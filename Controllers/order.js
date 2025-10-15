const connection = require('../config/database');


// ================= CREATE ORDER =================
exports.createOrder = (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !Array.isArray(items)) {
    return res.status(400).json({ error: "Missing user_id or items" });
  }

  // 1. Check stock from products
  const checkStockSql = `
    SELECT product_id, stock 
    FROM products 
    WHERE product_id IN (${items.map(() => '?').join(',')})
  `;
  const productIds = items.map(i => i.product_id);

  connection.query(checkStockSql, productIds, (err, stockRows) => {
    if (err) return res.status(500).json({ error: 'Stock check failed', details: err });

    // 2. Validate stock
    for (const item of items) {
      const dbItem = stockRows.find(r => r.product_id === item.product_id);
      if (!dbItem || dbItem.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock for product_id ${item.product_id}` 
        });
      }
    }

    // 3. Insert into orders (start with total_amount = 0)
    const orderSql = 'INSERT INTO orders (user_id, total_amount) VALUES (?, 0)';
    connection.execute(orderSql, [user_id], (err2, result) => {
      if (err2) return res.status(500).json({ error: 'Insert order failed', details: err2 });

      const orderId = result.insertId;

      // Build order_items values
      const orderLines = items.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      const orderLineSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';

      connection.query(orderLineSql, [orderLines], (err3) => {
        if (err3) return res.status(500).json({ error: 'Insert order_items failed', details: err3 });

        // 4. Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 5. Update order with total amount
        connection.execute(
          'UPDATE orders SET total_amount = ? WHERE order_id = ?',
          [totalAmount, orderId],
          (err4) => {
            if (err4) return res.status(500).json({ error: 'Failed to update total amount', details: err4 });

            // 6. Deduct stock from products
            const updateStockQueries = items.map(item => {
              return new Promise((resolve, reject) => {
                const updateSql = 'UPDATE products SET stock = stock - ? WHERE product_id = ?';
                connection.execute(updateSql, [item.quantity, item.product_id], (err5) => {
                  if (err5) reject(err5);
                  else resolve();
                });
              });
            });

            Promise.all(updateStockQueries)
              .then(() => {
                return res.status(200).json({ success: true, orderId });
              })
              .catch(err6 => {
                return res.status(500).json({ error: 'Stock deduction failed', details: err6 });
              });
          }
        );
      });
    });
  });
};


// ================= GET CUSTOMER ORDERS =================
exports.getCustomerOrders = (req, res) => {
  const user_id = req.params.user_id;

  const sql = `
    SELECT 
      o.order_id, 
      o.date_placed, 
      o.status,
      GROUP_CONCAT(CONCAT(p.name, ' x', oi.quantity) SEPARATOR ', ') AS items,
      SUM(oi.price * oi.quantity) AS total_price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.user_id = ?
    GROUP BY o.order_id
    ORDER BY o.date_placed DESC
  `;

  connection.query(sql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders', details: err });
    res.status(200).json({ data: result });
  });
};


// ================= CANCEL ORDER =================
exports.cancelOrder = (req, res) => {
  const { order_id } = req.body;

  // First, get order_items of this order
  const getItemsSql = `
    SELECT product_id, quantity 
    FROM order_items 
    WHERE order_id = ?
  `;

  connection.query(getItemsSql, [order_id], (err, itemRows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch order items', details: err });

    if (itemRows.length === 0) {
      return res.status(404).json({ error: 'Order not found or has no items' });
    }

    // Rollback stock
    const rollbackPromises = itemRows.map(item => {
      return new Promise((resolve, reject) => {
        const rollbackSql = `UPDATE products SET stock = stock + ? WHERE product_id = ?`;
        connection.query(rollbackSql, [item.quantity, item.product_id], (err2) => {
          if (err2) reject(err2);
          else resolve();
        });
      });
    });

    Promise.all(rollbackPromises)
      .then(() => {
        // Update order status
        const updateStatusSql = `
          UPDATE orders
          SET status = 'cancelled'
          WHERE order_id = ? AND status = 'pending'
        `;

        connection.query(updateStatusSql, [order_id], (err3, result) => {
          if (err3) return res.status(500).json({ error: 'Failed to cancel order', details: err3 });

          if (result.affectedRows === 0) {
            return res.status(400).json({ error: 'Order not found or not in pending status' });
          }

          return res.status(200).json({ success: true, message: 'Order cancelled and stock rolled back' });
        });
      })
      .catch(err4 => {
        return res.status(500).json({ error: 'Stock rollback failed', details: err4 });
      });
  });
};






// ================= ADMIN FUNCTIONS =================

// Get all orders with items + total
exports.getAllOrders = (req, res) => {

    const sql = `
  SELECT 
    o.order_id,
    u.username AS customer_name,
    o.date_placed,
    o.status,
    (
      SELECT SUM(oi.quantity * oi.price)
      FROM order_items oi
      WHERE oi.order_id = o.order_id
    ) AS total_amount,
    (
      SELECT GROUP_CONCAT(p.name SEPARATOR ', ')
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = o.order_id
    ) AS items
  FROM orders o
  LEFT JOIN users u ON o.user_id = u.user_id
  ORDER BY o.date_placed DESC
`;


  connection.query(sql, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ data: results });
  });
};



// ================= UPDATE ORDER STATUS ================= (modified to use awardCoins)
exports.updateOrderStatus = (req, res) => {
  const { order_id, status } = req.body;

  const validStatuses = ['pending', 'received', 'cancelled', 'shipped'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  // If cancelling → rollback stock
  if (status === 'cancelled') {
    // ... your existing rollback code ...
    Promise.all(rollbackPromises)
      .then(() => {
        // After rollback, update status
        finalizeStatusUpdate(order_id, status, res);
      })
      .catch(err3 => {
        return res.status(500).json({ error: 'Stock rollback failed', details: err3 });
      });
  } else {
    // For pending, received, shipped → just update
    finalizeStatusUpdate(order_id, status, res);
  }
};


// ================= HELPER ================= (modified)
function finalizeStatusUpdate(order_id, status, res) {
  connection.execute(
    `UPDATE orders SET status = ? WHERE order_id = ?`,
    [status, order_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to update status', details: err });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });

      // ✅ NEW: Award coins if status is 'received'
      if (status === 'received') {
        awardCoins(order_id, (err) => {
          if (err) console.error('Failed to award coins:', err);
        });
      }

      // ✅ No email/receipt, just confirm
      return res.status(200).json({ success: true, message: 'Status updated successfully' });
    }
  );
};

// ================= GET SELLER ORDERS =================
exports.getSellerOrders = (req, res) => {
  const { sellerId } = req.params;
  
  const sql = `
    SELECT 
      o.order_id,
      o.user_id,
      o.status,
      o.date_placed,
      o.date_shipped,
      oi.order_item_id,
      oi.quantity,
      oi.price,
      p.name,
      p.product_id,
      u.username,
      u.email
    FROM orders o
    INNER JOIN order_items oi ON o.order_id = oi.order_id
    INNER JOIN products p ON oi.product_id = p.product_id
    INNER JOIN users u ON o.user_id = u.user_id
    WHERE p.seller_id = ?
    ORDER BY o.date_placed DESC
  `;
  
  connection.query(sql, [sellerId], (err, results) => {
    if (err) {
      console.error('Error fetching seller orders:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch orders',
        details: err 
      });
    }
    
    res.json({ 
      success: true, 
      orders: results 
    });
  });
};

// ================= UPDATE ORDER STATUS (Seller specific) =================
exports.updateOrderStatusSeller = (req, res) => {
  const { orderId } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['pending', 'shipped', 'received', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      success: false,
      error: 'Invalid status value' 
    });
  }

  // Build SQL with conditional date_shipped update
  let updateSql = 'UPDATE orders SET status = ?';
  let params = [status];
  
  if (status === 'shipped') {
    updateSql += ', date_shipped = NOW()';
  }
  
  updateSql += ' WHERE order_id = ?';
  params.push(orderId);

  connection.execute(updateSql, params, (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Failed to update order status',
        details: err 
      });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // ✅ NEW: Award coins if status is 'received'
    if (status === 'received') {
      awardCoins(orderId, (err) => {
        if (err) console.error('Failed to award coins:', err);
      });
    }

    res.json({ 
      success: true, 
      message: 'Order status updated successfully' 
    });
  });
};



// ================= HELPER: Award Coins (Shared Function) =================
function awardCoins(orderId, callback) {
  connection.query('SELECT user_id, total_amount FROM orders WHERE order_id = ?', [orderId], (err, rows) => {
    if (err) {
      console.error('Error fetching order for coins:', err);
      return callback(err);
    }
    if (rows.length === 0) {
      return callback(new Error('Order not found'));
    }

    const { user_id, total_amount } = rows[0];
    const coins_earned = Math.floor(total_amount * 0.1); // Adjust formula here (e.g., Math.floor(total_amount * 0.1) for 10%)

    // Check if already awarded
    connection.query('SELECT * FROM transactions WHERE order_id = ?', [orderId], (err2, transRows) => {
      if (err2) {
        console.error('Error checking transaction:', err2);
        return callback(err2);
      }
      if (transRows.length > 0) {
        console.log(`Coins already awarded for order ${orderId}`);
        return callback(null); // Already done
      }

      // Insert new transaction
      connection.query(
        'INSERT INTO transactions (user_id, order_id, coins_earned) VALUES (?, ?, ?)',
        [user_id, orderId, coins_earned],
        (err3) => {
          if (err3) {
            console.error('Error awarding coins:', err3);
            return callback(err3);
          }
          console.log(`✅ Coins awarded: ${coins_earned} for order ${orderId} to user ${user_id}`);
          callback(null);
        }
      );
    });
  });
};





// ================= NEW: Get User Rewards (Total Coins + Transaction List) =================
exports.getUserRewards = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'User ID required' });
  }

  // Query total coins only
  connection.query(
    'SELECT COALESCE(SUM(coins_earned), 0) as total_coins FROM transactions WHERE user_id = ?',
    [user_id],
    (err, sumResult) => {
      if (err) {
        console.error('Error fetching total coins:', err);
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      const total_coins = sumResult[0].total_coins;

      res.json({
        success: true,
        data: {
          total_coins
        }
      });
    }
  );
};

exports.getUserDiscounts = (req, res) => {
  const user_id = req.params.user_id;
  connection.query(
    'SELECT reward_type, value, is_used FROM rewards WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, error: 'DB error' });
      res.json({ success: true, discounts: rows });
    }
  );
};


// 🎟️ TRADE DISCOUNT
exports.tradeDiscount = (req, res) => {
  const { user_id, percent, cost } = req.body;

  if (!user_id || !percent || !cost) {
    return res.status(400).json({ success: false, message: 'Missing data.' });
  }

  // Step 1: Check user's current coins
  connection.query(
    'SELECT COALESCE(SUM(coins_earned), 0) AS total_coins FROM transactions WHERE user_id = ?',
    [user_id],
    (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error.' });

      const total_coins = rows[0].total_coins;
      if (total_coins < cost) {
        return res.status(400).json({ success: false, message: 'Insufficient coins.' });
      }

      // Step 2: Get user's pet_id
      connection.query(
        'SELECT pet_id FROM pets WHERE user_id = ? LIMIT 1',
        [user_id],
        (errPet, petRows) => {
          if (errPet || petRows.length === 0) {
            return res.status(500).json({ success: false, message: 'No pet found for user.' });
          }
          const pet_id = petRows[0].pet_id;

          // Step 3: Deduct coins (record as negative transaction)
          connection.query(
            'INSERT INTO transactions (user_id, order_id, coins_earned) VALUES (?, NULL, ?)',
            [user_id, -cost],
            (err2) => {
              if (err2) return res.status(500).json({ success: false, message: 'Failed to deduct coins.' });

              // Step 4: Add discount to rewards table
              connection.query(
                'INSERT INTO rewards (user_id, pet_id, reward_type, value) VALUES (?, ?, "discount", ?)',
                [user_id, pet_id, `${percent}%`],
                (err3) => {
                  if (err3) return res.status(500).json({ success: false, message: 'Failed to save discount.' });

                  res.json({ success: true, message: `You received a ${percent}% OFF coupon!` });
                }
              );
            }
          );
        }
      );
    }
  );
};

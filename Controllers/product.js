const connection = require('../config/database');
const fs = require('fs');
const path = require('path');

// ============================
// Get all products
// ============================
exports.getAllProducts = (req, res) => {
  const sql = `
    SELECT 
      p.*, 
      c.name AS category_name,
      GROUP_CONCAT(img.image_path) AS images
    FROM products p
    LEFT JOIN product_images img ON p.product_id = img.product_id
    LEFT JOIN categories c ON p.category_id = c.category_id
    GROUP BY p.product_id;
  `;

  connection.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Query failed', details: err });

    const data = rows.map(row => ({
      ...row,
      images: row.images ? row.images.split(',') : []
    }));

    return res.status(200).json({ data });
  });
};

// ============================
// Get single product
// ============================
exports.getSingleProduct = (req, res) => {
  const sql = 'SELECT * FROM products WHERE product_id = ?';
  const values = [parseInt(req.params.id)];

  connection.execute(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Query error', details: err });
    }
    return res.status(200).json({
      success: true,
      result
    });
  });
};

// ============================
// Create product
// ============================
exports.createProduct = (req, res) => {
  const { name, description, price, stock, category_id } = req.body;
  const images = req.files;

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const insertSql = `
    INSERT INTO products (name, description, price, stock, category_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [name, description, price, stock, category_id || null];

  connection.execute(insertSql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error inserting product', details: err });

    const productId = result.insertId;

    if (images && images.length > 0) {
      const insertImageSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
      const imagePaths = images.map(file => [productId, file.path.replace(/\\/g, '/')]);

      connection.query(insertImageSql, [imagePaths], (err) => {
        if (err) return res.status(500).json({ error: 'Error inserting images', details: err });

        return res.status(201).json({
          success: true,
          message: 'Product and images saved successfully',
          productId
        });
      });
    } else {
      return res.status(201).json({
        success: true,
        message: 'Product saved without images',
        productId
      });
    }
  });
};

// ============================
// Update product
// ============================
exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const { name, description, price, stock, category_id } = req.body;

  let imagePath = [];

  if (req.files && req.files.length > 0) {
    imagePath = req.files.map(file => file.path.replace(/\\/g, "/"));
  }

  if (!name || !description || !price || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

//   if (!category_id) {
//     return res.status(400).json({ error: 'Category is required' });
//   }

  const updateSql = `
    UPDATE products 
    SET name = ?, description = ?, price = ?, stock = ?, category_id = ?
    WHERE product_id = ?
  `;
  const values = [name, description, price, stock, category_id || null , id];

  connection.execute(updateSql, values, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating product', details: err });
    }

    // If new images uploaded, replace old ones
    if (imagePath.length > 0) {
      const deleteSql = 'DELETE FROM product_images WHERE product_id = ?';
      connection.execute(deleteSql, [id], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Failed to delete old images' });
        }

        const insertSql = 'INSERT INTO product_images (product_id, image_path) VALUES ?';
        const imageValues = imagePath.map(p => [id, p]);

        connection.query(insertSql, [imageValues], (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Failed to insert new images' });
          }

          return res.status(200).json({ success: true, message: 'Product updated with new images' });
        });
      });
    } else {
      return res.status(200).json({ success: true, message: 'Product updated successfully (no new images)' });
    }
  });
};

// ============================
// Delete product
// ============================
exports.deleteProduct = (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM products WHERE product_id = ?';

  connection.execute(sql, [id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error deleting product', details: err });
    }
    return res.status(200).json({
      success: true,
      message: 'Product deleted'
    });
  });
};


exports.getAllCategories = (req, res) => {
  const sql = 'SELECT category_id, name FROM categories ORDER BY name ASC';

  connection.query(sql, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Query failed', details: err });
    }
    return res.status(200).json({ categories: rows });
  });
};


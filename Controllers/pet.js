const db = require('../config/database');

// Get all pets
exports.getAllPets = (req, res) => {
  const sql = `
    SELECT pets.*, users.username 
    FROM pets 
    JOIN users ON pets.user_id = users.user_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ data: results });
  });
};

// Get single pet
exports.getPetById = (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT pets.*, users.username 
    FROM pets 
    JOIN users ON pets.user_id = users.user_id
    WHERE pets.pet_id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ pet: results[0] });
  });
};


// Create pet
exports.createPet = (req, res) => {
  const { user_id, pet_name, level, coins } = req.body;
  const level1_image = req.files['level1_image'] ? req.files['level1_image'][0].filename : null;
  const level2_image = req.files['level2_image'] ? req.files['level2_image'][0].filename : null;
  const level3_image = req.files['level3_image'] ? req.files['level3_image'][0].filename : null;

  db.query(
    'INSERT INTO pets (user_id, pet_name, level, coins, level1_image, level2_image, level3_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [user_id, pet_name, level, coins, level1_image, level2_image, level3_image],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const newPetId = result.insertId;

      // 👇 Fetch the full row including username
      const sql = `
        SELECT pets.*, users.username
        FROM pets
        JOIN users ON pets.user_id = users.user_id
        WHERE pets.pet_id = ?
      `;

      db.query(sql, [newPetId], (err2, rows) => {
        if (err2) return res.status(500).json({ error: err2 });
        res.json({ success: true, data: rows[0] }); // return the full pet row
      });
    }
  );
};

// Update pet
exports.updatePet = (req, res) => {
  const id = req.params.id;
  const { user_id, pet_name, level, coins } = req.body;
  const level1_image = req.files['level1_image'] ? req.files['level1_image'][0].filename : null;
  const level2_image = req.files['level2_image'] ? req.files['level2_image'][0].filename : null;
  const level3_image = req.files['level3_image'] ? req.files['level3_image'][0].filename : null;

  db.query(
    'UPDATE pets SET user_id=?, pet_name=?, level=?, coins=?, level1_image=COALESCE(?, level1_image), level2_image=COALESCE(?, level2_image), level3_image=COALESCE(?, level3_image) WHERE pet_id=?',
    [user_id, pet_name, level, coins, level1_image, level2_image, level3_image, id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Pet updated' });
    }
  );
};

// Delete pet
exports.deletePet = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM pets WHERE pet_id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Pet deleted' });
  });
};

// USER SIDE FUNCTION" 



// Create pet for a user via choose.html (simple JSON API, no file upload)
exports.createPetForUser = (req, res) => {
  const { user_id, pet_name, choice } = req.body;

  if (!user_id || !pet_name) {
    return res.status(400).json({ error: 'Missing user_id or pet_name' });
  }

  // ensure user exists
  db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, users) => {
    if (err) return res.status(500).json({ error: err });
    if (!users.length) return res.status(404).json({ error: 'User not found' });

    // make sure user doesn't already have a pet
    db.query('SELECT * FROM pets WHERE user_id = ?', [user_id], (err2, existing) => {
      if (err2) return res.status(500).json({ error: err2 });
      if (existing.length) return res.status(400).json({ error: 'User already has a pet' });

      // choose default images by choice (update filenames to match your images folder)
      const defaults = {
        '1': ['t1.jpg', 't2.png', 't3.jpg'],
        '2': ['1as.png', '2as.png', '3as.png'],
        '3': ['t1.jpg', 't2.png', 't3.jpg']
      };
      const chosen = defaults[choice] || defaults['1'];
      const level1_image = chosen[0];
      const level2_image = chosen[1];
      const level3_image = chosen[2];

      const sql = `INSERT INTO pets (user_id, pet_name, level, coins, level1_image, level2_image, level3_image)
                   VALUES (?, ?, 1, 0, ?, ?, ?)`;
      db.query(sql, [user_id, pet_name, level1_image, level2_image, level3_image], (err3, result) => {
        if (err3) return res.status(500).json({ error: err3 });

        const newPetId = result.insertId;
        const fetchSql = `
          SELECT pets.*, users.username
          FROM pets JOIN users ON pets.user_id = users.user_id
          WHERE pets.pet_id = ?`;
        db.query(fetchSql, [newPetId], (err4, rows) => {
          if (err4) return res.status(500).json({ error: err4 });
          res.json({ success: true, pet: rows[0] });
        });
      });
    });
  });
};

// ================= NEW: Get User's Pet =================
exports.getUserPet = (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ error: 'User  ID required' });
  }

  const sql = `
    SELECT p.*, u.username 
    FROM pets p 
    JOIN users u ON p.user_id = u.user_id
    WHERE p.user_id = ?
  `;

  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error('Error fetching user pet:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.json({ success: true, pet: null }); // No pet created yet
    }

    res.json({ 
      success: true, 
      pet: results[0] 
    });
  });
};

exports.feedPet = (req, res) => {
  const { user_id, item_type } = req.body;
  if (!user_id || !item_type)
    return res.status(400).json({ message: 'Missing data' });

  const xpGain = item_type === 'water' ? 10 : 20;

  db.query(
    'SELECT * FROM user_inventory WHERE user_id = ? AND item_type = ?',
    [user_id, item_type],
    (err, rows) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      if (rows.length === 0 || rows[0].quantity <= 0)
        return res
          .status(400)
          .json({ message: `You don't have any ${item_type}` });

      // consume item
      db.query(
        'UPDATE user_inventory SET quantity = quantity - 1 WHERE user_id = ? AND item_type = ?',
        [user_id, item_type]
      );

      // get pet
      db.query('SELECT * FROM pets WHERE user_id = ?', [user_id], (err2, pets) => {
        if (err2) return res.status(500).json({ message: 'DB error' });
        if (pets.length === 0)
          return res.status(400).json({ message: 'No pet found' });

        const pet = pets[0];
        let newXp = pet.xp + xpGain;
        let newLevel = pet.level;
        let leveledUp = false;

        if (newXp >= 100) {
          newXp = 0;
          newLevel += 1;
          leveledUp = true;
        }

        db.query(
          'UPDATE pets SET xp = ?, level = ?, last_fed = NOW() WHERE user_id = ?',
          [newXp, newLevel, user_id],
          (err3) => {
            if (err3) return res.status(500).json({ message: 'DB error' });

            // 🏆 Pet reached level 3
            if (leveledUp && newLevel === 3) {
              const rewards = generateRandomRewards(pet.pet_id, user_id);
              const values = rewards.map((r) => [
                user_id,
                pet.pet_id,
                r.reward_type,
                r.value,
              ]);

              // insert all rewards into rewards table
              db.query(
                'INSERT INTO rewards (user_id, pet_id, reward_type, value) VALUES ?',
                [values],
                (err4) => {
                  if (err4)
                    console.error('Error inserting rewards:', err4);

                  // 🔁 For every bonus_coins reward, insert a transaction
                  const bonusRewards = rewards.filter(
                    (r) => r.reward_type === 'bonus_coins'
                  );

                  if (bonusRewards.length > 0) {
                    const insertTransactions = bonusRewards.map((r) => [
                      user_id,
                      null, // no order_id, direct bonus
                      parseInt(r.value),
                    ]);

                    db.query(
                      'INSERT INTO transactions (user_id, order_id, coins_earned) VALUES ?',
                      [insertTransactions],
                      (err5) => {
                        if (err5)
                          console.error('Error adding bonus coins:', err5);
                        console.log(
                          `💰 Added ${bonusRewards.length} bonus coin transaction(s) for user ${user_id}`
                        );
                        return res.json({
                          success: true,
                          message:
                            'Pet fed and leveled up to level 3! Bonus coins credited.',
                          rewards,
                        });
                      }
                    );
                  } else {
                    return res.json({
                      success: true,
                      message:
                        'Pet fed and leveled up to level 3! Rewards granted.',
                      rewards,
                    });
                  }
                }
              );
            } else {
              res.json({
                success: true,
                message: leveledUp
                  ? `Pet leveled up to Level ${newLevel}!`
                  : 'Pet fed successfully!',
              });
            }
          }
        );
      });
    }
  );
};

// ===================== 🧩 Reward Generator =====================
function generateRandomRewards(pet_id, user_id) {
  const possibleDiscounts = [5, 10, 50]; // %
  const possibleCoinBonuses = [50, 100, 200];

  const rewards = [];
  for (let i = 0; i < 3; i++) {
    const type = Math.random() < 0.5 ? 'bonus_coins' : 'discount';

    if (type === 'bonus_coins') {
      const value =
        possibleCoinBonuses[Math.floor(Math.random() * possibleCoinBonuses.length)];
      rewards.push({ reward_type: 'bonus_coins', value: value.toString() });
    } else {
      const value =
        possibleDiscounts[Math.floor(Math.random() * possibleDiscounts.length)];
      rewards.push({ reward_type: 'discount', value: value + '%' });
    }
  }
  return rewards;
}


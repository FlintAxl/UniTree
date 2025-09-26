const connection = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    connection.execute(userSql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }

      // ✅ Get the new user's ID
      const userId = result.insertId;

      // ✅ Return clean JSON (no password)
      res.status(201).json({
        success: true,
        user: {
          user_id: userId,
          username,
          email
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = `SELECT user_id, username, email, password, role, token FROM users WHERE email = ?`;
  connection.execute(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error logging in', details: err });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = results[0];

    // If they already have a token, block login
    if (user.token) {
      return res.status(403).json({ success: false, message: 'User already logged in. Please log out first.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET);
    const updateTokenSql = 'UPDATE users SET token = ? WHERE user_id = ?';
    connection.execute(updateTokenSql, [token, user.user_id], (updateErr) => {
      if (updateErr) {
        console.log(updateErr);
        return res.status(500).json({ error: 'Error saving token', details: updateErr });
      }
      delete user.password;
      return res.status(200).json({ success: "welcome back", user, token });
    });
  });
};


exports.logoutUser = (req, res) => {
  // Check Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const userId = parseInt(req.body.id, 10);
  if (!userId) return res.status(400).json({ error: 'User ID is required' });

  const sql = 'UPDATE users SET token = NULL WHERE user_id = ?';
  connection.execute(sql, [userId], (err, result) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Error logging out', details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'Logout successful' });
  });
};

//ADMIN SIDE

// Get all users (for DataTable)
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT user_id, username, email, role, created_at FROM users';
  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users', details: err });
    }
    res.status(200).json({ data: results });
  });
};

// Get single user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT user_id, username, email, role, created_at FROM users WHERE user_id = ?';
  connection.execute(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user', details: err });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user: results[0] });
  });
};

// Create new user (Admin version, no login restriction)
exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  connection.execute(sql, [username, email, hashedPassword, role || 'customer'], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating user', details: err });
    }
    res.status(201).json({ success: true, message: 'User created successfully', userId: result.insertId });
  });
};

// Update user (username, email, role)
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  const sql = 'UPDATE users SET username = ?, email = ?, role = ? WHERE user_id = ?';
  connection.execute(sql, [username, email, role, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating user', details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User updated successfully' });
  });
};

// Delete user (hard delete)
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE user_id = ?';
  connection.execute(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user', details: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  });
};
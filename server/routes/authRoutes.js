const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const router = express.Router();
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Registration route with validation
router.post('/register', [
  body('username', 'Username is required').not().isEmpty(),
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const role_id = 3;

    const newUser = await pool.query(
      'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role_id]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Login route with validation
router.post('/login', [
  body('username', 'Username is required').not().isEmpty(),
  body('password', 'Password is required').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Username or Password." });
    }
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    //user data from query
    const userData = {
      id: user.rows[0].id,
      username: user.rows[0].username,
      role_id: user.rows[0].role_id,
    };

    const accessToken = jwt.sign(
      userData, 
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' } 
    );

    res.json({ accessToken: accessToken, role_id: userData.role_id });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

// routes/test.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Test route
router.get('/', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
router.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as time');
    res.json({
      success: true,
      message: 'Database connection successful',
      time: result.rows[0].time
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router;
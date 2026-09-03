// routes/services.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/db-helper');
const authenticate = require('../middleware/auth');

// Get all services
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM services WHERE is_active = true';
    const params = [];
    
    if (category) {
      sql += ' AND category = $1';
      params.push(category);
    }
    
    sql += ' ORDER BY id';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM services WHERE id = $1 AND is_active = true', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create service
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, category, description, price, durationMinutes } = req.body;
    
    const result = await query(
      'INSERT INTO services (name, category, description, price, duration_minutes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, description, price, durationMinutes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update service
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, category, description, price, durationMinutes, isActive } = req.body;
    
    const result = await query(
      `UPDATE services SET 
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        description = COALESCE($3, description),
        price = COALESCE($4, price),
        duration_minutes = COALESCE($5, duration_minutes),
        is_active = COALESCE($6, is_active)
      WHERE id = $7 RETURNING *`,
      [name, category, description, price, durationMinutes, isActive, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
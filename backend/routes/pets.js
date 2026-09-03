// routes/pets.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

// Get all pets for authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pets WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get pet by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM pets WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new pet
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, type, breed, age, weight, medicalNotes } = req.body;
    
    const result = await pool.query(
      'INSERT INTO pets (user_id, name, type, breed, age, weight, medical_notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, name, type, breed, age, weight, medicalNotes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a pet
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, type, breed, age, weight, medicalNotes } = req.body;
    
    const result = await pool.query(
      'UPDATE pets SET name = COALESCE($1, name), type = COALESCE($2, type), breed = COALESCE($3, breed), age = COALESCE($4, age), weight = COALESCE($5, weight), medical_notes = COALESCE($6, medical_notes) WHERE id = $7 AND user_id = $8 RETURNING *',
      [name, type, breed, age, weight, medicalNotes, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a pet
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM pets WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
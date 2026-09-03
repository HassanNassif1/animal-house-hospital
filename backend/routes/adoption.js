// backend/routes/adoption.js
const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

// Get all pets with adoption status
router.get('/pets', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        COALESCE(a.status, 'available') as adoption_status,
        a.description as adoption_description,
        a.contact_email as adoption_contact
      FROM pets p
      LEFT JOIN adoptions a ON p.id = a.pet_id AND a.status != 'cancelled'
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit adoption request
router.post('/request', authenticate, async (req, res) => {
  const { petId, message } = req.body;
  const userId = req.user.id;

  try {
    // Check if pet exists and is available
    const petCheck = await pool.query(
      'SELECT id, name FROM pets WHERE id = $1',
      [petId]
    );
    
    if (petCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if adoption already exists
    const existingAdoption = await pool.query(
      'SELECT id FROM adoptions WHERE pet_id = $1 AND status = $2',
      [petId, 'pending']
    );

    if (existingAdoption.rows.length > 0) {
      return res.status(400).json({ message: 'Adoption already pending for this pet' });
    }

    // Create adoption request
    const result = await pool.query(
      `INSERT INTO adoptions (pet_id, user_id, status, message, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) RETURNING *`,
      [petId, userId, 'pending', message]
    );

    res.status(201).json({
      success: true,
      message: 'Adoption request submitted successfully',
      adoption: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's adoption requests
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, p.name as pet_name, p.type, p.breed
      FROM adoptions a
      JOIN pets p ON a.pet_id = p.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
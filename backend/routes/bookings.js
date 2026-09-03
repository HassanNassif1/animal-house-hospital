// routes/bookings.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

// Get user's bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, p.name as pet_name 
       FROM bookings b
       LEFT JOIN pets p ON b.pet_id = p.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking (boarding, grooming, mobile visit)
router.post('/', [
  authenticate,
  body('petId').isInt(),
  body('bookingType').isIn(['boarding', 'grooming', 'mobile_visit']),
  body('startDate').isDate(),
  body('endDate').optional().isDate()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { petId, bookingType, startDate, endDate, notes } = req.body;
    
    // Verify pet belongs to user
    const petCheck = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [petId, req.user.id]);
    if (petCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid pet' });
    }
    
    const result = await pool.query(
      `INSERT INTO bookings 
       (user_id, pet_id, booking_type, start_date, end_date, notes) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, petId, bookingType, startDate, endDate, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE bookings 
       SET status = COALESCE($1, status), 
           notes = COALESCE($2, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [status, notes, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
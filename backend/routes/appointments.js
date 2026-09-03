// routes/appointments.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const authenticate = require('../middleware/auth');

// Get user's appointments
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, s.name as service_name, p.name as pet_name 
       FROM appointments a
       LEFT JOIN services s ON a.service_id = s.id
       LEFT JOIN pets p ON a.pet_id = p.id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [req.user.id]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create appointment
router.post('/', [
  authenticate,
  body('petId').isInt(),
  body('serviceId').isInt(),
  body('appointmentDate').isDate(),
  body('appointmentTime').notEmpty(),
  body('appointmentType').isIn(['veterinary', 'grooming', 'mobile'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { petId, serviceId, appointmentDate, appointmentTime, appointmentType, notes } = req.body;
    
    // Verify pet belongs to user
    const petCheck = await pool.query('SELECT * FROM pets WHERE id = $1 AND user_id = $2', [petId, req.user.id]);
    if (petCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid pet' });
    }
    
    const result = await pool.query(
      `INSERT INTO appointments 
       (user_id, pet_id, service_id, appointment_date, appointment_time, appointment_type, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, petId, serviceId, appointmentDate, appointmentTime, appointmentType, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE appointments 
       SET status = COALESCE($1, status), 
           notes = COALESCE($2, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [status, notes, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete appointment
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM appointments WHERE id = $1 AND user_id = $2 RETURNING *',
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
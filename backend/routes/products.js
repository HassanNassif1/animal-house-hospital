// routes/products.js
const express = require('express');
const router = express.Router();
const { query } = require('../config/db-helper');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, search, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    
    let sql = 'SELECT * FROM products WHERE is_active = true';
    const params = [];
    let paramIndex = 1;
    
    if (category) {
      sql += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (subcategory) {
      sql += ` AND subcategory = $${paramIndex}`;
      params.push(subcategory);
      paramIndex++;
    }
    
    if (search) {
      sql += ` AND (name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Get total count
    const countQuery = sql.replace('SELECT *', 'SELECT COUNT(*)');
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);
    
    // Get paginated results
    sql += ` ORDER BY id LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await query(sql, params);
    
    res.json({
      products: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM products WHERE id = $1 AND is_active = true', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
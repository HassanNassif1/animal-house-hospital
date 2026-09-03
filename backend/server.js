// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./config/db-helper');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Enhanced CORS configuration - Dynamic
const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || isProduction) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (only in development)
if (!isProduction) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Routes
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const productRoutes = require('./routes/products');
const appointmentRoutes = require('./routes/appointments');
const bookingRoutes = require('./routes/bookings');
const petRoutes = require('./routes/pets');
const userRoutes = require('./routes/users');
const adoptionRoutes = require('./routes/adoption');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use('/api/adoption', adoptionRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let client;
  try {
    client = await pool.connect();
    dbStatus = 'connected';
    client.release();
  } catch (err) {
    dbStatus = 'error: ' + err.message;
  }
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbStatus,
    allowedOrigins: allowedOrigins,
    poolStats: {
      total: pool.totalCount || 0,
      idle: pool.idleCount || 0,
      waiting: pool.waitingCount || 0
    }
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
    availableRoutes: [
      '/api/auth',
      '/api/services', 
      '/api/products',
      '/api/appointments',
      '/api/bookings',
      '/api/pets',
      '/api/users',
      '/api/adoption',
      '/api/health'
    ]
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please try again later.'
    });
  }
  
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.'
    });
  }
  
  if (err.code === '53300') {
    return res.status(503).json({
      success: false,
      message: 'Too many database connections. Please try again later.'
    });
  }
  
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details || null
    })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);
  console.log(`🔒 CORS allowed origins:`, allowedOrigins);
});

// Graceful shutdown
const shutdown = () => {
  console.log('🛑 Shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database connection pool closed');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { app, server };
// config/database.js
const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'animal_house',
  password: process.env.DB_PASSWORD || '123',
  port: process.env.DB_PORT || 5432,
  // CRITICAL: Set to very low number to prevent "too many clients"
  max: 5, // Maximum 5 connections
  min: 1, // Minimum 1 connection
  idleTimeoutMillis: 5000, // Close idle connections after 5 seconds
  connectionTimeoutMillis: 3000, // Timeout after 3 seconds
  acquireTimeoutMillis: 5000,
});

// Log pool events
pool.on('connect', () => {
  console.log('🔌 New database connection established');
});

pool.on('acquire', () => {
  // Optional: Uncomment for debugging
  // console.log(`📊 Pool stats - Total: ${pool.totalCount}, Idle: ${pool.idleCount}, Waiting: ${pool.waitingCount}`);
});

pool.on('remove', () => {
  console.log('🔌 Database connection removed from pool');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err.message);
});

// Test connection
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  } catch (err) {
    console.error('❌ Error connecting to database:', err.message);
    console.error('⚠️  Please check:');
    console.error('  1. PostgreSQL is running');
    console.error('  2. Credentials in .env are correct');
    console.error('  3. Database "animal_house" exists');
  }
};

testConnection();

module.exports = pool;
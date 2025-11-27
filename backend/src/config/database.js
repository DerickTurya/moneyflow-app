/**
 * Database Configuration
 * PostgreSQL connection pool management
 */

const { Pool } = require('pg');
const logger = require('../utils/logger');

// Pool configuration
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'moneyflow',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection cannot be established
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Create connection pool
const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle database client', { error: err.message });
});

// Handle pool connection
pool.on('connect', () => {
  logger.info('New database client connected to pool');
});

// Handle pool removal
pool.on('remove', () => {
  logger.info('Database client removed from pool');
});

/**
 * Query the database
 * @param {string} text - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    logger.debug('Executed query', {
      query: text,
      duration: `${duration}ms`,
      rows: result.rowCount
    });
    
    return result;
  } catch (error) {
    logger.error('Database query error', {
      query: text,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Database client
 */
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    logger.error('Failed to get database client', { error: error.message });
    throw error;
  }
};

/**
 * Test database connection
 * @returns {Promise<boolean>} Connection status
 */
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    logger.info('Database connection successful');
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error: error.message });
    return false;
  }
};

/**
 * Close all database connections
 */
const closePool = async () => {
  try {
    await pool.end();
    logger.info('Database pool closed');
  } catch (error) {
    logger.error('Error closing database pool', { error: error.message });
  }
};

module.exports = {
  query,
  getClient,
  testConnection,
  closePool,
  pool
};

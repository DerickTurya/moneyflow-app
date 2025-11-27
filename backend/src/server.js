/**
 * MoneyFlow Tracking API Server
 * Main application entry point
 */

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const logger = require('./utils/logger');
const db = require('./config/database');
const { connectProducer } = require('./config/kafka');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',');
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
};

app.use(cors(corsOptions));

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.get('X-Request-ID') || require('uuid').v4();
  res.set('X-Request-ID', req.id);
  next();
});

// General API rate limiter
app.use(`/api/${API_VERSION}`, apiLimiter);

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: API_VERSION
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'MoneyFlow Tracking API',
    version: API_VERSION,
    description: 'Event tracking and analytics API with Kafka integration',
    endpoints: {
      events: `/api/${API_VERSION}/events`,
      auth: `/api/${API_VERSION}/auth`,
      health: '/health'
    }
  });
});

// Mount routes
app.use(`/api/${API_VERSION}`, eventRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    code: err.code || 'INTERNAL_ERROR'
  });
});

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await db.testConnection();
    
    if (!dbConnected) {
      logger.warn('Database connection failed, but server will start anyway');
    }
    
    // Connect to Kafka
    logger.info('Connecting to Kafka...');
    await connectProducer();
    
    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 MoneyFlow API started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        version: API_VERSION,
        pid: process.pid
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown...`);
  
  try {
    // Close Kafka producer
    const { disconnectProducer } = require('./config/kafka');
    await disconnectProducer();
    
    // Close database pool
    await db.closePool();
    
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', { error: error.message });
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', {
    error: error.message,
    stack: error.stack
  });
  gracefulShutdown('uncaughtException');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection', {
    reason: reason,
    promise: promise
  });
});

// Start the server
startServer();

module.exports = app;

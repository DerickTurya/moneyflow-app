/**
 * MoneyFlow Tracking API Server (Standalone Version)
 * Versão simplificada sem Kafka - apenas PostgreSQL
 */

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const logger = require('./utils/logger');
const db = require('./config/database');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
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
      callback(null, true); // Permissivo para desenvolvimento
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

// Serve static files (SDK and test page)
app.use(express.static(path.join(__dirname, '../public')));

// Serve demo files
app.use(express.static(path.join(__dirname, '../../demo')));

// Serve tracking.html (security monitoring dashboard)
app.get('/tracking.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../tracking.html'));
});

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Request ID middleware
app.use((req, res, next) => {
  req.id = req.get('X-Request-ID') || require('uuid').v4();
  res.set('X-Request-ID', req.id);
  next();
});

// General API rate limiter - DESABILITADO PARA DESENVOLVIMENTO
// app.use(`/api/${API_VERSION}`, apiLimiter);

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: API_VERSION,
    mode: 'standalone' // Sem Kafka
  });
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'MoneyFlow Tracking API',
    version: API_VERSION,
    description: 'Event tracking and analytics API (Standalone mode)',
    mode: 'standalone',
    endpoints: {
      events: `/api/${API_VERSION}/events`,
      auth: `/api/${API_VERSION}/auth`,
      analytics: `/api/${API_VERSION}/analytics`,
      health: '/health',
      test: '/test.html'
    }
  });
});

// Mount routes
app.use(`/api/${API_VERSION}`, eventRoutes);
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, analyticsRoutes);

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
    logger.info('🚀 Starting MoneyFlow API (Standalone mode)...');
    
    // Test database connection
    logger.info('Testing database connection...');
    const dbConnected = await db.testConnection();
    
    if (!dbConnected) {
      logger.warn('⚠️ Database connection failed. API will start but some features may not work.');
    } else {
      logger.info('✅ Database connected successfully');
    }
    
    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`✅ MoneyFlow API started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        version: API_VERSION,
        mode: 'standalone',
        pid: process.pid
      });
      
      console.log('\n════════════════════════════════════════════════════════');
      console.log('🚀 MoneyFlow Event Tracking API');
      console.log('════════════════════════════════════════════════════════');
      console.log(`📡 API: http://localhost:${PORT}`);
      console.log(`🧪 Test Page: http://localhost:${PORT}/test.html`);
      console.log(`❤️ Health: http://localhost:${PORT}/health`);
      console.log(`📊 Mode: Standalone (PostgreSQL only)`);
      console.log('════════════════════════════════════════════════════════\n');
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

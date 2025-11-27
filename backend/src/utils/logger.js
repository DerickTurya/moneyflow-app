/**
 * Logger Utility
 * Winston logger configuration with multiple transports
 */

const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(colors);

// Custom format to sanitize sensitive data
const sanitizeFormat = winston.format((info) => {
  const sanitized = { ...info };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'jwt', 'secret', 'authorization'];
  
  const removeSensitive = (obj) => {
    if (typeof obj !== 'object' || obj === null) return;
    
    Object.keys(obj).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        removeSensitive(obj[key]);
      }
    });
  };
  
  removeSensitive(sanitized);
  return sanitized;
});

// Define format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  sanitizeFormat(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (more readable)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  sanitizeFormat(),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => {
      const { timestamp, level, message, ...rest } = info;
      const meta = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
      return `${timestamp} [${level}]: ${message} ${meta}`;
    }
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
    level: process.env.LOG_LEVEL || 'info'
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
    format,
    maxsize: 10485760, // 10MB
    maxFiles: 5
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'app.log'),
    format,
    maxsize: 10485760, // 10MB
    maxFiles: 10
  })
];

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  exitOnError: false
});

// Stream for Morgan (HTTP logging)
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  }
};

module.exports = logger;

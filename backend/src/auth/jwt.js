/**
 * JWT Authentication
 * Token generation and verification with refresh token support
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// JWT secrets
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate access token
 * @param {string} userId - User ID
 * @param {Object} additionalData - Additional data to include in token
 * @returns {string} JWT token
 */
const generateToken = (userId, additionalData = {}) => {
  try {
    const payload = {
      userId,
      type: 'access',
      ...additionalData
    };
    
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'moneyflow-api',
      audience: 'moneyflow-client'
    });
    
    logger.debug('Access token generated', { userId });
    return token;
  } catch (error) {
    logger.error('Error generating access token', {
      userId,
      error: error.message
    });
    throw new Error('Failed to generate token');
  }
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  try {
    const payload = {
      userId,
      type: 'refresh'
    };
    
    const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'moneyflow-api',
      audience: 'moneyflow-client'
    });
    
    logger.debug('Refresh token generated', { userId });
    return token;
  } catch (error) {
    logger.error('Error generating refresh token', {
      userId,
      error: error.message
    });
    throw new Error('Failed to generate refresh token');
  }
};

/**
 * Verify access token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'moneyflow-api',
      audience: 'moneyflow-client'
    });
    
    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }
    
    logger.debug('Token verified', { userId: decoded.userId });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired', { expiredAt: error.expiredAt });
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid token', { error: error.message });
      throw new Error('Invalid token');
    }
    
    logger.error('Token verification error', { error: error.message });
    throw error;
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'moneyflow-api',
      audience: 'moneyflow-client'
    });
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    logger.debug('Refresh token verified', { userId: decoded.userId });
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Refresh token expired', { expiredAt: error.expiredAt });
      throw new Error('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid refresh token', { error: error.message });
      throw new Error('Invalid refresh token');
    }
    
    logger.error('Refresh token verification error', { error: error.message });
    throw error;
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Generate token pair (access + refresh)
 * @param {string} userId - User ID
 * @param {Object} additionalData - Additional data for access token
 * @returns {Object} Token pair
 */
const generateTokenPair = (userId, additionalData = {}) => {
  return {
    accessToken: generateToken(userId, additionalData),
    refreshToken: generateRefreshToken(userId),
    expiresIn: JWT_EXPIRES_IN
  };
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  extractTokenFromHeader,
  generateTokenPair
};

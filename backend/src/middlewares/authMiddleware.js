/**
 * Authentication Middleware
 * JWT verification middleware for protected routes
 */

const { verifyToken, extractTokenFromHeader } = require('../auth/jwt');
const logger = require('../utils/logger');

/**
 * Authenticate JWT token (required)
 * Blocks request if token is missing or invalid
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      logger.warn('Missing authentication token', {
        ip: req.ip,
        path: req.path
      });
      
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'MISSING_TOKEN'
      });
    }
    
    const decoded = verifyToken(token);
    
    // Attach user data to request
    req.user = {
      userId: decoded.userId,
      ...decoded
    };
    
    logger.debug('Request authenticated', {
      userId: decoded.userId,
      path: req.path
    });
    
    next();
  } catch (error) {
    logger.warn('Authentication failed', {
      error: error.message,
      ip: req.ip,
      path: req.path
    });
    
    return res.status(401).json({
      success: false,
      error: error.message || 'Authentication failed',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Optional authentication
 * Attaches user data if token is valid, but allows request to proceed without it
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      req.user = {
        userId: decoded.userId,
        ...decoded
      };
      
      logger.debug('Request authenticated (optional)', {
        userId: decoded.userId,
        path: req.path
      });
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // Token is invalid, but we allow the request to proceed
    logger.debug('Optional authentication failed, proceeding without auth', {
      error: error.message,
      path: req.path
    });
    
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};

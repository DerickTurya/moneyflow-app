/**
 * Authentication Routes
 * User authentication and token management
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { generateTokenPair, verifyRefreshToken } = require('../auth/jwt');
const { authenticate } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * POST /auth/register - User registration
 * Creates new user account
 */
router.post('/auth/register', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      full_name, 
      phone, 
      cpf,
      birthdate,
      address,
      financial_info
    } = req.body;
    
    // Validação básica
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password and full name are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Verificar se email já existe
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    // Verificar se CPF já existe (se fornecido)
    if (cpf) {
      const existingCpf = await db.query(
        'SELECT id FROM users WHERE cpf = $1',
        [cpf]
      );

      if (existingCpf.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: 'CPF already registered',
          code: 'CPF_EXISTS'
        });
      }
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(password, 10);

    // Preparar dados de endereço e info financeira
    const addressData = address ? {
      cep: address.cep,
      city: address.city,
      state: address.state
    } : null;

    const financialData = financial_info ? {
      income: financial_info.income,
      occupation: financial_info.occupation
    } : null;

    // Inserir novo usuário com dados completos
    const result = await db.query(
      `INSERT INTO users (
        id, email, password_hash, full_name, phone, cpf, birthdate,
        address, financial_info, points, level, streak_days
      )
       VALUES (
         uuid_generate_v4(), $1, $2, $3, $4, $5, $6, $7, $8, 0, 'Bronze', 0
       )
       RETURNING id, email, full_name, phone, cpf, birthdate`,
      [
        email, 
        password_hash, 
        full_name, 
        phone || null, 
        cpf || null,
        birthdate || null,
        addressData ? JSON.stringify(addressData) : null,
        financialData ? JSON.stringify(financialData) : null
      ]
    );

    const user = result.rows[0];

    // Gerar tokens
    const tokens = generateTokenPair(user.id, {
      email: user.email,
      name: user.full_name
    });

    logger.info('User registered successfully', {
      user_id: user.id,
      email: user.email
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        phone: user.phone
      },
      tokens
    });
  } catch (error) {
    logger.error('Registration error', {
      error: error.message,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Registration failed',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/login - User login
 * Returns access and refresh tokens
 */
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }
    
    // Find user by email
    const result = await db.query(
      'SELECT id, email, password_hash, full_name FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    
    if (result.rows.length === 0) {
      logger.warn('Login attempt with invalid email', { email });
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordValid) {
      logger.warn('Login attempt with invalid password', { email });
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }
    
    // Generate tokens
    const tokens = generateTokenPair(user.id, {
      email: user.email,
      name: user.full_name
    });
    
    logger.info('User logged in successfully', {
      user_id: user.id,
      email: user.email
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name
      },
      tokens
    });
  } catch (error) {
    logger.error('Login error', {
      error: error.message,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      error: 'Login failed',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/refresh - Refresh access token
 * Uses refresh token to generate new access token
 */
router.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
        code: 'MISSING_TOKEN'
      });
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    
    // Get user data
    const result = await db.query(
      'SELECT id, email, full_name FROM users WHERE id = $1 AND deleted_at IS NULL',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    const user = result.rows[0];
    
    // Generate new token pair
    const tokens = generateTokenPair(user.id, {
      email: user.email,
      name: user.full_name
    });
    
    logger.info('Token refreshed', { user_id: user.id });
    
    res.json({
      success: true,
      tokens
    });
  } catch (error) {
    logger.error('Token refresh error', {
      error: error.message
    });
    
    res.status(401).json({
      success: false,
      error: error.message || 'Token refresh failed',
      code: 'REFRESH_FAILED'
    });
  }
});

/**
 * GET /auth/me - Get current user info
 * Requires authentication
 */
router.get('/auth/me', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, full_name, cpf, phone, points, level, streak_days, 
              created_at, preferences
       FROM users 
       WHERE id = $1 AND deleted_at IS NULL`,
      [req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    const user = result.rows[0];
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
        cpf: user.cpf,
        phone: user.phone,
        gamification: {
          points: user.points,
          level: user.level,
          streak_days: user.streak_days
        },
        preferences: user.preferences,
        created_at: user.created_at
      }
    });
  } catch (error) {
    logger.error('Get user info error', {
      error: error.message,
      user_id: req.user.userId
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to get user info',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * POST /auth/logout - User logout
 * Invalidates tokens (client-side only for stateless JWT)
 */
router.post('/auth/logout', authenticate, (req, res) => {
  logger.info('User logged out', {
    user_id: req.user.userId
  });
  
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

module.exports = router;

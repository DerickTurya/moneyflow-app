/**
 * Analytics Routes
 * Endpoints para consultar dados de eventos do banco de dados
 */

const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimiter');
const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * POST /analytics/events - Registrar novo evento
 * Aceita autenticação opcional (para modo demo)
 */
router.post('/analytics/events', optionalAuth, async (req, res) => {
  try {
    const { user_id, event_type, event_data } = req.body;
    
    // Se não autenticado, ignora mas retorna sucesso (modo demo)
    if (!req.user && !user_id) {
      logger.info('Event received in demo mode', { event_type });
      return res.json({
        success: true,
        message: 'Event logged (demo mode)',
        demo: true
      });
    }
    
    const userId = req.user ? req.user.userId : user_id;
    
    // Verifica se usuário existe
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    
    if (userCheck.rows.length === 0) {
      // Se não existe, loga mas retorna sucesso (modo demo)
      logger.info('Event for non-existent user (demo mode)', { user_id: userId, event_type });
      return res.json({
        success: true,
        message: 'Event logged (demo mode)',
        demo: true
      });
    }
    
    // Inserir evento no banco
    const query = `
      INSERT INTO user_events (id, user_id, event_type, event_data)
      VALUES (uuid_generate_v4(), $1, $2, $3)
      RETURNING id, created_at
    `;
    
    const result = await db.query(query, [userId, event_type, event_data]);
    
    logger.info('Event tracked successfully', {
      user_id: userId,
      event_type: event_type,
      event_id: result.rows[0].id
    });
    
    res.json({
      success: true,
      data: {
        event_id: result.rows[0].id,
        created_at: result.rows[0].created_at
      }
    });
  } catch (error) {
    logger.error('Failed to track event', {
      user_id: req.user?.userId || req.body.user_id,
      event_type: req.body.event_type,
      error: error.message
    });
    
    // Retorna sucesso mesmo com erro (para não quebrar a aplicação)
    res.json({
      success: true,
      message: 'Event logged locally',
      error: error.message
    });
  }
});

/**
 * GET /analytics/events - Listar eventos do usuário
 * Requer autenticação
 */
router.get('/analytics/events', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50, offset = 0, event_type, start_date, end_date } = req.query;

    let query = `
      SELECT 
        id,
        event_type,
        event_data,
        created_at
      FROM user_events
      WHERE user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    // Filtro por tipo de evento
    if (event_type) {
      paramCount++;
      query += ` AND event_type = $${paramCount}`;
      params.push(event_type);
    }

    // Filtro por data inicial
    if (start_date) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(start_date);
    }

    // Filtro por data final
    if (end_date) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(end_date);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_events
      WHERE user_id = $1
      ${event_type ? `AND event_type = $2` : ''}
    `;
    const countParams = event_type ? [userId, event_type] : [userId];
    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + result.rows.length < parseInt(countResult.rows[0].total)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch events', {
      user_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/summary - Resumo de eventos por tipo
 * Requer autenticação
 */
router.get('/analytics/summary', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { start_date, end_date } = req.query;

    let query = `
      SELECT 
        event_type,
        COUNT(*) as count,
        MIN(created_at) as first_event,
        MAX(created_at) as last_event
      FROM user_events
      WHERE user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    if (start_date) {
      paramCount++;
      query += ` AND created_at >= $${paramCount}`;
      params.push(start_date);
    }

    if (end_date) {
      paramCount++;
      query += ` AND created_at <= $${paramCount}`;
      params.push(end_date);
    }

    query += ` GROUP BY event_type ORDER BY count DESC`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch summary', {
      user_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/timeline - Timeline de eventos (últimas 24h)
 * Requer autenticação
 */
router.get('/analytics/timeline', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hours = 24 } = req.query;

    const query = `
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        event_type,
        COUNT(*) as count
      FROM user_events
      WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '${parseInt(hours)} hours'
      GROUP BY DATE_TRUNC('hour', created_at), event_type
      ORDER BY hour DESC, count DESC
    `;

    const result = await db.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch timeline', {
      user_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch timeline',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/transactions - Eventos de transações financeiras
 * Requer autenticação
 */
router.get('/analytics/transactions', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { limit = 50 } = req.query;

    const query = `
      SELECT 
        id,
        event_type,
        event_data->'properties' as properties,
        created_at
      FROM user_events
      WHERE user_id = $1
        AND event_type IN ('transfer_completed', 'payment_completed', 'recharge_completed')
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const result = await db.query(query, [userId, parseInt(limit)]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch transactions', {
      user_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/user-stats - Estatísticas do usuário
 * Requer autenticação
 */
router.get('/analytics/user-stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Buscar dados do usuário
    const userQuery = `
      SELECT 
        id,
        full_name,
        email,
        points,
        level,
        streak_days,
        created_at
      FROM users
      WHERE id = $1
    `;
    const userResult = await db.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Total de eventos
    const eventsQuery = `
      SELECT COUNT(*) as total_events
      FROM user_events
      WHERE user_id = $1
    `;
    const eventsResult = await db.query(eventsQuery, [userId]);

    // Último login
    const lastLoginQuery = `
      SELECT created_at
      FROM user_events
      WHERE user_id = $1 AND event_type = 'login'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const lastLoginResult = await db.query(lastLoginQuery, [userId]);

    // Total de transações
    const transactionsQuery = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM((event_data->'properties'->>'amount')::numeric) as total_amount
      FROM user_events
      WHERE user_id = $1
        AND event_type IN ('transfer_completed', 'payment_completed')
        AND event_data->'properties'->>'amount' IS NOT NULL
    `;
    const transactionsResult = await db.query(transactionsQuery, [userId]);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          points: user.points,
          level: user.level,
          streak_days: user.streak_days,
          member_since: user.created_at
        },
        stats: {
          total_events: parseInt(eventsResult.rows[0].total_events),
          last_login: lastLoginResult.rows[0]?.created_at || null,
          total_transactions: parseInt(transactionsResult.rows[0].total_transactions || 0),
          total_amount: parseFloat(transactionsResult.rows[0].total_amount || 0)
        }
      }
    });
  } catch (error) {
    logger.error('Failed to fetch user stats', {
      user_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/heatmap - Mapa de calor de atividades
 * Requer autenticação
 */
router.get('/analytics/heatmap', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { days = 30 } = req.query;

    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as events
      FROM user_events
      WHERE user_id = $1
        AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    const result = await db.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Failed to fetch heatmap', {
      user_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch heatmap',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/admin/all-users - Lista todos os usuários com estatísticas
 * Requer autenticação (em produção, adicionar verificação de role admin)
 */
router.get('/analytics/admin/all-users', authenticate, async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.phone,
        u.points,
        u.level,
        u.streak_days,
        u.created_at,
        COUNT(ue.id) as total_events,
        MAX(ue.created_at) as last_activity
      FROM users u
      LEFT JOIN user_events ue ON u.id = ue.user_id
      GROUP BY u.id, u.full_name, u.email, u.phone, u.points, u.level, u.streak_days, u.created_at
      ORDER BY last_activity DESC NULLS LAST, u.created_at DESC
    `;

    const result = await db.query(query);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    logger.error('Failed to fetch all users', {
      admin_id: req.user.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch all users',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/admin/user/:userId/events - Lista eventos de um usuário específico (admin)
 * Requer autenticação (em produção, adicionar verificação de role admin)
 */
router.get('/analytics/admin/user/:userId/events', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0, event_type } = req.query;

    let query = `
      SELECT 
        id,
        event_type,
        event_data,
        created_at
      FROM user_events
      WHERE user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    if (event_type) {
      paramCount++;
      query += ` AND event_type = $${paramCount}`;
      params.push(event_type);
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await db.query(query, params);

    // Contar total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM user_events
      WHERE user_id = $1
      ${event_type ? `AND event_type = $2` : ''}
    `;
    const countParams = event_type ? [userId, event_type] : [userId];
    const countResult = await db.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + result.rows.length < parseInt(countResult.rows[0].total)
      }
    });
  } catch (error) {
    logger.error('Failed to fetch user events', {
      admin_id: req.user.userId,
      target_user_id: req.params.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch user events',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * GET /analytics/admin/user/:userId/stats - Estatísticas de um usuário específico (admin)
 * Requer autenticação (em produção, adicionar verificação de role admin)
 */
router.get('/analytics/admin/user/:userId/stats', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar dados do usuário
    const userQuery = `
      SELECT 
        id,
        full_name,
        email,
        phone,
        points,
        level,
        streak_days,
        created_at
      FROM users
      WHERE id = $1
    `;
    const userResult = await db.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.rows[0];

    // Total de eventos
    const eventsQuery = `
      SELECT COUNT(*) as total_events
      FROM user_events
      WHERE user_id = $1
    `;
    const eventsResult = await db.query(eventsQuery, [userId]);

    // Último login
    const lastLoginQuery = `
      SELECT created_at
      FROM user_events
      WHERE user_id = $1 AND event_type = 'login'
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const lastLoginResult = await db.query(lastLoginQuery, [userId]);

    // Total de transações
    const transactionsQuery = `
      SELECT 
        COUNT(*) as total_transactions,
        SUM((event_data->>'amount')::numeric) as total_amount
      FROM user_events
      WHERE user_id = $1
        AND event_type IN ('transfer_completed', 'payment_completed')
        AND event_data->>'amount' IS NOT NULL
    `;
    const transactionsResult = await db.query(transactionsQuery, [userId]);

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.full_name,
          email: user.email,
          phone: user.phone,
          points: user.points,
          level: user.level,
          streak_days: user.streak_days,
          member_since: user.created_at
        },
        stats: {
          total_events: parseInt(eventsResult.rows[0].total_events),
          last_login: lastLoginResult.rows[0]?.created_at || null,
          total_transactions: parseInt(transactionsResult.rows[0].total_transactions || 0),
          total_amount: parseFloat(transactionsResult.rows[0].total_amount || 0)
        }
      }
    });
  } catch (error) {
    logger.error('Failed to fetch user stats', {
      admin_id: req.user.userId,
      target_user_id: req.params.userId,
      error: error.message
    });

    res.status(500).json({
      success: false,
      error: 'Failed to fetch user stats',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;

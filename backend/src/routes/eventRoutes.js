/**
 * Event Routes
 * API endpoints for event collection
 */

const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middlewares/authMiddleware');
const { validateSingleEvent, validateBatchEvents, checkIdempotency } = require('../middlewares/validationMiddleware');
const { eventsLimiter } = require('../middlewares/rateLimiter');
const logger = require('../utils/logger');
const db = require('../config/database');

// Kafka é opcional - verificar se está disponível
let kafkaAvailable = false;
let sendEvent, sendEventBatch;

try {
  const kafka = require('../config/kafka');
  sendEvent = kafka.sendEvent;
  sendEventBatch = kafka.sendEventBatch;
  kafkaAvailable = true;
  logger.info('Kafka module loaded');
} catch (error) {
  logger.warn('Kafka not available, events will only be stored in PostgreSQL');
  kafkaAvailable = false;
}

/**
 * POST /events - Single event collection
 * Accepts a single event and sends it to Kafka
 */
router.post('/events',
  eventsLimiter,
  optionalAuth,
  validateSingleEvent,
  checkIdempotency,
  async (req, res) => {
    try {
      const event = req.validatedEvent;
      
      logger.info('Event received', {
        event_id: event.event_id,
        event_type: event.event_type,
        user_id: event.user?.user_id || 'anonymous'
      });
      
      // Send to Kafka asynchronously (if available)
      if (kafkaAvailable) {
        sendEvent(event).catch(error => {
          logger.error('Failed to send event to Kafka', {
            event_id: event.event_id,
            error: error.message
          });
        });
      }
      
      // Store ALL events in database (não só críticos se Kafka não disponível)
      const criticalEvents = ['transfer_completed', 'payment_completed', 'login', 'logout'];
      const shouldStoreInDB = criticalEvents.includes(event.event_type) || !kafkaAvailable;
      
      if (shouldStoreInDB && event.user?.user_id) {
        try {
          await db.query(
            `INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO NOTHING`,
            [event.event_id, event.user.user_id, event.event_type, event, new Date(event.timestamp)]
          );
        } catch (dbError) {
          logger.error('Failed to store event in database', {
            event_id: event.event_id,
            error: dbError.message
          });
        }
      }
      
      // Respond immediately (fire and forget pattern)
      res.status(202).json({
        success: true,
        message: 'Event accepted',
        event_id: event.event_id
      });
    } catch (error) {
      logger.error('Error processing event', {
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to process event',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * POST /events/batch - Batch event collection
 * Accepts multiple events and sends them to Kafka
 */
router.post('/events/batch',
  eventsLimiter,
  optionalAuth,
  validateBatchEvents,
  async (req, res) => {
    try {
      const events = req.validatedEvents;
      
      logger.info('Event batch received', {
        event_count: events.length,
        event_types: [...new Set(events.map(e => e.event_type))].join(',')
      });
      
      // Send to Kafka asynchronously (if available)
      if (kafkaAvailable) {
        sendEventBatch(events).catch(error => {
          logger.error('Failed to send event batch to Kafka', {
            event_count: events.length,
            error: error.message
          });
        });
      }
      
      // Store events in database
      const criticalEvents = ['transfer_completed', 'payment_completed', 'login', 'logout'];
      const eventsToStore = !kafkaAvailable 
        ? events.filter(e => e.user?.user_id)  // Todos se não tiver Kafka
        : events.filter(e => criticalEvents.includes(e.event_type) && e.user?.user_id);
      
      if (eventsToStore.length > 0) {
        try {
          const values = eventsToStore.map(e => 
            `('${e.event_id}', '${e.user.user_id}', '${e.event_type}', '${JSON.stringify(e)}'::jsonb, '${e.timestamp}')`
          ).join(',');
          
          await db.query(
            `INSERT INTO user_events (id, user_id, event_type, event_data, created_at)
             VALUES ${values}
             ON CONFLICT (id) DO NOTHING`
          );
        } catch (dbError) {
          logger.error('Failed to store events in database', {
            error: dbError.message
          });
        }
      }
      
      // Respond immediately
      res.status(202).json({
        success: true,
        message: 'Events accepted',
        count: events.length
      });
    } catch (error) {
      logger.error('Error processing event batch', {
        error: error.message,
        stack: error.stack
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to process event batch',
        code: 'INTERNAL_ERROR'
      });
    }
  }
);

/**
 * GET /events/types - Get available event types
 */
router.get('/events/types', (req, res) => {
  const { EVENT_TYPES } = require('../schemas/eventSchema');
  
  res.json({
    success: true,
    event_types: EVENT_TYPES
  });
});

module.exports = router;

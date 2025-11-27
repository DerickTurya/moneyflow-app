/**
 * Validation Middleware
 * Request validation and sanitization
 */

const { validateEvent, validateEventBatch, sanitizePII, enrichEvent } = require('../schemas/eventSchema');
const logger = require('../utils/logger');

/**
 * Validate single event
 */
const validateSingleEvent = (req, res, next) => {
  const { error, value } = validateEvent(req.body);
  
  if (error) {
    logger.warn('Event validation failed', {
      errors: error.details.map(d => d.message),
      event_id: req.body.event_id
    });
    
    return res.status(400).json({
      success: false,
      error: 'Invalid event data',
      code: 'VALIDATION_ERROR',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }
  
  // Sanitize PII if enabled
  let event = value;
  if (process.env.SANITIZE_PII === 'true') {
    event = sanitizePII(event);
  }
  
  // Enrich event with server-side data
  event = enrichEvent(event, req);
  
  // Replace request body with validated and enriched event
  req.validatedEvent = event;
  
  next();
};

/**
 * Validate batch of events
 */
const validateBatchEvents = (req, res, next) => {
  const { error, value } = validateEventBatch(req.body);
  
  if (error) {
    logger.warn('Event batch validation failed', {
      errors: error.details.map(d => d.message)
    });
    
    return res.status(400).json({
      success: false,
      error: 'Invalid event batch data',
      code: 'VALIDATION_ERROR',
      details: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }
  
  // Sanitize PII and enrich each event
  let events = value.events;
  if (process.env.SANITIZE_PII === 'true') {
    events = events.map(event => sanitizePII(event));
  }
  
  events = events.map(event => enrichEvent(event, req));
  
  // Replace request body with validated and enriched events
  req.validatedEvents = events;
  
  next();
};

/**
 * Check for duplicate events (idempotency)
 * Uses in-memory cache with TTL
 */
const eventCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const checkIdempotency = (req, res, next) => {
  const eventId = req.validatedEvent?.event_id || req.validatedEvents?.[0]?.event_id;
  
  if (!eventId) {
    return next();
  }
  
  // Check if event was recently processed
  if (eventCache.has(eventId)) {
    logger.warn('Duplicate event detected', { event_id: eventId });
    
    // Return success to avoid client retry
    return res.status(202).json({
      success: true,
      message: 'Event already processed',
      code: 'DUPLICATE_EVENT'
    });
  }
  
  // Add to cache
  eventCache.set(eventId, Date.now());
  
  // Clean up old entries
  setTimeout(() => {
    eventCache.delete(eventId);
  }, CACHE_TTL);
  
  next();
};

/**
 * Clean up cache periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [eventId, timestamp] of eventCache.entries()) {
    if (now - timestamp > CACHE_TTL) {
      eventCache.delete(eventId);
    }
  }
}, 60000); // Clean every minute

module.exports = {
  validateSingleEvent,
  validateBatchEvents,
  checkIdempotency
};

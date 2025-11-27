/**
 * Event Schema Validation
 * Joi schema for event validation with PII sanitization
 */

const Joi = require('joi');

// Event types enum
const EVENT_TYPES = [
  'page_view',
  'click',
  'form_submit',
  'login',
  'logout',
  'transfer_initiated',
  'transfer_confirmed',
  'transfer_completed',
  'payment_initiated',
  'payment_completed',
  'recharge_initiated',
  'recharge_completed',
  'cashback_earned',
  'goal_created',
  'goal_completed',
  'budget_exceeded',
  'achievement_unlocked',
  'error',
  'heartbeat'
];

// User schema
const userSchema = Joi.object({
  user_id: Joi.string().uuid().optional(),
  device_id: Joi.string().uuid().required(),
  email: Joi.string().email().optional(),
  cpf: Joi.string().pattern(/^\d{11}$/).optional()
}).required();

// Session schema
const sessionSchema = Joi.object({
  session_id: Joi.string().uuid().required(),
  seq: Joi.number().integer().min(0).required()
}).required();

// Context schema
const contextSchema = Joi.object({
  url: Joi.string().uri().optional(),
  referrer: Joi.string().uri().optional().allow(''),
  ip: Joi.string().ip().optional(),
  user_agent: Joi.string().max(500).optional(),
  screen_width: Joi.number().integer().optional(),
  screen_height: Joi.number().integer().optional(),
  viewport_width: Joi.number().integer().optional(),
  viewport_height: Joi.number().integer().optional(),
  timezone: Joi.string().optional(),
  locale: Joi.string().optional()
}).optional();

// Properties schema (flexible)
const propertiesSchema = Joi.object().pattern(
  Joi.string(),
  Joi.alternatives().try(
    Joi.string(),
    Joi.number(),
    Joi.boolean(),
    Joi.object(),
    Joi.array()
  )
).optional();

// Main event schema
const eventSchema = Joi.object({
  event_id: Joi.string().uuid().required(),
  event_type: Joi.string().valid(...EVENT_TYPES).required(),
  timestamp: Joi.date().iso().required(),
  user: userSchema,
  session: sessionSchema,
  context: contextSchema,
  properties: propertiesSchema,
  version: Joi.string().default('1.0.0').optional()
});

// Batch event schema
const batchEventSchema = Joi.object({
  events: Joi.array().items(eventSchema).min(1).max(100).required()
});

/**
 * Validate single event
 * @param {Object} event - Event object
 * @returns {Object} Validation result
 */
const validateEvent = (event) => {
  return eventSchema.validate(event, {
    abortEarly: false,
    stripUnknown: true
  });
};

/**
 * Validate batch of events
 * @param {Object} batch - Batch object with events array
 * @returns {Object} Validation result
 */
const validateEventBatch = (batch) => {
  return batchEventSchema.validate(batch, {
    abortEarly: false,
    stripUnknown: true
  });
};

/**
 * Sanitize PII from event
 * @param {Object} event - Event object
 * @returns {Object} Sanitized event
 */
const sanitizePII = (event) => {
  const sanitized = { ...event };
  
  // Sanitize CPF (keep only last 3 digits)
  if (sanitized.user?.cpf) {
    sanitized.user.cpf = `***.***.***-${sanitized.user.cpf.slice(-2)}`;
  }
  
  // Sanitize email (keep domain)
  if (sanitized.user?.email) {
    const [local, domain] = sanitized.user.email.split('@');
    if (local && domain) {
      sanitized.user.email = `${local.charAt(0)}***@${domain}`;
    }
  }
  
  // Sanitize phone numbers in properties
  if (sanitized.properties) {
    const sanitizeValue = (value) => {
      if (typeof value === 'string') {
        // Phone pattern: (XX) XXXXX-XXXX or similar
        return value.replace(/(\(\d{2}\)\s?\d{4,5})-?\d{4}/g, '(**) ****-****');
      }
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).reduce((acc, key) => {
          acc[key] = sanitizeValue(value[key]);
          return acc;
        }, {});
      }
      return value;
    };
    
    sanitized.properties = sanitizeValue(sanitized.properties);
  }
  
  // Remove sensitive fields from properties
  const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'credit_card', 'cvv'];
  if (sanitized.properties) {
    sensitiveFields.forEach(field => {
      if (sanitized.properties[field]) {
        sanitized.properties[field] = '[REDACTED]';
      }
    });
  }
  
  return sanitized;
};

/**
 * Enrich event with server-side data
 * @param {Object} event - Event object
 * @param {Object} req - Express request object
 * @returns {Object} Enriched event
 */
const enrichEvent = (event, req) => {
  const enriched = { ...event };
  
  // Add server timestamp for comparison
  enriched.server_timestamp = new Date().toISOString();
  
  // Add IP address if not present
  if (!enriched.context) {
    enriched.context = {};
  }
  
  if (!enriched.context.ip) {
    enriched.context.ip = req.ip || req.connection.remoteAddress;
  }
  
  // Add user agent if not present
  if (!enriched.context.user_agent) {
    enriched.context.user_agent = req.get('user-agent');
  }
  
  // Add authenticated user ID from JWT if available
  if (req.user && req.user.userId && !enriched.user.user_id) {
    enriched.user.user_id = req.user.userId;
  }
  
  return enriched;
};

module.exports = {
  eventSchema,
  batchEventSchema,
  validateEvent,
  validateEventBatch,
  sanitizePII,
  enrichEvent,
  EVENT_TYPES
};

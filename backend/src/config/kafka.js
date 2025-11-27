/**
 * Kafka Configuration
 * Professional Kafka producer setup with error handling and reconnection
 */

const { Kafka, logLevel, CompressionTypes } = require('kafkajs');
const logger = require('../utils/logger');

// Kafka client configuration
const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'moneyflow-api',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  logLevel: logLevel.ERROR,
  retry: {
    initialRetryTime: 100,
    retries: parseInt(process.env.KAFKA_RETRY_ATTEMPTS || '5'),
    maxRetryTime: 30000,
    multiplier: 2,
    factor: 0.2
  },
  connectionTimeout: 10000,
  requestTimeout: 30000
});

// Create Kafka producer
const producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
  compression: CompressionTypes.GZIP,
  idempotent: true, // Prevent duplicate messages
  maxInFlightRequests: 5,
  retry: {
    maxRetryTime: 30000,
    initialRetryTime: 100,
    retries: 5
  }
});

// Producer connection status
let isConnected = false;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 10;

/**
 * Connect to Kafka with retry mechanism
 */
const connectProducer = async () => {
  if (isConnected) {
    logger.info('Kafka producer already connected');
    return true;
  }

  try {
    logger.info('Connecting to Kafka...');
    await producer.connect();
    isConnected = true;
    connectionAttempts = 0;
    logger.info('Kafka producer connected successfully');
    return true;
  } catch (error) {
    connectionAttempts++;
    logger.error('Failed to connect to Kafka', {
      error: error.message,
      attempt: connectionAttempts,
      maxAttempts: MAX_CONNECTION_ATTEMPTS
    });

    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      const retryDelay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
      logger.info(`Retrying connection in ${retryDelay}ms...`);
      
      setTimeout(() => {
        connectProducer();
      }, retryDelay);
    } else {
      logger.error('Max Kafka connection attempts reached. Service degraded.');
    }
    
    return false;
  }
};

/**
 * Send event to Kafka
 * @param {Object} event - Event object to send
 * @param {string} topic - Kafka topic (default: events)
 * @returns {Promise<Object>} Send result
 */
const sendEvent = async (event, topic = process.env.KAFKA_TOPIC_EVENTS || 'events') => {
  if (!isConnected) {
    logger.warn('Kafka producer not connected. Attempting to reconnect...');
    await connectProducer();
    
    if (!isConnected) {
      throw new Error('Kafka producer not available');
    }
  }

  try {
    const message = {
      key: event.event_id, // Use event_id as message key for partitioning
      value: JSON.stringify(event),
      headers: {
        'event_type': event.event_type,
        'user_id': event.user?.user_id || 'anonymous',
        'timestamp': event.timestamp
      },
      timestamp: new Date(event.timestamp).getTime().toString()
    };

    const result = await producer.send({
      topic,
      messages: [message],
      compression: CompressionTypes.GZIP,
      timeout: 30000
    });

    logger.info('Event sent to Kafka', {
      event_id: event.event_id,
      event_type: event.event_type,
      topic,
      partition: result[0].partition,
      offset: result[0].offset
    });

    return result;
  } catch (error) {
    logger.error('Failed to send event to Kafka', {
      event_id: event.event_id,
      error: error.message,
      stack: error.stack
    });

    // Try to send to error topic
    try {
      await producer.send({
        topic: process.env.KAFKA_TOPIC_ERRORS || 'events-errors',
        messages: [{
          key: event.event_id,
          value: JSON.stringify({
            original_event: event,
            error: error.message,
            timestamp: new Date().toISOString()
          })
        }]
      });
    } catch (errorTopicError) {
      logger.error('Failed to send to error topic', { error: errorTopicError.message });
    }

    throw error;
  }
};

/**
 * Send batch of events to Kafka
 * @param {Array<Object>} events - Array of events
 * @param {string} topic - Kafka topic
 * @returns {Promise<Object>} Send result
 */
const sendEventBatch = async (events, topic = process.env.KAFKA_TOPIC_EVENTS || 'events') => {
  if (!isConnected) {
    logger.warn('Kafka producer not connected. Attempting to reconnect...');
    await connectProducer();
    
    if (!isConnected) {
      throw new Error('Kafka producer not available');
    }
  }

  try {
    const messages = events.map(event => ({
      key: event.event_id,
      value: JSON.stringify(event),
      headers: {
        'event_type': event.event_type,
        'user_id': event.user?.user_id || 'anonymous',
        'timestamp': event.timestamp
      },
      timestamp: new Date(event.timestamp).getTime().toString()
    }));

    const result = await producer.send({
      topic,
      messages,
      compression: CompressionTypes.GZIP,
      timeout: 30000
    });

    logger.info('Event batch sent to Kafka', {
      event_count: events.length,
      topic,
      partitions: result.map(r => r.partition).join(',')
    });

    return result;
  } catch (error) {
    logger.error('Failed to send event batch to Kafka', {
      event_count: events.length,
      error: error.message
    });
    throw error;
  }
};

/**
 * Disconnect Kafka producer
 */
const disconnectProducer = async () => {
  if (isConnected) {
    try {
      await producer.disconnect();
      isConnected = false;
      logger.info('Kafka producer disconnected');
    } catch (error) {
      logger.error('Error disconnecting Kafka producer', { error: error.message });
    }
  }
};

// Handle producer events
producer.on('producer.connect', () => {
  logger.info('Kafka producer connected event');
});

producer.on('producer.disconnect', () => {
  isConnected = false;
  logger.warn('Kafka producer disconnected event');
});

producer.on('producer.network.request_timeout', (payload) => {
  logger.error('Kafka producer request timeout', payload);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await disconnectProducer();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectProducer();
  process.exit(0);
});

module.exports = {
  kafka,
  producer,
  connectProducer,
  sendEvent,
  sendEventBatch,
  disconnectProducer,
  isConnected: () => isConnected
};

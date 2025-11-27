/**
 * MoneyFlow Tracking SDK
 * Client-side event tracking with offline support and automatic retry
 * 
 * @version 1.0.0
 * @author MoneyFlow Team
 */

(function(window) {
  'use strict';

  // SDK Configuration
  const DEFAULT_CONFIG = {
    apiUrl: 'http://localhost:3000/api/v1',
    batchSize: 10,
    batchTimeout: 5000,
    maxQueueSize: 1000,
    retryAttempts: 3,
    retryDelay: 1000,
    enableAutoTracking: true,
    enableOfflineQueue: true,
    debug: false
  };

  // SDK State
  let config = { ...DEFAULT_CONFIG };
  let eventQueue = [];
  let sessionId = null;
  let deviceId = null;
  let userId = null;
  let accessToken = null;
  let sequenceNumber = 0;
  let batchTimer = null;
  let isInitialized = false;
  let isOnline = navigator.onLine;

  /**
   * Initialize the tracking SDK
   * @param {Object} options - Configuration options
   */
  function initTracking(options = {}) {
    if (isInitialized) {
      console.warn('[MoneyFlow] SDK already initialized');
      return;
    }

    // Merge config
    config = { ...DEFAULT_CONFIG, ...options };

    // Initialize IDs
    deviceId = getOrCreateDeviceId();
    sessionId = getOrCreateSessionId();

    // Load offline queue
    if (config.enableOfflineQueue) {
      loadOfflineQueue();
    }

    // Setup auto-tracking
    if (config.enableAutoTracking) {
      setupAutoTracking();
    }

    // Setup online/offline listeners
    setupConnectivityListeners();

    // Setup beforeunload handler
    setupBeforeUnloadHandler();

    // Start heartbeat
    startHeartbeat();

    isInitialized = true;
    log('SDK initialized', { deviceId, sessionId });

    // Track page view
    track('page_view', {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer
    });
  }

  /**
   * Track an event
   * @param {string} eventType - Type of event
   * @param {Object} properties - Event properties
   */
  function track(eventType, properties = {}) {
    if (!isInitialized) {
      console.error('[MoneyFlow] SDK not initialized. Call initTracking() first.');
      return;
    }

    const event = createEvent(eventType, properties);
    addToQueue(event);
    log('Event tracked', event);
  }

  /**
   * Set user ID (after login)
   * @param {string} id - User ID
   */
  function setUserId(id) {
    userId = id;
    log('User ID set', { userId });
  }

  /**
   * Set access token (after login)
   * @param {string} token - JWT access token
   */
  function setAccessToken(token) {
    accessToken = token;
    log('Access token set');
  }

  /**
   * Clear user data (on logout)
   */
  function clearUser() {
    userId = null;
    accessToken = null;
    sessionId = generateUUID();
    sequenceNumber = 0;
    saveSessionId(sessionId);
    log('User cleared, new session started');
  }

  /**
   * Flush event queue immediately
   */
  function flushQueue() {
    if (eventQueue.length === 0) {
      log('Queue is empty, nothing to flush');
      return Promise.resolve();
    }

    const eventsToSend = [...eventQueue];
    eventQueue = [];

    return sendEventBatch(eventsToSend);
  }

  /**
   * Create event object
   * @param {string} eventType - Event type
   * @param {Object} properties - Event properties
   * @returns {Object} Event object
   */
  function createEvent(eventType, properties) {
    sequenceNumber++;

    return {
      event_id: generateUUID(),
      event_type: eventType,
      timestamp: new Date().toISOString(),
      user: {
        user_id: userId,
        device_id: deviceId
      },
      session: {
        session_id: sessionId,
        seq: sequenceNumber
      },
      context: getContext(),
      properties: properties || {},
      version: '1.0.0'
    };
  }

  /**
   * Add event to queue
   * @param {Object} event - Event object
   */
  function addToQueue(event) {
    // Check queue size limit
    if (eventQueue.length >= config.maxQueueSize) {
      console.warn('[MoneyFlow] Queue is full, dropping oldest event');
      eventQueue.shift();
    }

    eventQueue.push(event);

    // Save to localStorage if offline
    if (!isOnline && config.enableOfflineQueue) {
      saveOfflineQueue();
    }

    // Trigger batch send if queue is full
    if (eventQueue.length >= config.batchSize) {
      clearTimeout(batchTimer);
      flushQueue();
    } else {
      // Reset batch timer
      clearTimeout(batchTimer);
      batchTimer = setTimeout(() => {
        flushQueue();
      }, config.batchTimeout);
    }
  }

  /**
   * Send event batch to API
   * @param {Array} events - Array of events
   * @returns {Promise} Send result
   */
  function sendEventBatch(events) {
    if (!isOnline) {
      log('Offline, events saved to queue', { count: events.length });
      return Promise.reject(new Error('Offline'));
    }

    const endpoint = `${config.apiUrl}/events/batch`;
    const payload = { events };

    const headers = {
      'Content-Type': 'application/json'
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    log('Sending event batch', { count: events.length, endpoint });

    return fetchWithRetry(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    }, config.retryAttempts)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        log('Event batch sent successfully', data);
        return data;
      })
      .catch(error => {
        console.error('[MoneyFlow] Failed to send event batch', error);
        
        // Re-add to queue if failed
        eventQueue.unshift(...events);
        
        // Save to offline queue
        if (config.enableOfflineQueue) {
          saveOfflineQueue();
        }
        
        throw error;
      });
  }

  /**
   * Fetch with exponential backoff retry
   * @param {string} url - Request URL
   * @param {Object} options - Fetch options
   * @param {number} retries - Retry attempts remaining
   * @returns {Promise} Fetch promise
   */
  function fetchWithRetry(url, options, retries) {
    return fetch(url, options)
      .catch(error => {
        if (retries > 0) {
          const delay = config.retryDelay * Math.pow(2, config.retryAttempts - retries);
          log(`Retry after ${delay}ms`, { retriesLeft: retries - 1 });
          
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(fetchWithRetry(url, options, retries - 1));
            }, delay);
          });
        }
        throw error;
      });
  }

  /**
   * Setup automatic event tracking
   */
  function setupAutoTracking() {
    // Track clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [data-track]');
      if (target) {
        track('click', {
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim().substring(0, 100),
          href: target.href,
          id: target.id,
          class: target.className,
          dataset: target.dataset
        });
      }
    }, true);

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM') {
        track('form_submit', {
          form_id: form.id,
          form_name: form.name,
          action: form.action,
          method: form.method
        });
      }
    }, true);

    // Track errors
    window.addEventListener('error', (e) => {
      track('error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      track('error', {
        message: e.reason?.message || 'Unhandled promise rejection',
        stack: e.reason?.stack,
        type: 'unhandled_rejection'
      });
    });

    log('Auto-tracking enabled');
  }

  /**
   * Setup connectivity listeners
   */
  function setupConnectivityListeners() {
    window.addEventListener('online', () => {
      isOnline = true;
      log('Connection restored');
      
      // Flush offline queue
      if (config.enableOfflineQueue) {
        loadOfflineQueue();
        if (eventQueue.length > 0) {
          flushQueue();
        }
      }
    });

    window.addEventListener('offline', () => {
      isOnline = false;
      log('Connection lost');
    });
  }

  /**
   * Setup beforeunload handler
   */
  function setupBeforeUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      // Try to send remaining events using sendBeacon
      if (eventQueue.length > 0) {
        const endpoint = `${config.apiUrl}/events/batch`;
        const payload = JSON.stringify({ events: eventQueue });
        
        const headers = {
          type: 'application/json'
        };

        if (navigator.sendBeacon) {
          // Use sendBeacon for reliable sending on page unload
          const blob = new Blob([payload], headers);
          navigator.sendBeacon(endpoint, blob);
          log('Events sent via sendBeacon', { count: eventQueue.length });
        } else {
          // Fallback: save to offline queue
          saveOfflineQueue();
        }
      }
    });
  }

  /**
   * Start heartbeat tracking
   */
  function startHeartbeat() {
    setInterval(() => {
      track('heartbeat', {
        uptime: Math.floor((Date.now() - performance.timing.navigationStart) / 1000)
      });
    }, 60000); // Every 60 seconds
  }

  /**
   * Get context data
   * @returns {Object} Context object
   */
  function getContext() {
    return {
      url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: navigator.language
    };
  }

  /**
   * Get or create device ID
   * @returns {string} Device ID
   */
  function getOrCreateDeviceId() {
    let id = localStorage.getItem('moneyflow_device_id');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('moneyflow_device_id', id);
    }
    return id;
  }

  /**
   * Get or create session ID
   * @returns {string} Session ID
   */
  function getOrCreateSessionId() {
    let id = sessionStorage.getItem('moneyflow_session_id');
    if (!id) {
      id = generateUUID();
      sessionStorage.setItem('moneyflow_session_id', id);
    }
    return id;
  }

  /**
   * Save session ID
   * @param {string} id - Session ID
   */
  function saveSessionId(id) {
    sessionStorage.setItem('moneyflow_session_id', id);
  }

  /**
   * Save offline queue to localStorage
   */
  function saveOfflineQueue() {
    try {
      localStorage.setItem('moneyflow_offline_queue', JSON.stringify(eventQueue));
      log('Offline queue saved', { count: eventQueue.length });
    } catch (error) {
      console.error('[MoneyFlow] Failed to save offline queue', error);
    }
  }

  /**
   * Load offline queue from localStorage
   */
  function loadOfflineQueue() {
    try {
      const saved = localStorage.getItem('moneyflow_offline_queue');
      if (saved) {
        const savedEvents = JSON.parse(saved);
        eventQueue.push(...savedEvents);
        localStorage.removeItem('moneyflow_offline_queue');
        log('Offline queue loaded', { count: savedEvents.length });
      }
    } catch (error) {
      console.error('[MoneyFlow] Failed to load offline queue', error);
    }
  }

  /**
   * Generate UUID v4
   * @returns {string} UUID
   */
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Debug logger
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  function log(message, data) {
    if (config.debug) {
      console.log(`[MoneyFlow] ${message}`, data || '');
    }
  }

  // Export public API
  window.MoneyFlow = window.MoneyFlow || {
    initTracking,
    track,
    setUserId,
    setAccessToken,
    clearUser,
    flushQueue,
    version: '1.0.0'
  };

  // Also export as window.track for convenience
  window.track = track;

})(window);

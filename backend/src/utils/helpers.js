/**
 * Utilities
 * Helper functions for the application
 */

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
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Promise with function result
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const backoffDelay = delay * Math.pow(2, i);
        await sleep(backoffDelay);
      }
    }
  }
  
  throw lastError;
}

/**
 * Sanitize string for logging (remove sensitive data)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeForLog(str) {
  if (typeof str !== 'string') return str;
  
  // Remove email addresses
  str = str.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  
  // Remove CPF
  str = str.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, '[CPF]');
  
  // Remove phone numbers
  str = str.replace(/\(\d{2}\)\s?\d{4,5}-?\d{4}/g, '[PHONE]');
  
  // Remove credit card numbers
  str = str.replace(/\d{4}\s?\d{4}\s?\d{4}\s?\d{4}/g, '[CARD]');
  
  return str;
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Number of decimals
 * @returns {string} Formatted string
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Parse user agent string
 * @param {string} userAgent - User agent string
 * @returns {Object} Parsed user agent
 */
function parseUserAgent(userAgent) {
  const ua = userAgent || '';
  
  const browsers = [
    { name: 'Chrome', regex: /Chrome\/(\d+)/ },
    { name: 'Firefox', regex: /Firefox\/(\d+)/ },
    { name: 'Safari', regex: /Safari\/(\d+)/ },
    { name: 'Edge', regex: /Edg\/(\d+)/ },
    { name: 'Opera', regex: /OPR\/(\d+)/ }
  ];
  
  const os = [
    { name: 'Windows', regex: /Windows NT (\d+\.\d+)/ },
    { name: 'macOS', regex: /Mac OS X (\d+[._]\d+)/ },
    { name: 'Linux', regex: /Linux/ },
    { name: 'Android', regex: /Android (\d+)/ },
    { name: 'iOS', regex: /iPhone OS (\d+[._]\d+)/ }
  ];
  
  let browser = 'Unknown';
  let browserVersion = '';
  let operatingSystem = 'Unknown';
  let osVersion = '';
  
  for (const b of browsers) {
    const match = ua.match(b.regex);
    if (match) {
      browser = b.name;
      browserVersion = match[1];
      break;
    }
  }
  
  for (const o of os) {
    const match = ua.match(o.regex);
    if (match) {
      operatingSystem = o.name;
      osVersion = match[1] || '';
      break;
    }
  }
  
  return {
    browser,
    browserVersion,
    os: operatingSystem,
    osVersion,
    isMobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua),
    isTablet: /iPad|Android/i.test(ua) && !/Mobile/i.test(ua)
  };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
function isValidEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * Validate CPF format
 * @param {string} cpf - CPF to validate
 * @returns {boolean} Is valid
 */
function isValidCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

module.exports = {
  generateUUID,
  sleep,
  retryWithBackoff,
  sanitizeForLog,
  formatBytes,
  parseUserAgent,
  isValidEmail,
  isValidCPF
};

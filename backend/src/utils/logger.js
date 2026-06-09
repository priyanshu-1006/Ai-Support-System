import config from '../config/index.js';

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLogLevel = LOG_LEVELS[config.logLevel] || LOG_LEVELS.info;

const logger = {
  error: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.error) {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
    }
  },
  
  warn: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.warn) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
    }
  },
  
  info: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.info) {
      console.info(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
    }
  },
  
  debug: (message, meta = {}) => {
    if (currentLogLevel >= LOG_LEVELS.debug) {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
    }
  },
};

export default logger;

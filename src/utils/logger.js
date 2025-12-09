import winston from 'winston';
import path from 'path';

/**
 * Logger utility using Winston for comprehensive logging
 * Logs to both console and file with different levels
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'basicblog' },
    transports: [
        // Write all logs with importance level of `error` or less to `error.log`
        new winston.transports.File({
            filename: 'basicblog-error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // Write all logs to `basicblog.log`
        new winston.transports.File({
            filename: 'basicblog.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// If we're not in production, log to the console with a simple format
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                let msg = `${timestamp} [${level}]: ${message}`;
                if (Object.keys(metadata).length > 0) {
                    msg += ` ${JSON.stringify(metadata)}`;
                }
                return msg;
            })
        ),
    }));
}

/**
 * Log info message
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const logInfo = (message, meta = {}) => {
    logger.info(message, meta);
};

/**
 * Log warning message
 * @param {string} message - Message to log
 * @param {Object} meta - Additional metadata
 */
export const logWarn = (message, meta = {}) => {
    logger.warn(message, meta);
};

/**
 * Log error message
 * @param {string} message - Message to log
 * @param {Error|Object} error - Error object or metadata
 */
export const logError = (message, error = {}) => {
    if (error instanceof Error) {
        logger.error(message, { error: error.message, stack: error.stack });
    } else {
        logger.error(message, error);
    }
};

export default logger;

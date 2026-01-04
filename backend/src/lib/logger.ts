import winston from 'winston';
import path from 'path';

// Define log directory
const logDir = 'logs';

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info', // Default to info
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'moncvpro-backend' },
    transports: [
        // File for errors
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 7,
        }),
        // File for everything
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 7,
        }),
    ],
});

// Console in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        })
    );
}

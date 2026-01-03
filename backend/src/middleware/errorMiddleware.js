import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `Route not found: ${req.method} ${req.originalUrl}`,
        404
    );
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || 'unknown';
    
    let error = err;
    
    if (!(err instanceof AppError)) {
        error = new AppError(
            err.message || 'Internal server error',
            err.statusCode || 500,
            false
        );
        error.stack = err.stack;
    }

    const errorResponse = {
        success: false,
        error: error.message,
        statusCode: error.statusCode,
        timestamp: error.timestamp || new Date().toISOString(),
    };

    if (error.errors) {
        errorResponse.errors = error.errors;
    }

    if (error.retryAfter) {
        res.setHeader('Retry-After', error.retryAfter);
        errorResponse.retryAfter = error.retryAfter;
    }

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
        errorResponse.isOperational = error.isOperational;
    }

    const logMeta = {
        ip,
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: error.statusCode,
        userAgent: req.headers['user-agent'],
        body: req.body,
        params: req.params,
        query: req.query,
    };

    if (error.statusCode >= 500) {
        logger.error(
            `Server Error: ${error.message}`,
            error,
            logMeta
        );
    } else if (error.statusCode >= 400) {
        logger.warn(
            `Client Error: ${error.message}`,
            logMeta
        );
    }

    if (!error.isOperational) {
        logger.error(
            'CRITICAL: Non-operational error occurred',
            error,
            logMeta
        );
    }

    res.status(error.statusCode).json(errorResponse);
};

export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const handleUncaughtErrors = () => {
    process.on('uncaughtException', (error) => {
        logger.error('UNCAUGHT EXCEPTION! Shutting down...', error, {
            type: 'UNCAUGHT_EXCEPTION',
        });
        
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        logger.error('UNHANDLED REJECTION! Shutting down...', reason, {
            type: 'UNHANDLED_REJECTION',
            promise: promise.toString(),
        });
        
        process.exit(1);
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Shutting down gracefully...');
        process.exit(0);
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received. Shutting down gracefully...');
        process.exit(0);
    });
};

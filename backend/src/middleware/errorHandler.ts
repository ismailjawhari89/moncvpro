import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    // 1. Map Prisma Errors to AppError
    if (err.code && err.code.startsWith('P')) {
        // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        switch (err.code) {
            case 'P2002': // Unique constraint failed
                error = new AppError('A record with this value already exists', 400, 'DUPLICATE_ENTRY');
                break;
            case 'P2025': // Record not found
                error = new AppError('The requested record was not found', 404, 'NOT_FOUND');
                break;
            default:
                error = new AppError('Database operation failed', 500, 'DATABASE_ERROR');
        }
    }

    // 2. Wrap unknown errors as AppError
    if (!(error instanceof AppError)) {
        const statusCode = error.statusCode || error.status || 500;
        const message = error.message || 'An unexpected error occurred';
        error = new AppError(message, statusCode, 'INTERNAL_SERVER_ERROR', false);
    }

    const statusCode = error.statusCode;

    // 3. Log error based on severity
    const logMeta = {
        code: error.code,
        method: req.method,
        path: req.path,
        requestId: req.headers['x-request-id'],
        userId: (req as any).userId,
        ip: req.ip
    };

    if (statusCode >= 500) {
        logger.error('Unhandled Exception', { ...logMeta, stack: error.stack, body: req.body });
    } else {
        logger.warn('Operational Error', { ...logMeta, message: error.message });
    }

    // 4. Send clean response
    const response = {
        success: false,
        error: {
            code: error.code || 'INTERNAL_SERVER_ERROR',
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
            details: err.details || null
        },
        timestamp: new Date().toISOString()
    };

    res.status(statusCode).json(response);
};

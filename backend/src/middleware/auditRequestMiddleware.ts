import { logger } from '../lib/logger';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include custom fields
declare global {
    namespace Express {
        interface Request {
            startTime?: number;
            auditAction?: string;
        }
    }
}

/**
 * Middleware to log all API requests and capture response status for auditing
 */
export const auditRequestMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Record start time
    req.startTime = Date.now();

    // Capture original json response method to intercept response body if needed (Be careful with large bodies)
    // For now we assume we just want status codes and basic info

    // Log on response finish
    res.on('finish', () => {
        const duration = Date.now() - (req.startTime || 0);
        const status = res.statusCode;
        const success = status >= 200 && status < 300;

        const logData = {
            method: req.method,
            path: req.path,
            ip: req.ip || req.socket.remoteAddress,
            userAgent: req.get('user-agent'),
            userId: (req as any).user?.id || 'anonymous',
            statusCode: status,
            duration,
            success
        };

        if (status >= 500) {
            logger.error(logData, 'API Request Failed (Server Error)');
        } else if (status >= 400) {
            logger.warn(logData, 'API Request Failed (Client Error)');
        } else {
            logger.info(logData, 'API Request Completed');
        }
    });

    next();
};

/**
 * Helper to tag a specific route/controller action for more specific auditing
 */
export const auditAction = (action: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        req.auditAction = action;
        next();
    };
};

export default { auditRequestMiddleware, auditAction };

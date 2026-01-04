import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    logger.info({
        message: 'Incoming request',
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: (req as any).user?.id
    });

    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info({
            message: 'Request completed',
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration: `${duration}ms`
        });
    });

    next();
};

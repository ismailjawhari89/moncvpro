
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Track when the response is finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const cacheStatus = res.get('X-Cache') || 'NONE';

        // Log slow requests (> 500ms)
        if (duration > 500) {
            logger.warn({
                method: req.method,
                path: req.originalUrl,
                duration: `${duration}ms`,
                statusCode: res.statusCode,
                cacheStatus
            }, 'Slow Request Detected');
        }

        // In a real app, we would send these to a metrics service (e.g. Prometheus/Grafana)
        // For now, we'll log summary for all requests if debug level is on
        logger.debug({
            method: req.method,
            path: req.originalUrl,
            duration: `${duration}ms`,
            cacheStatus
        }, 'Request Performance');
    });

    next();
};

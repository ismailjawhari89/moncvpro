
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to extract audit information from the request
 */
export const auditMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'];

    req.audit = {
        ip: Array.isArray(ip) ? ip[0] : ip,
        userAgent: userAgent as string
    };

    next();
};

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../lib/logger';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';

/**
 * Middleware to protect routes and inject authenticated user ID
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // 1. Try reading from cookie first (httpOnly)
        const tokenFromCookie = req.cookies?.auth_token;

        // 2. Fallback to Authorization header
        let tokenFromHeader: string | undefined;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            tokenFromHeader = authHeader.split(' ')[1];
        }

        const token = tokenFromCookie || tokenFromHeader;

        if (!token) {
            logger.warn({ ip: req.ip, path: req.path }, 'Unauthorized access attempt: No token provided');
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authentication token provided'
            });
        }

        // 3. Verify token
        try {
            const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;

            // Inject user info into request
            (req as any).user = { id: decoded.userId };
            (req as any).userId = decoded.userId;

            next();
        } catch (err: any) {
            logger.warn({ ip: req.ip, path: req.path, error: err.name }, 'Security: Invalid or expired token attempt');
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'TokenExpired',
                    message: 'Token has expired'
                });
            }
            return res.status(401).json({
                error: 'InvalidToken',
                message: 'Token is not valid'
            });
        }
    } catch (err) {
        logger.error({ err }, 'Internal Auth Middleware Error');
        return res.status(500).json({
            error: 'AuthError',
            message: 'Authentication failed'
        });
    }
};

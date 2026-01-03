import logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.http(req, res, duration);
    });
    
    next();
};

export const securityLogger = (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const method = req.method;
    const path = req.path;
    
    const sensitiveRoutes = ['/api/auth/login', '/api/auth/register', '/api/upload'];
    
    if (process.env.NODE_ENV === 'production') {
        if (sensitiveRoutes.some(route => path.includes(route))) {
            logger.security('Sensitive route accessed', {
                method,
                path,
                ip,
                userAgent: req.headers['user-agent'],
            });
        }
    }
    
    res.on('finish', () => {
        if (res.statusCode === 401 || res.statusCode === 403) {
            logger.authFailure(
                method === 'POST' && path.includes('login') ? 'LOGIN' : 'AUTH',
                req.body?.email || 'unknown',
                ip,
                `${res.statusCode} - ${path}`
            );
        } else if (res.statusCode === 429) {
            logger.rateLimit(ip, path, res.getHeader('Retry-After') || 'unknown');
        }
    });
    
    next();
};

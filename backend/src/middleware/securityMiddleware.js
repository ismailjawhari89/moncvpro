import helmet from 'helmet';
import express from 'express';

export const helmetMiddleware = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    frameguard: {
        action: 'deny',
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
    hidePoweredBy: true,
});

const getRequestSizeLimit = () => {
    return process.env.REQUEST_SIZE_LIMIT || '1mb';
};

export const jsonBodyParser = express.json({
    limit: getRequestSizeLimit(),
    verify: (req, res, buf, encoding) => {
        if (buf.length > 1024 * 1024) {
            console.warn(`[SECURITY] Large request body detected: ${buf.length} bytes from IP: ${req.ip}`);
        }
    },
});

export const urlencodedBodyParser = express.urlencoded({
    limit: getRequestSizeLimit(),
    extended: true,
    verify: (req, res, buf, encoding) => {
        if (buf.length > 1024 * 1024) {
            console.warn(`[SECURITY] Large URL-encoded body detected: ${buf.length} bytes from IP: ${req.ip}`);
        }
    },
});

export const securityLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const method = req.method;
    const path = req.path;
    
    if (process.env.NODE_ENV === 'production') {
        const sensitiveRoutes = ['/api/auth/login', '/api/auth/register', '/api/upload'];
        
        if (sensitiveRoutes.some(route => path.includes(route))) {
            console.log(`[SECURITY LOG] ${timestamp} - ${method} ${path} - IP: ${ip}`);
        }
    }
    
    res.on('finish', () => {
        if (res.statusCode === 401 || res.statusCode === 403 || res.statusCode === 429) {
            console.warn(`[SECURITY ALERT] ${timestamp} - ${method} ${path} - Status: ${res.statusCode} - IP: ${ip}`);
        }
    });
    
    next();
};

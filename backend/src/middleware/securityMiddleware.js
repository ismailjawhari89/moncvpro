import helmet from 'helmet';
import express from 'express';
import logger from '../utils/logger.js';

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
            const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
            logger.warn('Large JSON request body detected', {
                size: buf.length,
                ip,
                path: req.path,
                type: 'LARGE_PAYLOAD',
            });
        }
    },
});

export const urlencodedBodyParser = express.urlencoded({
    limit: getRequestSizeLimit(),
    extended: true,
    verify: (req, res, buf, encoding) => {
        if (buf.length > 1024 * 1024) {
            const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
            logger.warn('Large URL-encoded request body detected', {
                size: buf.length,
                ip,
                path: req.path,
                type: 'LARGE_PAYLOAD',
            });
        }
    },
});

export const securityLogger = (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    const method = req.method;
    const path = req.path;
    
    if (process.env.NODE_ENV === 'production') {
        const sensitiveRoutes = ['/api/auth/login', '/api/auth/register', '/api/upload'];
        
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

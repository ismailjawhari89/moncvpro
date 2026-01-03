import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { AuthenticationError } from '../utils/errors.js';

export default function (req, res, next) {
    const token = req.header('x-auth-token');
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

    if (!token) {
        logger.warn('Authentication attempt without token', { 
            ip, 
            path: req.path,
            method: req.method 
        });
        throw new AuthenticationError('No token, authorization denied');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        logger.warn('Authentication failed - Invalid token', { 
            ip, 
            path: req.path,
            error: err.message 
        });
        throw new AuthenticationError('Token is not valid');
    }
}

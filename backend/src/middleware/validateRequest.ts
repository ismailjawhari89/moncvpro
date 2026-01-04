import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../lib/logger';

/**
 * Middleware to check for validation errors from express-validator
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn({ ip: req.ip, path: req.path, errors: errors.array() }, 'Input Validation Failed');
        return res.status(400).json({
            error: 'ValidationError',
            message: 'Invalid input parameters',
            errors: errors.array()
        });
    }
    next();
};

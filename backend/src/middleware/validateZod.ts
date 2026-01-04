import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { logger } from '../lib/logger';

export const validateZod = (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.parseAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            logger.warn('Zod Validation Failed', { ip: req.ip, path: req.path, errors: error.issues });
            return res.status(400).json({
                error: 'ValidationError',
                message: 'Invalid input data',
                details: error.issues.map(e => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        next(error);
    }
};

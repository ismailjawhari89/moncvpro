
import compression from 'compression';
import { Request, Response } from 'express';

export const compressionMiddleware = compression({
    threshold: 1024, // Only compress responses > 1KB
    filter: (req: Request, res: Response) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    },
});

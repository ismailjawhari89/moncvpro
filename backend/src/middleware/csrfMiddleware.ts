import { Request, Response, NextFunction } from 'express';
import csrf from 'csurf';

// Setup CSRF protection
// We store the CSRF secret in a cookie (signed/secure)
const protection = csrf({
    cookie: {
        key: '_csrf',
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    }
});

export const csrfMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF for webhooks or specific paths if necessary
    // e.g. if (req.path.startsWith('/api/webhooks')) return next();

    protection(req, res, (err) => {
        if (err) {
            if (err.code === 'EBADCSRFTOKEN') {
                return res.status(403).json({
                    error: 'CSRF',
                    message: 'Invalid CSRF token'
                });
            }
            return next(err);
        }
        next();
    });
};

export const csrfTokenEndpoint = (req: Request, res: Response) => {
    res.json({ csrfToken: req.csrfToken() });
};

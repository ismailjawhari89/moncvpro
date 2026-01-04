import helmet from 'helmet';
import { Express, Request, Response, NextFunction } from 'express';

/**
 * Configure security headers and middleware
 */
export const configureSecurityHeaders = (app: Express) => {
    // Use Helmet for security headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "https://vitals.vercel-insights.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
                connectSrc: ["'self'", "https://api.groq.com", "https://vitals.vercel-insights.com", "https://*.sentry.io"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
                frameAncestors: ["'none'"], // Prevent clickjacking
                upgradeInsecureRequests: [],
            },
        },
        strictTransportSecurity: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        },
        xFrameOptions: { action: 'deny' },
        referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
        // xContentTypeOptions is enabled by default
    }));

    // Additional security headers
    app.use((req: Request, res: Response, next: NextFunction) => {
        // XSS Protection (Helmet v8 disables this by default, we enable it manually as per requirements)
        res.setHeader('X-XSS-Protection', '1; mode=block');

        // Permissions Policy
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        next();
    });
};

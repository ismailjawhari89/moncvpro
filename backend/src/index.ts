
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { setupBullBoard } from './utils/queueMonitor';
import { setupWebSocket } from './websocket/websocket.service';
import { setupSwagger } from './swagger';
import apiRoutes from './routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { logger } from './lib/logger';
import { requestLogger } from './middleware/requestLogger';
import { errorLogger } from './middleware/errorLogger';
import { performanceMiddleware } from './middleware/metricsMiddleware';
import { compressionMiddleware } from './middleware/compressionMiddleware';
import { register } from './lib/metrics';
import healthRoutes from './routes/health.routes';
import { initSentry } from './lib/sentry';
import * as Sentry from '@sentry/node';

// Import workers to ensure they start listening to queues
import './workers/pdf.worker';
import './workers/ai.worker';
import './workers/email.worker';

import { auditMiddleware } from './middleware/audit.middleware';
import { auditRequestMiddleware } from './middleware/auditRequestMiddleware';
import { configureSecurityHeaders } from './middleware/securityHeaders';
import prisma from './lib/prisma';
import { validateEnv } from './config/validateEnv';

dotenv.config();

// Validate Environment Variables
validateEnv();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize Sentry
initSentry(app);

// 1. HTTPS Redirect in production
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

// 2. Security Headers (must be early in middleware chain)
configureSecurityHeaders(app);

// 3. Middlewares
app.use(requestLogger);
app.use(performanceMiddleware);
app.use(compressionMiddleware);

// 4. Secure CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(o => o.length > 0);

if (allowedOrigins.length === 0 && process.env.NODE_ENV === 'production') {
    logger.warn('No ALLOWED_ORIGINS set in production! API might be inaccessible or insecure.');
}

const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (like mobile apps or curl) 
        // if not in production, or if explicitly allowed.
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            logger.warn(`Origin blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
    maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Handle CORS Errors
app.use((err: any, req: any, res: any, next: any) => {
    if (err.message === 'Not allowed by CORS') {
        res.status(403).json({
            error: 'CORS',
            message: 'Origin not allowed'
        });
    } else {
        next(err);
    }
});

app.use(bodyParser.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(auditMiddleware);
app.use(auditRequestMiddleware);

import { csrfMiddleware } from './middleware/csrfMiddleware';
app.use(csrfMiddleware);

logger.info('MonCVPro Backend Service Started');
logger.info('Bull Queues initialized.');
logger.info('Loki & Sentry monitoring stack active');

// Setup Monitoring Dashboard
setupBullBoard(app);

// Setup Swagger Documentation
// Setup Swagger Documentation
setupSwagger(app);

import { apiLimiter } from './middleware/rateLimiter';
// Apply global rate limiter to API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/health', healthRoutes);
app.get('/metrics', async (_, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});
app.use('/api', apiRoutes);

// Initialize Jobs
import { initAuditJobs } from './jobs/auditArchival';
import { initBackupJob } from './jobs/backupJob';
initAuditJobs();
initBackupJob();

// Error Handling (Must be last)
// Modern Sentry v8+ Express handler
if (typeof (Sentry as any).setupExpressErrorHandler === 'function') {
    (Sentry as any).setupExpressErrorHandler(app);
} else {
    // Fallback for older patterns
    app.use((Sentry as any).Handlers?.errorHandler() || ((err: any, req: any, res: any, next: any) => next(err)));
}

// Custom Error Logger
app.use(errorLogger);

import { errorHandler } from './middleware/errorHandler';
// Global Standardized Error Handler
app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('MonCVPro Backend Running. Visit /api-docs for documentation.');
});

httpServer.listen(PORT, () => {
    logger.info(`Backend Server running on port ${PORT}`);
    logger.info(`Queue Dashboard available at http://localhost:${PORT}/admin/queues`);
    logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
    logger.info(`WebSocket server initialized`);
});

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    httpServer.close(async () => {
        logger.info('HTTP server closed');

        try {
            // Close Prisma (Singleton)
            await prisma.$disconnect();
            logger.info('Prisma disconnected');

            // Close Redis (if applicable, though usually managed by the library)
            // process.exit(0);
        } catch (err) {
            logger.error('Error during graceful shutdown', { err });
            process.exit(1);
        }
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

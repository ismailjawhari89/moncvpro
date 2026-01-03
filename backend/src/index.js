import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ENV Validation - FAIL FAST
const requiredEnv = [
    'DATABASE_URL',
    'JWT_SECRET',
];

for (const env of requiredEnv) {
    if (!process.env[env]) {
        console.error(`❌ FATAL: Missing required environment variable: ${env}`);
        console.error(`Please set ${env} in your .env file or environment.`);
        process.exit(1);  // Exit immediately
    }
}

const app = express();

// ✅ CORS - Whitelist specific origins
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000').split(',').map(origin => origin.trim());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠️  CORS blocked request from: ${origin}`);
            callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    maxAge: 86400, // 24 hours - cache preflight requests
}));

// ✅ Security headers with Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    hsts: {
        maxAge: 31536000,  // 1 year
        includeSubDomains: true,
        preload: true,
    },
    frameguard: { action: 'deny' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));

app.use(express.json());
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// ✅ Routes with CSRF protection applied in route files
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cv', cvRoutes);

// Error handler for CORS errors
app.use((err, req, res, next) => {
    if (err.message && err.message.includes('CORS policy')) {
        return res.status(403).json({ 
            msg: 'Access denied: Origin not allowed',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
    next(err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ CORS enabled for: ${allowedOrigins.join(', ')}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});

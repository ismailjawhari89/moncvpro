import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cvRoutes from './routes/cvRoutes.js';

import corsMiddleware from './middleware/corsMiddleware.js';
import { helmetMiddleware, jsonBodyParser, urlencodedBodyParser, securityLogger } from './middleware/securityMiddleware.js';
import { globalRateLimit } from './middleware/rateLimitMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(securityLogger);
app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(jsonBodyParser);
app.use(urlencodedBodyParser);

app.use(globalRateLimit);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/cv', cvRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../utils/prisma.js';
import logger from '../utils/logger.js';
import { 
    ValidationError, 
    AuthenticationError, 
    ConflictError, 
    InternalServerError,
    DatabaseError
} from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const register = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
    }

    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

    let user = await prisma.user.findUnique({ where: { email } });
    if (user) {
        logger.warn('Registration attempt with existing email', { email, ip });
        throw new ConflictError('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
    } catch (error) {
        logger.error('Database error during user creation', error, { email, ip });
        throw new DatabaseError('Failed to create user account', error);
    }

    logger.info('User registered successfully', { userId: user.id, email, ip });

    const payload = {
        user: {
            id: user.id,
        },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
            if (err) {
                logger.error('JWT signing error', err, { userId: user.id });
                throw new InternalServerError('Failed to generate authentication token');
            }
            res.json({ 
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                }
            });
        }
    );
});

export const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ValidationError('Validation failed', errors.array());
    }

    const { email, password } = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        logger.warn('Login attempt with non-existent email', { email, ip });
        throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        logger.warn('Login attempt with incorrect password', { email, ip });
        throw new AuthenticationError('Invalid credentials');
    }

    logger.info('User logged in successfully', { userId: user.id, email, ip });

    const payload = {
        user: {
            id: user.id,
        },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '5d' },
        (err, token) => {
            if (err) {
                logger.error('JWT signing error', err, { userId: user.id });
                throw new InternalServerError('Failed to generate authentication token');
            }
            res.json({ 
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                }
            });
        }
    );
});

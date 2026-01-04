import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

/**
 * Generate a random secure token string
 */
export function generateSecureToken(length: number = 40): string {
    return randomBytes(length).toString('hex');
}

/**
 * Hash a token for DB storage
 */
export function hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
}

/**
 * Hash a plain text password
 */
/**
 * Hash a plain text password
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
}

/**
 * Validate password requirements
 * @deprecated Use validatePassword from src/utils/validators.ts instead for stronger checks
 */
export const validatePassword = (password: string, userDetails?: { email?: string, name?: string }) => {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumbers: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*]/.test(password),
    };

    const isValid = Object.values(requirements).every(Boolean);
    if (!isValid) return { valid: false, errors: requirements };

    // Reject common passwords
    const commonPasswords = ['password123', 'admin', '12345678', 'moncvpro2024'];
    if (commonPasswords.includes(password.toLowerCase())) {
        return { valid: false, error: 'Password is too common' };
    }

    // Reject user email/name in password
    if (userDetails) {
        const { email, name } = userDetails;
        if (email && password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
            return { valid: false, error: 'Password cannot contain parts of your email' };
        }
        if (name && password.toLowerCase().includes(name.toLowerCase())) {
            return { valid: false, error: 'Password cannot contain your name' };
        }
    }

    return { valid: true };
}

/**
 * Compare plain text password with hashed password
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Generate a short-lived Access Token
 */
export function generateAccessToken(userId: string): string {
    return jwt.sign({ userId, type: 'access' }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
}

/**
 * Generate a long-lived Refresh Token
 */
export function generateRefreshToken(userId: string): string {
    return jwt.sign({ userId } as any, REFRESH_TOKEN_SECRET, {
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN as any) || '7d'
    });
}

/**
 * Verify Access Token
 */
export function verifyAccessToken(token: string): any {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Verify Refresh Token
 */
export function verifyRefreshToken(token: string): any {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
}

import { TokenType } from '@prisma/client';
import prisma from '../lib/prisma';
import { hashPassword, comparePassword, generateAccessToken, generateSecureToken, hashToken, validatePassword } from '../utils/auth';
import { queueEmail } from '../queues/emailQueue';
import { logger } from '../lib/logger';
import speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { google } from 'googleapis';
import axios from 'axios';
import { logAction } from '../utils/auditLog';
import { alertService } from './alertService';
import { Request } from 'express';
import { encrypt, decrypt } from '../utils/crypto';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

export class AuthService {

    /**
     * Parse User-Agent for device name
     */
    private parseDeviceName(userAgent?: string): string {
        if (!userAgent) return 'Unknown Device';
        if (userAgent.includes('Mobile')) return 'Mobile Device';
        if (userAgent.includes('Chrome')) return 'Chrome on Desktop';
        if (userAgent.includes('Firefox')) return 'Firefox on Desktop';
        if (userAgent.includes('Safari')) return 'Safari on Desktop';
        return 'Web Application';
    }

    /**
     * Record login attempt & handle brute force
     */
    async recordLoginAttempt(email: string, success: boolean, req: Request, userId?: string) {
        await prisma.loginAttempt.create({
            data: {
                email,
                userId,
                success,
                ipAddress: req.ip as string,
            }
        });

        if (!success) {
            const failedAttempts = await prisma.loginAttempt.count({
                where: {
                    email,
                    success: false,
                    createdAt: { gt: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 mins
                }
            });

            if (failedAttempts >= 5) {
                await prisma.user.update({
                    where: { email },
                    data: {
                        isLocked: true,
                        lockUntil: new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 mins
                    }
                });
                logger.warn({ email }, 'Account locked due to brute force protection');
            }
        } else {
            // Clear attempts on success
            await prisma.loginAttempt.deleteMany({
                where: { email }
            });
        }
    }

    /**
     * Generate both Access and Refresh Tokens & Create Session record
     */
    async generateTokens(userId: string, req?: Request) {
        // Access Token (JWT)
        const accessToken = generateAccessToken(userId);

        // Refresh Token (stored in DB)
        const refreshTokenString = generateSecureToken();

        // Create Refresh Token record
        await prisma.refreshToken.create({
            data: {
                userId,
                token: hashToken(refreshTokenString),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                createdAt: new Date(),
            }
        });

        // Create Session record (User requested device-specific session)
        const userAgent = req?.headers['user-agent'] as string;
        const ipAddress = req?.ip as string;

        // Check for existing session to detect new device
        const existingSession = await prisma.session.findFirst({
            where: {
                userId,
                userAgent,
                ipAddress
            }
        });

        if (!existingSession) {
            // New device login!
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
            if (user) {
                // We'll send this asynchronously to not block login
                alertService.sendNewDeviceLoginAlert(userId, user.email, ipAddress || 'Unknown', userAgent || 'Unknown browser').catch((err: any) => {
                    logger.error(`Failed to send new device alert: ${err.message}`);
                });
            }
        }

        await prisma.session.create({
            data: {
                userId,
                accessToken: hashToken(accessToken), // Store hash for tracking
                userAgent,
                ipAddress,
                deviceName: this.parseDeviceName(userAgent),
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins matching access token
                lastActivityAt: new Date(),
            }
        });

        return {
            accessToken,
            refreshToken: refreshTokenString,
        };
    }

    /**
     * Register a new user
     */
    async register(input: any): Promise<{ userId: string; message: string }> {
        const { email, password, firstName, lastName } = input;

        // Validate password
        const pwValidation = validatePassword(password, { email, name: firstName });
        if (!pwValidation.valid) {
            throw new Error(`Password check failed: ${JSON.stringify(pwValidation)}`);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Create user
        const hashedPassword = await hashPassword(password);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                emailVerified: null,
                passwordHistory: {
                    create: {
                        password: hashedPassword
                    }
                },
                emailPreferences: {
                    create: {} // Using defaults
                }
            },
        });

        // Send verification email
        await this.sendVerificationEmail(email);

        logger.info({ userId: user.id, email }, 'New user registered');

        return {
            userId: user.id,
            message: 'Registration successful. Please check your email to verify your account.',
        };
    }

    /**
     * Login user
     */
    async login(input: any, req: Request): Promise<{
        accessToken?: string;
        refreshToken?: string;
        user?: any;
        mfaRequired?: boolean;
        tempToken?: string;
    }> {
        const { email, password } = input;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
            include: { twoFactor: true }
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Check lock
        if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
            throw new Error(`Account locked. Try again after ${user.lockUntil.toLocaleTimeString()}`);
        }

        if (!user.password) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            await this.recordLoginAttempt(email, false, req, user.id);
            throw new Error('Invalid email or password');
        }

        // Success
        await this.recordLoginAttempt(email, true, req, user.id);

        if (user.isLocked) {
            await prisma.user.update({
                where: { id: user.id },
                data: { isLocked: false, lockUntil: null }
            });
        }

        // 2FA
        if (user.twoFactor?.isEnabled) {
            const tempToken = generateSecureToken(32);
            await prisma.verificationToken.create({
                data: {
                    userId: user.id,
                    email: user.email,
                    token: tempToken,
                    type: TokenType.TWO_FACTOR,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                },
            });
            return { mfaRequired: true, tempToken };
        }

        const tokens = await this.generateTokens(user.id, req);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: user.twoFactor?.isEnabled || false,
            },
        };
    }

    /**
     * Refresh token rotation
     */
    async refreshToken(refreshToken: string, req?: Request): Promise<{ accessToken: string; refreshToken: string }> {
        const dbToken = await prisma.refreshToken.findFirst({
            where: {
                token: hashToken(refreshToken),
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
        });

        if (!dbToken) throw new Error('Invalid or revoked refresh token');

        await prisma.refreshToken.update({
            where: { id: dbToken.id },
            data: { isRevoked: true, revokedAt: new Date() }
        });

        return this.generateTokens(dbToken.userId, req);
    }

    /**
     * Logout specific session
     */
    async logout(refreshToken: string): Promise<any> {
        const hashedToken = hashToken(refreshToken);
        const tokenRecord = await prisma.refreshToken.findFirst({ where: { token: hashedToken } });

        await prisma.refreshToken.updateMany({
            where: { token: hashedToken },
            data: { isRevoked: true, revokedAt: new Date() },
        });

        return tokenRecord;
    }

    /**
     * Session Management
     */
    async getSessions(userId: string) {
        return prisma.session.findMany({
            where: { userId, expiresAt: { gt: new Date() } },
            orderBy: { lastActivityAt: 'desc' },
            select: {
                id: true,
                deviceName: true,
                ipAddress: true,
                userAgent: true,
                lastActivityAt: true,
                createdAt: true
            }
        });
    }

    async revokeSession(userId: string, sessionId: string) {
        await prisma.session.deleteMany({
            where: { id: sessionId, userId }
        });
    }

    async logoutAllDevices(userId: string) {
        await prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true, revokedAt: new Date() }
        });
        await prisma.session.deleteMany({ where: { userId } });
    }

    /**
     * 2FA Methods
     */
    async verify2FA(tempToken: string, otpToken: string, req?: Request) {
        const verification = await prisma.verificationToken.findFirst({
            where: { token: tempToken, type: TokenType.TWO_FACTOR, usedAt: null },
            include: { user: { include: { twoFactor: true } } }
        });

        if (!verification || !verification.user) {
            throw new Error('Invalid or expired token');
        }

        const user = verification.user;
        if (new Date() > verification.expiresAt) {
            throw new Error('Invalid or expired token');
        }

        const twoFactor = user.twoFactor;
        if (!twoFactor?.totpSecret) throw new Error('2FA not setup');

        const verified = speakeasy.totp.verify({
            secret: decrypt(twoFactor.totpSecret),
            encoding: 'base32',
            token: otpToken,
            window: 2
        });

        if (!verified) throw new Error('Invalid 2FA code');

        await prisma.verificationToken.update({
            where: { id: verification.id },
            data: { usedAt: new Date() }
        });

        const tokens = await this.generateTokens(user.id, req);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        };
    }

    async setup2FA(userId: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error('User not found');

        const secret = speakeasy.generateSecret({ name: 'MonCVPro', issuer: 'MonCVPro' });
        const qrCode = await QRCode.toDataURL((secret as any).otpauth_url);

        await prisma.twoFactorAuth.upsert({
            where: { userId },
            create: { userId, method: 'totp', totpSecret: encrypt(secret.base32), isEnabled: false },
            update: { method: 'totp', totpSecret: encrypt(secret.base32), isEnabled: false }
        });

        return { secret: secret.base32, qrCode };
    }

    async enable2FA(userId: string, otpToken: string) {
        const tf = await prisma.twoFactorAuth.findUnique({ where: { userId } });
        if (!tf?.totpSecret) throw new Error('Not initiated');

        const verified = speakeasy.totp.verify({
            secret: decrypt(tf.totpSecret),
            encoding: 'base32',
            token: otpToken,
            window: 2
        });

        if (!verified) throw new Error('Invalid code');

        // Backup codes
        const codes = Array.from({ length: 10 }, () => generateSecureToken(8).toUpperCase());
        const hashed = await Promise.all(codes.map(c => hashPassword(c)));

        await prisma.twoFactorAuth.update({
            where: { userId },
            data: { isEnabled: true, backupCodes: hashed }
        });

        return codes;
    }

    async disable2FA(userId: string, otpToken: string) {
        const tf = await prisma.twoFactorAuth.findUnique({ where: { userId } });
        if (!tf?.isEnabled || !tf.totpSecret) throw new Error('Not enabled');

        const verified = speakeasy.totp.verify({
            secret: decrypt(tf.totpSecret),
            encoding: 'base32',
            token: otpToken,
            window: 2
        });

        if (!verified) throw new Error('Invalid code');

        await prisma.twoFactorAuth.update({
            where: { userId },
            data: { isEnabled: false, totpSecret: null, backupCodes: [] }
        });
    }

    /**
     * OAuth
     */
    async handleGooglePayload(payload: any, req?: Request) {
        const { sub, email, family_name, given_name, picture } = payload;
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    profileImage: picture,
                    emailVerified: new Date(),
                },
                include: { twoFactor: true }
            });
        } else {
            // Fetch twoFactor if user exists
            const refreshedUser = await prisma.user.findUnique({
                where: { id: user.id },
                include: { twoFactor: true }
            });
            if (!refreshedUser) throw new Error('User not found');
            user = refreshedUser;
        }

        if (!user) throw new Error('User processing failed');

        // Check 2FA
        const twoFactor = (user as any).twoFactor;
        if (twoFactor?.isEnabled) {
            const tempToken = generateSecureToken(32);
            await prisma.verificationToken.create({
                data: {
                    userId: user.id,
                    email: user.email,
                    token: tempToken,
                    type: TokenType.TWO_FACTOR,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                },
            });
            return { mfaRequired: true, tempToken };
        }

        const tokens = await this.generateTokens(user.id, req);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: (user as any).twoFactor?.isEnabled || false
            }
        };
    }

    /**
     * Email Verification & Password Reset
     */
    async sendVerificationEmail(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.emailVerified) return;

        const token = generateSecureToken(32);
        await prisma.verificationToken.create({
            data: { userId: user.id, email, token, type: TokenType.EMAIL_VERIFY, expiresAt: new Date(Date.now() + 24 * 3600000) }
        });

        await queueEmail({
            to: email,
            subject: 'Verify Your Email - MonCVPro ✉️',
            templateName: 'verify-email',
            context: {
                userName: user.firstName || 'User',
                actionUrl: `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`,
                expiresIn: '24 hours'
            },
            userId: user.id
        });
    }

    async verifyEmail(token: string) {
        const vt = await prisma.verificationToken.findFirst({ where: { token, type: TokenType.EMAIL_VERIFY, usedAt: null } });
        if (!vt || vt.expiresAt < new Date()) throw new Error('Invalid or expired');

        const user = await prisma.user.update({
            where: { email: vt.email },
            data: { emailVerified: new Date() },
            include: { twoFactor: true }
        });
        await prisma.verificationToken.update({ where: { id: vt.id }, data: { usedAt: new Date() } });

        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            emailVerified: !!user.emailVerified,
            twoFactorEnabled: (user as any).twoFactor?.isEnabled || false
        };
    }

    async requestPasswordReset(email: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return;

        const token = generateSecureToken(32);
        await prisma.verificationToken.create({
            data: { userId: user.id, email, token, type: TokenType.PASSWORD_RESET, expiresAt: new Date(Date.now() + 3600000) }
        });

        await queueEmail({
            to: email,
            subject: 'Reset Your Password - MonCVPro 🔐',
            templateName: 'reset-password',
            context: {
                userName: user.firstName || 'User',
                actionUrl: `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`,
                expiresIn: '1 hour'
            },
            userId: user.id
        });
    }

    async resetPassword(token: string, newPw: string) {
        const vt = await prisma.verificationToken.findFirst({ where: { token, type: TokenType.PASSWORD_RESET, usedAt: null } });
        if (!vt || vt.expiresAt < new Date()) throw new Error('Invalid or expired');

        const user = await prisma.user.findUnique({ where: { email: vt.email }, include: { passwordHistory: { orderBy: { createdAt: 'desc' }, take: 5 } } });
        if (!user) throw new Error('User not found');

        // Check history
        for (const hist of user.passwordHistory) {
            if (await comparePassword(newPw, hist.password)) throw new Error('Cannot reuse last 5 passwords');
        }

        const hashed = await hashPassword(newPw);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashed,
                passwordHistory: { create: { password: hashed } }
            }
        });
        await prisma.verificationToken.update({ where: { id: vt.id }, data: { usedAt: new Date() } });
        await this.logoutAllDevices(user.id);
        return user;
    }

    async handleLinkedInPayload(profile: any, req?: Request) {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName;
        const lastName = profile.name?.familyName;
        const picture = profile.photos?.[0]?.value;

        if (!email) throw new Error('LinkedIn account must have an email');

        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: firstName || 'User',
                    lastName: lastName || '',
                    profileImage: picture,
                    emailVerified: new Date(),
                },
                include: { twoFactor: true }
            });
        } else {
            const refreshedUser = await prisma.user.findUnique({
                where: { id: user.id },
                include: { twoFactor: true }
            });
            if (!refreshedUser) throw new Error('User not found');
            user = refreshedUser;
        }

        if ((user as any).twoFactor?.isEnabled) {
            const tempToken = generateSecureToken(32);
            await prisma.verificationToken.create({
                data: {
                    userId: user.id,
                    email: user.email,
                    token: tempToken,
                    type: TokenType.TWO_FACTOR,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                },
            });
            return { mfaRequired: true, tempToken };
        }

        const tokens = await this.generateTokens(user.id, req);
        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                emailVerified: user.emailVerified,
                twoFactorEnabled: (user as any).twoFactor?.isEnabled || false
            }
        };
    }

    async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, firstName: true, lastName: true, emailVerified: true }
        });
    }
}

export const authService = new AuthService();

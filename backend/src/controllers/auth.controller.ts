
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { auditService } from '../services/audit.service';
import { alertService } from '../services/alertService';
import { bruteForceHandler } from '../middleware/bruteForceMiddleware';
import { logger } from '../lib/logger';
import { google } from 'googleapis';
import passport from '../config/passport';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);

import { validatePassword } from '../utils/validators';
export class AuthController {

    /**
     * Register a new user
     */
    async register(req: Request, res: Response) {
        const { email, password, firstName, lastName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Validate Password Strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                error: 'InvalidPassword',
                errors: passwordValidation.errors,
                message: passwordValidation.errors[0] // Return first error for simple clients
            });
        }

        try {
            const result = await authService.register({
                email,
                password, // Service will hash this, make sure to update service salt rounds there too if needed, or hash here
                firstName,
                lastName,
            });


            await auditService.logAuditEvent(
                result.userId,
                'REGISTER_SUCCESS',
                { email },
                req.audit?.ip,
                req.audit?.userAgent
            );

            res.status(201).json(result);
        } catch (error: any) {
            await auditService.logAuditEvent(
                null,
                'REGISTER_FAILURE',
                { email, error: error.message },
                req.audit?.ip,
                req.audit?.userAgent,
                'failure'
            );
            logger.error('Registration failed', { error: error.message, email });
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Login user
     */
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        try {
            const result = await authService.login({ email, password }, req);

            if ('mfaRequired' in result && result.mfaRequired) {
                await auditService.logAuditEvent(
                    null,
                    'LOGIN_MFA_CHALLENGE',
                    { email },
                    req.audit?.ip,
                    req.audit?.userAgent
                );
                return res.json({
                    mfaRequired: true,
                    tempToken: result.tempToken,
                    message: '2FA authentication required'
                });
            }

            const successResult = result as any;

            // Reset brute force counter on successful login
            bruteForceHandler.reset(email, req.ip as string);

            // TODO: In a more advanced version, check if this is a new device
            // and call alertService.sendNewDeviceLoginAlert
            // For now, let's assume all logins are potentially new or we just log them.

            // Set refresh token as HTTP-only cookie
            if (successResult.refreshToken) {
                res.cookie('refreshToken', successResult.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/api/auth/refresh',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }

            // Set access token as HTTP-only cookie
            if (successResult.accessToken) {
                res.cookie('auth_token', successResult.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });
            }

            await auditService.logAuditEvent(
                successResult.user.id,
                'LOGIN_SUCCESS',
                { email },
                req.audit?.ip,
                req.audit?.userAgent
            );

            res.json({
                user: successResult.user,
            });
        } catch (error: any) {
            // Record failed attempt for brute force protection
            await bruteForceHandler.handleFailedAttempt(email, req.ip as string);

            await auditService.logAuditEvent(
                null,
                'LOGIN_FAILURE',
                { email, error: error.message },
                req.audit?.ip,
                req.audit?.userAgent,
                'failure'
            );
            logger.error('Login failed', { error: error.message, email });
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Google OAuth Redirect
     */
    async initiateGoogle(req: Request, res: Response) {
        const authorizeUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['profile', 'email'],
        });
        res.redirect(authorizeUrl);
    }

    async googleCallback(req: Request, res: Response) {
        const { code } = req.query as { code: string };
        try {
            const { tokens } = await oauth2Client.getToken(code);
            const ticket = await (oauth2Client as any).verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const result = await authService.handleGooglePayload(payload, req);

            if ('mfaRequired' in result && result.mfaRequired) {
                return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?mfaRequired=true&tempToken=${result.tempToken}`);
            }

            const successResult = result as any;

            res.cookie('refreshToken', successResult.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/auth/refresh',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie('auth_token', successResult.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000,
            });

            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
        } catch (error: any) {
            logger.error('Google callback failed', { error: error.message });
            res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`);
        }
    }

    /**
     * 2FA verification
     */
    async verify2FA(req: Request, res: Response) {
        const { tempToken, otpToken } = req.body;
        try {
            const result = await authService.verify2FA(tempToken, otpToken, req);

            await auditService.logAuditEvent(
                result.user.id,
                'LOGIN_2FA_SUCCESS',
                {},
                req.audit?.ip,
                req.audit?.userAgent
            );

            if (result.refreshToken) {
                res.cookie('refreshToken', result.refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/api/auth/refresh',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
            }
            if (result.accessToken) {
                res.cookie('auth_token', result.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 15 * 60 * 1000,
                });
            }
            res.json({ user: result.user });
        } catch (error: any) {
            await auditService.logAuditEvent(
                null,
                'LOGIN_2FA_FAILURE',
                { error: error.message },
                req.audit?.ip,
                req.audit?.userAgent,
                'failure'
            );
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Token Refresh
     */
    async refresh(req: Request, res: Response) {
        const oldToken = req.cookies.refreshToken;
        if (!oldToken) return res.status(401).json({ error: 'No refresh token' });

        try {
            const result = await authService.refreshToken(oldToken, req);
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/auth/refresh',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.cookie('auth_token', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000,
            });
            res.json({
                success: true
            });
        } catch (error: any) {
            res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
            res.clearCookie('accessToken', { path: '/' });
            res.status(401).json({ error: error.message });
        }
    }

    /**
     * Logout
     */
    async logout(req: Request, res: Response) {
        const token = req.cookies.refreshToken;
        if (token) {
            try {
                const session = await authService.logout(token);
                if (session) {
                    await auditService.logAuditEvent(
                        session.userId,
                        'LOGOUT',
                        { sessionId: session.id },
                        req.audit?.ip,
                        req.audit?.userAgent
                    );
                }
            } catch (error) {
                // Ignore logout errors for audit
            }
        }
        res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
        res.clearCookie('auth_token', { path: '/' });
        res.json({ message: 'Logged out' });
    }

    /**
     * Session Management
     */
    async getSessions(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const sessions = await authService.getSessions(userId);
            res.json(sessions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async revokeSession(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { sessionId } = req.params;
            await authService.revokeSession(userId, sessionId);

            await auditService.logAuditEvent(
                userId,
                'SESSION_REVOKED',
                { sessionId },
                req.audit?.ip,
                req.audit?.userAgent
            );

            res.json({ message: 'Session revoked' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async logoutAll(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            await authService.logoutAllDevices(userId);
            res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
            res.json({ message: 'Logged out from all devices' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * Password Reset
     */
    async requestPasswordReset(req: Request, res: Response) {
        const { email } = req.body;
        await authService.requestPasswordReset(email);

        await auditService.logAuditEvent(
            null,
            'PASSWORD_RESET_REQUESTED',
            { email },
            req.audit?.ip,
            req.audit?.userAgent
        );

        res.json({ message: 'If email exists, reset link sent.' });
    }

    async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;
        try {
            const user = await authService.resetPassword(token, newPassword);

            if (user) {
                await auditService.logAuditEvent(
                    user.id,
                    'PASSWORD_RESET_SUCCESS',
                    {},
                    req.audit?.ip,
                    req.audit?.userAgent
                );

                // Send security alert
                await alertService.sendPasswordChangedAlert(
                    user.id,
                    user.email,
                    req.audit?.ip || req.ip || 'Unknown',
                    req.audit?.userAgent || req.headers['user-agent'] as string || 'Unknown'
                );
            }

            res.json({ message: 'Password reset successful' });
        } catch (error: any) {
            await auditService.logAuditEvent(
                null,
                'PASSWORD_RESET_FAILURE',
                { error: error.message },
                req.audit?.ip,
                req.audit?.userAgent,
                'failure'
            );
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * Profile
     */
    async me(req: Request, res: Response) {
        res.json((req as any).user);
    }

    /**
     * Email Verification
     */
    async verifyEmail(req: Request, res: Response) {
        const { token } = req.body;
        try {
            const user = await authService.verifyEmail(token);
            res.json({ message: 'Email verified successfully', user });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
    async sendVerificationEmail(req: Request, res: Response) {
        const { email } = req.body;
        try {
            await authService.sendVerificationEmail(email);
            res.json({ message: 'Verification email sent' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    /**
     * OAuth Login (Token based)
     */
    async googleLogin(req: Request, res: Response) {
        const { token } = req.body;
        try {
            const ticket = await (oauth2Client as any).verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const result = await authService.handleGooglePayload(payload, req);

            if ('mfaRequired' in result && result.mfaRequired) {
                return res.json({
                    mfaRequired: true,
                    tempToken: result.tempToken,
                    message: '2FA authentication required'
                });
            }

            const successResult = result as any;

            res.cookie('refreshToken', successResult.refreshToken as string, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/auth/refresh',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.cookie('auth_token', successResult.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 15 * 60 * 1000,
            });

            res.json({
                user: successResult.user
            });
        } catch (error: any) {
            res.status(401).json({ error: 'Google login failed' });
        }
    }

    async initiateLinkedIn(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('linkedin', {
            state: Math.random().toString(36).substring(2),
            scope: ['r_emailaddress', 'r_liteprofile']
        })(req, res, next);
    }

    async linkedinCallback(req: Request, res: Response, next: NextFunction) {
        passport.authenticate('linkedin', async (err: any, profile: any) => {
            if (err || !profile) {
                logger.error('LinkedIn OAuth callback error', { err });
                return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=oauth_failed`);
            }

            try {
                const result = await authService.handleLinkedInPayload(profile, req);

                if ('mfaRequired' in result && result.mfaRequired) {
                    await auditService.logAuditEvent(
                        null,
                        'LOGIN_MFA_CHALLENGE',
                        { provider: 'linkedin', email: profile.emails?.[0]?.value },
                        req.audit?.ip,
                        req.audit?.userAgent
                    );
                    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?mfaRequired=true&tempToken=${result.tempToken}`);
                }

                const successResult = result as any;

                await auditService.logAuditEvent(
                    successResult.user.id,
                    'LOGIN_SUCCESS',
                    { provider: 'linkedin', method: 'oauth' },
                    req.audit?.ip,
                    req.audit?.userAgent
                );

                res.cookie('refreshToken', successResult.refreshToken as string, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/api/auth/refresh',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });

                res.cookie('auth_token', successResult.accessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    path: '/',
                    maxAge: 15 * 60 * 1000,
                });

                res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
            } catch (error: any) {
                logger.error('LinkedIn processing error', { error: error.message });
                await auditService.logAuditEvent(
                    null,
                    'LOGIN_FAILURE',
                    { provider: 'linkedin', reason: error.message },
                    req.audit?.ip,
                    req.audit?.userAgent
                );
                res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=processing_failed`);
            }
        })(req, res, next);
    }

    /**
     * 2FA Management
     */
    async setup2FA(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const result = await authService.setup2FA(userId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async enable2FA(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { otpToken } = req.body;
            const backupCodes = await authService.enable2FA(userId, otpToken);

            // Fetch user for email alert
            const user = await authService.getUserById(userId);
            if (user) {
                await alertService.send2FAEnabledAlert(userId, user.email);
            }

            await auditService.logAuditEvent(
                userId,
                '2FA_ENABLED',
                {},
                req.audit?.ip,
                req.audit?.userAgent
            );

            res.json({ message: '2FA enabled successfully', backupCodes });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async disable2FA(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { otpToken } = req.body;
            await authService.disable2FA(userId, otpToken);

            // Fetch user for email alert
            const user = await authService.getUserById(userId);
            if (user) {
                await alertService.send2FADisabledAlert(userId, user.email);
            }

            await auditService.logAuditEvent(
                userId,
                '2FA_DISABLED',
                {},
                req.audit?.ip,
                req.audit?.userAgent
            );

            res.json({ message: '2FA disabled successfully' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const authController = new AuthController();

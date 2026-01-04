
import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { verifiedMiddleware } from '../../middleware/verifiedMiddleware';
import { bruteForceMiddleware } from '../../middleware/bruteForceMiddleware';
import { authLimiter, passwordResetLimiter, mfaLimiter } from '../../middleware/rateLimiter';

import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

// --- Public Authentication ---
router.post(
    '/register',
    authLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 12 }).withMessage('Password must be at least 12 characters long'),
        body('firstName').trim().notEmpty().withMessage('First name is required'),
        body('lastName').trim().notEmpty().withMessage('Last name is required'),
    ],
    validateRequest,
    authController.register
);

router.post(
    '/login',
    authLimiter,
    bruteForceMiddleware,
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validateRequest,
    authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// --- Multi-Factor Authentication (Login Flow) ---
router.post(
    '/verify-2fa',
    mfaLimiter,
    [
        body('tempToken').notEmpty().withMessage('Temporary token is required'),
        body('otpToken').isLength({ min: 6, max: 6 }).isNumeric().withMessage('Invalid OTP format'),
    ],
    validateRequest,
    authController.verify2FA
);

// --- Identity Recovery ---
router.post(
    '/forgot-password',
    passwordResetLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    ],
    validateRequest,
    authController.requestPasswordReset
);

router.post(
    '/reset-password',
    passwordResetLimiter,
    [
        body('token').notEmpty().withMessage('Reset token is required'),
        body('newPassword').isLength({ min: 12 }).withMessage('Password must be at least 12 characters long'),
    ],
    validateRequest,
    authController.resetPassword
);

router.post(
    '/verify-email',
    [
        body('token').notEmpty().withMessage('Verification token is required'),
    ],
    validateRequest,
    authController.verifyEmail
);

router.post(
    '/resend-verification',
    authLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    ],
    validateRequest,
    (authController as any).sendVerificationEmail
);

// --- Social OAuth ---
router.get('/google', authController.initiateGoogle);
router.get('/google/callback', authController.googleCallback);
router.get('/linkedin', authController.initiateLinkedIn);
router.get('/linkedin/callback', authController.linkedinCallback);

// --- User Profile & Account (Protected) ---
router.get('/me', authMiddleware, authController.me);
router.get('/sessions', authMiddleware, authController.getSessions);
router.delete('/sessions/:sessionId', authMiddleware, authController.revokeSession);
router.post('/logout-all', authMiddleware, authController.logoutAll);

// --- 2FA Management (Protected) ---
router.post('/2fa/setup', authMiddleware, verifiedMiddleware, authController.setup2FA);
router.post('/2fa/enable', authMiddleware, verifiedMiddleware, authController.enable2FA);
router.post('/2fa/disable', authMiddleware, verifiedMiddleware, authController.disable2FA);

import { csrfTokenEndpoint } from '../../middleware/csrfMiddleware';

router.get('/csrf-token', csrfTokenEndpoint);

export default router;

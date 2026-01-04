
import { Router } from 'express';
import { authController } from '../../controllers/auth.controller';
import { userController } from '../../controllers/user.controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { verifiedMiddleware } from '../../middleware/verifiedMiddleware';
import { cacheMiddleware } from '../../middleware/cacheMiddleware';

import { body } from 'express-validator';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

/**
 * @openapi
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 */
router.get('/profile', authMiddleware, cacheMiddleware(1800, ['user:profile']), authController.me);

// Profile Updates
router.patch(
    '/email',
    authMiddleware,
    verifiedMiddleware,
    [
        body('email').isEmail().normalizeEmail().withMessage('Invalid email address')
    ],
    validateRequest,
    userController.updateEmail
);

// Security Activity
router.get('/security-activity', authMiddleware, cacheMiddleware(300, ['user:security']), userController.getSecurityActivity);

/**
 * Session Management
 */
router.get('/sessions', authMiddleware, cacheMiddleware(60, ['user:sessions']), authController.getSessions);

// Security sensitive actions require email verification
router.delete('/sessions/:sessionId', authMiddleware, verifiedMiddleware, authController.revokeSession);
router.post('/sessions/logout-all', authMiddleware, verifiedMiddleware, authController.logoutAll);

export default router;

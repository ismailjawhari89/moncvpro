
import { Router } from 'express';
import { EmailController } from '../controllers/email.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const emailController = new EmailController();

// Preferences management (authenticated)
router.get('/preferences', authMiddleware, emailController.getPreferences);
router.patch('/preferences', authMiddleware, emailController.updatePreferences);
router.get('/history', authMiddleware, emailController.getHistory);

// One-click unsubscribe (public with token)
router.get('/unsubscribe/:token', emailController.unsubscribe);

export default router;

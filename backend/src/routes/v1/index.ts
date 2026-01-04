
import { Router } from 'express';
import cvRoutes from './cv.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import cvSharingRoutes from './cv-sharing.routes';
import aiRoutes from './ai.routes';
import linkedinRoutes from './linkedin.routes';
import adminRoutes from './admin.routes';
import emailRoutes from './email.routes';
import uploadRoutes from './upload.routes';
import gdprRoutes from '../gdpr.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auth', gdprRoutes); // Merge GDPR routes into /auth
router.use('/users', userRoutes);
router.use('/cvs', cvRoutes);
router.use('/upload', uploadRoutes);
router.use('/sharing', cvSharingRoutes);
router.use('/ai', aiRoutes);
router.use('/linkedin', linkedinRoutes);
router.use('/admin', adminRoutes);
router.use('/email', emailRoutes);

export default router;

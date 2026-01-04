import { Router } from 'express';
import { gdprController } from '../controllers/gdpr.controller';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Endpoint to exercise Right to be Forgotten
router.delete('/delete-account', authMiddleware, gdprController.deleteAccount);

// Endpoint to exercise Right to Data Portability
router.get('/export-data', authMiddleware, gdprController.exportData);

export default router;

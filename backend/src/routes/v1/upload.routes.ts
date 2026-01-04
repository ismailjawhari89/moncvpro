import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { uploadController } from '../../controllers/upload.controller';

const router = Router();

// Only authenticated users can upload files
// router.use(authMiddleware);

/**
 * @openapi
 * /upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 */
import { uploadMiddleware } from '../../middleware/upload.middleware';

router.post('/', authMiddleware, uploadMiddleware.single('file'), uploadController.uploadFile);


export default router;

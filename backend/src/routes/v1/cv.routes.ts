
import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { verifiedMiddleware } from '../../middleware/verifiedMiddleware';
import { cvController } from '../../controllers/cv.controller';

const router = Router();

// Apply authMiddleware to all CV routes explicitly
// router.use(authMiddleware);

/**
 * @openapi
 * /cvs:
 *   get:
 *     summary: List user's CVs
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 */
import { validateZod } from '../../middleware/validateZod';
import { cvSchema } from '../../validations/cv.validation';
import { param } from 'express-validator'; // Keep for simple param checks if desired, or use Zod for params too.

import { cvLimiter } from '../../middleware/rateLimiter';

router.use(cvLimiter);

router.get('/', authMiddleware, cvController.listCVs);


/**
 * @openapi
 * /cvs:
 *   post:
 *     summary: Create a new CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 */
router.post(
    '/',
    authMiddleware,
    verifiedMiddleware,
    validateZod(cvSchema),
    cvController.createCV
);

/**
 * @openapi
 * /cvs/{id}:
 *   get:
 *     summary: Get CV by ID
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 */
router.get(
    '/:id',
    authMiddleware,
    cvController.getCV
);

/**
 * @openapi
 * /cvs/{id}:
 *   put:
 *     summary: Update CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 */
router.put(
    '/:id',
    authMiddleware,
    validateZod(cvSchema),
    cvController.updateCV
);

/**
 * @openapi
 * /cvs/{id}:
 *   delete:
 *     summary: Delete CV
 *     tags: [CVs]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
    '/:id',
    authMiddleware,
    cvController.deleteCV
);

export default router;

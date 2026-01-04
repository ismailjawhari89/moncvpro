
import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { verifiedMiddleware } from '../../middleware/verifiedMiddleware';

import { aiLimiter } from '../../middleware/rateLimiter';

import { aiController } from '../../controllers/ai.controller';

const router = Router();

// AI generation features are premium and restricted to verified users
router.use(authMiddleware);
router.use(verifiedMiddleware);
router.use(aiLimiter);

router.post('/suggest', aiController.getSuggestions);
router.post('/improve', aiController.improveContent);
router.post('/analyze', (req, res) => {
    // Placeholder for analyze
    res.json({ message: 'AI analyze endpoint (under construction)' });
});


export default router;

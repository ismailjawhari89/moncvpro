
import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { verifiedMiddleware } from '../../middleware/verifiedMiddleware';

const router = Router();

// LinkedIn sync features are premium and restricted to verified users
router.use(authMiddleware);
router.use(verifiedMiddleware);

router.post('/sync', (req, res) => {
    // Placeholder for LinkedIn sync
    res.json({ message: 'LinkedIn sync endpoint (protected)' });
});

export default router;

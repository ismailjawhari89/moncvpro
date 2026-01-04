
import { Router } from 'express';
import v1Routes from './v1';

const router = Router();

// Default to latest version
router.use('/v1', v1Routes);

// You can add v2 here in the future
// router.use('/v2', v2Routes);

export default router;

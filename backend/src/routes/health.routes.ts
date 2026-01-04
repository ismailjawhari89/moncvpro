import { Router } from 'express';
import { healthController } from '../controllers/health.controller';

const router = Router();

// Deep health check (DB, Cache) - Used for Readiness
router.get('/', healthController.getHealth);

// Liveness check (Process running)
router.get('/live', healthController.getLive);

// Explicit Readiness check
router.get('/ready', healthController.getHealth);

export default router;

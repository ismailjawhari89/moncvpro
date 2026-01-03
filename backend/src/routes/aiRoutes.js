import express from 'express';
import { check } from 'express-validator';
import { generateCVContent } from '../controllers/aiController.js';
import auth from '../middleware/authMiddleware.js';
import { protectMutations } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// @route   POST api/ai/generate
// @desc    Generate CV content
// @access  Private
router.post(
    '/generate',
    [
        auth,
        protectMutations,
        check('jobTitle', 'Job title is required').not().isEmpty(),
        check('skills', 'Skills are required').not().isEmpty(),
    ],
    generateCVContent
);

export default router;

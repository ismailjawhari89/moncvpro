import express from 'express';
import { saveCV } from '../controllers/cvController.js';
import { protectMutations } from '../middleware/csrfMiddleware.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST api/cv
// @desc    Save CV data
// @access  Private
router.post('/', auth, protectMutations, saveCV);

export default router;

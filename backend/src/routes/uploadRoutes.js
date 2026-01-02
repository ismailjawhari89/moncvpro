import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';
import auth from '../middleware/authMiddleware.js';
import { uploadRateLimit } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// @route   POST api/upload
// @desc    Upload a file
// @access  Private
router.post('/', uploadRateLimit, auth, upload.single('file'), uploadFile);

export default router;

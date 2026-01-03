import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';
import auth from '../middleware/authMiddleware.js';
import { protectMutations } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// @route   POST api/upload
// @desc    Upload a file
// @access  Private
router.post('/', auth, protectMutations, upload.single('file'), uploadFile);

export default router;

import express from 'express';
import upload, { 
    uploadImage, 
    uploadResume, 
    uploadDocument,
    handleUploadError,
    validateUploadedFile 
} from '../middleware/uploadMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';
import auth from '../middleware/authMiddleware.js';
import { uploadRateLimit } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// @route   POST api/upload
// @desc    Upload a file (general)
// @access  Private
router.post(
    '/', 
    uploadRateLimit, 
    auth, 
    upload.single('file'), 
    handleUploadError,
    validateUploadedFile,
    uploadFile
);

// @route   POST api/upload/image
// @desc    Upload an image file
// @access  Private
router.post(
    '/image', 
    uploadRateLimit, 
    auth, 
    uploadImage.single('file'), 
    handleUploadError,
    validateUploadedFile,
    uploadFile
);

// @route   POST api/upload/resume
// @desc    Upload a resume file (PDF, DOC, DOCX)
// @access  Private
router.post(
    '/resume', 
    uploadRateLimit, 
    auth, 
    uploadResume.single('file'), 
    handleUploadError,
    validateUploadedFile,
    uploadFile
);

// @route   POST api/upload/document
// @desc    Upload a document file
// @access  Private
router.post(
    '/document', 
    uploadRateLimit, 
    auth, 
    uploadDocument.single('file'), 
    handleUploadError,
    validateUploadedFile,
    uploadFile
);

export default router;

import express from 'express';
import { 
    exportToPDF, 
    downloadExport, 
    previewExport,
    exportToDOCX,
    getExportHistory 
} from '../controllers/exportController.js';
import auth from '../middleware/authMiddleware.js';
import { uploadRateLimit } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// @route   POST /api/export/pdf
// @desc    Export CV to PDF
// @access  Private
router.post('/pdf', uploadRateLimit, auth, exportToPDF);

// @route   POST /api/export/docx
// @desc    Export CV to DOCX (Word)
// @access  Private
router.post('/docx', uploadRateLimit, auth, exportToDOCX);

// @route   GET /api/export/download/:filename
// @desc    Download exported file
// @access  Public (with secure filename)
router.get('/download/:filename', downloadExport);

// @route   GET /api/export/preview/:filename
// @desc    Preview HTML export
// @access  Public
router.get('/preview/:filename', previewExport);

// @route   GET /api/export/history
// @desc    Get user's export history
// @access  Private
router.get('/history', auth, getExportHistory);

export default router;

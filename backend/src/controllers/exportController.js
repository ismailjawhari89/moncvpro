import { generatePDF, getExportFile } from '../services/pdfService.js';
import logger from '../utils/logger.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

/**
 * Generate PDF export of CV
 * @route POST /api/export/pdf
 * @access Private
 */
export const exportToPDF = asyncHandler(async (req, res) => {
    const cvData = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    
    // Validate CV data
    if (!cvData || Object.keys(cvData).length === 0) {
        logger.warn('PDF export attempted with empty data', { 
            ip, 
            userId: req.user?.id 
        });
        throw new ValidationError('CV data is required');
    }
    
    // Validate required fields
    if (!cvData.personalInfo || !cvData.personalInfo.fullName) {
        throw new ValidationError('Personal information with full name is required');
    }
    
    logger.info('PDF export started', {
        userId: req.user?.id,
        fullName: cvData.personalInfo.fullName,
        ip,
    });
    
    // Generate PDF
    const result = await generatePDF(cvData, {
        template: req.body.template || 'modern',
        format: req.body.format || 'A4',
    });
    
    logger.info('PDF export completed', {
        userId: req.user?.id,
        filename: result.filename,
        format: result.format,
        size: result.size,
        ip,
    });
    
    res.json({
        success: true,
        message: `Export generated successfully (${result.format.toUpperCase()})`,
        export: {
            format: result.format,
            filename: result.filename,
            downloadUrl: result.url,
            previewUrl: result.htmlPreview,
            size: result.size,
            expiresIn: '24 hours',
        }
    });
});

/**
 * Download exported file
 * @route GET /api/export/download/:filename
 * @access Public (with token in query or secure link)
 */
export const downloadExport = asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    
    logger.info('Download requested', {
        filename,
        ip,
        userId: req.user?.id,
    });
    
    // Get file path
    const filePath = getExportFile(filename);
    
    if (!filePath) {
        logger.warn('Export file not found or expired', {
            filename,
            ip,
        });
        throw new NotFoundError('Export file not found or expired');
    }
    
    // Determine content type
    const ext = filename.split('.').pop().toLowerCase();
    const contentType = ext === 'pdf' ? 'application/pdf' : 'text/html';
    
    // Set headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    // Send file
    res.sendFile(filePath, (err) => {
        if (err) {
            logger.error('Failed to send export file', err, {
                filename,
                ip,
            });
        } else {
            logger.info('Export file downloaded', {
                filename,
                ip,
                userId: req.user?.id,
            });
        }
    });
});

/**
 * Preview exported HTML
 * @route GET /api/export/preview/:filename
 * @access Public
 */
export const previewExport = asyncHandler(async (req, res) => {
    const { filename } = req.params;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    
    // Only allow HTML files for preview
    if (!filename.endsWith('.html')) {
        throw new ValidationError('Only HTML files can be previewed');
    }
    
    logger.info('Preview requested', {
        filename,
        ip,
    });
    
    // Get file path
    const filePath = getExportFile(filename);
    
    if (!filePath) {
        throw new NotFoundError('Preview file not found or expired');
    }
    
    // Set headers
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Send file
    res.sendFile(filePath);
});

/**
 * Export to DOCX format
 * @route POST /api/export/docx
 * @access Private
 */
export const exportToDOCX = asyncHandler(async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    
    logger.info('DOCX export requested', {
        userId: req.user?.id,
        ip,
    });
    
    // For now, return not implemented
    // TODO: Implement DOCX export using docx library
    res.status(501).json({
        success: false,
        message: 'DOCX export is not yet implemented',
        alternative: 'Please use PDF export for now',
    });
});

/**
 * Get export history for user
 * @route GET /api/export/history
 * @access Private
 */
export const getExportHistory = asyncHandler(async (req, res) => {
    // TODO: Implement export history from database
    // For now, return empty array
    
    logger.info('Export history requested', {
        userId: req.user?.id,
    });
    
    res.json({
        success: true,
        exports: [],
        message: 'Export history feature coming soon',
    });
});

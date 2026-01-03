import logger from '../utils/logger.js';
import { ValidationError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const uploadFile = asyncHandler(async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

    if (!req.file) {
        logger.warn('Upload attempt with no file', { ip, userId: req.user?.id });
        throw new ValidationError('No file uploaded');
    }

    logger.info('File uploaded successfully', {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        userId: req.user?.id,
        ip,
    });

    res.json({
        success: true,
        message: 'File uploaded successfully',
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: `uploads/${req.file.filename}`,
            size: req.file.size,
            mimetype: req.file.mimetype,
        }
    });
});

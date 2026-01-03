import logger from '../utils/logger.js';
import { ValidationError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const saveCV = asyncHandler(async (req, res) => {
    const cvData = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;

    if (!cvData || Object.keys(cvData).length === 0) {
        logger.warn('CV save attempt with empty data', { ip });
        throw new ValidationError('CV data is required');
    }

    logger.info('CV data received', {
        userId: req.user?.id,
        ip,
        dataSize: JSON.stringify(cvData).length,
    });

    res.json({
        success: true,
        message: 'CV received successfully',
        data: cvData
    });
});

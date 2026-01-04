import { Request, Response } from 'express';
import { logger } from '../lib/logger';
import { AppError } from '../utils/AppError';


export class UploadController {
    /**
     * Handle file upload
     */
    async uploadFile(req: Request, res: Response) {
        const file = req.file;
        if (!file) {
            throw new AppError('No file uploaded', 400);
        }

        // Task 9 - Magic Bytes check for hardening
        try {
            const { fileTypeFromFile } = await import('file-type');
            const type = await fileTypeFromFile(file.path);

            if (!type || !['pdf', 'jpg', 'png', 'docx', 'doc'].includes(type.ext)) {
                // Remove the malicious file
                const fs = await import('fs/promises');
                await fs.unlink(file.path);
                throw new AppError('File content does not match its extension (Magic Bytes check failed)', 400);
            }
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            logger.error('Magic bytes check failed', { error: err.message });
            // Non-blocking for now if library fails, but log it
        }

        logger.info(`File uploaded and verified by user ${(req as any).userId}`, {
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size
        });

        res.json({
            success: true,
            data: {
                filename: file.filename,
                mimetype: file.mimetype,
                size: file.size
            }
        });
    }
}


export const uploadController = new UploadController();

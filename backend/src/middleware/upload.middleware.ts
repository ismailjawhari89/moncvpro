import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';
import { AppError } from '../utils/AppError';

// 1. Storage Configuration (use diskStorage but with safe naming)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || 'storage/uploads');
    },
    filename: (req, file, cb) => {
        // Prevent double extensions and directory traversal
        // 1. Get safe extension (only the last part)
        const ext = path.extname(file.originalname).toLowerCase();

        // 2. Validate extension against a strict whitelist again
        const allowedExts = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
        if (!allowedExts.includes(ext)) {
            return cb(new Error('Invalid file extension'), '');
        }

        // 3. Generate a random UUID-like filename
        const uniqueName = crypto.randomUUID();
        cb(null, `${uniqueName}${ext}`);
    }
});

// 2. File Filter (MIME type check)
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Only allow specific types
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG are allowed.', 400));
    }
};

// 3. Size Limits (5MB default)
export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1 // Only one file per request
    }
});

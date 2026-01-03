import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';
import { ValidationError } from '../utils/errors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File type configurations
const FILE_TYPES = {
    image: {
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxSize: 5 * 1024 * 1024, // 5MB
    },
    document: {
        extensions: ['pdf', 'doc', 'docx'],
        mimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        maxSize: 10 * 1024 * 1024, // 10MB
    },
    resume: {
        extensions: ['pdf', 'doc', 'docx'],
        mimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        maxSize: 5 * 1024 * 1024, // 5MB
    },
};

// Dangerous file extensions to block
const BLOCKED_EXTENSIONS = [
    'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar',
    'zip', 'rar', '7z', 'tar', 'gz', 'sh', 'app', 'deb', 'rpm',
    'msi', 'dmg', 'pkg', 'bin', 'run', 'elf', 'dll', 'so',
    'php', 'asp', 'aspx', 'jsp', 'cgi', 'pl', 'py', 'rb',
];

// Ensure upload directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    logger.info('Uploads directory created', { path: uploadsDir });
}

// Sanitize filename
const sanitizeFilename = (filename) => {
    // Remove any path traversal attempts
    filename = path.basename(filename);
    
    // Remove special characters except dots, hyphens, and underscores
    filename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Prevent multiple dots (potential double extension attacks)
    filename = filename.replace(/\.+/g, '.');
    
    // Limit filename length
    const ext = path.extname(filename);
    const name = path.basename(filename, ext);
    const maxLength = 100;
    
    if (name.length > maxLength) {
        return name.substring(0, maxLength) + ext;
    }
    
    return filename;
};

// Generate secure random filename
const generateSecureFilename = (originalname) => {
    const ext = path.extname(originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    return `${randomName}-${timestamp}${ext}`;
};

// Check if file extension is blocked
const isBlockedExtension = (filename) => {
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    return BLOCKED_EXTENSIONS.includes(ext);
};

// Validate file type
const validateFileType = (file, allowedTypes) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mimeType = file.mimetype.toLowerCase();
    
    // Check if extension is blocked
    if (isBlockedExtension(file.originalname)) {
        logger.warn('Blocked file extension attempted', {
            filename: file.originalname,
            extension: ext,
            type: 'BLOCKED_EXTENSION',
        });
        return false;
    }
    
    // Check against allowed types
    const allowed = allowedTypes.some(type => {
        const config = FILE_TYPES[type];
        return (
            config.extensions.includes(ext) &&
            config.mimeTypes.includes(mimeType)
        );
    });
    
    if (!allowed) {
        logger.warn('Invalid file type attempted', {
            filename: file.originalname,
            extension: ext,
            mimeType: mimeType,
            type: 'INVALID_FILE_TYPE',
        });
    }
    
    return allowed;
};

// Get max file size for allowed types
const getMaxFileSize = (allowedTypes) => {
    return Math.max(...allowedTypes.map(type => FILE_TYPES[type].maxSize));
};

// Create storage configuration
const createStorage = (subdir = '') => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(uploadsDir, subdir);
            
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const sanitized = sanitizeFilename(file.originalname);
            const secureFilename = generateSecureFilename(sanitized);
            
            logger.info('File upload in progress', {
                originalName: file.originalname,
                savedName: secureFilename,
                mimeType: file.mimetype,
                userId: req.user?.id,
            });
            
            cb(null, secureFilename);
        },
    });
};

// Create file filter
const createFileFilter = (allowedTypes) => {
    return (req, file, cb) => {
        const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        
        // Validate file type
        if (!validateFileType(file, allowedTypes)) {
            logger.warn('File upload rejected - invalid type', {
                filename: file.originalname,
                mimeType: file.mimetype,
                ip,
                userId: req.user?.id,
            });
            return cb(new ValidationError('Invalid file type. Only images and documents are allowed.'));
        }
        
        cb(null, true);
    };
};

// Create upload middleware
const createUploadMiddleware = (options = {}) => {
    const {
        allowedTypes = ['image', 'document'],
        subdir = '',
        maxFiles = 1,
    } = options;
    
    const maxSize = getMaxFileSize(allowedTypes);
    
    return multer({
        storage: createStorage(subdir),
        limits: {
            fileSize: maxSize,
            files: maxFiles,
            fields: 10,
            fieldSize: 1024 * 1024, // 1MB
        },
        fileFilter: createFileFilter(allowedTypes),
    });
};

// Error handler for multer errors
export const handleUploadError = (err, req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
    
    if (err instanceof multer.MulterError) {
        let message = 'File upload error';
        
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'File is too large. Maximum size is 10MB.';
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files. Maximum is 1 file.';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected field name.';
                break;
            case 'LIMIT_FIELD_COUNT':
                message = 'Too many fields.';
                break;
            case 'LIMIT_FIELD_SIZE':
                message = 'Field value too large.';
                break;
            default:
                message = err.message;
        }
        
        logger.warn('Multer upload error', {
            error: err.code,
            message: err.message,
            ip,
            userId: req.user?.id,
        });
        
        return res.status(400).json({
            success: false,
            error: message,
            statusCode: 400,
        });
    }
    
    next(err);
};

// Validate uploaded file (post-upload checks)
export const validateUploadedFile = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    
    const file = req.file;
    const filePath = file.path;
    
    // Additional security checks
    try {
        // Check if file actually exists
        if (!fs.existsSync(filePath)) {
            throw new ValidationError('File upload failed');
        }
        
        // Verify file size matches
        const stats = fs.statSync(filePath);
        if (stats.size !== file.size) {
            logger.warn('File size mismatch detected', {
                expected: file.size,
                actual: stats.size,
                filename: file.filename,
            });
            fs.unlinkSync(filePath);
            throw new ValidationError('File validation failed');
        }
        
        // Check for null bytes in filename (security vulnerability)
        if (file.filename.includes('\0')) {
            logger.warn('Null byte in filename detected', {
                filename: file.filename,
            });
            fs.unlinkSync(filePath);
            throw new ValidationError('Invalid filename');
        }
        
        logger.info('File validated successfully', {
            filename: file.filename,
            size: file.size,
            mimeType: file.mimetype,
            userId: req.user?.id,
        });
        
        next();
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        next(error);
    }
};

// Clean up old files (optional utility)
export const cleanupOldFiles = (maxAgeInDays = 30) => {
    const now = Date.now();
    const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
    
    const scanDirectory = (dir) => {
        if (!fs.existsSync(dir)) return;
        
        const files = fs.readdirSync(dir);
        let deletedCount = 0;
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isFile()) {
                const age = now - stats.mtimeMs;
                if (age > maxAge) {
                    fs.unlinkSync(filePath);
                    deletedCount++;
                }
            } else if (stats.isDirectory()) {
                scanDirectory(filePath);
            }
        });
        
        if (deletedCount > 0) {
            logger.info('Old files cleaned up', {
                directory: dir,
                count: deletedCount,
                maxAge: `${maxAgeInDays} days`,
            });
        }
    };
    
    scanDirectory(uploadsDir);
};

// Default upload middleware (general purpose)
const upload = createUploadMiddleware({
    allowedTypes: ['image', 'document'],
    subdir: '',
});

// Specific upload middlewares
export const uploadImage = createUploadMiddleware({
    allowedTypes: ['image'],
    subdir: 'images',
});

export const uploadResume = createUploadMiddleware({
    allowedTypes: ['resume'],
    subdir: 'resumes',
});

export const uploadDocument = createUploadMiddleware({
    allowedTypes: ['document'],
    subdir: 'documents',
});

export const uploadMultiple = (maxFiles = 5) => createUploadMiddleware({
    allowedTypes: ['image', 'document'],
    subdir: '',
    maxFiles,
});

export default upload;

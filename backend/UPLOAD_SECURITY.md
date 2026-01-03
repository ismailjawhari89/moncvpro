# Upload Security Documentation

## 📋 Overview
Comprehensive file upload security system with validation, sanitization, and protection against common vulnerabilities.

---

## 🔒 Security Features

### 1. File Type Validation
**Multiple layers of validation:**
- Extension validation
- MIME type validation
- Blocked extensions list
- Whitelist approach (only allowed types)

### 2. Filename Security
**Sanitization:**
- Path traversal prevention
- Special character removal
- Null byte attack prevention
- Double extension protection
- Length limitation

**Secure naming:**
- Cryptographic random filenames
- Timestamp inclusion
- Original extension preservation
- No predictable patterns

### 3. File Size Limits
**Type-specific limits:**
- Images: 5MB
- Documents: 10MB
- Resumes: 5MB
- Configurable per type

### 4. Blocked File Types
**Dangerous extensions blocked:**
- Executables: exe, bat, cmd, com, etc.
- Archives: zip, rar, 7z, tar, gz
- Scripts: sh, php, asp, jsp, py, rb
- System files: dll, so, bin

### 5. Post-Upload Validation
**Additional checks:**
- File existence verification
- Size mismatch detection
- Null byte checks
- File integrity validation

### 6. Directory Organization
**Structured storage:**
```
uploads/
├── images/          # Image files
├── resumes/         # Resume files
├── documents/       # General documents
└── [temp files]     # General uploads
```

### 7. Logging & Monitoring
**Comprehensive tracking:**
- Upload attempts logged
- Rejections logged with reason
- Success confirmations
- User ID tracking
- IP address logging

---

## 📊 Allowed File Types

### Images
**Extensions:** jpg, jpeg, png, gif, webp  
**MIME Types:**
- `image/jpeg`
- `image/png`
- `image/gif`
- `image/webp`

**Max Size:** 5MB

### Documents
**Extensions:** pdf, doc, docx  
**MIME Types:**
- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Max Size:** 10MB

### Resumes
**Extensions:** pdf, doc, docx  
**MIME Types:**
- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Max Size:** 5MB

---

## 🚫 Blocked File Types

### Executables
```
exe, bat, cmd, com, pif, scr, vbs, jar,
msi, dmg, pkg, app, deb, rpm, run, elf
```

### Archives
```
zip, rar, 7z, tar, gz
```

### Scripts
```
sh, php, asp, aspx, jsp, cgi, pl, py, rb, js
```

### System Files
```
dll, so, bin
```

---

## 🛠️ API Endpoints

### 1. General Upload
```http
POST /api/upload
```

**Description:** Upload any allowed file type (image or document)

**Authorization:** Required (Bearer token)

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@/path/to/file.pdf"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "abc123def456-1704240000000.pdf",
    "originalName": "resume.pdf",
    "path": "uploads/abc123def456-1704240000000.pdf",
    "size": 245760,
    "mimetype": "application/pdf"
  }
}
```

---

### 2. Image Upload
```http
POST /api/upload/image
```

**Description:** Upload image files only

**Allowed:** jpg, jpeg, png, gif, webp

**Max Size:** 5MB

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@profile.jpg"
```

---

### 3. Resume Upload
```http
POST /api/upload/resume
```

**Description:** Upload resume files (PDF, DOC, DOCX)

**Allowed:** pdf, doc, docx

**Max Size:** 5MB

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload/resume \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@my-resume.pdf"
```

---

### 4. Document Upload
```http
POST /api/upload/document
```

**Description:** Upload document files

**Allowed:** pdf, doc, docx

**Max Size:** 10MB

**Request:**
```bash
curl -X POST http://localhost:5000/api/upload/document \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@cover-letter.docx"
```

---

## ⚠️ Error Responses

### File Too Large
```json
{
  "success": false,
  "error": "File is too large. Maximum size is 10MB.",
  "statusCode": 400
}
```

### Invalid File Type
```json
{
  "success": false,
  "error": "Invalid file type. Only images and documents are allowed.",
  "statusCode": 400
}
```

### No File Provided
```json
{
  "success": false,
  "error": "No file uploaded",
  "statusCode": 400
}
```

### Rate Limit Exceeded
```json
{
  "success": false,
  "error": "Rate limit exceeded. Please try again in 3600 seconds.",
  "statusCode": 429,
  "retryAfter": 3600
}
```

### Authentication Required
```json
{
  "success": false,
  "error": "No token, authorization denied",
  "statusCode": 401
}
```

---

## 🔐 Security Best Practices

### 1. Filename Sanitization
```javascript
// ✅ Good - Sanitized and secured
const secureFilename = generateSecureFilename(originalname);
// Result: "abc123def456-1704240000000.pdf"

// ❌ Bad - Using original filename
const filename = req.file.originalname;
// Risk: Path traversal, special characters
```

### 2. File Validation
```javascript
// ✅ Good - Multiple validations
- Extension check
- MIME type check
- Blocked extensions check
- Post-upload validation

// ❌ Bad - Only extension check
- Easy to bypass
```

### 3. Size Limits
```javascript
// ✅ Good - Enforced limits
limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
}

// ❌ Bad - No limits
// Risk: DOS attacks, disk space exhaustion
```

### 4. Storage Location
```javascript
// ✅ Good - Outside web root
uploads/images/abc123.jpg

// ❌ Bad - Inside web root
public/uploads/script.php
// Risk: Executable files can be run
```

---

## 🛡️ Attack Prevention

### 1. Path Traversal
**Attack:** `../../etc/passwd`
**Prevention:** 
- `path.basename()` to strip path
- Filename sanitization
- Directory validation

### 2. Double Extension
**Attack:** `file.php.jpg`
**Prevention:**
- Multiple dot replacement
- MIME type validation
- Blocked extension list

### 3. Null Byte Injection
**Attack:** `file.php%00.jpg`
**Prevention:**
- Null byte detection
- Filename validation
- File deletion on detection

### 4. Large File DOS
**Attack:** Upload 1GB file
**Prevention:**
- File size limits
- Rate limiting (10 uploads/hour)
- Request timeout

### 5. Executable Upload
**Attack:** Upload `.exe`, `.sh`, `.php`
**Prevention:**
- Blocked extensions list
- MIME type validation
- Whitelist approach

### 6. File Content Mismatch
**Attack:** Rename `.exe` to `.jpg`
**Prevention:**
- MIME type validation
- Magic number checking (future)
- Content-Type verification

---

## 📝 Configuration

### Environment Variables
```env
# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880  # 5MB in bytes

# Upload Rate Limiting
UPLOAD_REQUESTS_LIMIT=10  # 10 uploads per hour
```

### Custom Configuration
```javascript
// Create custom upload middleware
const customUpload = createUploadMiddleware({
    allowedTypes: ['image'],
    subdir: 'custom',
    maxFiles: 1,
});

// Use in route
router.post('/custom', customUpload.single('file'), handler);
```

---

## 🧪 Testing

### Test Valid Upload
```bash
# Upload image
curl -X POST http://localhost:5000/api/upload/image \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@test.jpg"

# Expected: 200 OK, file details returned
```

### Test Invalid File Type
```bash
# Try to upload .exe file
curl -X POST http://localhost:5000/api/upload \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@malware.exe"

# Expected: 400 Bad Request, error message
```

### Test File Size Limit
```bash
# Try to upload 20MB file
curl -X POST http://localhost:5000/api/upload \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@large-file.pdf"

# Expected: 400 Bad Request, "File too large"
```

### Test Rate Limit
```bash
# Upload 11 files quickly
for i in {1..11}; do
  curl -X POST http://localhost:5000/api/upload \
    -H "x-auth-token: YOUR_TOKEN" \
    -F "file=@test.jpg"
done

# Expected: 11th request returns 429 Too Many Requests
```

---

## 🔍 Monitoring

### Security Logs
All upload activities are logged:

```
[INFO] File upload in progress
{
  "originalName": "resume.pdf",
  "savedName": "abc123-1704240000000.pdf",
  "mimeType": "application/pdf",
  "userId": "user123"
}

[WARN] File upload rejected - invalid type
{
  "filename": "script.php",
  "mimeType": "application/x-php",
  "ip": "192.168.1.100",
  "userId": "user123"
}

[WARN] Blocked file extension attempted
{
  "filename": "malware.exe",
  "extension": "exe",
  "type": "BLOCKED_EXTENSION"
}
```

### View Upload Logs
```bash
# All upload activity
grep "upload" logs/$(date +%Y-%m-%d).log

# Only rejections
grep "rejected" logs/$(date +%Y-%m-%d).log

# Security events
grep "Blocked file extension" logs/$(date +%Y-%m-%d)-errors.log
```

---

## 🧹 Maintenance

### Cleanup Old Files
```javascript
import { cleanupOldFiles } from './middleware/uploadMiddleware.js';

// Clean files older than 30 days
cleanupOldFiles(30);
```

### Schedule Cleanup (Cron)
```javascript
// Run daily at midnight
import cron from 'node-cron';

cron.schedule('0 0 * * *', () => {
    logger.info('Running scheduled file cleanup');
    cleanupOldFiles(30);
});
```

### Manual Cleanup
```bash
# Delete files older than 30 days
find uploads -type f -mtime +30 -delete

# Check disk usage
du -sh uploads/
```

---

## 📚 Code Examples

### Basic Usage
```javascript
import upload from './middleware/uploadMiddleware.js';

router.post('/upload', 
    auth, 
    upload.single('file'), 
    handleUploadError,
    validateUploadedFile,
    uploadHandler
);
```

### Image Only
```javascript
import { uploadImage } from './middleware/uploadMiddleware.js';

router.post('/profile-picture', 
    auth, 
    uploadImage.single('file'), 
    handleUploadError,
    validateUploadedFile,
    saveProfilePicture
);
```

### Multiple Files
```javascript
import { uploadMultiple } from './middleware/uploadMiddleware.js';

router.post('/gallery', 
    auth, 
    uploadMultiple(5).array('files'), // Max 5 files
    handleUploadError,
    validateUploadedFile,
    saveGallery
);
```

---

## ✅ Security Checklist

- [x] File type validation (extension + MIME)
- [x] Blocked dangerous extensions
- [x] File size limits enforced
- [x] Filename sanitization
- [x] Secure random filenames
- [x] Path traversal prevention
- [x] Null byte attack prevention
- [x] Double extension protection
- [x] Post-upload validation
- [x] Rate limiting (10/hour)
- [x] Authentication required
- [x] Comprehensive logging
- [x] Error handling
- [x] Directory organization
- [x] Cleanup utilities

---

## 🎯 Summary

### Security Layers
1. **Pre-upload:** Rate limiting, authentication
2. **During upload:** File type validation, size check
3. **Filename:** Sanitization, secure naming
4. **Post-upload:** File validation, integrity check
5. **Storage:** Organized directories, secure location
6. **Logging:** All activities tracked

### Protection Against
- ✅ Malware uploads
- ✅ Path traversal
- ✅ Null byte injection
- ✅ Double extension
- ✅ Large file DOS
- ✅ Rate limit abuse
- ✅ Unauthorized access

### Production Ready
- ✅ Comprehensive validation
- ✅ Error handling
- ✅ Logging & monitoring
- ✅ Rate limiting
- ✅ Documentation
- ✅ Testing covered

---

**Implementation Date:** January 3, 2024  
**Status:** ✅ Production Ready  
**Security Level:** High

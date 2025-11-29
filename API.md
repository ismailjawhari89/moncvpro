# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## CV Endpoints

### List All CVs
```http
GET /api/cv
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Software Engineer CV",
    "template": "modern",
    "updatedAt": "2025-11-29T14:00:00Z"
  }
]
```

### Get CV by ID
```http
GET /api/cv/:id
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Software Engineer CV",
  "template": "modern",
  "content": {
    "personalInfo": {...},
    "summary": "...",
    "experience": [...],
    "education": [...],
    "skills": [...]
  }
}
```

### Create CV
```http
POST /api/cv
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "My New CV",
  "content": {...},
  "userId": "uuid"
}
```

### Update CV
```http
PUT /api/cv/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": {...},
  "template": "classic"
}
```

### Delete CV
```http
DELETE /api/cv/:id
```

---

## AI Endpoints

### Rewrite Section
```http
POST /api/ai/rewrite
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "Original text to rewrite",
  "section": "summary"
}
```

**Response:**
```json
{
  "rewrittenText": "Improved professional text..."
}
```

### Improve Entire CV
```http
POST /api/ai/improve
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": {
    "personalInfo": {...},
    "summary": "...",
    ...
  }
}
```

**Response:**
```json
{
  "suggestions": [
    "Use stronger action verbs",
    "Quantify achievements"
  ],
  "improvedContent": {...}
}
```

### Generate Bullet Points
```http
POST /api/ai/bullets
Content-Type: application/json
```

**Request Body:**
```json
{
  "jobTitle": "Software Engineer",
  "text": "Worked on web applications"
}
```

**Response:**
```json
{
  "bullets": [
    "• Developed scalable web applications using React and Node.js",
    "• Improved application performance by 40%"
  ]
}
```

### ATS Score
```http
POST /api/ai/ats-score
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": {...},
  "jobDescription": "Job description text..."
}
```

**Response:**
```json
{
  "score": 85,
  "missingKeywords": ["React", "TypeScript"],
  "suggestions": [...]
}
```

---

## Upload Endpoints

### Upload CV File
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: PDF or DOCX file

**Response:**
```json
{
  "message": "File uploaded successfully",
  "filename": "cv_1234567890.pdf",
  "parsedContent": {...}
}
```

---

## Export Endpoints

### Export as PDF
```http
POST /api/export/pdf
Content-Type: application/json
```

**Request Body:**
```json
{
  "cvId": "uuid",
  "template": "modern"
}
```

**Response:** PDF file download

### Export as DOCX
```http
POST /api/export/docx
Content-Type: application/json
```

**Response:** DOCX file download

### Export as PNG
```http
POST /api/export/png
Content-Type: application/json
```

**Response:** PNG image download

---

## Image Endpoints

### Enhance Image
```http
POST /api/image/enhance
Content-Type: multipart/form-data
```

**Form Data:**
- `image`: Image file

**Response:**
```json
{
  "enhancedImage": "base64_string_or_url"
}
```

### Remove Background
```http
POST /api/image/remove-bg
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "imageWithoutBg": "base64_string_or_url"
}
```

---

## Error Responses

All endpoints may return the following error format:

```json
{
  "error": "Error message description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

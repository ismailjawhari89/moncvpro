# API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
Authentication is primarily handled via **Secure, HttpOnly Cookies**.
 
When using the API from a browser, ensure `credentials: 'include'` (fetch) or `withCredentials: true` (axios) is set.
 
### Auth Cookies:
- `auth_token`: JWT access token.
- `refresh_token`: Long-lived refresh token.
 
### Authorization Header (Fallback):
Protected endpoints also accept a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## CV Endpoints (`/cvs`)

### List All CVs
`GET /cvs` - Lists user's CVs (Soft deletes excluded)

### Create CV
`POST /cvs` - Create a new CV with nested relations.
**Body:** `cvSchema` (Zod validated)

### Get CV by ID
`GET /cvs/:id` - Returns full CV with nested relations.

### Update CV
`PUT /cvs/:id` - Updates CV and its relations (Experience, Education, Skills).
**Body:** `cvSchema` (Zod validated)

### Delete CV
`DELETE /cvs/:id` - Performs a **Soft Delete** (`deletedAt` timestamp).

---

## AI Endpoints (`/ai`)

### Section Suggestions
`POST /ai/suggest` - Professional suggestions for a CV section.
**Body:** `{ "cvId": string, "section": string, "prompt": string }`

### Content Improvement
`POST /ai/improve` - Rewrites content for better impact.
**Body:** `{ "cvId": string, "content": string }`

---

## Upload Endpoints (`/upload`)

### File Upload
`POST /upload` - Uploads PDF/DOCX images.
**Security:**
- Unique UUID filenames.
- Magic Bytes verification.
- Size limit: 5MB.

---

## Health & Monitoring

### Liveness Check
`GET /health/live` - Quick process check. Returns `200`.

### Deep Health Check
`GET /health` - Readiness check for DB, Cache, and AI.
**Example Response:**
```json
{
  "status": "UP",
  "timestamp": "2026-01-04T08:00:00.000Z",
  "components": {
    "database": "UP",
    "cache": "UP",
    "ai_provider": "UP"
  }
}
```

---

## Standard Error Response
All endpoints return a consistent error structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": null,
    "stack": "Included in development only"
  },
  "timestamp": "ISO_TIMESTAMP"
}
```

**Common Codes:**
- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `INTERNAL_SERVER_ERROR` (500)
- `DATABASE_ERROR` (500)

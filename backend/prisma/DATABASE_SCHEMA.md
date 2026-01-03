# Database Schema Documentation

## Overview
This document describes the complete database schema for CV Master AI application using Prisma ORM with PostgreSQL.

---

## 🏗️ Schema Architecture

### Core Entities
1. **User Management** - User accounts, sessions, authentication
2. **Resume/CV Management** - CVs, versions, templates
3. **Export Management** - PDF, DOCX, PNG exports
4. **Sharing & Collaboration** - Public sharing, password protection
5. **AI Features** - AI generations, caching
6. **File Management** - Uploads, file storage
7. **Templates** - CV templates library
8. **API & Integration** - API keys, external integrations
9. **Analytics & Logging** - Activity logs, metrics
10. **System** - Configuration, rate limiting
11. **Notifications** - User notifications

---

## 📊 Models Reference

### 1. User Management

#### User
Primary user account model with authentication and security features.

**Fields:**
- `id` (String, CUID) - Unique identifier
- `email` (String, unique) - User email address
- `password` (String) - Hashed password
- `firstName`, `lastName` (String?) - User name
- `phoneNumber` (String?) - Contact number
- `profileImage` (String?) - Profile picture URL

**Security Fields:**
- `isActive` (Boolean) - Account status
- `isVerified` (Boolean) - Email verification status
- `verifiedAt` (DateTime?) - Verification timestamp
- `lastLoginAt` (DateTime?) - Last successful login
- `lastLoginIp` (String?) - Last login IP address
- `failedLoginAttempts` (Int) - Failed login counter
- `lockedUntil` (DateTime?) - Account lock expiry
- `passwordChangedAt` (DateTime?) - Last password change

**Timestamps:**
- `createdAt` (DateTime) - Account creation
- `updatedAt` (DateTime) - Last update
- `deletedAt` (DateTime?) - Soft delete timestamp

**Relations:**
- `resumes` - User's CVs
- `sessions` - Active sessions
- `uploads` - Uploaded files
- `apiKeys` - API keys
- `activityLogs` - Activity history

**Indexes:**
- `email` - Fast email lookups
- `isActive` - Filter active users
- `createdAt` - Sort by registration date

---

#### Session
User session management with JWT tokens.

**Fields:**
- `id` (String, CUID)
- `userId` (String) - Owner
- `token` (String, unique) - JWT token
- `refreshToken` (String?, unique) - Refresh token
- `ipAddress` (String) - Session IP
- `userAgent` (String?) - Browser/device info
- `expiresAt` (DateTime) - Expiration time
- `isRevoked` (Boolean) - Revocation status
- `revokedAt` (DateTime?) - Revocation timestamp

**Relations:**
- `user` - Session owner (cascade delete)

**Indexes:**
- `userId` - User's sessions
- `token` - Token lookup
- `expiresAt` - Expired sessions cleanup

---

### 2. Resume/CV Management

#### Resume
Core CV/resume model with versioning and analytics.

**Fields:**
- `id` (String, CUID)
- `userId` (String) - Owner
- `title` (String) - Resume title
- `slug` (String, unique) - URL-friendly identifier
- `description` (String?) - Resume description
- `templateId` (String) - Template reference

**Content:**
- `personalInfo` (Json?) - Personal details
- `summary` (String?) - Professional summary
- `content` (Json/JsonB) - Full CV content

**Metadata:**
- `isPublic` (Boolean) - Public visibility
- `isTemplate` (Boolean) - Template flag
- `language` (String) - Content language (default: en)

**Status:**
- `status` (ResumeStatus) - DRAFT/PUBLISHED/ARCHIVED
- `publishedAt` (DateTime?) - Publication date

**Analytics:**
- `viewCount` (Int) - View counter
- `downloadCount` (Int) - Download counter
- `shareCount` (Int) - Share counter

**AI Features:**
- `atsScore` (Float?) - ATS compatibility score
- `lastAnalyzedAt` (DateTime?) - Last AI analysis

**Relations:**
- `user` - Resume owner
- `versions` - Version history
- `exports` - Export history
- `shares` - Sharing records
- `aiGenerations` - AI generations

**Indexes:**
- `userId` - User's resumes
- `slug` - Slug lookup
- `status` - Filter by status
- `isPublic` - Public resumes
- `createdAt`, `updatedAt` - Sorting

---

#### ResumeVersion
Version control for resume changes.

**Fields:**
- `id` (String, CUID)
- `resumeId` (String) - Parent resume
- `versionNumber` (Int) - Version number
- `content` (Json/JsonB) - Version content
- `changeDescription` (String?) - Change notes
- `createdAt` (DateTime)
- `createdBy` (String?) - User who created

**Relations:**
- `resume` - Parent resume (cascade delete)

**Unique Constraint:**
- `[resumeId, versionNumber]` - Unique version per resume

---

#### ResumeStatus Enum
```
DRAFT       - Work in progress
PUBLISHED   - Public/active
ARCHIVED    - Archived/inactive
```

---

### 3. Export Management

#### Export
Export job tracking for different formats.

**Fields:**
- `id` (String, CUID)
- `resumeId` (String) - Source resume
- `format` (ExportFormat) - Output format
- `filename` (String) - Generated filename
- `fileUrl` (String?) - Download URL
- `fileSize` (Int?) - File size in bytes
- `status` (ExportStatus) - Job status
- `errorMessage` (String?) - Error details
- `createdAt` (DateTime) - Job created
- `completedAt` (DateTime?) - Job completed

**Relations:**
- `resume` - Source resume (cascade delete)

**Indexes:**
- `resumeId` - Resume exports
- `status` - Filter by status
- `createdAt` - Sort by creation

---

#### ExportFormat Enum
```
PDF    - PDF document
DOCX   - Word document
PNG    - Image export
JSON   - JSON data export
```

#### ExportStatus Enum
```
PENDING     - Queued
PROCESSING  - In progress
COMPLETED   - Success
FAILED      - Error occurred
```

---

### 4. Sharing & Collaboration

#### Share
Public sharing links with access control.

**Fields:**
- `id` (String, CUID)
- `resumeId` (String) - Shared resume
- `shareToken` (String, unique) - Access token
- `password` (String?) - Optional password
- `expiresAt` (DateTime?) - Expiration date
- `maxViews` (Int?) - View limit
- `viewCount` (Int) - Current views
- `isActive` (Boolean) - Active status
- `createdAt` (DateTime)
- `lastViewedAt` (DateTime?) - Last access

**Relations:**
- `resume` - Shared resume (cascade delete)

**Indexes:**
- `resumeId` - Resume shares
- `shareToken` - Token lookup
- `isActive` - Active shares

**Use Cases:**
- Public portfolio links
- Password-protected sharing
- Time-limited access
- View-limited sharing

---

### 5. AI Features

#### AiGeneration
AI content generation tracking and history.

**Fields:**
- `id` (String, CUID)
- `resumeId` (String?) - Associated resume
- `userId` (String?) - User who requested
- `type` (AiGenerationType) - Generation type
- `prompt` (String/Text) - AI prompt
- `input` (Json/JsonB?) - Input data
- `output` (Json/JsonB?) - Generated output
- `model` (String) - AI model used (default: gpt-3.5-turbo)
- `tokens` (Int?) - Token count
- `cost` (Float?) - API cost
- `status` (AiGenerationStatus) - Job status
- `errorMessage` (String?) - Error details
- `createdAt` (DateTime)
- `completedAt` (DateTime?)

**Relations:**
- `resume` - Associated resume (set null on delete)

**Indexes:**
- `resumeId`, `userId` - User/resume generations
- `type` - Filter by type
- `status` - Filter by status
- `createdAt` - Sort by date

---

#### AiGenerationType Enum
```
SUMMARY            - Professional summary
BULLET_POINTS      - Experience bullet points
COVER_LETTER       - Cover letter generation
SKILL_SUGGESTIONS  - Skill recommendations
JOB_MATCH          - Job description matching
ATS_ANALYSIS       - ATS score analysis
REWRITE            - Content rewriting
TRANSLATE          - Content translation
```

#### AiGenerationStatus Enum
```
PENDING     - Queued
PROCESSING  - In progress
COMPLETED   - Success
FAILED      - Error occurred
```

---

#### AiCache
Cache for AI responses to reduce API costs.

**Fields:**
- `id` (String, CUID)
- `cacheKey` (String, unique) - Cache key (hash of input)
- `type` (AiGenerationType) - Generation type
- `input` (Json/JsonB) - Input data
- `output` (Json/JsonB) - Cached output
- `hitCount` (Int) - Cache hit counter
- `createdAt` (DateTime)
- `lastHitAt` (DateTime) - Last cache hit
- `expiresAt` (DateTime) - Cache expiration

**Indexes:**
- `cacheKey` - Fast lookups
- `type` - Filter by type
- `expiresAt` - Expired cache cleanup

**Cache Strategy:**
- Hash input to generate cache key
- Store for 30 days (configurable)
- Track hit count for analytics
- Auto-expire old cache

---

### 6. File Management

#### Upload
File upload tracking and metadata.

**Fields:**
- `id` (String, CUID)
- `userId` (String) - Owner
- `filename` (String) - Stored filename
- `originalName` (String) - Original filename
- `mimeType` (String) - File MIME type
- `fileSize` (Int) - Size in bytes
- `filePath` (String) - Storage path
- `uploadType` (UploadType) - File category
- `metadata` (Json/JsonB?) - Additional metadata
- `isPublic` (Boolean) - Public access
- `createdAt` (DateTime)
- `deletedAt` (DateTime?) - Soft delete

**Relations:**
- `user` - File owner (cascade delete)

**Indexes:**
- `userId` - User's uploads
- `uploadType` - Filter by type
- `createdAt` - Sort by date

---

#### UploadType Enum
```
PROFILE_IMAGE  - Profile pictures
RESUME_PDF     - Resume PDF uploads
COVER_LETTER   - Cover letter documents
PORTFOLIO      - Portfolio files
OTHER          - Miscellaneous
```

---

### 7. Templates

#### Template
CV template library with configurations.

**Fields:**
- `id` (String, CUID)
- `name` (String) - Template name
- `slug` (String, unique) - URL identifier
- `description` (String?) - Description
- `category` (String) - Category (modern, classic, creative, etc.)
- `thumbnail` (String?) - Preview image
- `previewUrl` (String?) - Demo URL
- `config` (Json/JsonB) - Template configuration
- `styles` (Json/JsonB?) - CSS/styling
- `isPremium` (Boolean) - Premium flag
- `isActive` (Boolean) - Active status
- `usageCount` (Int) - Usage counter
- `rating` (Float?) - User rating
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- `slug` - Slug lookup
- `category` - Filter by category
- `isPremium` - Premium templates
- `isActive` - Active templates

**Template Structure:**
```json
{
  "name": "Modern Professional",
  "layout": "single-column",
  "sections": ["header", "summary", "experience", "education", "skills"],
  "colors": {
    "primary": "#2563eb",
    "secondary": "#64748b"
  }
}
```

---

### 8. API & Integration

#### ApiKey
API keys for external integrations.

**Fields:**
- `id` (String, CUID)
- `userId` (String) - Owner
- `name` (String) - Key name/label
- `key` (String, unique) - API key
- `permissions` (Json/JsonB?) - Permission scopes
- `lastUsedAt` (DateTime?) - Last usage
- `lastUsedIp` (String?) - Last IP
- `usageCount` (Int) - Usage counter
- `isActive` (Boolean) - Active status
- `expiresAt` (DateTime?) - Expiration
- `createdAt` (DateTime)
- `revokedAt` (DateTime?) - Revocation

**Relations:**
- `user` - Key owner (cascade delete)

**Indexes:**
- `userId` - User's keys
- `key` - Key lookup
- `isActive` - Active keys

**Permissions Example:**
```json
{
  "scopes": ["resume:read", "resume:write", "export:create"],
  "rateLimit": 1000
}
```

---

### 9. Analytics & Logging

#### ActivityLog
User activity tracking for audit trail.

**Fields:**
- `id` (String, CUID)
- `userId` (String?) - User (nullable for system actions)
- `action` (String) - Action type (login, create_resume, etc.)
- `entity` (String?) - Entity type (Resume, User, etc.)
- `entityId` (String?) - Entity ID
- `ipAddress` (String?) - Request IP
- `userAgent` (String?) - Browser/device
- `metadata` (Json/JsonB?) - Additional data
- `createdAt` (DateTime)

**Relations:**
- `user` - User (set null on delete)

**Indexes:**
- `userId` - User's activities
- `action` - Filter by action
- `entity` - Filter by entity
- `createdAt` - Sort by date

**Common Actions:**
- `user.login`, `user.logout`
- `resume.create`, `resume.update`, `resume.delete`
- `export.create`, `export.download`
- `share.create`, `share.view`

---

#### Analytics
Aggregated metrics and statistics.

**Fields:**
- `id` (String, CUID)
- `date` (DateTime/Date) - Metric date
- `metric` (String) - Metric name
- `value` (Float) - Metric value
- `dimensions` (Json/JsonB?) - Metric dimensions
- `createdAt` (DateTime)

**Unique Constraint:**
- `[date, metric]` - One value per metric per day

**Indexes:**
- `date` - Date range queries
- `metric` - Filter by metric

**Metric Examples:**
```
daily_active_users: 1234
resumes_created: 56
exports_completed: 89
ai_generations: 234
```

---

### 10. System & Configuration

#### RateLimitLog
Rate limiting event tracking.

**Fields:**
- `id` (String, CUID)
- `ipAddress` (String) - Client IP
- `endpoint` (String) - API endpoint
- `route` (String) - Route name
- `attempts` (Int) - Attempt count
- `blocked` (Boolean) - Blocked status
- `timestamp` (DateTime)
- `resetAt` (DateTime) - Rate limit reset
- `metadata` (Json/JsonB?) - Additional data

**Indexes:**
- `ipAddress` - IP lookups
- `endpoint` - Endpoint stats
- `timestamp` - Time-based queries
- `blocked` - Blocked requests

---

#### SystemConfig
System-wide configuration settings.

**Fields:**
- `id` (String, CUID)
- `key` (String, unique) - Config key
- `value` (Json/JsonB) - Config value
- `description` (String?) - Description
- `isPublic` (Boolean) - Public visibility
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

**Indexes:**
- `key` - Key lookup

**Example Configs:**
```json
{
  "key": "max_resumes_per_user",
  "value": {"free": 3, "premium": 100}
}
{
  "key": "ai_rate_limits",
  "value": {"free": 10, "premium": 100}
}
```

---

### 11. Notifications

#### Notification
User notification system.

**Fields:**
- `id` (String, CUID)
- `userId` (String) - Recipient
- `type` (NotificationType) - Notification type
- `title` (String) - Notification title
- `message` (String/Text) - Notification message
- `data` (Json/JsonB?) - Additional data
- `isRead` (Boolean) - Read status
- `readAt` (DateTime?) - Read timestamp
- `createdAt` (DateTime)

**Indexes:**
- `userId` - User notifications
- `isRead` - Unread notifications
- `createdAt` - Sort by date

---

#### NotificationType Enum
```
SYSTEM           - System notifications
EXPORT_COMPLETE  - Export job completed
SHARE_VIEWED     - Someone viewed shared CV
AI_COMPLETE      - AI generation completed
SECURITY_ALERT   - Security-related alerts
```

---

## 🔗 Relationships Overview

### User → One-to-Many
- Resumes (user can have many CVs)
- Sessions (multiple active sessions)
- Uploads (file uploads)
- ApiKeys (multiple API keys)
- ActivityLogs (activity history)

### Resume → One-to-Many
- Versions (version history)
- Exports (export jobs)
- Shares (sharing links)
- AiGenerations (AI content generations)

### Cascade Delete Rules
- User deletion → Deletes all user's data (sessions, resumes, uploads, etc.)
- Resume deletion → Deletes versions, exports, shares
- Session revocation → Soft delete (isRevoked flag)

---

## 📈 Indexing Strategy

### Primary Indexes
- All IDs are indexed by default
- Unique constraints create indexes automatically

### Secondary Indexes
- **Frequent Queries**: `userId`, `email`, `slug`
- **Filtering**: `status`, `isActive`, `isPublic`
- **Sorting**: `createdAt`, `updatedAt`
- **Lookups**: `token`, `shareToken`, `key`

### Composite Indexes (Future)
```prisma
@@index([userId, createdAt])  // User's recent items
@@index([status, updatedAt])  // Active items sorting
```

---

## 🔒 Security Considerations

### Password Storage
- Passwords hashed with bcrypt (salt rounds: 10)
- Never store plain text passwords
- Password change tracking (`passwordChangedAt`)

### Token Management
- JWT tokens in Session table
- Refresh tokens for extended sessions
- Token revocation support
- IP and user agent tracking

### Soft Deletes
- `deletedAt` field for soft deletion
- Preserve data for auditing
- Exclude from queries by default

### Account Security
- Failed login attempt tracking
- Account locking mechanism
- IP address logging
- Email verification

---

## 🚀 Performance Optimization

### JSON vs JSONB
- `@db.JsonB` for PostgreSQL (faster queries, indexable)
- Regular `Json` for simple storage

### Query Optimization
- Use indexes for frequent queries
- Limit/offset pagination
- Select specific fields
- Eager loading with `include`

### Caching Strategy
- AI responses cached in `AiCache`
- Cache hit tracking
- Automatic expiration

---

## 📝 Migration Guide

### Initial Setup
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy
```

### Adding New Fields
```bash
# Create migration
npx prisma migrate dev --name add_field_name

# Reset database (dev only)
npx prisma migrate reset
```

### Production Deployment
```bash
# Deploy migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

---

## 🧪 Testing

### Seeding Database
```bash
# Run seed script
npx prisma db seed
```

### Prisma Studio
```bash
# Open Prisma Studio
npx prisma studio
```

---

## 📚 Best Practices

1. **Always use transactions** for multi-table operations
2. **Use soft deletes** for user-generated content
3. **Index foreign keys** for join performance
4. **Validate data** before database operations
5. **Use enums** for fixed value sets
6. **Track timestamps** (createdAt, updatedAt)
7. **Log activities** for audit trail
8. **Cache AI results** to reduce costs
9. **Clean up expired** sessions and shares
10. **Monitor query performance** in production

---

## 🔄 Future Enhancements

### Planned Features
- [ ] Multi-language support (i18n in content)
- [ ] Collaboration features (team workspaces)
- [ ] Comments and feedback system
- [ ] Payment and subscription management
- [ ] Advanced analytics dashboard
- [ ] Resume comparison tool
- [ ] Job application tracking
- [ ] Interview preparation features

### Schema Additions
- `Workspace` model for teams
- `Subscription` model for billing
- `Comment` model for feedback
- `Application` model for job tracking

---

**Schema Version:** 1.0.0  
**Last Updated:** January 3, 2024  
**Total Models:** 16  
**Total Enums:** 6

# Prisma Database - Quick Start Guide

## 🚀 Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
# Create .env file
cp ../.env.example ../.env

# Edit DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/moncvpro"
```

### 3. Generate Prisma Client
```bash
npm run prisma:generate
# or
npx prisma generate
```

---

## 🗄️ Database Operations

### Create Migration
```bash
# Create and apply migration
npm run prisma:migrate

# or specify migration name
npx prisma migrate dev --name add_user_fields
```

### Apply Migrations (Production)
```bash
npm run prisma:deploy
# or
npx prisma migrate deploy
```

### Push Schema (Development Only)
```bash
# Push schema without migration
npm run db:push
# or
npx prisma db push
```

### Reset Database
```bash
# ⚠️ WARNING: This will delete all data!
npm run prisma:reset
# or
npx prisma migrate reset
```

---

## 🌱 Seeding Database

### Run Seed Script
```bash
# Seed database with test data
npm run db:seed
# or
npm run prisma:seed
```

### Seed Data Includes:
- 2 test users (test@moncvpro.com, admin@moncvpro.com)
- 4 CV templates
- 1 sample resume
- System configurations
- Sample analytics data

### Test Credentials:
```
Email: test@moncvpro.com
Password: Password123!

Email: admin@moncvpro.com
Password: Password123!
```

---

## 🎨 Prisma Studio

### Open Studio
```bash
npm run prisma:studio
# or
npx prisma studio
```

This opens a web-based database browser at `http://localhost:5555`

---

## 📊 Common Commands

### View Database Status
```bash
npx prisma migrate status
```

### Format Schema
```bash
npx prisma format
```

### Validate Schema
```bash
npx prisma validate
```

### Generate ERD (if installed)
```bash
npx prisma-erd-generator
```

---

## 🔍 Query Examples

### In Your Code

```javascript
import prisma from './utils/prisma.js';

// Create user
const user = await prisma.user.create({
    data: {
        email: 'newuser@example.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
    },
});

// Find user
const user = await prisma.user.findUnique({
    where: { email: 'test@example.com' },
    include: {
        resumes: true,
        sessions: true,
    },
});

// Update user
const updated = await prisma.user.update({
    where: { id: userId },
    data: {
        firstName: 'Jane',
        lastLoginAt: new Date(),
    },
});

// Delete user (cascade deletes related data)
await prisma.user.delete({
    where: { id: userId },
});

// Create resume with relations
const resume = await prisma.resume.create({
    data: {
        userId: user.id,
        title: 'My Resume',
        slug: 'my-resume-123',
        content: {
            personalInfo: { ... },
            experience: [ ... ],
        },
        status: 'PUBLISHED',
    },
});

// Query with filters
const resumes = await prisma.resume.findMany({
    where: {
        userId: user.id,
        status: 'PUBLISHED',
        deletedAt: null,
    },
    orderBy: {
        updatedAt: 'desc',
    },
    take: 10,
    skip: 0,
});

// Complex queries
const stats = await prisma.resume.aggregate({
    where: { userId: user.id },
    _count: true,
    _avg: { atsScore: true },
    _sum: { viewCount: true },
});

// Transactions
await prisma.$transaction([
    prisma.resume.create({ data: resumeData }),
    prisma.activityLog.create({ data: logData }),
]);
```

---

## 🛠️ Troubleshooting

### Prisma Client Out of Sync
```bash
# Regenerate client
npm run prisma:generate
```

### Migration Conflicts
```bash
# Mark migration as applied
npx prisma migrate resolve --applied <migration_name>

# Mark as rolled back
npx prisma migrate resolve --rolled-back <migration_name>
```

### Reset Everything
```bash
# ⚠️ Deletes all data
npm run prisma:reset

# Then seed
npm run db:seed
```

### Connection Issues
1. Check DATABASE_URL in .env
2. Verify PostgreSQL is running
3. Test connection:
   ```bash
   npx prisma db pull
   ```

---

## 📚 Schema Models Overview

### Core Models
- **User** - User accounts & authentication
- **Session** - User sessions & tokens
- **Resume** - CV/Resume data
- **ResumeVersion** - Version history
- **Export** - Export jobs (PDF, DOCX, PNG)
- **Share** - Public sharing links
- **AiGeneration** - AI content generations
- **AiCache** - AI response cache
- **Upload** - File uploads
- **Template** - CV templates
- **ApiKey** - API keys
- **ActivityLog** - Activity tracking
- **Analytics** - Metrics & stats
- **RateLimitLog** - Rate limit events
- **SystemConfig** - System settings
- **Notification** - User notifications

### Enums
- **ResumeStatus**: DRAFT, PUBLISHED, ARCHIVED
- **ExportFormat**: PDF, DOCX, PNG, JSON
- **ExportStatus**: PENDING, PROCESSING, COMPLETED, FAILED
- **AiGenerationType**: SUMMARY, BULLET_POINTS, COVER_LETTER, etc.
- **AiGenerationStatus**: PENDING, PROCESSING, COMPLETED, FAILED
- **UploadType**: PROFILE_IMAGE, RESUME_PDF, COVER_LETTER, etc.
- **NotificationType**: SYSTEM, EXPORT_COMPLETE, SHARE_VIEWED, etc.

---

## 🔐 Security Notes

### Password Hashing
Always hash passwords with bcrypt:
```javascript
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(password, 10);
```

### Soft Deletes
Use `deletedAt` for soft deletion:
```javascript
await prisma.resume.update({
    where: { id },
    data: { deletedAt: new Date() },
});

// Exclude deleted in queries
where: { deletedAt: null }
```

### Token Management
- Store JWT tokens in Session table
- Implement token refresh mechanism
- Track IP and user agent
- Revoke tokens on logout

---

## 📈 Performance Tips

1. **Use Indexes**
   - Already optimized in schema
   - Query patterns follow indexes

2. **Select Specific Fields**
   ```javascript
   select: { id: true, email: true, firstName: true }
   ```

3. **Use Pagination**
   ```javascript
   { take: 20, skip: page * 20 }
   ```

4. **Eager Loading**
   ```javascript
   include: { resumes: true, sessions: true }
   ```

5. **Raw Queries** (when needed)
   ```javascript
   await prisma.$queryRaw`SELECT * FROM users WHERE email = ${email}`
   ```

---

## 🚀 Production Checklist

- [ ] Set DATABASE_URL with production credentials
- [ ] Run migrations: `npm run prisma:deploy`
- [ ] Generate client: `npm run prisma:generate`
- [ ] **DO NOT** run seed in production
- [ ] Setup database backups
- [ ] Monitor query performance
- [ ] Enable connection pooling
- [ ] Configure SSL for database connection
- [ ] Set up database monitoring
- [ ] Plan migration strategy

---

## 📖 Documentation

- **Full Schema Docs**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

## 🆘 Getting Help

### Check Status
```bash
npx prisma migrate status
npx prisma validate
```

### View Logs
```bash
# Prisma debug logs
DEBUG=prisma:* npm run dev
```

### Common Issues

1. **"Environment variable not found: DATABASE_URL"**
   - Create .env file with DATABASE_URL

2. **"Migration failed"**
   - Check database connection
   - Verify schema syntax
   - Review migration conflicts

3. **"Type does not exist"**
   - Regenerate Prisma client
   - Restart TypeScript server

---

**Quick Command Reference:**
```bash
npm run prisma:generate      # Generate client
npm run prisma:migrate       # Create & apply migration
npm run prisma:deploy        # Deploy migrations
npm run prisma:studio        # Open Prisma Studio
npm run db:seed              # Seed database
npm run prisma:reset         # Reset database (⚠️ deletes data)
```

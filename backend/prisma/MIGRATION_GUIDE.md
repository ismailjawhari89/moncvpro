# Database Migration Guide

## 📋 Overview
This guide explains how to migrate from the old simple schema to the new comprehensive schema.

---

## 🔄 Migration Strategy

### Current Schema (Old)
```prisma
model User {
  id       Int     @id @default(autoincrement())
  email    String  @unique
  password String
}
```

### New Schema
- **16 models** with full features
- String IDs (CUID) instead of Int
- Complete relationships
- Enhanced security fields
- Analytics & logging
- AI features
- File management

---

## ⚠️ Breaking Changes

### 1. User ID Type Change
**Old:** `Int` with `autoincrement()`  
**New:** `String` with `cuid()`

**Impact:**
- All foreign keys need updating
- Existing data needs ID migration
- API responses will have string IDs

### 2. Additional Required Fields
**User model additions:**
- Security fields (lastLoginAt, failedLoginAttempts, etc.)
- Timestamps (createdAt, updatedAt, deletedAt)
- Profile fields (firstName, lastName, etc.)

### 3. New Relations
- User → Resumes, Sessions, Uploads, etc.
- Cascade deletes implemented
- Soft deletes for user-generated content

---

## 🛠️ Migration Steps

### Step 1: Backup Current Database
```bash
# PostgreSQL backup
pg_dump -U username -d moncvpro > backup_$(date +%Y%m%d).sql

# Or using Prisma
npx prisma db pull
# Save the schema.prisma as backup
```

### Step 2: Create Migration Plan

**Option A: Clean Migration (Recommended for Development)**
```bash
# Reset database (⚠️ deletes all data)
npm run prisma:reset

# Apply new schema
npm run prisma:migrate

# Seed with test data
npm run db:seed
```

**Option B: Data Migration (Production)**
```bash
# Create custom migration
npx prisma migrate dev --create-only --name migrate_to_new_schema

# Edit migration file to preserve data
# See "Data Migration SQL" section below
```

---

## 📝 Data Migration SQL

### Migration Script Template
```sql
-- Create temporary tables for data mapping
CREATE TABLE temp_user_mapping (
    old_id INT,
    new_id VARCHAR(25)
);

-- Step 1: Migrate Users with new IDs
INSERT INTO "users" (
    id, email, password,
    "isActive", "isVerified",
    "createdAt", "updatedAt"
)
SELECT 
    gen_random_uuid()::text as id,
    email,
    password,
    true as "isActive",
    false as "isVerified",
    CURRENT_TIMESTAMP as "createdAt",
    CURRENT_TIMESTAMP as "updatedAt"
FROM "User"
RETURNING id, email;

-- Step 2: Store ID mapping
INSERT INTO temp_user_mapping (old_id, new_id)
SELECT 
    u_old.id as old_id,
    u_new.id as new_id
FROM "User" u_old
JOIN "users" u_new ON u_old.email = u_new.email;

-- Step 3: Migrate related data (if exists)
-- Add similar SQL for other tables...

-- Step 4: Drop old tables
DROP TABLE IF EXISTS "User";

-- Step 5: Clean up
DROP TABLE temp_user_mapping;
```

---

## 🔧 Code Changes Required

### 1. Update User Creation
**Before:**
```javascript
const user = await prisma.user.create({
    data: {
        email: 'user@example.com',
        password: hashedPassword,
    },
});
// user.id is Int
```

**After:**
```javascript
const user = await prisma.user.create({
    data: {
        email: 'user@example.com',
        password: hashedPassword,
        // Optional but recommended
        firstName: 'John',
        lastName: 'Doe',
        isVerified: false,
    },
});
// user.id is String (CUID)
```

### 2. Update Queries
**Before:**
```javascript
const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
});
```

**After:**
```javascript
const user = await prisma.user.findUnique({
    where: { id: userId }, // No parseInt needed
    include: {
        resumes: true, // Can include relations
        sessions: true,
    },
});
```

### 3. Update API Responses
**Before:**
```json
{
  "id": 123,
  "email": "user@example.com"
}
```

**After:**
```json
{
  "id": "clx123abc456def",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isActive": true,
  "isVerified": true,
  "createdAt": "2024-01-03T00:00:00.000Z"
}
```

---

## 🧪 Testing Migration

### Test Checklist
- [ ] User creation works
- [ ] User login works
- [ ] Password verification works
- [ ] JWT token generation works
- [ ] API endpoints return correct IDs
- [ ] Frontend can handle string IDs
- [ ] Relations work correctly
- [ ] Cascade deletes work
- [ ] Soft deletes work

### Test Script
```javascript
// test-migration.js
import prisma from './src/utils/prisma.js';
import bcrypt from 'bcryptjs';

async function testMigration() {
    console.log('Testing new schema...\n');

    // Test 1: Create user
    const password = await bcrypt.hash('Test123!', 10);
    const user = await prisma.user.create({
        data: {
            email: `test-${Date.now()}@example.com`,
            password,
            firstName: 'Test',
            lastName: 'User',
        },
    });
    console.log('✓ User created:', user.id);

    // Test 2: Create resume
    const resume = await prisma.resume.create({
        data: {
            userId: user.id,
            title: 'Test Resume',
            slug: `test-resume-${Date.now()}`,
            content: { test: true },
        },
    });
    console.log('✓ Resume created:', resume.id);

    // Test 3: Query with relations
    const userWithResumes = await prisma.user.findUnique({
        where: { id: user.id },
        include: { resumes: true },
    });
    console.log('✓ User with resumes:', userWithResumes.resumes.length);

    // Test 4: Soft delete
    await prisma.resume.update({
        where: { id: resume.id },
        data: { deletedAt: new Date() },
    });
    console.log('✓ Resume soft deleted');

    // Test 5: Cascade delete
    await prisma.user.delete({
        where: { id: user.id },
    });
    console.log('✓ User deleted (cascade)');

    console.log('\n✅ All tests passed!');
}

testMigration()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
```

---

## 🚨 Rollback Plan

### If Migration Fails

1. **Restore from Backup**
   ```bash
   psql -U username -d moncvpro < backup_YYYYMMDD.sql
   ```

2. **Revert Prisma Schema**
   ```bash
   git checkout HEAD~1 -- prisma/schema.prisma
   npx prisma generate
   ```

3. **Mark Migration as Rolled Back**
   ```bash
   npx prisma migrate resolve --rolled-back migration_name
   ```

---

## 📊 Field Mapping Reference

### User Model

| Old Field | New Field | Type Change | Notes |
|-----------|-----------|-------------|-------|
| `id` | `id` | Int → String | CUID instead of autoincrement |
| `email` | `email` | String | No change |
| `password` | `password` | String | No change |
| - | `firstName` | - | New optional field |
| - | `lastName` | - | New optional field |
| - | `isActive` | - | New, default true |
| - | `isVerified` | - | New, default false |
| - | `createdAt` | - | New, auto timestamp |
| - | `updatedAt` | - | New, auto timestamp |

---

## 🔐 Security Enhancements

### New Security Features
1. **Account Locking**
   - `failedLoginAttempts` counter
   - `lockedUntil` timestamp
   - Auto-lock after N failed attempts

2. **Session Management**
   - Separate Session table
   - Token revocation
   - IP and user agent tracking

3. **Activity Logging**
   - All user actions logged
   - IP address tracking
   - Audit trail

4. **Soft Deletes**
   - User-generated content preserved
   - Can be restored if needed
   - Comply with data retention policies

---

## 📈 Performance Considerations

### Indexes Added
- User: email, isActive, createdAt
- Resume: userId, slug, status, isPublic
- Session: userId, token, expiresAt
- All foreign keys indexed

### Query Optimization
- Use `select` to limit fields
- Use `include` for eager loading
- Implement pagination
- Cache frequently accessed data

---

## 🎯 Post-Migration Tasks

### Immediate
- [ ] Update all controllers to use new schema
- [ ] Update API documentation
- [ ] Update frontend to handle string IDs
- [ ] Test all API endpoints
- [ ] Update seed data
- [ ] Run integration tests

### Short-term
- [ ] Monitor query performance
- [ ] Set up database monitoring
- [ ] Configure automated backups
- [ ] Implement data retention policy
- [ ] Add database connection pooling

### Long-term
- [ ] Analyze query patterns
- [ ] Optimize indexes if needed
- [ ] Plan for horizontal scaling
- [ ] Implement caching strategy
- [ ] Set up read replicas (if needed)

---

## 📖 Additional Resources

- [Prisma Migration Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [PostgreSQL Migration Guide](https://www.postgresql.org/docs/current/ddl-alter.html)
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Full schema documentation
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

---

## 🆘 Getting Help

### Common Issues

1. **"Unique constraint failed"**
   - Check for duplicate emails
   - Verify migration order

2. **"Foreign key constraint failed"**
   - Ensure parent records exist
   - Check cascade rules

3. **"Migration conflict"**
   - Resolve manually or reset
   - See Prisma docs

### Support Channels
- Check error logs
- Review migration history
- Test in development first
- Keep backups ready

---

**Migration Status:** Ready for implementation  
**Recommended Approach:** Clean migration for dev, careful migration for production  
**Estimated Time:** 30 minutes (dev) - 2 hours (production)

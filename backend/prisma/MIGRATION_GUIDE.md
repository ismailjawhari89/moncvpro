# Database Migration Guide

## Overview
This guide helps you migrate from the simple User model to the complete Prisma schema.

## Pre-Migration Checklist

1. **Backup your database**
   ```bash
   npm run backup
   # Or manually:
   pg_dump -U username -d cvmaster > backup_$(date +%Y%m%d).sql
   ```

2. **Review the new schema**
   - Read `/backend/prisma/schema.prisma`
   - Check all models and relations
   - Understand the new data structure

3. **Test in development first**
   - Never run migrations directly in production
   - Test on a staging/development database first

## Migration Strategy

### Option 1: Fresh Start (Recommended for Development)

If you don't have production data yet:

```bash
# Reset the database (WARNING: Deletes all data)
npx prisma migrate reset

# Create initial migration
npx prisma migrate dev --name init_full_schema

# Seed with default templates
npm run prisma:seed
```

### Option 2: Incremental Migration (For Production)

If you have existing data:

#### Step 1: Create Migration Without Applying
```bash
npx prisma migrate dev --create-only --name migrate_to_full_schema
```

#### Step 2: Edit the Generated Migration

The migration file is in `prisma/migrations/TIMESTAMP_migrate_to_full_schema/migration.sql`

Add data transformation logic:

```sql
-- First, create a mapping table for old Int IDs to new String IDs
CREATE TABLE IF NOT EXISTS _user_id_mapping (
  old_id INTEGER,
  new_id TEXT
);

-- Create new users table with String IDs
CREATE TABLE "User_new" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  password TEXT NOT NULL,
  "firstName" TEXT,
  "lastName" TEXT,
  "profileImage" TEXT,
  bio TEXT,
  "phoneNumber" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migrate existing users to new table
INSERT INTO "User_new" (email, password)
SELECT email, password FROM "User";

-- Store the mapping of old IDs to new IDs
INSERT INTO _user_id_mapping (old_id, new_id)
SELECT u_old.id, u_new.id
FROM "User" u_old
JOIN "User_new" u_new ON u_old.email = u_new.email;

-- Drop old table and rename new table
DROP TABLE "User";
ALTER TABLE "User_new" RENAME TO "User";

-- Create all other new tables
-- (Prisma will generate these automatically)

-- Clean up mapping table after migration
-- DROP TABLE _user_id_mapping;
```

#### Step 3: Apply the Migration
```bash
npx prisma migrate dev
```

#### Step 4: Verify Data
```bash
npx prisma studio
# Check that all data migrated correctly
```

## Post-Migration Tasks

### 1. Update Application Code

Replace all old Prisma imports:

```javascript
// OLD
import prisma from './src/utils/prisma.js';

// NEW
import prisma from './src/lib/prisma.js';
```

### 2. Initialize Default Data

```bash
# Create default templates
npm run prisma:seed

# Create default subscription plans if needed
# (Add to seed.ts if required)
```

### 3. Create Default Subscriptions for Existing Users

Run this script after migration:

```javascript
import prisma from './src/lib/prisma.js';
import { PLAN_LIMITS, SUBSCRIPTION_PLANS } from './src/constants/subscription.js';

async function createDefaultSubscriptions() {
  const users = await prisma.user.findMany({
    where: {
      subscription: null
    }
  });

  for (const user of users) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: SUBSCRIPTION_PLANS.FREE,
        status: 'active',
        ...PLAN_LIMITS[SUBSCRIPTION_PLANS.FREE]
      }
    });

    await prisma.usageMetric.create({
      data: {
        userId: user.id,
        currentMonth: new Date().toISOString().slice(0, 7),
        totalCVsCreated: 0,
        totalExports: 0,
        totalAIUses: 0
      }
    });

    await prisma.userSettings.create({
      data: {
        userId: user.id,
        language: 'en',
        theme: 'light'
      }
    });

    console.log(`✅ Created defaults for user ${user.email}`);
  }
}

createDefaultSubscriptions().catch(console.error);
```

### 4. Update Environment Variables

Make sure your `.env` file has all required variables:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cvmaster"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."
```

### 5. Test All Functionality

- [ ] User registration
- [ ] User login
- [ ] CV creation
- [ ] Template loading
- [ ] Export functionality
- [ ] AI features
- [ ] Subscription management
- [ ] Settings update

## Rollback Plan

If something goes wrong:

### Quick Rollback

```bash
# Restore from backup
psql -U username -d cvmaster < backup_20240101.sql

# Revert to previous Prisma Client
npm run prisma:generate
```

### Revert Migration

```bash
# View migration history
npx prisma migrate status

# Revert last migration (if possible)
npx prisma migrate resolve --rolled-back MIGRATION_NAME
```

## Common Issues

### Issue: Foreign Key Constraints

**Problem**: Cannot create relations because referenced records don't exist

**Solution**: Ensure templates are created before creating CVs

```bash
npm run prisma:seed
```

### Issue: Type Mismatches

**Problem**: Old code expects `Int` IDs, new schema uses `String`

**Solution**: Update all ID comparisons:

```javascript
// OLD
if (userId === 1) { ... }

// NEW
if (userId === 'clxxx...') { ... }
```

### Issue: Missing Relations

**Problem**: Queries fail because relations aren't loaded

**Solution**: Use `include` in Prisma queries:

```javascript
const user = await prisma.user.findUnique({
  where: { id },
  include: {
    cvs: true,
    subscription: true,
    settings: true
  }
});
```

### Issue: JSON Field Validation

**Problem**: Invalid JSON structure in CV fields

**Solution**: Validate JSON before saving:

```javascript
import { z } from 'zod';

const personalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  // ... more fields
});

const validated = personalInfoSchema.parse(personalInfo);
```

## Performance Optimization

After migration:

1. **Analyze Query Performance**
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "CV" WHERE "userId" = 'xxx';
   ```

2. **Add Missing Indexes**
   If needed, add more indexes to the schema

3. **Vacuum Database**
   ```sql
   VACUUM ANALYZE;
   ```

4. **Update Statistics**
   ```sql
   ANALYZE;
   ```

## Monitoring

Set up monitoring for:

- Database connection pool usage
- Slow query logs
- Migration status
- Data integrity checks

## Support

If you encounter issues:

1. Check Prisma logs (set `log: ['query', 'error']` in PrismaClient)
2. Review migration files in `prisma/migrations/`
3. Check database logs
4. Consult Prisma documentation: https://www.prisma.io/docs

## Checklist

- [ ] Database backed up
- [ ] Migration tested in development
- [ ] Application code updated
- [ ] Default data seeded
- [ ] Environment variables configured
- [ ] All tests passing
- [ ] Rollback plan prepared
- [ ] Team notified
- [ ] Documentation updated
- [ ] Monitoring configured

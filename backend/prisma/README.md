# Prisma Database Schema

## Overview
This is the complete Prisma schema for CV Master AI, covering all aspects of the application including user management, CV creation, templates, subscriptions, analytics, and more.

## Database Models

### 1. **User Management**
- **User**: Core user model with authentication and profile information
- **Session**: JWT session management with device tracking
- **UserSettings**: User preferences (language, theme, notifications)

### 2. **CV Management**
- **CV**: Core CV model with version control and AI features
  - Supports draft/published/archived status
  - Version history tracking with `parentVersionId`
  - ATS score and analysis
  - Public sharing via `publicUrl`
- **Export**: Track all CV exports (PDF, DOCX, PNG, JSON)

### 3. **Templates**
- **Template**: Customizable CV templates
  - Design configuration (colors, fonts, layout)
  - Premium/free distinction
  - Category-based organization

### 4. **Subscription & Billing**
- **Subscription**: User subscription management
  - Plan types: free, pro, premium
  - Stripe integration
  - Usage limits per plan
- **Payment**: Payment transaction tracking

### 5. **Analytics**
- **UsageMetric**: Track user engagement and feature usage
  - Monthly usage tracking
  - Lifetime totals
  - Last activity timestamps
- **AuditLog**: Security and compliance logging

## Key Features

### Version Control
CVs support full version history:
```prisma
versionNumber         Int       @default(1)
parentVersionId       String?
versions              CV[]      @relation("CVVersions")
originalVersion       CV?       @relation("CVVersions", fields: [parentVersionId], references: [id])
```

### Flexible Content Storage
CV content is stored as JSON for maximum flexibility:
- `personalInfo`: Basic personal information
- `experience`: Array of work experiences
- `education`: Array of education entries
- `skills`: Technical and soft skills
- `languages`: Languages with proficiency levels
- `customSections`: Custom user-defined sections

### AI-Powered Features
- `atsScore`: Automated ATS scoring (0-100)
- `atsAnalysis`: Detailed analysis results
- `lastAIEnhance`: Track AI enhancement usage

### Subscription Limits
Each subscription plan defines:
- `cvLimit`: Maximum CVs allowed
- `templateLimit`: Maximum custom templates
- `exportLimit`: Monthly export limit
- `aiUsageLimit`: Monthly AI feature usage

## Database Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Update the `DATABASE_URL` with your PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@localhost:5432/cvmaster?schema=public"
```

### 3. Create Migration
```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client
```bash
npx prisma generate
```

### 5. (Optional) Seed Database
```bash
npx prisma db seed
```

## Common Prisma Commands

### Development
```bash
# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Create migration
npx prisma migrate dev --name migration_name

# Generate client
npx prisma generate

# Open Prisma Studio (GUI)
npx prisma studio
```

### Production
```bash
# Apply migrations
npx prisma migrate deploy

# Generate client
npx prisma generate
```

## Indexes

The schema includes strategic indexes for optimal query performance:

- **User**: Email lookup
- **CV**: User ID, Template ID, Status, Parent Version ID
- **Template**: Category, Premium status
- **Subscription**: Status, Plan
- **UsageMetric**: Current month, Last activity
- **Export**: CV ID, Status, Creation date
- **Session**: User ID, Token, Expiration
- **Payment**: User ID, Status, Creation date
- **AuditLog**: User ID, Action, Resource Type, Creation date

## Relations & Cascade Behavior

### Cascade Delete
The following relations use `onDelete: Cascade`:
- User → CVs, Sessions, Subscription, UsageMetric, UserSettings
- CV → Exports
- Subscription → User
- Session → User

### No Action (Version Control)
CV version relationships use `onDelete: NoAction` to preserve version history integrity.

## Data Migration

### From Existing User Model
If migrating from the simple User model (id: Int), create a migration that:
1. Creates all new tables
2. Migrates existing users to new schema (String IDs with cuid())
3. Updates foreign key references

Example migration strategy:
```sql
-- Create temporary mapping table
CREATE TABLE user_id_mapping (
  old_id INT,
  new_id TEXT
);

-- Migrate users and create mapping
-- Then use mapping to update all foreign keys
```

## Best Practices

### 1. Always Use Transactions for Complex Operations
```typescript
await prisma.$transaction([
  prisma.cv.create({ ... }),
  prisma.usageMetric.update({ ... }),
  prisma.auditLog.create({ ... })
]);
```

### 2. Handle JSON Fields Properly
```typescript
// Type-safe JSON handling
interface CVPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  summary?: string;
}

const cv = await prisma.cv.create({
  data: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com"
    } as CVPersonalInfo
  }
});
```

### 3. Use Select to Optimize Queries
```typescript
// Only fetch required fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    firstName: true,
    lastName: true
  }
});
```

### 4. Implement Proper Error Handling
```typescript
try {
  const result = await prisma.user.create({ ... });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
    }
  }
  throw error;
}
```

## Security Considerations

1. **Never expose raw Prisma errors to clients** - Log details, return generic messages
2. **Always validate input** before passing to Prisma queries
3. **Use parameterized queries** (Prisma does this automatically)
4. **Implement rate limiting** on sensitive operations
5. **Audit sensitive actions** using the AuditLog model
6. **Hash passwords** before storing (use bcrypt)
7. **Sanitize JSON fields** before storing user-provided content

## Performance Tips

1. **Use indexes** on frequently queried fields
2. **Implement pagination** for large result sets
3. **Use select** to limit returned fields
4. **Cache frequently accessed data** (Redis)
5. **Use database-level aggregations** instead of fetching all records
6. **Monitor slow queries** using Prisma query logs
7. **Consider read replicas** for high-traffic applications

## Support

For issues or questions:
- Prisma Documentation: https://www.prisma.io/docs
- Prisma Community: https://github.com/prisma/prisma/discussions
- CV Master AI Team: [contact info]

# Prisma Schema Implementation Guide

## Quick Start

### 1. Setup Database Connection

Create a `.env` file in the backend directory:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/cvmaster?schema=public"
```

### 2. Generate Prisma Client

```bash
npm run prisma:generate
```

### 3. Create and Apply Migrations

```bash
npm run prisma:migrate
# Follow the prompts to name your migration
```

### 4. (Optional) Seed the Database

```bash
npm run prisma:seed
```

This will create 6 default CV templates that users can use.

### 5. Open Prisma Studio (Database GUI)

```bash
npm run prisma:studio
```

Visit http://localhost:5555 to manage your database visually.

## Usage Examples

### User Management

#### Create a New User
```javascript
import prisma from './src/lib/prisma.js';
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: hashedPassword,
    firstName: 'John',
    lastName: 'Doe',
    settings: {
      create: {
        language: 'en',
        theme: 'light'
      }
    },
    usageMetrics: {
      create: {
        currentMonth: new Date().toISOString().slice(0, 7),
        totalCVsCreated: 0,
        totalExports: 0,
        totalAIUses: 0
      }
    }
  },
  include: {
    settings: true,
    usageMetrics: true
  }
});
```

#### Get User with Relations
```javascript
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: {
    cvs: {
      where: { status: 'published' },
      orderBy: { updatedAt: 'desc' }
    },
    subscription: true,
    usageMetrics: true,
    settings: true
  }
});
```

### CV Management

#### Create a CV
```javascript
const cv = await prisma.cv.create({
  data: {
    userId: user.id,
    templateId: template.id,
    title: 'Software Engineer Resume',
    description: 'My professional resume for tech positions',
    status: 'draft',
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      location: 'San Francisco, CA',
      summary: 'Experienced software engineer...'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2020-01',
        endDate: '2023-12',
        current: false,
        description: 'Led development of key features...',
        achievements: [
          'Increased performance by 40%',
          'Mentored 5 junior developers'
        ],
        technologies: ['JavaScript', 'React', 'Node.js']
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Tech',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8'
      }
    ],
    skills: {
      technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      soft: ['Leadership', 'Communication', 'Problem Solving']
    },
    languages: [
      { language: 'English', proficiency: 'native' },
      { language: 'Spanish', proficiency: 'intermediate' }
    ]
  }
});

// Update usage metrics
await prisma.usageMetric.update({
  where: { userId: user.id },
  data: {
    totalCVsCreated: { increment: 1 },
    cvCreatedThisMonth: { increment: 1 },
    lastActivityAt: new Date()
  }
});
```

#### Get CV with Template
```javascript
const cv = await prisma.cv.findUnique({
  where: { id: cvId },
  include: {
    template: true,
    user: {
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true
      }
    },
    exports: {
      orderBy: { createdAt: 'desc' },
      take: 10
    }
  }
});
```

#### Get CV Version History
```javascript
const cvWithVersions = await prisma.cv.findUnique({
  where: { id: cvId },
  include: {
    versions: {
      orderBy: { versionNumber: 'desc' }
    },
    originalVersion: true
  }
});
```

#### Create CV Version
```javascript
const newVersion = await prisma.cv.create({
  data: {
    ...existingCV,
    id: undefined, // Generate new ID
    versionNumber: existingCV.versionNumber + 1,
    parentVersionId: existingCV.id,
    title: `${existingCV.title} (v${existingCV.versionNumber + 1})`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
});
```

### Template Management

#### Get All Public Templates
```javascript
const templates = await prisma.template.findMany({
  where: {
    isPublic: true,
    OR: [
      { isPremium: false },
      { isPremium: true, cvs: { some: { userId: user.id } } }
    ]
  },
  orderBy: { createdAt: 'desc' }
});
```

#### Get Templates by Category
```javascript
const modernTemplates = await prisma.template.findMany({
  where: {
    category: 'modern',
    isPublic: true
  }
});
```

### Subscription Management

#### Create Subscription
```javascript
const subscription = await prisma.subscription.create({
  data: {
    userId: user.id,
    plan: 'pro',
    status: 'active',
    cvLimit: 5,
    templateLimit: 3,
    exportLimit: 50,
    aiUsageLimit: 100,
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    stripeCustomerId: 'cus_xxx',
    stripeSubscriptionId: 'sub_xxx',
    priceId: 'price_xxx'
  }
});
```

#### Check Plan Limits
```javascript
import { checkPlanLimit } from './src/lib/prisma.js';

const hasReachedLimit = await checkPlanLimit(user.id, 'cvLimit');

if (hasReachedLimit) {
  throw new Error('You have reached your plan limit. Please upgrade.');
}
```

#### Update Usage Metrics
```javascript
import { incrementUsageMetric } from './src/lib/prisma.js';

// After exporting a CV
await incrementUsageMetric(user.id, 'exportsThisMonth');
await incrementUsageMetric(user.id, 'totalExports');

// After using AI feature
await incrementUsageMetric(user.id, 'aiUsesThisMonth');
await incrementUsageMetric(user.id, 'totalAIUses');
```

### Export Management

#### Create Export
```javascript
const exportRecord = await prisma.export.create({
  data: {
    cvId: cv.id,
    format: 'pdf',
    fileName: `${cv.title}.pdf`,
    status: 'pending'
  }
});

// After export completes
await prisma.export.update({
  where: { id: exportRecord.id },
  data: {
    status: 'completed',
    fileUrl: 'https://storage.example.com/cv-123.pdf',
    fileSize: 1024000 // bytes
  }
});
```

#### Get User's Export History
```javascript
const exports = await prisma.export.findMany({
  where: {
    cv: {
      userId: user.id
    }
  },
  include: {
    cv: {
      select: {
        id: true,
        title: true
      }
    }
  },
  orderBy: { createdAt: 'desc' },
  take: 20
});
```

### Audit Logging

#### Create Audit Log
```javascript
import { createAuditLog } from './src/lib/prisma.js';

await createAuditLog({
  userId: user.id,
  action: 'update',
  resourceType: 'cv',
  resourceId: cv.id,
  changes: {
    before: { title: 'Old Title' },
    after: { title: 'New Title' },
    fields: ['title']
  },
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

#### Get User Activity Log
```javascript
const logs = await prisma.auditLog.findMany({
  where: { userId: user.id },
  orderBy: { createdAt: 'desc' },
  take: 50
});
```

### Session Management

#### Create Session
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

const session = await prisma.session.create({
  data: {
    userId: user.id,
    token: token,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
});
```

#### Validate Session
```javascript
const session = await prisma.session.findUnique({
  where: { token: token },
  include: { user: true }
});

if (!session || session.expiresAt < new Date()) {
  throw new Error('Invalid or expired session');
}
```

#### Cleanup Expired Sessions
```javascript
// Run this periodically (cron job)
await prisma.session.deleteMany({
  where: {
    expiresAt: {
      lt: new Date()
    }
  }
});
```

## Complex Queries

### Dashboard Statistics
```javascript
const stats = await prisma.$transaction([
  // Total CVs
  prisma.cv.count({
    where: { userId: user.id, status: { not: 'archived' } }
  }),
  
  // Exports this month
  prisma.export.count({
    where: {
      cv: { userId: user.id },
      createdAt: {
        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }
  }),
  
  // Average ATS Score
  prisma.cv.aggregate({
    where: { userId: user.id, atsScore: { not: null } },
    _avg: { atsScore: true }
  }),
  
  // Usage metrics
  prisma.usageMetric.findUnique({
    where: { userId: user.id }
  })
]);

const [totalCVs, exportsThisMonth, atsAvg, metrics] = stats;
```

### Search CVs
```javascript
const searchResults = await prisma.cv.findMany({
  where: {
    userId: user.id,
    OR: [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ],
    status: { in: ['draft', 'published'] }
  },
  include: {
    template: {
      select: {
        name: true,
        category: true
      }
    }
  },
  orderBy: { updatedAt: 'desc' }
});
```

### Pagination Helper
```javascript
import { buildPaginationMeta } from './src/lib/prisma.js';

const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const [cvs, total] = await prisma.$transaction([
  prisma.cv.findMany({
    where: { userId: user.id },
    skip,
    take: limit,
    orderBy: { updatedAt: 'desc' }
  }),
  prisma.cv.count({
    where: { userId: user.id }
  })
]);

const pagination = buildPaginationMeta(total, page, limit);

const response = {
  data: cvs,
  pagination
};
```

## Error Handling

```javascript
import { handlePrismaError } from './src/lib/prisma.js';

try {
  const user = await prisma.user.create({
    data: { email: 'duplicate@example.com', password: 'hash' }
  });
} catch (error) {
  const formattedError = handlePrismaError(error);
  return res.status(formattedError.status).json({
    success: false,
    error: formattedError.message,
    field: formattedError.field
  });
}
```

## Performance Tips

1. **Use Select to Limit Fields**
   ```javascript
   // Good
   const user = await prisma.user.findUnique({
     where: { id },
     select: { id: true, email: true, firstName: true }
   });
   
   // Bad - fetches all fields
   const user = await prisma.user.findUnique({ where: { id } });
   ```

2. **Use Transactions for Related Operations**
   ```javascript
   await prisma.$transaction([
     prisma.cv.create({ data: cvData }),
     prisma.usageMetric.update({ where: { userId }, data: { totalCVsCreated: { increment: 1 } } }),
     prisma.auditLog.create({ data: auditData })
   ]);
   ```

3. **Index Frequently Queried Fields**
   Already done in the schema! Check `@@index` annotations.

4. **Use Pagination**
   Always paginate large result sets to avoid memory issues.

5. **Connection Pooling**
   The Prisma Client singleton handles this automatically.

## Migration Workflow

### Development
```bash
# Create a new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Apply pending migrations
npx prisma migrate dev
```

### Production
```bash
# Apply migrations in production
npm run prisma:deploy

# Generate Prisma Client
npm run prisma:generate
```

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Make sure `.env` file exists in the backend directory
- Check that `DATABASE_URL` is set correctly

### "Can't reach database server"
- Verify PostgreSQL is running
- Check database connection string
- Verify network access

### "Unique constraint failed"
- Check if a record with the same unique field already exists
- Use `upsert` instead of `create` when appropriate

### "Foreign key constraint failed"
- Ensure referenced record exists before creating relation
- Use transactions when creating related records

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

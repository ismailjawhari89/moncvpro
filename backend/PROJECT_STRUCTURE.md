# Backend Project Structure

## Overview
This document outlines the complete backend structure after implementing the comprehensive Prisma schema.

## Directory Structure

```
backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   │   └── .gitkeep
│   ├── schema.prisma        # Complete database schema (10 models)
│   ├── seed.ts              # Database seeding script (6 templates)
│   ├── README.md            # Prisma documentation
│   └── MIGRATION_GUIDE.md   # Migration strategies
│
├── src/
│   ├── constants/           # Application constants
│   │   ├── cv.js            # CV-related constants
│   │   └── subscription.js  # Subscription plans and limits
│   │
│   ├── lib/                 # Core libraries
│   │   └── prisma.js        # Enhanced Prisma client with helpers
│   │
│   ├── types/               # TypeScript definitions
│   │   └── prisma.d.ts      # Prisma model type definitions
│   │
│   ├── utils/               # Utility functions
│   │   └── validators.js    # Input validation helpers
│   │
│   ├── routes/              # API routes (to be implemented)
│   ├── controllers/         # Route controllers (to be implemented)
│   ├── middleware/          # Express middleware (to be implemented)
│   └── index.js             # Main application entry point
│
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # NPM dependencies and scripts
├── CHANGES.md               # Changelog of schema implementation
├── PRISMA_SCHEMA_SUMMARY.md # Implementation summary
└── SCHEMA_GUIDE.md          # Complete usage guide
```

## Database Schema (10 Models)

### 1. User
- **Purpose**: User management and authentication
- **Key Fields**: id, email, password, profile info
- **Relations**: CVs, Subscription, UsageMetric, UserSettings, Sessions

### 2. CV
- **Purpose**: Resume/CV management with version control
- **Key Fields**: title, content (JSON), status, atsScore
- **Relations**: User, Template, Exports, Versions (self-referencing)

### 3. Template
- **Purpose**: CV template system
- **Key Fields**: name, category, colors, fonts, layout
- **Relations**: CVs

### 4. Subscription
- **Purpose**: User subscription and billing
- **Key Fields**: plan, status, limits, Stripe IDs
- **Relations**: User

### 5. UsageMetric
- **Purpose**: Usage tracking and analytics
- **Key Fields**: monthly/total metrics, last activity
- **Relations**: User

### 6. Export
- **Purpose**: CV export tracking
- **Key Fields**: format, status, fileUrl
- **Relations**: CV

### 7. UserSettings
- **Purpose**: User preferences
- **Key Fields**: language, theme, notifications
- **Relations**: User

### 8. Session
- **Purpose**: Authentication sessions
- **Key Fields**: token, refreshToken, device info
- **Relations**: User

### 9. Payment
- **Purpose**: Payment transaction tracking
- **Key Fields**: amount, status, Stripe payment ID
- **Relations**: None (userId as optional field)

### 10. AuditLog
- **Purpose**: Security and compliance logging
- **Key Fields**: action, resourceType, changes, IP
- **Relations**: None (userId as optional field)

## Key Files

### Configuration
- **`.env.example`** - Template for environment variables
- **`.gitignore`** - Files to exclude from Git
- **`package.json`** - Dependencies and NPM scripts

### Schema & Database
- **`prisma/schema.prisma`** - Complete database schema
- **`prisma/seed.ts`** - Default templates seeding
- **`prisma/migrations/`** - Database migration files

### Code
- **`src/lib/prisma.js`** - Prisma client singleton with helpers
- **`src/constants/cv.js`** - CV constants (status, formats, limits)
- **`src/constants/subscription.js`** - Plans and pricing
- **`src/utils/validators.js`** - Input validation functions

### Types
- **`src/types/prisma.d.ts`** - TypeScript type definitions for all models

### Documentation
- **`SCHEMA_GUIDE.md`** - Complete usage guide with examples
- **`prisma/README.md`** - Prisma setup and best practices
- **`prisma/MIGRATION_GUIDE.md`** - Migration strategies
- **`PRISMA_SCHEMA_SUMMARY.md`** - Implementation summary
- **`CHANGES.md`** - Changelog
- **`PROJECT_STRUCTURE.md`** - This file

## Available NPM Scripts

```bash
# Development
npm run dev                  # Start dev server with nodemon
npm start                    # Start production server

# Prisma
npm run prisma:generate      # Generate Prisma Client
npm run prisma:migrate       # Create and apply migration
npm run prisma:studio        # Open Prisma Studio (database GUI)
npm run prisma:seed          # Seed database with templates
npm run prisma:deploy        # Apply migrations in production

# Code Quality
npm test                     # Run tests with coverage
npm run lint                 # Lint code
npm run format               # Format code with Prettier

# Build
npm run build                # Generate Prisma Client

# Utilities
npm run backup               # Backup database
```

## Environment Variables

Required variables (see `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR="./uploads"

# CORS
ALLOWED_ORIGINS="http://localhost:3000"
```

## Helper Functions

### Prisma Client (`src/lib/prisma.js`)

```javascript
import prisma, {
  handlePrismaError,        // Convert Prisma errors to user-friendly messages
  buildPaginationMeta,      // Build pagination metadata
  executeTransaction,       // Safe transaction wrapper
  softDelete,               // Archive instead of delete
  checkPlanLimit,           // Check subscription limits
  incrementUsageMetric,     // Track usage
  createAuditLog            // Create audit logs
} from './src/lib/prisma.js';
```

### Constants (`src/constants/`)

```javascript
import {
  SUBSCRIPTION_PLANS,       // Plan names: free, pro, premium
  SUBSCRIPTION_STATUS,      // Status: active, canceled, expired, trialing
  PLAN_LIMITS,              // Limits per plan
  getPlanLimits,            // Get limits for a plan
  hasPlanFeature,           // Check if feature is available
  getRemainingUsage         // Calculate remaining usage
} from './src/constants/subscription.js';

import {
  CV_STATUS,                // draft, published, archived
  EXPORT_FORMAT,            // pdf, docx, png, json
  EXPORT_STATUS,            // pending, completed, failed
  TEMPLATE_CATEGORY,        // modern, classic, elegant, creative, professional
  LANGUAGE_PROFICIENCY,     // native, fluent, advanced, intermediate, basic
  getATSScoreRating         // Convert score to rating
} from './src/constants/cv.js';
```

### Validators (`src/utils/validators.js`)

```javascript
import {
  validateCVData,           // Validate complete CV
  validatePersonalInfo,     // Validate personal info
  validateExperience,       // Validate experience entries
  validateEducation,        // Validate education entries
  validateSkills,           // Validate skills
  validateLanguages,        // Validate languages
  validateCustomSections,   // Validate custom sections
  validateTemplateData,     // Validate template
  validateSubscriptionData, // Validate subscription
  validateExportFormat,     // Validate export format
  sanitizeInput,            // XSS protection
  isValidEmail,             // Email validation
  isValidUrl,               // URL validation
  isValidDate               // Date validation
} from './src/utils/validators.js';
```

## Type Definitions

TypeScript types available in `src/types/prisma.d.ts`:

- `CVPersonalInfo`
- `CVExperience`
- `CVEducation`
- `CVSkills`
- `CVLanguage`
- `CVCustomSection`
- `TemplateColors`
- `TemplateFonts`
- `TemplateConfig`
- `ATSAnalysis`
- `SubscriptionLimits`
- `PaginatedResponse`
- `ApiResponse`
- And many more...

## Subscription Plans

### Free Plan
- 1 CV
- 0 custom templates
- 3 exports/month
- 5 AI uses/month
- Basic templates
- Basic ATS analysis

### Pro Plan ($9.99/month)
- 5 CVs
- 3 custom templates
- 50 exports/month
- 100 AI uses/month
- All templates
- Advanced ATS analysis
- Version history
- Priority support

### Premium Plan ($19.99/month)
- Unlimited CVs
- Unlimited custom templates
- Unlimited exports
- Unlimited AI uses
- All premium templates
- Advanced ATS analysis
- Version history
- Priority support 24/7
- Job matching AI
- Cover letter generator
- LinkedIn optimization

## Default Templates

6 templates seeded by default:

1. **Modern Professional** (Free, Modern, 2-col)
2. **Classic Elegant** (Free, Classic, 1-col)
3. **Creative Bold** (Premium, Creative, 2-col)
4. **Minimalist** (Free, Modern, 1-col)
5. **Executive Pro** (Premium, Elegant, 2-col)
6. **Tech Startup** (Premium, Modern, 3-col)

## Security Features

- JWT session management with refresh tokens
- Audit logging for all sensitive operations
- IP address and user agent tracking
- Cascade deletion for data cleanup
- Input validation and sanitization
- Error handling with user-friendly messages
- Soft delete (archive) functionality

## Performance Optimizations

- 25+ strategic indexes
- Prisma Client singleton pattern
- Connection pooling (automatic)
- Query optimization helpers
- Pagination support
- Transaction support

## Next Steps

### To Implement:
1. API routes for all models
2. Authentication middleware
3. Subscription management logic
4. Export functionality (PDF, DOCX)
5. AI integration (ATS, content generation)
6. Stripe webhook handlers
7. Email notifications
8. Rate limiting
9. Tests (unit + integration)
10. API documentation

## Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Stripe API**: https://stripe.com/docs/api
- **JWT**: https://jwt.io/

## Support

For questions or issues, check the documentation files:
- `SCHEMA_GUIDE.md` - Complete usage guide
- `prisma/README.md` - Prisma documentation
- `prisma/MIGRATION_GUIDE.md` - Migration help
- `CHANGES.md` - What changed

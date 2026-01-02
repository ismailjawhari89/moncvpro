# MonCVPro Backend API

Backend API for MonCVPro - Professional CV Builder with AI-powered features.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Setup Database
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with default templates
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```

Server runs on http://localhost:5000

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema (10 models)
│   ├── seed.ts                # Default templates seeding
│   ├── migrations/            # Database migrations
│   ├── README.md              # Prisma documentation
│   └── MIGRATION_GUIDE.md     # Migration strategies
│
├── src/
│   ├── constants/             # Application constants
│   ├── lib/                   # Core libraries (Prisma client)
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Utility functions (validators)
│   ├── routes/                # API routes
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Express middleware
│   └── index.js               # Main entry point
│
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
│
└── Documentation/
    ├── SCHEMA_GUIDE.md        # Complete usage guide
    ├── PRISMA_SCHEMA_SUMMARY.md
    ├── PROJECT_STRUCTURE.md
    └── CHANGES.md
```

## 🗄️ Database Models

**10 comprehensive models:**

1. **User** - Authentication & profile
2. **CV** - Resume management with version control
3. **Template** - Customizable CV templates
4. **Subscription** - Free/Pro/Premium plans (Stripe ready)
5. **UsageMetric** - Analytics & usage tracking
6. **Export** - PDF/DOCX/PNG export tracking
7. **UserSettings** - User preferences
8. **Session** - JWT session management
9. **Payment** - Stripe payment tracking
10. **AuditLog** - Security & compliance logging

## 📦 Available Scripts

```bash
# Development
npm run dev                    # Start with nodemon
npm start                      # Start production server

# Database
npm run prisma:generate        # Generate Prisma Client
npm run prisma:migrate         # Create/apply migrations
npm run prisma:studio          # Open database GUI
npm run prisma:seed            # Seed default templates
npm run prisma:deploy          # Production migrations

# Code Quality
npm test                       # Run tests
npm run lint                   # Lint code
npm run format                 # Format code

# Utilities
npm run backup                 # Backup database
```

## 🔧 Environment Variables

See `.env.example` for all required variables:

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Strong random secret (32+ chars)
- `JWT_EXPIRES_IN` - Token expiration (e.g., "7d")
- `NODE_ENV` - "development" or "production"
- `PORT` - Server port (default: 5000)

### Optional
- `STRIPE_SECRET_KEY` - For payments (not enabled yet)
- `GROQ_API_KEY` - For AI features
- `SMTP_*` - For email notifications
- `REDIS_URL` - For caching (Upstash)
- `SENTRY_DSN` - For error monitoring

## 🎯 Subscription Plans

### Free Plan
- 1 CV
- 3 exports/month
- 5 AI uses/month
- Basic templates

### Pro Plan ($9.99/month)
- 5 CVs
- 50 exports/month
- 100 AI uses/month
- All templates
- Priority support

### Premium Plan ($19.99/month)
- Unlimited everything
- Premium templates
- 24/7 support
- Job matching AI

## 🛡️ Security Features

- JWT authentication with refresh tokens
- Rate limiting (Redis-based)
- CORS configuration
- Input validation and sanitization
- Audit logging for sensitive operations
- Session tracking with device info

## 📊 Features

### Core Features
- ✅ User authentication (email/password + OAuth)
- ✅ CV CRUD operations with version control
- ✅ Template system (6 default templates)
- ✅ PDF/DOCX/PNG export
- ✅ ATS score analysis (AI-powered)
- ✅ Multi-language support (en, fr, ar)
- ✅ Usage tracking & analytics

### Admin Features
- ✅ Admin dashboard
- ✅ User management
- ✅ Analytics & metrics
- ✅ Audit logs

### Subscription Features
- ✅ Plan limits enforcement
- ✅ Usage tracking (monthly + lifetime)
- ⏳ Stripe integration (ready, not enabled)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth
- `POST /api/auth/linkedin` - LinkedIn OAuth
- `POST /api/auth/refresh` - Refresh JWT token

### CV Management
- `GET /api/cv` - List user's CVs
- `POST /api/cv` - Create new CV
- `GET /api/cv/:id` - Get CV by ID
- `PUT /api/cv/:id` - Update CV
- `DELETE /api/cv/:id` - Delete CV
- `POST /api/cv/:id/export` - Export CV
- `POST /api/cv/:id/analyze` - Run ATS analysis

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get template by ID

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/settings` - Get settings
- `PUT /api/user/settings` - Update settings
- `GET /api/user/metrics` - Get usage metrics

### Admin (Protected)
- `GET /api/admin/users` - List all users
- `GET /api/admin/analytics` - Platform analytics
- `GET /api/admin/audit-logs` - Audit logs

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- user.test.js
```

## 📚 Documentation

Comprehensive documentation available:

- **[SCHEMA_GUIDE.md](./SCHEMA_GUIDE.md)** - Complete database usage guide
- **[prisma/README.md](./prisma/README.md)** - Prisma setup & best practices
- **[MIGRATION_GUIDE.md](./prisma/MIGRATION_GUIDE.md)** - Database migration strategies
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Project organization
- **[PRISMA_SCHEMA_SUMMARY.md](./PRISMA_SCHEMA_SUMMARY.md)** - Schema overview

## 🚀 Deployment

### Production Checklist

See **[../GO_LIVE_CHECKLIST.md](../GO_LIVE_CHECKLIST.md)** for complete pre-launch checklist.

### Quick Deploy Steps

1. Set all environment variables
2. Run migrations: `npm run prisma:deploy`
3. Generate client: `npm run prisma:generate`
4. Seed templates: `npm run prisma:seed`
5. Start server: `npm start`
6. Verify health: `curl https://api.moncvpro.com/health`

## 🔄 Database Migrations

### Development
```bash
# Create new migration
npm run prisma:migrate

# Reset database (WARNING: deletes data)
npx prisma migrate reset
```

### Production
```bash
# Apply pending migrations
npm run prisma:deploy
```

## 🛠️ Helper Functions

### Prisma Helpers (`src/lib/prisma.js`)
```javascript
import prisma, {
  handlePrismaError,      // Error handling
  buildPaginationMeta,    // Pagination
  checkPlanLimit,         // Subscription limits
  incrementUsageMetric,   // Track usage
  createAuditLog          // Audit logging
} from './src/lib/prisma.js';
```

### Validators (`src/utils/validators.js`)
```javascript
import {
  validateCVData,         // Validate CV
  validatePersonalInfo,   // Validate personal info
  validateExperience,     // Validate experience
  sanitizeInput,          // XSS protection
  isValidEmail            // Email validation
} from './src/utils/validators.js';
```

### Constants (`src/constants/`)
```javascript
import { SUBSCRIPTION_PLANS, PLAN_LIMITS } from './src/constants/subscription.js';
import { CV_STATUS, EXPORT_FORMAT } from './src/constants/cv.js';
```

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check DATABASE_URL is set
echo $DATABASE_URL

# Test connection
npx prisma studio
```

### Prisma Client Issues
```bash
# Regenerate client
npm run prisma:generate

# Clear cache
rm -rf node_modules/.prisma
npm run prisma:generate
```

### Migration Conflicts
```bash
# View migration status
npx prisma migrate status

# Reset (WARNING: deletes data)
npx prisma migrate reset
```

## 📝 Code Style

- ES6 modules (`type: "module"` in package.json)
- Use Prisma client from `src/lib/prisma.js`
- Always validate inputs
- Use constants instead of magic strings
- Create audit logs for sensitive operations
- Handle errors with user-friendly messages

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Format code: `npm run format`
6. Commit and push
7. Create pull request

## 📞 Support

- **Documentation**: See docs in this directory
- **Issues**: GitHub Issues
- **Email**: support@moncvpro.com

## 📄 License

MIT License - See LICENSE file

---

**Built with ❤️ by the MonCVPro Team**

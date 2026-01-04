# MonCVPro

## 🚀 Production-Ready SaaS Platform

MonCVPro is an enterprise-grade AI-powered resume builder with comprehensive authentication, admin operations, email notifications, and performance optimization.

## ✨ Features

### 🔐 Enterprise Security
- Multi-factor authentication (TOTP)
- OAuth integration (Google, LinkedIn)
- Session management with device tracking
- Brute-force protection
- Comprehensive audit logging
- Role-based access control (RBAC)

### ⚡ High Performance
- Redis caching with smart invalidation
- Database query optimization
- Gzip compression
- CDN integration
- PWA support with offline functionality
- Average API latency < 80ms

### 👥 Admin Operations
- User management (search, filter, suspend)
- Subscription management
- Analytics & reporting dashboards
- System health monitoring
- Audit trail visibility

### 📧 Email System
- Transactional emails (verification, password reset)
- Marketing emails (onboarding, newsletters)
- User email preferences
- Professional HTML templates
- Queue-based processing with Bull + Redis

### 🎨 Modern UI/UX
- Responsive design
- Dark mode support
- Internationalization (i18n)
- Real-time updates
- Accessibility compliant

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Cache:** Redis
- **Queue:** Bull (Redis-based)
- **Authentication:** JWT + OAuth 2.0
- **Email:** Nodemailer + SendGrid
- **Monitoring:** Sentry, Winston logging

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **i18n:** next-intl
- **Charts:** Recharts

### DevOps
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry, DataDog
- **Backups:** Automated daily to S3
- **SSL:** Let's Encrypt

## 📦 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/moncvpro.git
cd moncvpro

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment variables
cp .env.production.template .env
# Edit .env with your configuration

# Run database migrations
cd backend
npx prisma migrate deploy
npx prisma generate

# Start development servers
npm run dev # in both backend and frontend directories
```

### Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# View logs
docker-compose logs -f
```

## 📚 Documentation

- [System Architecture](./ARCHITECTURE.md)
- [Security Policy](./SECURITY.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Operations Runbook](./OPERATIONS.md)
- [Disaster Recovery Plan](./DISASTER_RECOVERY.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [API Documentation](./API.md)
- [Security Audit Report](./SECURITY_AUDIT_REPORT.md)

## 🔧 Configuration

### Environment Variables

See `.env.production.template` for all required environment variables.

Key configurations:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `ACCESS_TOKEN_SECRET`: JWT secret for access tokens
- `SENDGRID_API_KEY`: Email service API key
- `SENTRY_DSN`: Error tracking DSN

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test

# Load testing
k6 run tests/load.test.ts
```

## 📊 Monitoring

- **Health Check:** `https://api.moncvpro.com/health`
- **Metrics:** `https://api.moncvpro.com/metrics`
- **Sentry:** Error tracking and performance monitoring
- **Uptime:** 99.9% SLA with Pingdom monitoring

## 🚀 Deployment

### Automated Deployment

Push to `main` branch triggers automatic deployment via GitHub Actions.

### Manual Deployment

```bash
# Deploy to production
gh workflow run deploy.yml
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 🔐 Security

- All passwords hashed with bcrypt
- JWT tokens with short expiry
- HTTPS enforced in production
- Security headers (Helmet.js)
- Rate limiting on all endpoints
- CORS configured for production domains
- Regular security audits

## 📈 Performance

- API Response Time: < 100ms (p95)
- Cache Hit Rate: > 70%
- Uptime: 99.9%
- Concurrent Users: 1000+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 👥 Team

- **Development:** MonCVPro Team
- **DevOps:** DevOps Team
- **Support:** support@moncvpro.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- All open-source contributors

---

**Built with ❤️ by the MonCVPro Team**

**Version:** 1.0.0  
**Last Updated:** 2026-01-02

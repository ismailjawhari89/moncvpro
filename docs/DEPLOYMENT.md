# MonCVPro Production Deployment Guide

## 🚀 Overview

This guide covers the complete deployment process for MonCVPro to production environments.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] Docker and Docker Compose installed
- [ ] PostgreSQL database provisioned
- [ ] Redis instance provisioned
- [ ] Domain name configured (moncvpro.com, api.moncvpro.com)
- [ ] SSL certificates obtained (Let's Encrypt recommended)
- [ ] GitHub repository secrets configured
- [ ] Monitoring services set up (Sentry, DataDog, etc.)

## 🔐 Environment Configuration

### 1. Copy Environment Template

```bash
cp .env.production.template .env.production
```

### 2. Fill in Production Values

Edit `.env.production` and replace all placeholder values:

- **Database**: Production PostgreSQL connection string
- **Redis**: Production Redis URL with password
- **Secrets**: Generate secure random strings (min 32 characters)
- **OAuth**: Production OAuth credentials from Google/LinkedIn
- **Email**: SendGrid or SMTP credentials
- **Stripe**: Live API keys
- **Monitoring**: Sentry DSN, analytics IDs

### 3. Secure Secrets Management

**Never commit `.env.production` to version control!**

For GitHub Actions, add secrets in:
`Repository Settings > Secrets and variables > Actions`

Required secrets:
- `PRODUCTION_DATABASE_URL`
- `PRODUCTION_REDIS_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `SENDGRID_API_KEY`
- `STRIPE_SECRET_KEY`
- `SENTRY_DSN`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SLACK_WEBHOOK_URL`

## 🐳 Docker Deployment

### Local Testing with Docker

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Stop services
docker-compose down
```

### Production Docker Deployment

```bash
# Pull latest images
docker-compose pull

# Start with production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Monitor health
docker-compose ps
```

## 🗄️ Database Setup

### 1. Run Migrations

```bash
cd backend
npx prisma migrate deploy
```

### 2. Seed Initial Data (Optional)

```bash
npx prisma db seed
```

### 3. Verify Schema

```bash
npx prisma studio
```

## 🔄 CI/CD Pipeline

### Automated Deployment Flow

1. **Push to `main` branch** → Triggers build workflow
2. **Build & Test** → Runs tests and linting
3. **Docker Build** → Creates and pushes images
4. **Deploy** → Deploys to production
5. **Smoke Tests** → Verifies deployment
6. **Notification** → Sends Slack alert

### Manual Deployment

```bash
# Trigger deployment manually
gh workflow run deploy.yml
```

## 🌐 Platform-Specific Deployment

### Option A: Railway.app (Recommended)

1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click
4. Auto-scaling enabled

### Option B: Vercel + Render

**Frontend (Vercel):**
```bash
vercel --prod
```

**Backend (Render):**
- Connect GitHub repo
- Set environment variables
- Deploy

### Option C: AWS ECS

1. Push images to ECR
2. Create ECS task definitions
3. Deploy to ECS cluster
4. Configure ALB

### Option D: DigitalOcean App Platform

1. Connect GitHub
2. Configure build settings
3. Add environment variables
4. Deploy

## 🔒 SSL/TLS Configuration

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d moncvpro.com -d api.moncvpro.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.moncvpro.com;
    
    ssl_certificate /etc/letsencrypt/live/api.moncvpro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.moncvpro.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📊 Monitoring Setup

### 1. Sentry Error Tracking

```bash
# Already configured in backend/src/lib/sentry.ts
# Just add SENTRY_DSN to environment
```

### 2. Health Checks

```bash
# Test health endpoint
curl https://api.moncvpro.com/health
```

### 3. Uptime Monitoring

Configure in Pingdom/UptimeRobot:
- URL: `https://api.moncvpro.com/health`
- Interval: 5 minutes
- Alert: Slack/Email

## 🔄 Rollback Procedures

### Quick Rollback

```bash
# Rollback to previous Docker image
docker-compose down
docker-compose pull moncvpro-backend:previous
docker-compose up -d
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d moncvpro /backups/moncvpro_TIMESTAMP.sql.gz
```

## 🧪 Post-Deployment Verification

### Smoke Tests

```bash
# Health check
curl https://api.moncvpro.com/health

# Frontend
curl https://moncvpro.com

# Authentication
curl -X POST https://api.moncvpro.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'
```

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run tests/load.test.ts
```

## 📈 Scaling

### Horizontal Scaling

```bash
# Scale backend instances
docker-compose up -d --scale backend=3
```

### Database Scaling

- Enable read replicas
- Configure connection pooling
- Add Redis caching

## 🆘 Troubleshooting

### Common Issues

**Database Connection Errors:**
```bash
# Check database connectivity
docker-compose exec backend npx prisma db pull
```

**Redis Connection Errors:**
```bash
# Test Redis
docker-compose exec redis redis-cli ping
```

**Build Failures:**
```bash
# Clear Docker cache
docker system prune -a
docker-compose build --no-cache
```

## 📞 Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Review health checks: `/health` endpoint
- Contact: devops@moncvpro.com

## ✅ Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Load tests passed
- [ ] Smoke tests passed
- [ ] Team notified
- [ ] Documentation updated

---

**Last Updated:** 2026-01-02
**Version:** 1.0.0

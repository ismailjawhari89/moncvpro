# Quick Start Guide - Advanced Authentication System

## 🚀 Getting Started in 5 Minutes

This guide will help you get the advanced authentication system up and running quickly.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Redis (for email queues)
- SMTP server credentials (or use development mode)

## Step 1: Database Migration

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate dev --name add-advanced-auth

# Or apply the SQL migration directly
psql -U your_user -d your_database -f prisma/migrations/add_advanced_auth.sql
```

## Step 2: Environment Variables

Create/update `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/moncvpro"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this"

# Frontend URL
FRONTEND_URL="http://localhost:3001"

# Email Configuration (Development - emails will be logged to console)
NODE_ENV="development"
SMTP_HOST="smtp.ethereal.email"
SMTP_PORT="587"
SMTP_USER="test@ethereal.email"
SMTP_PASS="test"
EMAIL_FROM="noreply@moncvpro.com"

# Production Email Configuration (uncomment for production)
# NODE_ENV="production"
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-app-password"
# EMAIL_FROM="noreply@moncvpro.com"
```

## Step 3: Start Backend

```bash
cd backend

# Install dependencies (if not already done)
npm install

# Start all workers (PDF, AI, Email)
npm run dev
```

The backend will start on `http://localhost:3000`

## Step 4: Test the API

### Test Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Expected response:
```json
{
  "userId": "clxxx...",
  "message": "Registration successful. Please check your email to verify your account."
}
```

### Test Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }' \
  -c cookies.txt
```

Expected response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clxxx...",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "emailVerified": false
  }
}
```

### Test Protected Endpoint

```bash
# Extract access token from previous response
ACCESS_TOKEN="your-access-token-here"

curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

### Test Password Reset

```bash
# Request password reset
curl -X POST http://localhost:3000/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Check backend logs for the reset link (in development mode)
# The link will look like: http://localhost:3001/auth/reset-password?token=abc123...

# Reset password
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123...",
    "newPassword": "NewTest123!@#"
  }'
```

## Step 5: Frontend Integration (Optional)

If you want to integrate with the frontend:

1. Copy the auth store implementation from `FRONTEND_AUTH_INTEGRATION.md`
2. Create the auth pages (Login, Register, etc.)
3. Set up the axios interceptor
4. Configure protected routes

```bash
cd frontend

# Add environment variable
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" >> .env.local

# Start frontend
npm run dev
```

## Step 6: Verify Email Flow (Development)

In development mode, emails are logged to the console. Check the backend logs to find the verification link:

```
[Email Service] DEV MODE - Would send email to test@example.com
[Email Service] Subject: Verify Your Email - MonCVPro ✉️
[Email Service] Body preview: <!DOCTYPE html>...
```

Extract the verification token from the logs and test:

```bash
curl -X POST http://localhost:3000/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-verification-token"
  }'
```

## Step 7: Test Session Management

```bash
# Get active sessions
curl -X GET http://localhost:3000/api/v1/auth/sessions \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Revoke a specific session
curl -X DELETE http://localhost:3000/api/v1/auth/sessions/SESSION_ID \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Logout from all devices
curl -X POST http://localhost:3000/api/v1/auth/logout-all \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

## Step 8: Run Maintenance Tasks (Optional)

```bash
cd backend

# Clean up expired tokens
npx ts-node src/scripts/auth-maintenance.ts --cleanup-tokens

# Clean up expired sessions
npx ts-node src/scripts/auth-maintenance.ts --cleanup-sessions

# Generate security report
npx ts-node src/scripts/auth-maintenance.ts --security-report

# Run all maintenance tasks
npx ts-node src/scripts/auth-maintenance.ts --all
```

## Common Issues & Solutions

### Issue 1: Prisma Client Not Generated

**Error:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
cd backend
npx prisma generate
```

### Issue 2: Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Test connection: `psql -U your_user -d your_database`

### Issue 3: Redis Connection Error

**Error:** `Redis connection failed`

**Solution:**
- Ensure Redis is running: `redis-cli ping` (should return PONG)
- Check REDIS_URL in .env
- Start Redis: `redis-server`

### Issue 4: Email Not Sending

**Solution:**
- In development, emails are logged to console (check backend logs)
- For production, configure SMTP settings correctly
- Test SMTP credentials separately

### Issue 5: Token Expired

**Error:** `Invalid or expired verification token`

**Solution:**
- Tokens expire after 24 hours (email verification) or 1 hour (password reset)
- Request a new token
- Check system time is synchronized

## Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET and JWT_REFRESH_SECRET to secure random strings
- [ ] Set NODE_ENV=production
- [ ] Configure production SMTP settings
- [ ] Set FRONTEND_URL to production domain
- [ ] Enable HTTPS (secure cookies)
- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Set up monitoring and logging
- [ ] Test all auth flows
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Review security headers
- [ ] Set up automated maintenance tasks (cron jobs)

## Next Steps

1. **Read Full Documentation**
   - `backend/ADVANCED_AUTH.md` - Complete API documentation
   - `FRONTEND_AUTH_INTEGRATION.md` - Frontend integration guide

2. **Implement Frontend**
   - Create auth pages
   - Set up auth store
   - Configure protected routes
   - Add session management UI

3. **Add Future Features**
   - Two-Factor Authentication (2FA)
   - OAuth integration (Google, LinkedIn)
   - Rate limiting
   - Advanced security features

4. **Set Up Monitoring**
   - Log aggregation
   - Error tracking (Sentry)
   - Performance monitoring
   - Security alerts

## Support

- **Documentation:** `backend/ADVANCED_AUTH.md`
- **Frontend Guide:** `FRONTEND_AUTH_INTEGRATION.md`
- **Summary:** `ADVANCED_AUTH_SUMMARY.md`

## Testing Credentials

For development testing:

```
Email: test@example.com
Password: Test123!@#
```

Remember to delete test accounts before going to production!

---

**Congratulations!** 🎉 Your advanced authentication system is now up and running!

# Advanced Authentication System - MonCVPro

## Overview

MonCVPro now features an **enterprise-grade authentication system** with comprehensive security features including email verification, password reset, refresh token rotation, session management, and security logging.

## Features

### ✅ Implemented

1. **User Registration & Login**
   - Secure password hashing with bcrypt
   - Email validation
   - Password strength validation
   - Automatic email verification flow

2. **Email Verification**
   - Secure token generation (32-byte cryptographic random)
   - 24-hour token expiration
   - One-time use tokens
   - Automatic email sending via queue
   - Professional branded email templates

3. **Password Reset**
   - Secure reset token generation
   - 1-hour token expiration
   - One-time use tokens
   - Security: doesn't reveal if email exists
   - All sessions revoked after password reset
   - Confirmation email sent after successful reset

4. **OAuth Integration (Google & LinkedIn)**
   - Social login flow
   - Automatic account creation
   - Account linking

5. **Two-Factor Authentication (2FA)**
   - TOTP based (Google Authenticator, etc.)
   - QR code generation
   - Backup codes
   - Mandatory check during login if enabled

6. **Refresh Token Rotation**
   - Automatic token rotation on refresh
   - Old tokens immediately invalidated
   - Session tracking in database
   - HTTP-only secure cookies

6. **Session Management**
   - Track all active sessions per user
   - Device information (browser, OS)
   - IP address and location tracking
   - Last activity timestamp
   - Ability to revoke individual sessions
   - Logout from all devices

7. **Security Features**
   - 2FA support
   - Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
   - Cryptographically secure token generation
   - Token hashing for additional security layer
   - Rate limiting ready (implement in middleware)
   - Security logging with Pino
   - Audit trail for all auth operations

## API Endpoints

### Public Endpoints

#### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "userId": "clxxx...",
  "message": "Registration successful. Please check your email to verify your account."
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "clxxx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "emailVerified": true
  }
}
```

**Note:** Refresh token is set as HTTP-only cookie

#### Refresh Token
```http
POST /api/v1/auth/refresh
Cookie: refreshToken=xxx
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Request Password Reset
```http
POST /api/v1/auth/request-password-reset
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If that email exists in our system, a password reset link has been sent."
}
```

#### Validate Reset Token
```http
POST /api/v1/auth/validate-reset-token
Content-Type: application/json

{
  "token": "abc123..."
}
```

**Response:**
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "abc123...",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "message": "Password reset successful. Please login with your new password."
}
```

#### Send Verification Email
```http
POST /api/v1/auth/send-verification-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent"
}
```

#### Verify Email
```http
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "abc123..."
}
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

### Protected Endpoints (Require Authentication)

#### Get Current User
```http
GET /api/v1/auth/me
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "id": "clxxx...",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### Get Active Sessions
```http
GET /api/v1/auth/sessions
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "clxxx...",
      "deviceName": "Chrome Browser",
      "ipAddress": "192.168.1.1",
      "location": "New York, US",
      "lastActivityAt": "2024-01-01T12:00:00.000Z",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ]
}
```

#### Revoke Session
```http
DELETE /api/v1/auth/sessions/:sessionId
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "message": "Session revoked successfully"
}
```

#### Logout
```http
POST /api/v1/auth/logout
Cookie: refreshToken=xxx
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### Logout from All Devices
```http
POST /api/v1/auth/logout-all
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "message": "Logged out from all devices successfully"
}
```

## Database Schema

### VerificationToken Model
```prisma
model VerificationToken {
  id              String    @id @default(cuid())
  userId          String?
  email           String
  token           String    @unique
  type            TokenType // EMAIL_VERIFY, PASSWORD_RESET, TWO_FACTOR
  expiresAt       DateTime
  usedAt          DateTime?
  createdAt       DateTime  @default(now())
  ipAddress       String?
  userAgent       String?
  
  @@index([email])
  @@index([token])
  @@index([type])
  @@index([userId])
  @@index([email, type])
}

enum TokenType {
  EMAIL_VERIFY
  PASSWORD_RESET
  TWO_FACTOR
}
```

### Session Model
```prisma
model Session {
  id               String    @id @default(cuid())
  userId           String
  user             User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  refreshToken     String    @unique
  refreshTokenHash String?
  userAgent        String?
  ipAddress        String?
  deviceName       String?
  location         String?
  expiresAt        DateTime
  revokedAt        DateTime?
  lastActivityAt   DateTime  @default(now())
  createdAt        DateTime  @default(now())

  @@index([userId])
  @@index([refreshToken])
  @@index([userId, revokedAt])
}
```

## Email Templates

All email templates are professionally designed with:
- Responsive HTML layout
- Branded header with gradient
- Clear call-to-action buttons
- Security notices
- Mobile-friendly design
- Consistent styling

Available templates:
1. **welcome** - Welcome new users
2. **email-verification** - Verify email address
3. **password-reset** - Reset password request
4. **password-reset-confirmation** - Password changed confirmation
5. **export-ready** - CV export ready
6. **ai-suggestions-ready** - AI analysis complete
7. **payment-confirmation** - Payment successful
8. **premium-expiry-warning** - Subscription expiring

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Token Security
- Cryptographically secure random generation (32 bytes)
- SHA-256 hashing for additional security
- Short expiration times (1 hour for password reset, 24 hours for email verification)
- One-time use only
- Case-sensitive

### Session Security
- HTTP-only cookies for refresh tokens
- Secure flag in production
- SameSite=strict
- Automatic token rotation
- Session tracking with device info
- Ability to revoke sessions

### Additional Security
- Don't reveal if email exists (password reset)
- Revoke all sessions on password change
- Log all authentication events
- IP address tracking
- User agent tracking

## Environment Variables

```env
# Frontend URL for email links
FRONTEND_URL=https://moncvpro.com

# JWT Secrets
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@moncvpro.com
SMTP_PASS=your-smtp-password
EMAIL_FROM=noreply@moncvpro.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/moncvpro

# Redis (for queues)
REDIS_URL=redis://localhost:6379
```

## Migration Guide

### 1. Update Database Schema
```bash
cd backend
npx prisma migrate dev --name add-advanced-auth
npx prisma generate
```

### 2. Run Database Migration
The migration will:
- Add `VerificationToken` model
- Add `TokenType` enum
- Update `Session` model with new fields
- Keep existing `PasswordReset` and `EmailVerification` for backward compatibility

### 3. Update Environment Variables
Add the required environment variables to your `.env` file.

### 4. Test the System
```bash
# Start backend
npm run dev

# Test registration
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","firstName":"Test","lastName":"User"}'
```

## Maintenance Tasks

### Clean Up Expired Tokens
```typescript
// Run periodically (e.g., daily cron job)
await authService.cleanupExpiredTokens();
```

### Clean Up Expired Sessions
```typescript
// Run periodically (e.g., daily cron job)
await authService.cleanupExpiredSessions();
```

## Future Enhancements

### 🔜 Planned Features

1. **Two-Factor Authentication (2FA)**
   - TOTP (Time-based One-Time Password)
   - SMS verification
   - Backup codes

2. **OAuth Integration**
   - Google Sign-In
   - LinkedIn Sign-In
   - GitHub Sign-In

3. **Advanced Security**
   - Rate limiting per IP
   - Account lockout after failed attempts
   - Suspicious activity detection
   - Device fingerprinting

4. **Session Management**
   - Geolocation for sessions
   - Push notifications for new logins
   - Trusted devices

5. **Audit & Compliance**
   - Complete audit trail
   - GDPR compliance features
   - Data export
   - Account deletion

## Support

For issues or questions:
- Email: support@moncvpro.com
- Documentation: https://docs.moncvpro.com
- GitHub: https://github.com/moncvpro/moncvpro

## License

MIT License - See LICENSE file for details

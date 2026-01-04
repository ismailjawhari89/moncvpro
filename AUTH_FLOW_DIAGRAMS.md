# Authentication System Flow Diagrams

## 1. User Registration Flow

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/v1/auth/register
       │ { email, password, firstName, lastName }
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Auth Controller                       │
│  1. Validate input                                       │
│  2. Call authService.register()                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Validate password strength                           │
│  2. Check if user exists                                 │
│  3. Hash password (bcrypt)                               │
│  4. Create user in database                              │
│  5. Generate verification token                          │
│  6. Save token to database                               │
│  7. Queue verification email                             │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Email Queue                          │
│  1. Process email job                                    │
│  2. Render email template                                │
│  3. Send email via SMTP                                  │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    User     │
│  Receives   │
│    Email    │
└─────────────┘
```

## 2. Email Verification Flow

```
┌─────────────┐
│    User     │
│ Clicks Link │
│  in Email   │
└──────┬──────┘
       │
       │ GET /auth/verify-email?token=xxx
       ▼
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/v1/auth/verify-email
       │ { token }
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Auth Controller                       │
│  1. Validate token                                       │
│  2. Call authService.verifyEmail()                       │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Find token in database                               │
│  2. Check if token is valid (not expired, not used)      │
│  3. Update user.emailVerified = true                     │
│  4. Mark token as used                                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Success   │
│   Response  │
└─────────────┘
```

## 3. Login Flow with Token Rotation

```
┌─────────────┐
│   Client    │
│  (Frontend) │
└──────┬──────┘
       │
       │ POST /api/v1/auth/login
       │ { email, password }
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Auth Controller                       │
│  1. Validate input                                       │
│  2. Call authService.login()                             │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Find user by email                                   │
│  2. Verify password (bcrypt compare)                     │
│  3. Generate access token (JWT, 15min)                   │
│  4. Generate refresh token (JWT, 7 days)                 │
│  5. Create session in database                           │
│     - Store refresh token                                │
│     - Store device info, IP, user agent                  │
│  6. Return tokens and user data                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Auth Controller                       │
│  1. Set refresh token as HTTP-only cookie                │
│  2. Return access token and user in response             │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │
│  Stores     │
│ AccessToken │
└─────────────┘
```

## 4. Token Refresh Flow (Automatic Rotation)

```
┌─────────────┐
│   Client    │
│ AccessToken │
│   Expired   │
└──────┬──────┘
       │
       │ POST /api/v1/auth/refresh
       │ Cookie: refreshToken=xxx
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Auth Controller                       │
│  1. Extract refresh token from cookie                    │
│  2. Call authService.refreshToken()                      │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Find session by refresh token                        │
│  2. Verify token is not revoked                          │
│  3. Check expiration                                     │
│  4. Generate NEW access token                            │
│  5. Generate NEW refresh token                           │
│  6. Revoke OLD session                                   │
│  7. Create NEW session                                   │
│  8. Return new tokens                                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Auth Controller                       │
│  1. Update refresh token cookie                          │
│  2. Return new access token                              │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Client    │
│   Updates   │
│ AccessToken │
└─────────────┘
```

## 5. Password Reset Flow

```
┌─────────────┐
│    User     │
│   Forgot    │
│  Password   │
└──────┬──────┘
       │
       │ POST /api/v1/auth/request-password-reset
       │ { email }
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Find user by email (silent if not found)             │
│  2. Invalidate existing reset tokens                     │
│  3. Generate secure reset token (32-byte)                │
│  4. Save token to database (1h expiration)               │
│  5. Queue reset email                                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│    User     │
│  Receives   │
│    Email    │
└──────┬──────┘
       │
       │ Clicks reset link
       │ GET /auth/reset-password?token=xxx
       ▼
┌─────────────┐
│   Client    │
│  Shows Form │
└──────┬──────┘
       │
       │ POST /api/v1/auth/reset-password
       │ { token, newPassword }
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Validate token (not expired, not used)               │
│  2. Validate password strength                           │
│  3. Hash new password                                    │
│  4. Update user password                                 │
│  5. Mark token as used                                   │
│  6. Revoke ALL user sessions (force re-login)            │
│  7. Send confirmation email                              │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────┐
│   Success   │
│    User     │
│ Must Login  │
└─────────────┘
```

## 6. Session Management Flow

```
┌─────────────┐
│    User     │
│   Logged    │
│     In      │
└──────┬──────┘
       │
       │ GET /api/v1/auth/sessions
       │ Authorization: Bearer <token>
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  1. Get all active sessions for user                     │
│  2. Return session details:                              │
│     - Device name                                        │
│     - IP address                                         │
│     - Location                                           │
│     - Last activity                                      │
│     - Created date                                       │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Client Display                        │
│                                                          │
│  Active Sessions:                                        │
│  ┌────────────────────────────────────────────┐         │
│  │ Chrome Browser                              │         │
│  │ 192.168.1.1 • New York, US                 │         │
│  │ Last active: 2 minutes ago                 │         │
│  │                              [Revoke]      │         │
│  └────────────────────────────────────────────┘         │
│  ┌────────────────────────────────────────────┐         │
│  │ Safari Browser                              │         │
│  │ 192.168.1.5 • New York, US                 │         │
│  │ Last active: 1 day ago                     │         │
│  │                              [Revoke]      │         │
│  └────────────────────────────────────────────┘         │
│                                                          │
│  [Logout from All Devices]                              │
└─────────────────────────────────────────────────────────┘
       │
       │ User clicks "Revoke" or "Logout from All"
       ▼
┌─────────────────────────────────────────────────────────┐
│                     Auth Service                         │
│  Option 1: Revoke specific session                       │
│    - Update session.revokedAt = now                      │
│                                                          │
│  Option 2: Logout from all devices                       │
│    - Update ALL sessions.revokedAt = now                 │
│    - Clear cookies                                       │
│    - Redirect to login                                   │
└─────────────────────────────────────────────────────────┘
```

## 7. Security Logging Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Every Auth Operation                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Security Logger                       │
│  Logs:                                                   │
│  - Timestamp                                             │
│  - User ID / Email                                       │
│  - Action (login, logout, register, etc.)                │
│  - IP Address                                            │
│  - User Agent                                            │
│  - Success / Failure                                     │
│  - Error details (if any)                                │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    Log Aggregation                       │
│  - Pino logger (structured JSON)                         │
│  - Can be sent to:                                       │
│    • File system                                         │
│    • Elasticsearch                                       │
│    • CloudWatch                                          │
│    • Datadog                                             │
│    • Sentry                                              │
└─────────────────────────────────────────────────────────┘
```

## 8. Maintenance Flow (Automated)

```
┌─────────────────────────────────────────────────────────┐
│                    Cron Job (Daily)                      │
│  Schedule: 2:00 AM UTC                                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│              auth-maintenance.ts --all                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ├──────────────────────────────────────────────────┐
       │                                                   │
       ▼                                                   ▼
┌──────────────────┐                          ┌──────────────────┐
│  Cleanup Tokens  │                          │ Cleanup Sessions │
│                  │                          │                  │
│ DELETE FROM      │                          │ DELETE FROM      │
│ VerificationToken│                          │ Session          │
│ WHERE            │                          │ WHERE            │
│ expiresAt < now  │                          │ expiresAt < now  │
│                  │                          │ OR revokedAt     │
│ Result: X tokens │                          │ < 30 days ago    │
│ deleted          │                          │                  │
└──────┬───────────┘                          │ Result: Y        │
       │                                      │ sessions deleted │
       │                                      └──────┬───────────┘
       │                                             │
       └─────────────────┬───────────────────────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Security Report    │
              │                     │
              │ - Total users       │
              │ - Active users      │
              │ - Unverified users  │
              │ - Active sessions   │
              │ - Expired tokens    │
              │                     │
              │ Email to admins     │
              └─────────────────────┘
```

## 9. Complete User Journey

```
Registration → Email Verification → Login → Use App → Logout
     │              │                  │        │         │
     ▼              ▼                  ▼        ▼         ▼
  Create        Verify              Create   Access   Revoke
  Account       Email               Session  Protected Session
  Send Email    Update User         Store    Routes   Clear
                                    Tokens            Cookies


Forgot Password → Reset Password → Login
     │                 │              │
     ▼                 ▼              ▼
  Generate          Validate       Create
  Reset Token       Token          New
  Send Email        Update         Session
                    Password
                    Revoke All
                    Sessions
```

## 10. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Client                            │
│  - React/Next.js                                         │
│  - Zustand Store (Auth State)                            │
│  - Axios (HTTP Client)                                   │
└──────┬──────────────────────────────────────────────────┘
       │
       │ HTTP/HTTPS
       │ Cookies (refreshToken)
       │ Headers (Authorization: Bearer <accessToken>)
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│  - Express.js                                            │
│  - CORS Middleware                                       │
│  - Cookie Parser                                         │
│  - Auth Middleware (verify JWT)                          │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                  Auth Controller                         │
│  - Request validation                                    │
│  - Error handling                                        │
│  - Response formatting                                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│                   Auth Service                           │
│  - Business logic                                        │
│  - Token generation/validation                           │
│  - Password hashing                                      │
│  - Security logging                                      │
└──────┬──────────────────────────────────────────────────┘
       │
       ├─────────────────┬─────────────────┬──────────────┐
       │                 │                 │              │
       ▼                 ▼                 ▼              ▼
┌──────────┐    ┌──────────────┐   ┌──────────┐   ┌──────────┐
│ Database │    │ Email Queue  │   │  Logger  │   │  Cache   │
│          │    │              │   │          │   │          │
│ Prisma   │    │ Bull/Redis   │   │  Pino    │   │  Redis   │
│          │    │              │   │          │   │          │
│ - User   │    │ - Verify     │   │ - Auth   │   │ - Session│
│ - Session│    │ - Reset      │   │   Events │   │ - Tokens │
│ - Token  │    │ - Welcome    │   │ - Errors │   │          │
└──────────┘    └──────────────┘   └──────────┘   └──────────┘
```

## Legend

```
┌─────────┐
│  Box    │  = Component/Service
└─────────┘

    │
    ▼         = Data Flow Direction

───────────   = Connection/Relationship
```

---

**Note:** These diagrams represent the logical flow of the authentication system. Actual implementation may vary based on specific requirements and infrastructure.

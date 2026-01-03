# Security Features

This document outlines the security measures implemented in the MonCVPro backend.

## 🔒 Security Implementations

### 1. CORS Protection

The backend implements strict CORS (Cross-Origin Resource Sharing) policies to prevent unauthorized domains from accessing the API.

**Configuration:**
- Only whitelisted origins in `FRONTEND_URL` environment variable can access the API
- Multiple origins can be specified (comma-separated)
- Credentials (cookies, auth headers) are allowed for whitelisted origins only
- Restricted HTTP methods: `GET`, `POST`, `PUT`, `DELETE`
- Restricted headers: `Content-Type`, `Authorization`, `X-CSRF-Token`

**Environment Variable:**
```env
FRONTEND_URL=http://localhost:3000,https://yourdomain.com
```

### 2. CSRF Protection

CSRF (Cross-Site Request Forgery) protection prevents malicious websites from making unauthorized requests on behalf of authenticated users.

**Implementation:**
- Uses `csurf` middleware with cookie-based token storage
- GET/HEAD requests: No CSRF token required (safe methods)
- POST/PUT/DELETE/PATCH requests: CSRF token required
- Tokens stored in httpOnly cookies with SameSite=strict

**Usage:**
1. Frontend fetches CSRF token from `/api/auth/csrf-token`
2. Backend sets _csrf cookie automatically
3. Token is included in `X-CSRF-Token` header for mutations
4. Invalid/missing tokens result in `403 Forbidden`

**Protected Routes:**
- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/cv` - CV operations
- `/api/upload` - File uploads
- `/api/ai/generate` - AI content generation

### 3. Environment Variable Validation (Fail-Fast)

The application validates critical environment variables at startup and exits immediately if any are missing.

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT token signing

**Optional but Recommended:**
- `FRONTEND_URL` - CORS whitelist (defaults to `http://localhost:3000`)
- `REFRESH_TOKEN_SECRET` - Secret for refresh tokens
- `NODE_ENV` - Environment (development/production)

**Behavior:**
- Missing required variables → Application exits with error code 1
- Clear error messages indicate which variables are missing
- Prevents silent failures with dummy/placeholder values

### 4. Security Headers (Helmet)

Enhanced security headers protect against common web vulnerabilities.

**Implemented Headers:**
- **Content-Security-Policy**: Restricts resource loading to prevent XSS
- **HSTS**: Forces HTTPS connections (1 year max-age)
- **X-Frame-Options**: Prevents clickjacking (`DENY`)
- **Referrer-Policy**: Controls referrer information leakage
- **X-Content-Type-Options**: Prevents MIME-sniffing
- **X-DNS-Prefetch-Control**: Controls DNS prefetching

## 🛡️ Security Best Practices

### JWT Tokens
- Use strong secrets (minimum 32 characters)
- Rotate secrets regularly in production
- Set appropriate expiration times
- Store tokens securely (httpOnly cookies recommended)

### Passwords
- Minimum 12 characters required for registration
- Hashed with bcrypt (10 salt rounds)
- Never logged or stored in plain text

### HTTPS
- Always use HTTPS in production
- HSTS header enforces HTTPS connections
- Redirect HTTP to HTTPS at reverse proxy level

### Rate Limiting
- Consider implementing rate limiting for auth endpoints
- Use `rate-limiter-flexible` package (already installed)

## 🧪 Testing Security

### CORS Testing
```bash
# Should succeed - allowed origin
curl -H "Origin: http://localhost:3000" http://localhost:5000/api/auth/csrf-token

# Should fail - disallowed origin
curl -H "Origin: https://attacker.com" http://localhost:5000/api/auth/csrf-token
```

### CSRF Testing
```bash
# Step 1: Get CSRF token
TOKEN=$(curl -s http://localhost:5000/api/auth/csrf-token | jq -r '.csrfToken')

# Step 2: Make protected request with token (should succeed)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -d '{"email":"test@example.com","password":"test123456789"}'

# Step 3: Make protected request without token (should fail with 403)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456789"}'
```

### ENV Validation Testing
```bash
# Should crash with error
unset DATABASE_URL
npm start

# Expected output:
# ❌ FATAL: Missing required environment variable: DATABASE_URL
# Process exits with code 1
```

## 📚 References

- [OWASP CORS Guide](https://owasp.org/www-community/Cross-Origin_Resource_Sharing)
- [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Helmet Documentation](https://helmetjs.github.io/)
- [csurf Documentation](https://github.com/expressjs/csurf)

## 🚨 Security Incidents

If you discover a security vulnerability, please email security@moncvpro.com instead of using the issue tracker.

## 🔄 Updates

Last updated: 2024-01
Security review: Pending
Next review: TBD

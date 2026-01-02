# API Security Documentation

## Overview
The Backend API implements comprehensive security measures including rate limiting, CORS policies, security headers, and request validation to protect against common attacks and abuse.

---

## Rate Limiting

### Global Rate Limiting
All API endpoints are protected by a global rate limiter:
- **Limit:** 100 requests per 15 minutes per IP address
- **Storage:** In-Memory (upgradeable to Redis)
- **Purpose:** Protect against DoS attacks and general abuse

### Endpoint-Specific Rate Limits

#### Authentication Endpoints

**Login (`/api/auth/login`)**
- **Limit:** 5 attempts per 15 minutes
- **Block Duration:** 15 minutes
- **Purpose:** Prevent brute-force password attacks
- **Headers:**
  ```
  X-RateLimit-Limit: 5
  X-RateLimit-Remaining: 4
  X-RateLimit-Reset: 2024-01-02T12:15:00.000Z
  ```

**Register (`/api/auth/register`)**
- **Limit:** 3 attempts per hour
- **Block Duration:** 1 hour
- **Purpose:** Prevent spam account creation
- **Headers:**
  ```
  X-RateLimit-Limit: 3
  X-RateLimit-Remaining: 2
  X-RateLimit-Reset: 2024-01-02T13:00:00.000Z
  ```

#### Upload Endpoint (`/api/upload`)
- **Limit:** 10 uploads per hour
- **Block Duration:** 1 hour
- **Purpose:** Prevent storage abuse and DoS via large files
- **Headers:**
  ```
  X-RateLimit-Limit: 10
  X-RateLimit-Remaining: 9
  X-RateLimit-Reset: 2024-01-02T13:00:00.000Z
  ```

#### AI Generation (`/api/ai/generate`)
- **Limit:** 20 requests per hour
- **Block Duration:** 1 hour
- **Purpose:** Prevent AI API quota abuse and cost overruns
- **Headers:**
  ```
  X-RateLimit-Limit: 20
  X-RateLimit-Remaining: 19
  X-RateLimit-Reset: 2024-01-02T13:00:00.000Z
  ```

### Rate Limit Response Headers

All responses include the following headers:

| Header | Description | Example |
|--------|-------------|---------|
| `X-RateLimit-Limit` | Maximum requests allowed in window | `100` |
| `X-RateLimit-Remaining` | Requests remaining in current window | `95` |
| `X-RateLimit-Reset` | ISO timestamp when limit resets | `2024-01-02T12:15:00.000Z` |
| `Retry-After` | Seconds until retry (only when limited) | `900` |

### Rate Limit Exceeded Response

**Status Code:** `429 Too Many Requests`

**Response Body:**
```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in 900 seconds.",
  "retryAfter": 900
}
```

**Response Headers:**
```
HTTP/1.1 429 Too Many Requests
Retry-After: 900
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-01-02T12:15:00.000Z
Content-Type: application/json
```

### Example: Testing Rate Limits

**Using cURL:**
```bash
# Test login rate limit (attempt 6 times)
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password123"}' \
    -i
  echo "\n---\n"
  sleep 1
done
```

**Expected Behavior:**
- Requests 1-5: Normal response (200, 400, or 401)
- Request 6: `429 Too Many Requests` with `Retry-After` header

---

## CORS Policy

### Allowed Origins
The API enforces strict CORS policies to prevent unauthorized cross-origin requests:

**Development:**
- `http://localhost:3000`
- `http://localhost:3001`

**Production:**
- `https://moncvpro.pages.dev`

**Custom Origins:**
Set via environment variable:
```env
ALLOWED_ORIGINS=https://app.example.com,https://app2.example.com
```

### CORS Configuration
```javascript
{
  origin: <dynamic based on environment>,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After'],
  maxAge: 3600,
  optionsSuccessStatus: 204
}
```

### CORS Error Response
When a request is blocked by CORS:

**Status Code:** `403 Forbidden` or browser-level CORS error

**Browser Console:**
```
Access to fetch at 'http://localhost:5000/api/auth/login' from origin 'http://malicious-site.com' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Server Logs:**
```
[CORS] Blocked request from origin: http://malicious-site.com
```

---

## Security Headers (Helmet)

The API includes comprehensive security headers via Helmet.js:

### Content Security Policy (CSP)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self';
  font-src 'self';
  object-src 'none';
  media-src 'self';
  frame-src 'none'
```

### HTTP Strict Transport Security (HSTS)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
- Forces HTTPS connections for 1 year
- Applies to all subdomains
- Can be preloaded in browsers

### Frame Protection
```
X-Frame-Options: DENY
```
- Prevents clickjacking attacks
- Disallows embedding in iframes

### Content Type Sniffing Protection
```
X-Content-Type-Options: nosniff
```
- Prevents MIME-type sniffing attacks
- Forces browser to respect declared content types

### XSS Protection
```
X-XSS-Protection: 1; mode=block
```
- Enables browser XSS filtering
- Blocks page if attack detected

### Referrer Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
- Controls referrer information sent with requests
- Enhances privacy

### Hide Server Information
```
X-Powered-By: <removed>
```
- Hides Express.js version information
- Reduces information disclosure

---

## Request Size Limits

### Body Size Restrictions
To prevent payload attacks and memory exhaustion:

**JSON Bodies:**
```javascript
app.use(express.json({ limit: '1mb' }))
```

**URL-Encoded Bodies:**
```javascript
app.use(express.urlencoded({ limit: '1mb', extended: true }))
```

**Environment Configuration:**
```env
REQUEST_SIZE_LIMIT=1mb
```

### Oversized Request Response

**Status Code:** `413 Payload Too Large`

**Response:**
```json
{
  "error": "Request entity too large"
}
```

**Server Logs:**
```
[SECURITY] Large request body detected: 2097152 bytes from IP: 192.168.1.1
```

---

## Security Logging

### Logged Events

#### 1. Sensitive Route Access
All requests to authentication, upload, and AI routes are logged in production:
```
[SECURITY LOG] 2024-01-02T12:00:00.000Z - POST /api/auth/login - IP: 192.168.1.1
```

#### 2. Failed Authentication
```
[SECURITY ALERT] 2024-01-02T12:00:00.000Z - POST /api/auth/login - Status: 401 - IP: 192.168.1.1
```

#### 3. Rate Limit Violations
```
[RATE LIMIT] 2024-01-02T12:00:00.000Z - IP: 192.168.1.1 - Route: Auth Login - Retry after: 900s
```

#### 4. Potential Abuse Detection
```
[SECURITY ALERT] Potential abuse detected from IP: 192.168.1.1 on route: Auth Login
```

#### 5. Large Request Bodies
```
[SECURITY] Large request body detected: 2097152 bytes from IP: 192.168.1.1
```

#### 6. CORS Violations
```
[CORS] Blocked request from origin: http://malicious-site.com
```

### Log Levels
- **INFO:** Normal sensitive route access (production only)
- **WARN:** Failed auth attempts, rate limits, large bodies
- **ERROR:** Potential abuse, repeated violations

---

## IP Detection Strategy

The rate limiter detects client IPs using the following priority order:

1. `X-Forwarded-For` header (first IP in chain)
2. `X-Real-IP` header
3. `req.connection.remoteAddress`
4. `req.socket.remoteAddress`
5. `req.ip` (Express default)

This ensures accurate rate limiting when behind proxies like:
- Nginx
- Cloudflare
- AWS ALB/NLB
- Google Cloud Load Balancer

**Example Behind Cloudflare:**
```
X-Forwarded-For: 203.0.113.1, 198.51.100.1
X-Real-IP: 203.0.113.1
```
Rate limiter uses: `203.0.113.1` (actual client IP)

---

## Environment Variables

### Required Variables
```env
NODE_ENV=production
JWT_SECRET=your_secret_key_minimum_32_characters_long
DATABASE_URL=postgresql://user:password@localhost:5432/database
PORT=5000
```

### Rate Limiting (Optional - with defaults)
```env
# Global rate limit window in milliseconds (default: 900000 = 15 minutes)
RATE_LIMIT_WINDOW_MS=900000

# Maximum requests in global window (default: 100)
RATE_LIMIT_MAX_REQUESTS=100

# Login attempts allowed (default: 5)
AUTH_LOGIN_ATTEMPTS=5

# Register attempts allowed (default: 3)
AUTH_REGISTER_ATTEMPTS=3

# Upload requests allowed per hour (default: 10)
UPLOAD_REQUESTS_LIMIT=10

# AI generation requests per hour (default: 20)
AI_GENERATE_REQUESTS_LIMIT=20
```

### CORS Configuration (Optional)
```env
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=http://localhost:3000,https://moncvpro.pages.dev
```

### Security Settings (Optional)
```env
# Maximum request body size (default: 1mb)
REQUEST_SIZE_LIMIT=1mb
```

---

## Best Practices

### For Production Deployment

1. **Set Production Environment**
   ```env
   NODE_ENV=production
   ```

2. **Configure Allowed Origins**
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com
   ```
   Never use wildcards (`*`) in production.

3. **Use Strong JWT Secret**
   ```bash
   openssl rand -base64 32
   ```
   Minimum 32 characters, maximum entropy.

4. **Monitor Security Logs**
   - Set up log aggregation (e.g., ELK, Datadog, CloudWatch)
   - Create alerts for repeated 429 responses
   - Track IPs with multiple failed auth attempts

5. **Consider Redis for Rate Limiting**
   For distributed/horizontal scaling:
   ```javascript
   import { RateLimiterRedis } from 'rate-limiter-flexible';
   import Redis from 'ioredis';
   
   const redisClient = new Redis(process.env.REDIS_URL);
   const limiter = new RateLimiterRedis({
     storeClient: redisClient,
     points: 100,
     duration: 900
   });
   ```

6. **Enable HTTPS**
   - Use Let's Encrypt certificates
   - Configure HSTS headers (already enabled)
   - Redirect HTTP to HTTPS at load balancer/proxy level

7. **Implement IP Whitelisting** (Optional)
   For admin endpoints:
   ```javascript
   const adminIPs = process.env.ADMIN_IPS?.split(',') || [];
   app.use('/api/admin', (req, res, next) => {
     const clientIP = getClientIp(req);
     if (!adminIPs.includes(clientIP)) {
       return res.status(403).json({ error: 'Forbidden' });
     }
     next();
   });
   ```

### For Development

1. **Use `.env.example` as Template**
   ```bash
   cp .env.example .env
   ```

2. **Relaxed Rate Limits**
   ```env
   RATE_LIMIT_MAX_REQUESTS=1000
   AUTH_LOGIN_ATTEMPTS=50
   ```

3. **Allow Localhost Origins**
   ```env
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

---

## Testing Security Features

### 1. Test Rate Limiting
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Send 10 concurrent requests
ab -n 10 -c 10 -p data.json -T application/json \
   http://localhost:5000/api/auth/login
```

### 2. Test CORS
```javascript
// Try from browser console on unauthorized origin
fetch('http://localhost:5000/api/cv', {
  method: 'GET',
  credentials: 'include'
}).then(r => console.log(r)).catch(e => console.error(e));
```

### 3. Test Security Headers
```bash
curl -I http://localhost:5000/
# Check for:
# - Strict-Transport-Security
# - X-Frame-Options
# - X-Content-Type-Options
# - Content-Security-Policy
```

### 4. Test Large Payload
```bash
# Generate 2MB JSON file
node -e "console.log(JSON.stringify({data: 'x'.repeat(2097152)}))" > large.json

# Try to send it
curl -X POST http://localhost:5000/api/cv \
  -H "Content-Type: application/json" \
  -d @large.json
```

---

## Troubleshooting

### Rate Limit Not Working
1. **Check Middleware Order**
   Ensure rate limiters are applied before route handlers.

2. **Verify IP Detection**
   ```javascript
   console.log('Client IP:', getClientIp(req));
   ```

3. **Check Environment Variables**
   ```javascript
   console.log('Rate limit config:', {
     points: process.env.RATE_LIMIT_MAX_REQUESTS,
     window: process.env.RATE_LIMIT_WINDOW_MS
   });
   ```

### CORS Errors
1. **Verify Origin**
   Check `ALLOWED_ORIGINS` includes your frontend domain.

2. **Check Credentials**
   Frontend must set:
   ```javascript
   fetch(url, { credentials: 'include' })
   ```

3. **Preflight Requests**
   Ensure OPTIONS requests are not blocked by other middleware.

### Security Headers Missing
1. **Check Helmet Configuration**
   Verify helmet middleware is applied early in chain.

2. **Test with curl**
   ```bash
   curl -I http://localhost:5000/ | grep -E "X-|Strict|Content-Security"
   ```

---

## Security Checklist

- [ ] `NODE_ENV=production` in production
- [ ] Strong JWT_SECRET (32+ characters)
- [ ] ALLOWED_ORIGINS configured (no wildcards)
- [ ] Rate limiting enabled on all sensitive routes
- [ ] Security logging enabled and monitored
- [ ] HTTPS enforced (at load balancer level)
- [ ] Database credentials secured (not in code)
- [ ] Helmet headers configured
- [ ] Request size limits enforced
- [ ] Regular dependency updates (`npm audit`)
- [ ] Error messages don't leak sensitive info
- [ ] Authentication tokens use secure storage (httpOnly cookies or secure headers)

---

## Additional Resources

- [Backend Security Documentation](backend/SECURITY.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## Contact

For security vulnerabilities, please contact the security team directly:
**Email:** security@moncvpro.com (replace with actual email)

Do not open public GitHub issues for security vulnerabilities.

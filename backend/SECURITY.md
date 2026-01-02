# Security Configuration

## Rate Limiting

This backend implements comprehensive rate limiting to protect against abuse and attacks.

### Global Rate Limiting
- **Limit**: 100 requests per 15 minutes per IP
- **Applies to**: All API endpoints
- **Storage**: In-Memory (can be upgraded to Redis for distributed systems)

### Route-Specific Rate Limiting

#### Authentication Routes

**Login (`/api/auth/login`)**
- **Limit**: 5 attempts per 15 minutes
- **Block Duration**: 15 minutes after exceeding limit
- **Purpose**: Prevent brute-force attacks

**Register (`/api/auth/register`)**
- **Limit**: 3 attempts per hour
- **Block Duration**: 1 hour after exceeding limit
- **Purpose**: Prevent spam account creation

#### Upload Route (`/api/upload`)
- **Limit**: 10 uploads per hour
- **Block Duration**: 1 hour after exceeding limit
- **Purpose**: Prevent storage abuse and DoS attacks

### Rate Limit Response

When rate limit is exceeded, the API returns:
```json
{
  "success": false,
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in X seconds.",
  "retryAfter": 900
}
```

**Response Headers:**
- `Retry-After`: Seconds until the client can retry
- `X-RateLimit-Limit`: Maximum number of requests allowed
- `X-RateLimit-Remaining`: Number of requests remaining
- `X-RateLimit-Reset`: ISO timestamp when the limit resets

## CORS Configuration

### Allowed Origins
- Development: `http://localhost:3000`, `http://localhost:3001`
- Production: `https://moncvpro.pages.dev`
- Custom: Set via `ALLOWED_ORIGINS` environment variable

### CORS Settings
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Content-Type, Authorization, x-auth-token, X-Requested-With
- **Max Age**: 3600 seconds (1 hour)

### Exposed Headers
- X-RateLimit-Limit
- X-RateLimit-Remaining
- X-RateLimit-Reset
- Retry-After

## Helmet Security Headers

### Content Security Policy (CSP)
- `default-src`: 'self'
- `script-src`: 'self'
- `style-src`: 'self', 'unsafe-inline'
- `img-src`: 'self', data:, https:
- `connect-src`: 'self'
- `font-src`: 'self'
- `object-src`: 'none'
- `media-src`: 'self'
- `frame-src`: 'none'

### HTTP Strict Transport Security (HSTS)
- **Max Age**: 31536000 seconds (1 year)
- **Include Subdomains**: Yes
- **Preload**: Yes

### Other Security Headers
- **X-Frame-Options**: DENY
- **X-Content-Type-Options**: nosniff
- **X-XSS-Protection**: Enabled
- **Referrer-Policy**: strict-origin-when-cross-origin
- **X-Powered-By**: Hidden

## Request Size Limits

- **JSON Body**: 1MB (configurable via `REQUEST_SIZE_LIMIT`)
- **URL-encoded Body**: 1MB
- **Purpose**: Prevent payload attacks and memory exhaustion

Large requests (>1MB) are logged with a security warning.

## Security Logging

### Logged Events
- All requests to sensitive routes (`/api/auth/*`, `/api/upload`)
- Failed authentication attempts (401, 403)
- Rate limit violations (429)
- Large request bodies (>1MB)

### Log Format
```
[SECURITY LOG] 2024-01-02T12:00:00.000Z - POST /api/auth/login - IP: 192.168.1.1
[SECURITY ALERT] 2024-01-02T12:00:00.000Z - POST /api/auth/login - Status: 429 - IP: 192.168.1.1
[RATE LIMIT] 2024-01-02T12:00:00.000Z - IP: 192.168.1.1 - Route: Auth Login - Retry after: 900s
```

### Production Alerts
In production mode, potential abuse is flagged with additional alerts:
```
[SECURITY ALERT] Potential abuse detected from IP: 192.168.1.1 on route: Auth Login
```

## Environment Variables

### Required
```env
NODE_ENV=production
JWT_SECRET=your_secret_key_min_32_chars
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

### Rate Limiting (Optional - with defaults)
```env
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100          # Global limit
AUTH_LOGIN_ATTEMPTS=5                # Login attempts
AUTH_REGISTER_ATTEMPTS=3             # Register attempts
UPLOAD_REQUESTS_LIMIT=10             # Upload limit
```

### CORS (Optional)
```env
ALLOWED_ORIGINS=http://localhost:3000,https://moncvpro.pages.dev
```

### Security (Optional)
```env
REQUEST_SIZE_LIMIT=1mb               # Max request body size
```

## IP Detection

The rate limiter detects client IPs in the following order:
1. `X-Forwarded-For` header (first IP)
2. `X-Real-IP` header
3. `req.connection.remoteAddress`
4. `req.socket.remoteAddress`
5. `req.ip`

This ensures proper rate limiting behind proxies (nginx, Cloudflare, etc.).

## Best Practices

### Production Deployment
1. Set `NODE_ENV=production`
2. Configure `ALLOWED_ORIGINS` with your production domains only
3. Use a strong `JWT_SECRET` (min 32 characters)
4. Consider upgrading to Redis for rate limiting in distributed systems
5. Monitor security logs regularly
6. Set up alerts for repeated rate limit violations

### Redis Integration (Optional)
To use Redis instead of in-memory storage:

```javascript
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,
  duration: 900,
});
```

### Monitoring
- Track 429 responses in your monitoring system
- Set up alerts for unusual patterns
- Review security logs regularly
- Consider integrating with a SIEM system

## Testing Rate Limits

### Using curl
```bash
# Test login rate limit
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"password"}'
  echo ""
done
```

### Expected Behavior
- First 5 requests: Normal response
- 6th request: 429 status with Retry-After header

## Troubleshooting

### Rate Limit Not Working
1. Check that middleware is imported correctly
2. Verify environment variables are loaded
3. Ensure requests come from the same IP (check IP detection)

### CORS Errors
1. Verify `ALLOWED_ORIGINS` includes your frontend domain
2. Check browser console for specific CORS error
3. Ensure credentials are properly configured in frontend requests

### Logging Not Appearing
1. Verify `NODE_ENV` is set correctly
2. Check console output destination
3. Ensure sensitive routes match logging patterns

## Security Updates

Keep dependencies updated regularly:
```bash
npm audit
npm audit fix
npm update
```

## Contact

For security issues, please contact the security team immediately rather than opening a public issue.

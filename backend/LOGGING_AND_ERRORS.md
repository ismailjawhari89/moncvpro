# Unified Logging & Error Handling System

## Overview
This document describes the comprehensive logging and error handling system implemented in the backend API.

---

## 🎯 Key Features

### 1. Structured Logging
- **Color-coded console output** for easy debugging
- **File-based logging** with daily rotation
- **Separate error logs** for critical issues
- **Contextual metadata** in all logs
- **Production-ready** logging levels

### 2. Custom Error Classes
- **AppError** - Base error class
- **ValidationError** - Input validation failures (400)
- **AuthenticationError** - Authentication failures (401)
- **AuthorizationError** - Authorization failures (403)
- **NotFoundError** - Resource not found (404)
- **ConflictError** - Resource conflicts (409)
- **RateLimitError** - Rate limit exceeded (429)
- **InternalServerError** - Server errors (500)
- **DatabaseError** - Database operation failures (500)
- **ExternalServiceError** - External API failures (502)

### 3. Global Error Handler
- Catches all errors
- Formats consistent error responses
- Logs errors with full context
- Hides sensitive information in production
- Handles operational vs non-operational errors

### 4. Async Error Handling
- **asyncHandler** wrapper for async route handlers
- Automatic error catching and forwarding
- No more try-catch blocks in controllers

---

## 📚 Logger Usage

### Import Logger
```javascript
import logger from '../utils/logger.js';
```

### Log Levels

#### ERROR - Critical Errors
```javascript
logger.error('Database connection failed', error, {
    operation: 'connect',
    database: 'postgres',
    attempt: 3
});
```

#### WARN - Warning Messages
```javascript
logger.warn('User attempted invalid operation', {
    userId: user.id,
    operation: 'delete_admin',
    ip: req.ip
});
```

#### INFO - Important Events
```javascript
logger.info('User registered successfully', {
    userId: user.id,
    email: user.email,
    ip: req.ip
});
```

#### DEBUG - Development Information
```javascript
logger.debug('Processing payment', {
    orderId: order.id,
    amount: order.total,
    gateway: 'stripe'
});
```

#### SECURITY - Security Events
```javascript
logger.security('Suspicious activity detected', {
    type: 'MULTIPLE_FAILED_LOGINS',
    ip: req.ip,
    attempts: 10
});
```

### HTTP Request Logging
```javascript
// Automatically logged by requestLogger middleware
logger.http(req, res, duration);
// Output: GET /api/users 200 - 45ms - 192.168.1.1
```

### Specialized Security Logging
```javascript
// Rate limit violation
logger.rateLimit(ip, 'Auth Login', 900);

// Authentication failure
logger.authFailure('LOGIN', email, ip, 'Invalid credentials');

// CORS violation
logger.corsViolation(origin, ip);

// Suspicious activity
logger.suspiciousActivity('BRUTE_FORCE', ip, {
    attempts: 20,
    route: '/api/auth/login'
});
```

---

## 🚨 Error Handling

### Using Custom Errors

#### In Controllers (with asyncHandler)
```javascript
import { asyncHandler } from '../middleware/errorMiddleware.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        throw new ValidationError('User ID is required');
    }
    
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
        throw new NotFoundError('User not found');
    }
    
    res.json({ success: true, user });
});
```

#### Without asyncHandler (manual error forwarding)
```javascript
export const updateUser = (req, res, next) => {
    try {
        // ... your logic
        if (error) {
            throw new ValidationError('Invalid data');
        }
    } catch (error) {
        next(error); // Forward to error handler
    }
};
```

### Error Response Format

#### Successful Response
```json
{
  "success": true,
  "data": { ... }
}
```

#### Error Response (Production)
```json
{
  "success": false,
  "error": "User not found",
  "statusCode": 404,
  "timestamp": "2024-01-02T12:00:00.000Z"
}
```

#### Error Response (Development)
```json
{
  "success": false,
  "error": "User not found",
  "statusCode": 404,
  "timestamp": "2024-01-02T12:00:00.000Z",
  "stack": "Error: User not found\n    at ...",
  "isOperational": true
}
```

#### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "statusCode": 400,
  "timestamp": "2024-01-02T12:00:00.000Z",
  "errors": [
    {
      "field": "email",
      "message": "Please include a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## 📂 Log Files

### Directory Structure
```
backend/
└── logs/
    ├── 2024-01-02.log          # All logs for the day
    ├── 2024-01-02-errors.log   # Only ERROR and SECURITY logs
    ├── 2024-01-03.log
    └── 2024-01-03-errors.log
```

### Log Format
```
[2024-01-02T12:00:00.000Z] [INFO] User logged in successfully {"userId":"abc123","email":"user@example.com","ip":"192.168.1.1"}
[2024-01-02T12:01:00.000Z] [ERROR] Database error during user creation {"error":{"message":"Connection timeout","stack":"..."},"email":"user@example.com","ip":"192.168.1.1"}
[2024-01-02T12:02:00.000Z] [SECURITY] Rate limit exceeded {"ip":"192.168.1.100","route":"Auth Login","retryAfter":"900s","type":"RATE_LIMIT"}
```

### Log Rotation
- New log file created daily
- Separate error logs for easy monitoring
- Logs are **not** committed to Git (in `.gitignore`)

---

## 🛠️ Middleware Integration

### Application Flow
```javascript
// src/index.js
import { requestLogger } from './middleware/loggingMiddleware.js';
import { notFoundHandler, errorHandler, handleUncaughtErrors } from './middleware/errorMiddleware.js';

handleUncaughtErrors(); // Setup global error handlers

const app = express();

// Logging middleware (first)
app.use(requestLogger);

// ... other middleware ...

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 404 handler (after all routes)
app.use(notFoundHandler);

// Global error handler (last)
app.use(errorHandler);
```

### Middleware Order
1. **requestLogger** - Log all HTTP requests
2. **securityLogger** - Log security-related events
3. **corsMiddleware** - CORS handling
4. **helmetMiddleware** - Security headers
5. **bodyParsers** - Parse request bodies
6. **globalRateLimit** - Rate limiting
7. **Routes** - Application routes
8. **notFoundHandler** - 404 errors
9. **errorHandler** - Catch all errors

---

## 🔍 Monitoring & Debugging

### Console Output (Development)
Logs are color-coded for easy identification:
- **ERROR** - Red
- **WARN** - Yellow
- **INFO** - Cyan
- **DEBUG** - Magenta
- **SECURITY** - Bright Red

### Production Monitoring

#### Watch Live Logs
```bash
# All logs
tail -f logs/$(date +%Y-%m-%d).log

# Only errors
tail -f logs/$(date +%Y-%m-%d)-errors.log

# Filter by log level
grep "\[ERROR\]" logs/$(date +%Y-%m-%d).log
grep "\[SECURITY\]" logs/$(date +%Y-%m-%d).log
```

#### Search Logs
```bash
# Find all errors from specific IP
grep "192.168.1.100" logs/2024-01-02-errors.log

# Find all authentication failures
grep "AUTH_FAILURE" logs/2024-01-02.log

# Find all rate limit violations
grep "RATE_LIMIT" logs/2024-01-02.log
```

#### Log Analysis
```bash
# Count errors by type
grep "\[ERROR\]" logs/*.log | cut -d' ' -f4- | sort | uniq -c | sort -rn

# Most active IPs
grep -h "ip" logs/*.log | grep -o '"ip":"[^"]*"' | sort | uniq -c | sort -rn

# Request distribution by endpoint
grep "\[INFO\]" logs/*.log | grep -o '"url":"[^"]*"' | sort | uniq -c | sort -rn
```

---

## 📊 Error Types & HTTP Status Codes

| Error Class | Status Code | Use Case |
|------------|-------------|----------|
| ValidationError | 400 | Invalid input data |
| AuthenticationError | 401 | Login failed, invalid token |
| AuthorizationError | 403 | Insufficient permissions |
| NotFoundError | 404 | Resource doesn't exist |
| ConflictError | 409 | Duplicate resource |
| RateLimitError | 429 | Too many requests |
| InternalServerError | 500 | Unexpected server error |
| DatabaseError | 500 | Database operation failed |
| ExternalServiceError | 502 | Third-party API failed |

---

## 🎯 Best Practices

### 1. Always Use asyncHandler
```javascript
// ✅ Good
export const getUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) throw new NotFoundError('User not found');
    res.json({ success: true, user });
});

// ❌ Bad (missing try-catch or asyncHandler)
export const getUser = async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    res.json({ user });
};
```

### 2. Log with Context
```javascript
// ✅ Good - Includes context
logger.info('User created', {
    userId: user.id,
    email: user.email,
    ip: req.ip,
    referrer: req.headers.referer
});

// ❌ Bad - No context
logger.info('User created');
```

### 3. Use Appropriate Error Classes
```javascript
// ✅ Good - Specific error
if (!user) throw new NotFoundError('User not found');

// ❌ Bad - Generic error
if (!user) throw new Error('User not found');
```

### 4. Never Log Sensitive Data
```javascript
// ✅ Good - Sensitive data masked
logger.info('User authenticated', {
    userId: user.id,
    email: user.email,
    // password NOT logged
});

// ❌ Bad - Logging password
logger.info('User authenticated', {
    email: user.email,
    password: req.body.password // NEVER DO THIS
});
```

### 5. Use Structured Logging
```javascript
// ✅ Good - Structured with metadata
logger.error('Payment processing failed', error, {
    orderId: order.id,
    amount: order.total,
    gateway: 'stripe',
    customerId: customer.id
});

// ❌ Bad - Unstructured string
logger.error(`Payment failed for order ${order.id}`);
```

---

## 🔧 Configuration

### Environment Variables
```env
# Logging
NODE_ENV=production           # Controls log verbosity
LOG_LEVEL=info               # Minimum log level (optional)
```

### Log Levels by Environment
- **Development**: All levels (ERROR, WARN, INFO, DEBUG, SECURITY)
- **Production**: ERROR, WARN, INFO, SECURITY only (no DEBUG)
- **Test**: Minimal logging (file logging disabled)

---

## 🚀 Advanced Usage

### Custom Error with Additional Data
```javascript
const error = new AppError('Operation failed', 400, true);
error.details = {
    operation: 'payment',
    provider: 'stripe',
    reason: 'insufficient_funds'
};
throw error;
```

### Conditional Logging
```javascript
if (process.env.NODE_ENV === 'production') {
    logger.security('Admin action performed', {
        action: 'delete_user',
        adminId: req.user.id,
        targetUserId: targetUser.id
    });
}
```

### Error Recovery
```javascript
try {
    await externalAPI.call();
} catch (error) {
    logger.error('External API call failed', error, {
        service: 'payment-gateway',
        retrying: true
    });
    
    // Retry logic
    await retryWithBackoff();
}
```

---

## 🔍 Troubleshooting

### Log Files Not Created
1. Check directory permissions: `chmod 755 backend/logs`
2. Ensure logger is imported: `import logger from './utils/logger.js'`
3. Verify NODE_ENV is not 'test'

### Errors Not Being Caught
1. Ensure error handler is **last** middleware
2. Use `asyncHandler` wrapper for async functions
3. Always call `next(error)` to forward errors

### Logs Too Verbose
1. Set `NODE_ENV=production` to reduce DEBUG logs
2. Implement log level filtering if needed

### Color Codes in Log Files
- Log files contain ANSI color codes
- Use `cat` or text editors that support ANSI
- Or strip colors: `cat logs/file.log | sed 's/\x1b\[[0-9;]*m//g'`

---

## 📈 Metrics & Analytics

### Track Important Events
- User registrations/logins
- Failed authentication attempts
- Rate limit violations
- API errors (500s)
- Slow requests (>1000ms)
- Large payloads (>1MB)

### Recommended Monitoring Tools
- **Development**: Console + log files
- **Production**: 
  - ELK Stack (Elasticsearch, Logstash, Kibana)
  - Datadog
  - New Relic
  - CloudWatch (AWS)
  - Google Cloud Logging

---

## ✅ Testing

### Test Error Responses
```bash
# Test 404
curl http://localhost:5000/api/nonexistent

# Test validation error
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid"}'

# Test rate limit
for i in {1..10}; do
  curl http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
```

### Check Logs
```bash
# Verify logs are being created
ls -lah backend/logs/

# Check today's logs
cat backend/logs/$(date +%Y-%m-%d).log

# Check errors
cat backend/logs/$(date +%Y-%m-%d)-errors.log
```

---

## 📚 Related Documentation

- [Security Documentation](./SECURITY.md)
- [API Security](../API_SECURITY.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

---

## 🎓 Summary

### What's Unified
- ✅ All logging goes through central logger
- ✅ All errors use custom error classes
- ✅ All HTTP requests logged consistently
- ✅ All security events tracked
- ✅ All error responses formatted uniformly

### Benefits
- **Easier debugging** with structured logs
- **Better monitoring** with consistent format
- **Improved security** with detailed tracking
- **Cleaner code** with asyncHandler
- **Production-ready** logging and error handling

### Quick Reference
```javascript
// Import
import logger from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

// Use in controller
export const myHandler = asyncHandler(async (req, res) => {
    logger.info('Operation started', { userId: req.user.id });
    
    const item = await findItem(id);
    if (!item) throw new NotFoundError('Item not found');
    
    res.json({ success: true, item });
});
```

---

**Implementation Date:** January 2, 2024  
**Status:** ✅ Complete  
**Version:** 1.0.0

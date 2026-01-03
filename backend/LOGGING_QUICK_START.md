# Unified Logging & Error Handling - Quick Start Guide 🚀

## ⚡ Quick Reference

### Import What You Need
```javascript
// Logger
import logger from '../utils/logger.js';

// Error classes
import { 
    ValidationError,      // 400 - Bad input
    AuthenticationError,  // 401 - Auth failed
    NotFoundError,        // 404 - Not found
    ConflictError,        // 409 - Already exists
    RateLimitError       // 429 - Too many requests
} from '../utils/errors.js';

// Async handler
import { asyncHandler } from '../middleware/errorMiddleware.js';
```

---

## 📝 Basic Usage in Controllers

### Old Way ❌
```javascript
export const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
```

### New Way ✅
```javascript
export const getUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    
    if (!user) {
        throw new NotFoundError('User not found');
    }
    
    logger.info('User retrieved', { userId: user.id, ip: req.ip });
    res.json({ success: true, user });
});
```

---

## 🎯 Common Patterns

### 1. Validation Error
```javascript
export const createUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        throw new ValidationError('Email and password are required');
    }
    
    // Continue with user creation...
});
```

### 2. Not Found Error
```javascript
export const getUser = asyncHandler(async (req, res) => {
    const user = await findUser(req.params.id);
    
    if (!user) {
        throw new NotFoundError('User not found');
    }
    
    res.json({ success: true, user });
});
```

### 3. Conflict Error
```javascript
export const register = asyncHandler(async (req, res) => {
    const existing = await findUserByEmail(req.body.email);
    
    if (existing) {
        throw new ConflictError('User already exists');
    }
    
    // Continue with registration...
});
```

### 4. Authentication Error
```javascript
export const login = asyncHandler(async (req, res) => {
    const user = await findUserByEmail(req.body.email);
    
    if (!user || !await comparePassword(req.body.password, user.password)) {
        throw new AuthenticationError('Invalid credentials');
    }
    
    // Continue with login...
});
```

---

## 📊 Logging Examples

### Info Logging
```javascript
logger.info('User registered successfully', {
    userId: user.id,
    email: user.email,
    ip: req.ip
});
```

### Warning Logging
```javascript
logger.warn('Suspicious login attempt', {
    email: req.body.email,
    ip: req.ip,
    attempts: 5
});
```

### Error Logging
```javascript
try {
    await externalAPI.call();
} catch (error) {
    logger.error('External API call failed', error, {
        service: 'payment-gateway',
        orderId: order.id
    });
    throw new ExternalServiceError('payment-gateway', 'Payment processing failed');
}
```

### Security Logging
```javascript
logger.security('Admin action performed', {
    action: 'delete_user',
    adminId: req.user.id,
    targetUserId: userId,
    ip: req.ip
});
```

---

## 🧪 Testing

### Run Test Script
```bash
cd backend
node test-logging.js
```

### Check Logs
```bash
# View today's logs
cat logs/$(date +%Y-%m-%d).log

# View errors only
cat logs/$(date +%Y-%m-%d)-errors.log

# Follow live logs
tail -f logs/$(date +%Y-%m-%d).log
```

---

## 🎯 HTTP Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "User not found",
  "statusCode": 404,
  "timestamp": "2024-01-02T12:00:00.000Z"
}
```

---

## 📁 Log Files Location

```
backend/
└── logs/
    ├── 2024-01-02.log          # All logs for the day
    ├── 2024-01-02-errors.log   # Only ERROR and SECURITY logs
    ├── 2024-01-03.log
    └── 2024-01-03-errors.log
```

---

## ⚠️ Important Rules

### ✅ DO
- Use `asyncHandler` for all async route handlers
- Throw custom error classes (ValidationError, NotFoundError, etc.)
- Log important events with context
- Include IP address in security-related logs
- Use structured logging with metadata

### ❌ DON'T
- Use try-catch in every controller (asyncHandler does this)
- Log sensitive data (passwords, tokens, etc.)
- Use console.log/console.error directly
- Return different error response formats
- Throw generic Error objects

---

## 🔗 Full Documentation

For complete documentation, see:
- **[LOGGING_AND_ERRORS.md](./LOGGING_AND_ERRORS.md)** - Comprehensive guide
- **[UNIFIED_LOGGING_SUMMARY.md](./UNIFIED_LOGGING_SUMMARY.md)** - Implementation summary

---

## 💡 Tips

1. **Always use asyncHandler** for async functions
2. **Throw specific error classes** for better error handling
3. **Log with context** (userId, IP, etc.) for debugging
4. **Check error logs** regularly in production
5. **Monitor security logs** for suspicious activities

---

**Happy Logging! 🎉**

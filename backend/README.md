# Backend API - CV Master AI

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev

# Run in production
npm start
```

---

## 📚 Documentation

### Security & Rate Limiting
- **[SECURITY.md](./SECURITY.md)** - Security features and rate limiting
- **[API_SECURITY.md](../API_SECURITY.md)** - API security documentation
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Security implementation details
- **[UPLOAD_SECURITY.md](./UPLOAD_SECURITY.md)** - File upload security guide
- **[PDF_EXPORT.md](./PDF_EXPORT.md)** - PDF export system documentation

### Logging & Error Handling
- **[LOGGING_AND_ERRORS.md](./LOGGING_AND_ERRORS.md)** - Comprehensive logging guide
- **[LOGGING_QUICK_START.md](./LOGGING_QUICK_START.md)** - Quick reference
- **[UNIFIED_LOGGING_SUMMARY.md](./UNIFIED_LOGGING_SUMMARY.md)** - Implementation details

### Database
- **[prisma/DATABASE_SCHEMA.md](./prisma/DATABASE_SCHEMA.md)** - Complete database schema
- **[prisma/QUICK_START.md](./prisma/QUICK_START.md)** - Database quick start
- **[DATABASE_IMPROVEMENT_SUMMARY.md](./DATABASE_IMPROVEMENT_SUMMARY.md)** - Database improvements

### Quick References
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Security quick reference
- **[CHANGES.md](./CHANGES.md)** - Security implementation changes

---

## 🎯 Features

### Security
- ✅ **Rate Limiting** - Global and route-specific limits
- ✅ **CORS Protection** - Secure cross-origin configuration
- ✅ **Security Headers** - Helmet.js with enhanced configuration
- ✅ **Request Validation** - Size limits and input validation
- ✅ **Security Logging** - Comprehensive security event tracking
- ✅ **Secure File Upload** - Multi-layer validation, blocked extensions, sanitization

### Logging & Error Handling
- ✅ **Structured Logging** - JSON-based logs with metadata
- ✅ **Custom Error Classes** - Type-safe error handling
- ✅ **Global Error Handler** - Consistent error responses
- ✅ **HTTP Request Logging** - Automatic request/response logging
- ✅ **File-Based Logging** - Daily log rotation

### Database
- ✅ **Prisma ORM** - Type-safe database access
- ✅ **16 Models** - Comprehensive data structure
- ✅ **Relationships** - Proper foreign keys and cascades
- ✅ **Indexes** - Performance optimized
- ✅ **Soft Deletes** - Data preservation

### File Management
- ✅ **Secure Uploads** - Multi-layer validation
- ✅ **File Type Detection** - Extension + MIME validation
- ✅ **Blocked Extensions** - 25+ dangerous types
- ✅ **Secure Naming** - Cryptographic random filenames
- ✅ **Size Limits** - Type-specific limits (5-10MB)
- ✅ **Directory Organization** - Type-based subdirectories

### Export System
- ✅ **PDF Export** - Professional CV exports
- ✅ **HTML Fallback** - Always available format
- ✅ **Beautiful Templates** - Modern, professional design
- ✅ **Secure Downloads** - Time-limited access (24h)
- ✅ **Auto-Cleanup** - 7-day retention policy
- ✅ **Preview Mode** - View before download

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Express middleware
│   │   ├── authMiddleware.js
│   │   ├── corsMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   ├── securityMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── loggingMiddleware.js
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   │   ├── logger.js      # Central logger
│   │   ├── errors.js      # Custom error classes
│   │   └── prisma.js      # Database client
│   └── index.js           # Application entry point
├── logs/                  # Log files (auto-generated)
├── prisma/                # Database schema
├── .env.example           # Environment template
└── package.json
```

---

## 🔧 Environment Variables

See [.env.example](./.env.example) for all available options.

### Required
```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
```

### Rate Limiting (Optional - with defaults)
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_LOGIN_ATTEMPTS=5
AUTH_REGISTER_ATTEMPTS=3
UPLOAD_REQUESTS_LIMIT=10
AI_GENERATE_REQUESTS_LIMIT=20
```

### CORS (Optional)
```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 🧪 Testing

### Test Security Features
```bash
# Validate security implementation
node validate-security.js

# Test rate limiting
node test-rate-limit.js
```

### Test Logging System
```bash
# Test logger functionality
node test-logging.js

# View logs
cat logs/$(date +%Y-%m-%d).log
cat logs/$(date +%Y-%m-%d)-errors.log
```

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (Rate limit: 3/hour)
- `POST /api/auth/login` - Login user (Rate limit: 5/15min)

### Upload
- `POST /api/upload` - Upload file (Rate limit: 10/hour) [Protected]

### AI
- `POST /api/ai/generate` - Generate CV content (Rate limit: 20/hour) [Protected]

### CV
- `POST /api/cv` - Save CV data [Protected]

---

## 🔒 Security Features

### Rate Limiting
| Endpoint | Limit | Window |
|----------|-------|--------|
| Global | 100 requests | 15 minutes |
| Login | 5 attempts | 15 minutes |
| Register | 3 attempts | 1 hour |
| Upload | 10 uploads | 1 hour |
| AI Generate | 20 requests | 1 hour |

### Security Headers
- Content-Security-Policy
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection

### Request Size Limits
- JSON body: 1MB
- URL-encoded body: 1MB

---

## 📝 Logging

### Log Levels
- **ERROR** - Critical errors
- **WARN** - Warnings and client errors
- **INFO** - Important events
- **DEBUG** - Development information (dev only)
- **SECURITY** - Security-related events

### Log Files
```
logs/
├── YYYY-MM-DD.log           # All logs
└── YYYY-MM-DD-errors.log    # Errors + Security only
```

### Viewing Logs
```bash
# Live logs
tail -f logs/$(date +%Y-%m-%d).log

# Errors only
tail -f logs/$(date +%Y-%m-%d)-errors.log

# Search logs
grep "SECURITY" logs/*.log
grep "192.168.1.100" logs/*.log
```

---

## 🎯 Error Handling

### Custom Error Classes
- `ValidationError` (400) - Invalid input
- `AuthenticationError` (401) - Auth failed
- `AuthorizationError` (403) - Access denied
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Duplicate resource
- `RateLimitError` (429) - Too many requests
- `InternalServerError` (500) - Server error
- `DatabaseError` (500) - DB operation failed
- `ExternalServiceError` (502) - External API failed

### Error Response Format
```json
{
  "success": false,
  "error": "User not found",
  "statusCode": 404,
  "timestamp": "2024-01-03T00:19:57.568Z"
}
```

---

## 💻 Development

### Code Style
- ES6+ modules
- Async/await for async operations
- Use `asyncHandler` wrapper for route handlers
- Throw custom error classes
- Use logger instead of console

### Example Controller
```javascript
import logger from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import { asyncHandler } from '../middleware/errorMiddleware.js';

export const getUser = asyncHandler(async (req, res) => {
    const user = await findUser(req.params.id);
    
    if (!user) {
        throw new NotFoundError('User not found');
    }
    
    logger.info('User retrieved', { userId: user.id, ip: req.ip });
    res.json({ success: true, user });
});
```

---

## 🚀 Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure `JWT_SECRET` (32+ characters)
- [ ] Set `DATABASE_URL`
- [ ] Configure `ALLOWED_ORIGINS`
- [ ] Adjust rate limits if needed
- [ ] Enable HTTPS
- [ ] Set up log monitoring
- [ ] Configure backup strategy

### Running in Production
```bash
# Build Prisma client
npm run build

# Run migrations
npm run prisma:deploy

# Start server
npm start
```

---

## 📖 Additional Resources

### Documentation
- [Security Guide](./SECURITY.md)
- [Logging Guide](./LOGGING_AND_ERRORS.md)
- [API Security](../API_SECURITY.md)

### Scripts
- `npm run dev` - Development server with nodemon
- `npm start` - Production server
- `npm run build` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code

---

## 🆘 Troubleshooting

### Rate Limit Not Working
1. Check middleware order in `src/index.js`
2. Verify environment variables are loaded
3. Check IP detection with proxies

### Logs Not Created
1. Check `logs/` directory exists
2. Verify write permissions
3. Ensure `NODE_ENV` is not 'test'

### Database Connection Issues
1. Verify `DATABASE_URL` in `.env`
2. Check database is running
3. Run `npm run prisma:migrate`

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review error logs
3. Verify environment configuration

---

## 📄 License

MIT

---

**Built with:** Express.js, Prisma, JWT, Helmet, Rate-Limiter-Flexible  
**Version:** 1.0.0  
**Status:** Production Ready ✅

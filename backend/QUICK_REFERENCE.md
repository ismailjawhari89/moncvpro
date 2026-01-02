# Security Implementation Quick Reference

## 🚀 Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 2. Start Server
```bash
npm run dev
```

### 3. Test Rate Limiting
```bash
node test-rate-limit.js
```

---

## 📊 Rate Limits at a Glance

| Route | Limit | Window |
|-------|-------|--------|
| **All Routes** | 100 | 15 min |
| **Login** | 5 | 15 min |
| **Register** | 3 | 1 hour |
| **Upload** | 10 | 1 hour |
| **AI Generate** | 20 | 1 hour |

---

## 🔑 Required Environment Variables

```env
# Minimum required for production
NODE_ENV=production
JWT_SECRET=<32+ characters>
DATABASE_URL=<postgresql connection string>
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 📝 Response Headers

### Success
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2024-01-02T12:15:00.000Z
```

### Rate Limited (429)
```
Retry-After: 900
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-01-02T12:15:00.000Z
```

---

## 🔒 Security Headers

- ✅ Content-Security-Policy
- ✅ Strict-Transport-Security (HSTS)
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection
- ✅ Referrer-Policy
- ✅ X-Powered-By: hidden

---

## 🧪 Testing Commands

### Test with cURL
```bash
# Test rate limit
for i in {1..6}; do
  curl -i http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123"}'
  echo "\n---\n"
done

# Check security headers
curl -I http://localhost:5000/

# Test CORS
curl -H "Origin: http://unauthorized.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS http://localhost:5000/api/cv
```

### Test with Apache Bench
```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:5000/
```

---

## 📁 Files Created

### Middleware
- `src/middleware/rateLimitMiddleware.js`
- `src/middleware/corsMiddleware.js`
- `src/middleware/securityMiddleware.js`

### Config
- `.env.example`

### Documentation
- `SECURITY.md` - Comprehensive security docs
- `API_SECURITY.md` - API-focused security docs
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `QUICK_REFERENCE.md` - This file

### Tests
- `test-rate-limit.js`

---

## 🔧 Troubleshooting

### Rate Limit Not Working?
1. Check middleware order in `src/index.js`
2. Verify `dotenv.config()` is called early
3. Check IP detection: `console.log(req.ip)`

### CORS Errors?
1. Verify `ALLOWED_ORIGINS` in `.env`
2. Check origin matches exactly (no trailing slash)
3. Ensure frontend sends credentials if needed

### Headers Missing?
1. Ensure helmet middleware is applied
2. Check middleware runs before routes
3. Test with: `curl -I http://localhost:5000/`

---

## 📚 Documentation

- **Detailed Security:** [SECURITY.md](./SECURITY.md)
- **API Security:** [../API_SECURITY.md](../API_SECURITY.md)
- **Implementation:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## ⚡ Common Tasks

### Adjust Rate Limits
Edit `.env`:
```env
RATE_LIMIT_MAX_REQUESTS=200
AUTH_LOGIN_ATTEMPTS=10
```

### Add New Origin
Edit `.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,https://new-domain.com
```

### Increase Body Size Limit
Edit `.env`:
```env
REQUEST_SIZE_LIMIT=5mb
```

### Enable Production Mode
```env
NODE_ENV=production
```

---

## 🎯 Acceptance Criteria Status

- ✅ Global rate limiting (100 req/15min)
- ✅ Auth login rate limiting (5 req/15min)
- ✅ Auth register rate limiting (3 req/1hour)
- ✅ Upload rate limiting (10 req/1hour)
- ✅ AI generation rate limiting (20 req/1hour)
- ✅ Secure CORS with environment-based origins
- ✅ Enhanced Helmet configuration
- ✅ Request size limits (1MB)
- ✅ Security logging
- ✅ Clear error responses with Retry-After
- ✅ Response headers (X-RateLimit-*, Retry-After)
- ✅ No hardcoded values
- ✅ All environment variables documented
- ✅ Comprehensive documentation

---

## 🚨 Production Checklist

Before deploying:
- [ ] Set `NODE_ENV=production`
- [ ] Strong `JWT_SECRET` (32+ chars)
- [ ] Configure `ALLOWED_ORIGINS` (production domains only)
- [ ] Set `DATABASE_URL`
- [ ] Test all rate limits
- [ ] Verify CORS works from production frontend
- [ ] Check all security headers present
- [ ] Set up log monitoring
- [ ] Configure alerts for 429 responses
- [ ] Enable HTTPS at load balancer

---

## 💡 Tips

1. **Development:** Use high rate limits in `.env`
2. **Production:** Use strict limits, monitor logs
3. **Scaling:** Consider Redis for distributed rate limiting
4. **Monitoring:** Track 429 responses, failed auth attempts
5. **Security:** Never commit `.env`, use strong secrets

---

## 🔗 Related Files

- Main app: `src/index.js`
- Auth routes: `src/routes/authRoutes.js`
- Upload routes: `src/routes/uploadRoutes.js`
- AI routes: `src/routes/aiRoutes.js`
- Config: `.env.example`

---

## 📞 Support

For issues:
1. Check logs for error messages
2. Review [SECURITY.md](./SECURITY.md)
3. Verify `.env` variables are set
4. Test with cURL commands above

For security vulnerabilities:
- Contact security team directly
- Do not open public issues

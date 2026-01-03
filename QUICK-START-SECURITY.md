# Quick Start: Security Features

## 🚀 Getting Started

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Start server:**
```bash
npm run dev
```

Expected output:
```
✅ Server running on port 5000
✅ CORS enabled for: http://localhost:3000
✅ Environment: development
```

### Frontend Setup

No additional setup required! The new API client is ready to use.

## 🔑 Usage Examples

### Frontend: Making API Calls

**Login Example:**
```typescript
import { authService } from '@/lib/auth';

// CSRF token is automatically handled
const data = await authService.login('user@example.com', 'password123456');
```

**Custom API Call:**
```typescript
import { apiPost, apiGet } from '@/lib/api-client';

// POST request (auto-includes CSRF token)
const response = await apiPost('/api/cv', { cvData });
const data = await response.json();

// GET request (no CSRF token needed)
const response = await apiGet('/api/cv/123');
const cv = await response.json();
```

**Manual CSRF Token:**
```typescript
import { getCsrfToken } from '@/lib/csrf';

const token = await getCsrfToken();
// Token is cached for subsequent requests
```

### Backend: Adding Protected Routes

```javascript
import { protectMutations } from '../middleware/csrfMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Protected route example
router.post(
    '/endpoint',
    authMiddleware,      // Check JWT token
    protectMutations,    // Check CSRF token
    controller           // Your controller
);

// Public GET endpoint (no CSRF needed)
router.get('/endpoint', controller);
```

## 🔒 Security Checklist

### Development
- ✅ `.env` file created with required variables
- ✅ `DATABASE_URL` set
- ✅ `JWT_SECRET` set (minimum 32 characters)
- ✅ `FRONTEND_URL` set to development origin

### Production
- ✅ Strong `JWT_SECRET` (use `openssl rand -base64 32`)
- ✅ `FRONTEND_URL` set to production domain(s)
- ✅ `NODE_ENV=production`
- ✅ HTTPS enabled
- ✅ Environment variables from secure source (not `.env` file)
- ✅ Regular security audits
- ⚠️ Consider adding rate limiting

## 🧪 Quick Tests

### Test 1: Server Starts
```bash
cd backend
npm start
# Should see: ✅ Server running on port 5000
```

### Test 2: ENV Validation
```bash
cd backend
mv .env .env.test
npm start
# Should see: ❌ FATAL: Missing required environment variable
mv .env.test .env
```

### Test 3: CSRF Token
```bash
curl http://localhost:5000/api/auth/csrf-token
# Should return: {"csrfToken":"..."}
```

### Test 4: CSRF Protection
```bash
# Without token (should fail)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123456789012"}'
# Expected: 403 Forbidden

# With token (should process)
TOKEN=$(curl -s http://localhost:5000/api/auth/csrf-token | jq -r '.csrfToken')
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: $TOKEN" \
  -d '{"email":"test@test.com","password":"test123456789012"}'
# Expected: 400 or 401 (invalid credentials, but CSRF passed)
```

### Test 5: Full Test Suite
```bash
cd backend
./test-security.sh
```

## 🐛 Troubleshooting

### "FATAL: Missing required environment variable"
**Solution:** Create `.env` file with required variables:
```bash
cp .env.example .env
# Edit .env with your values
```

### "CSRF token invalid or missing" (403 error)
**Frontend Solution:** Use the API client helpers:
```typescript
import { apiPost } from '@/lib/api-client';
// CSRF token is automatically included
```

**Manual Solution:** Get and include CSRF token:
```typescript
import { getCsrfToken } from '@/lib/csrf';
const csrfToken = await getCsrfToken();
// Include in X-CSRF-Token header
```

### "CORS policy: Origin not allowed"
**Solution:** Add your origin to `FRONTEND_URL`:
```env
FRONTEND_URL=http://localhost:3000,https://yourdomain.com
```

### "AI service is not configured" (503 error)
**Solution:** Add OpenAI API key (optional):
```env
OPENAI_API_KEY=sk-...
```

### TypeScript errors in frontend
**Solution:** Ensure imports are correct:
```typescript
// Correct imports
import { apiPost } from '@/lib/api-client';
import { getCsrfToken } from '@/lib/csrf';
```

## 📚 More Information

- **Full Documentation:** `SPRINT0-SECURITY.md`
- **Security Details:** `backend/SECURITY.md`
- **Acceptance Criteria:** `ACCEPTANCE-CHECKLIST.md`
- **Environment Variables:** `backend/.env.example`

## 🔐 Security Features Summary

| Feature | Status | Location |
|---------|--------|----------|
| CORS Whitelist | ✅ | `backend/src/index.js` |
| CSRF Protection | ✅ | `backend/src/middleware/csrfMiddleware.js` |
| ENV Validation | ✅ | `backend/src/index.js` |
| Security Headers | ✅ | `backend/src/index.js` (Helmet) |
| Frontend CSRF Client | ✅ | `frontend/src/lib/csrf.ts` |
| API Client | ✅ | `frontend/src/lib/api-client.ts` |

## ⚡ Common Commands

```bash
# Backend
cd backend
npm install              # Install dependencies
npm run dev             # Start development server
npm start               # Start production server
./test-security.sh      # Run security tests

# Frontend
cd frontend
npm install             # Install dependencies
npm run dev            # Start development server
npm run build          # Build for production
```

## 🎯 Next Steps

1. ✅ Security features implemented
2. ⏭️ Add rate limiting (future sprint)
3. ⏭️ Implement refresh token rotation
4. ⏭️ Add request logging
5. ⏭️ Set up monitoring/alerting
6. ⏭️ Regular security audits

---

**Need Help?** Check the detailed documentation in `SPRINT0-SECURITY.md`

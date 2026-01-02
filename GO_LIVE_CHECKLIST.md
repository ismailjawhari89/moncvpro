# 🚀 MonCVPro Production Go-Live Checklist

**Last Updated**: Pre-Launch  
**Target Launch**: TODAY  
**Mode**: Free Plan Only (No Payments)

---

## ⚠️ CRITICAL - Do These First

### 1. Database & Schema Ready
- ⬜ Supabase PostgreSQL is running and accessible
- ⬜ Run `npm run prisma:migrate` on backend (applies schema)
- ⬜ Run `npm run prisma:seed` on backend (creates 6 default templates)
- ⬜ Verify DATABASE_URL in production env vars
- ⬜ Test DB connection: `npx prisma studio` should open

**Why**: Without DB, nothing works. Templates must exist for users to create CVs.

---

### 2. Redis/Upstash Ready
- ⬜ Upstash Redis instance is active
- ⬜ REDIS_URL is set in production env vars
- ⬜ Test connection: Backend should start without Redis errors

**Why**: Needed for rate limiting, caching, job queues.

---

### 3. Backend Deployment Check
- ⬜ Backend deployed to api.moncvpro.com
- ⬜ `curl https://api.moncvpro.com/health` returns 200 OK
- ⬜ CORS allows moncvpro.com (check ALLOWED_ORIGINS env var)
- ⬜ JWT_SECRET is set (long random string, NOT "your-secret-key")
- ⬜ NODE_ENV is set to "production"

**Why**: API must be reachable and secure.

---

### 4. Frontend Deployment Check
- ⬜ Frontend deployed to moncvpro.com
- ⬜ `curl https://moncvpro.com` returns HTML
- ⬜ NEXT_PUBLIC_API_URL points to https://api.moncvpro.com
- ⬜ Homepage loads in browser without errors
- ⬜ Check browser console for no error messages

**Why**: Users can't access the app if frontend is broken.

---

## 🔒 SECURITY - Must Pass All

### 5. Authentication System
- ⬜ JWT_SECRET is strong (32+ chars, random)
- ⬜ JWT_EXPIRES_IN is set (e.g., "7d")
- ⬜ Google OAuth credentials are production keys (not test)
- ⬜ LinkedIn OAuth credentials are production keys
- ⬜ Test: Register a new user → Receive JWT → Can access dashboard

**Why**: Users need secure login to access their CVs.

---

### 6. CORS & Rate Limiting
- ⬜ ALLOWED_ORIGINS includes only moncvpro.com (no wildcards)
- ⬜ Rate limiting is active (check backend logs for "rate limit" messages)
- ⬜ Test: Make 100 rapid API requests → Should get 429 errors

**Why**: Prevents abuse and unauthorized access.

---

### 7. Admin Access Control
- ⬜ Admin dashboard requires authentication
- ⬜ Only specific admin emails can access /admin routes
- ⬜ Test: Non-admin user cannot access /admin
- ⬜ Test: Admin user CAN access /admin

**Why**: Admin tools must not be public.

---

## 📧 EMAIL SYSTEM

### 8. SMTP Configuration
- ⬜ Gmail App Password is set in SMTP_PASSWORD env var
- ⬜ SMTP_USER, SMTP_HOST, SMTP_PORT are correct
- ⬜ Send test email: Backend should have email test endpoint
- ⬜ Check spam folder if email doesn't arrive

**Test Command** (if available):
```bash
curl -X POST https://api.moncvpro.com/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@gmail.com"}'
```

**Why**: Users need email for password reset, notifications.

---

## 🤖 AI SERVICE

### 9. Groq API Ready
- ⬜ GROQ_API_KEY is set in env vars
- ⬜ OPENAI_API_KEY is REMOVED or set to empty string
- ⬜ Test ATS analysis on a CV → Should return score/suggestions
- ⬜ Check backend logs for Groq API calls (no OpenAI calls)

**Why**: AI features must work. OpenAI must be disabled to avoid charges.

---

## 💳 PAYMENTS DISABLED

### 10. Stripe MUST Be Off
- ⬜ STRIPE_SECRET_KEY is NOT set (or set to empty string)
- ⬜ STRIPE_PUBLISHABLE_KEY is NOT set
- ⬜ STRIPE_WEBHOOK_SECRET is NOT set
- ⬜ Subscription page shows "Free Plan Only" message
- ⬜ No payment forms are visible on frontend
- ⬜ Users default to FREE plan on signup

**Why**: Payments are not ready. Must not charge users.

---

### 11. AWS Backups Disabled
- ⬜ AWS credentials are NOT set
- ⬜ No cron jobs or scheduled tasks for AWS backups
- ⬜ Backup script (if exists) is not running in production

**Why**: AWS not configured yet. Manual Supabase backups only.

---

## 📊 MONITORING & LOGGING

### 12. Sentry Enabled
- ⬜ SENTRY_DSN is set in backend env vars
- ⬜ NEXT_PUBLIC_SENTRY_DSN is set in frontend env vars
- ⬜ Trigger test error → Check Sentry dashboard for error
- ⬜ Sentry alerts are configured (email/Slack)

**Test Error** (backend):
```bash
curl https://api.moncvpro.com/api/test/error
```

**Why**: You need to know when things break in production.

---

### 13. Basic Logging Works
- ⬜ Backend logs are visible (check hosting platform logs)
- ⬜ Frontend build logs show no errors
- ⬜ No sensitive data (passwords, secrets) in logs

**Why**: Logs help debug issues after launch.

---

## ⚡ PERFORMANCE BASICS

### 14. Database Performance
- ⬜ Prisma Client is generated (`npm run prisma:generate`)
- ⬜ Database has proper indexes (already in schema.prisma)
- ⬜ Test query: `npx prisma studio` loads fast (<3 seconds)

**Why**: Slow DB = slow app.

---

### 15. Redis Caching Works
- ⬜ Templates are cached (check Redis keys)
- ⬜ Rate limiting counters are in Redis
- ⬜ Test: Load homepage twice → Second load uses cache

**Why**: Caching reduces DB load and speeds up app.

---

### 16. API Response Times
- ⬜ Health endpoint responds in <200ms
- ⬜ Get templates endpoint responds in <500ms
- ⬜ User login responds in <1s

**Test**:
```bash
time curl https://api.moncvpro.com/health
# Should be <1 second total
```

**Why**: Slow API = bad user experience.

---

## 🌍 INTERNATIONALIZATION

### 17. Multi-Language Support
- ⬜ Homepage loads in English (default)
- ⬜ Switch to French → All text changes
- ⬜ Switch to Arabic → All text changes, RTL layout works
- ⬜ No missing translation keys (no "translation.key" visible)

**Why**: App supports 3 languages. Must work on launch.

---

## ✅ FUNCTIONAL TESTS

### 18. User Journey - Registration
- ⬜ Visit homepage → Click "Sign Up"
- ⬜ Register with email/password → Success
- ⬜ Verify email received (welcome email)
- ⬜ Login with new account → Redirects to dashboard

**Why**: Core user flow must work.

---

### 19. User Journey - Create CV
- ⬜ Logged in user clicks "Create CV"
- ⬜ Select a template → Template preview loads
- ⬜ Fill in personal info → Saves successfully
- ⬜ Add experience section → Saves
- ⬜ Click "Preview" → CV renders correctly

**Why**: Main app feature must work.

---

### 20. User Journey - Export CV
- ⬜ Open existing CV → Click "Export PDF"
- ⬜ PDF generates and downloads
- ⬜ Check usage counter → Shows 1/3 exports used (free plan)
- ⬜ Export 3 times → Should show limit reached message

**Why**: Export is a key feature. Limits must work.

---

### 21. User Journey - AI Features
- ⬜ Open CV → Click "ATS Analysis"
- ⬜ Analysis runs → Returns score (0-100)
- ⬜ Suggestions display correctly
- ⬜ Check usage counter → Shows 1/5 AI uses (free plan)

**Why**: AI is a selling point. Must work but be limited.

---

### 22. OAuth Login
- ⬜ Click "Sign in with Google" → Redirects to Google
- ⬜ Authorize → Redirects back, user is logged in
- ⬜ Click "Sign in with LinkedIn" → Same flow works
- ⬜ User profile has correct name/email from OAuth

**Why**: Social login is easier for users.

---

## 🔧 ADMIN TOOLS

### 23. Admin Dashboard Access
- ⬜ Go to /admin → Redirects if not admin
- ⬜ Admin user logs in → Can access dashboard
- ⬜ View user list → Shows all registered users
- ⬜ View analytics → Shows metrics (users, CVs, exports)

**Why**: You need to monitor usage and manage users.

---

### 24. Admin Actions Work
- ⬜ Search for user by email → Finds user
- ⬜ View user details → Shows CV count, exports, plan
- ⬜ Delete test user → User is removed from DB
- ⬜ Check audit logs → Actions are logged

**Why**: Admin must be able to manage platform.

---

## 🚨 PRE-LAUNCH SECURITY AUDIT

### 25. Environment Variables Review
- ⬜ No default/example values (e.g., "your-secret-key")
- ⬜ No secrets in Git repository
- ⬜ GitHub Secrets are all set correctly
- ⬜ Production .env is NOT committed

**Check**:
```bash
git log --all -- .env
# Should return NOTHING
```

**Why**: Leaked secrets = security disaster.

---

### 26. Exposed Endpoints Check
- ⬜ /health endpoint is public (OK)
- ⬜ /api/test/* endpoints are DISABLED in production
- ⬜ Database credentials are NOT exposed
- ⬜ Admin endpoints require authentication

**Test**:
```bash
curl https://api.moncvpro.com/api/test/email
# Should return 404 or 403, NOT send email
```

**Why**: Test endpoints can be abused.

---

### 27. HTTPS & SSL
- ⬜ https://moncvpro.com has valid SSL certificate
- ⬜ https://api.moncvpro.com has valid SSL certificate
- ⬜ No mixed content warnings in browser console
- ⬜ HTTP redirects to HTTPS automatically

**Why**: Users need secure connections.

---

## 📱 MOBILE & PWA

### 28. Mobile Responsiveness
- ⬜ Open moncvpro.com on mobile device (or Chrome DevTools)
- ⬜ Homepage is readable, no horizontal scroll
- ⬜ Dashboard works on mobile
- ⬜ CV editor is usable on mobile
- ⬜ PWA "Add to Home Screen" prompt appears

**Why**: Many users will access via mobile.

---

### 29. PWA Functionality
- ⬜ Service worker registers (check browser DevTools → Application)
- ⬜ Manifest.json is valid
- ⬜ Icons load correctly (check /manifest.json)
- ⬜ App works offline (basic pages cache)

**Why**: PWA improves mobile experience.

---

## 🎯 FINAL VERIFICATION

### 30. Cross-Browser Testing
- ⬜ Chrome: All features work
- ⬜ Firefox: All features work
- ⬜ Safari: All features work
- ⬜ Mobile Safari: All features work

**Why**: Users use different browsers.

---

### 31. Error Handling
- ⬜ Invalid API endpoint returns 404, not 500
- ⬜ Invalid login returns clear error message
- ⬜ Network error shows user-friendly message
- ⬜ No stack traces visible to users

**Why**: Errors will happen. Must handle gracefully.

---

### 32. Load Testing (Basic)
- ⬜ 10 users register simultaneously → All succeed
- ⬜ 10 users create CVs simultaneously → All succeed
- ⬜ API remains responsive under load

**Tool** (optional):
```bash
# Install Apache Bench
ab -n 100 -c 10 https://api.moncvpro.com/health
# Should show 0 failed requests
```

**Why**: Basic load test ensures stability.

---

## 📋 DOCUMENTATION CHECK

### 33. User-Facing Content
- ⬜ Homepage has clear value proposition
- ⬜ Features page explains what the app does
- ⬜ Pricing page shows "Free Plan" only
- ⬜ FAQ page answers common questions
- ⬜ Privacy Policy exists (required by law)
- ⬜ Terms of Service exist (required by law)

**Why**: Legal requirements and user clarity.

---

### 34. Support Channels
- ⬜ Contact email is set up and monitored
- ⬜ Support page has contact form or email
- ⬜ Test: Send support email → Receives confirmation

**Why**: Users need help sometimes.

---

## 🎬 GO-LIVE STEPS

### 35. Final Smoke Test
**Do this RIGHT BEFORE launch:**

- ⬜ Clear browser cache
- ⬜ Visit https://moncvpro.com in incognito mode
- ⬜ Register brand new account (use real email)
- ⬜ Create 1 complete CV with all sections
- ⬜ Export CV as PDF
- ⬜ Run ATS analysis
- ⬜ Logout and login again
- ⬜ Everything still works

**Why**: Final sanity check with fresh eyes.

---

### 36. Monitoring Setup
- ⬜ Sentry dashboard is open in browser tab
- ⬜ Server logs are streaming (if available)
- ⬜ Uptime monitor is active (e.g., UptimeRobot)
- ⬜ Your phone has alerts enabled

**Why**: Watch for issues immediately after launch.

---

### 37. Rollback Plan Ready
- ⬜ Previous stable version is tagged in Git
- ⬜ Know how to redeploy previous version
- ⬜ Database backup is recent (<24 hours old)
- ⬜ Write down rollback steps

**Why**: If disaster strikes, you can undo quickly.

---

## 🚦 GO / NO-GO DECISION

**Answer YES to ALL before launching:**

- ⬜ Database is seeded with templates
- ⬜ Health endpoint returns 200 OK
- ⬜ Test user can register, login, create CV, export PDF
- ⬜ OAuth (Google + LinkedIn) works
- ⬜ Email system sends emails
- ⬜ AI analysis works (Groq)
- ⬜ Stripe is DISABLED (no payment forms visible)
- ⬜ AWS backups are DISABLED
- ⬜ Sentry is receiving test errors
- ⬜ CORS allows only moncvpro.com
- ⬜ Rate limiting works
- ⬜ Admin dashboard is secure
- ⬜ Mobile version works
- ⬜ Privacy Policy + Terms exist
- ⬜ No secrets in Git
- ⬜ HTTPS works with valid certificates
- ⬜ Rollback plan is ready

**All checked?** ✅ **GO LIVE!**

**Any unchecked?** ⬜ **NO GO - Fix first.**

---

## 🎉 POST-LAUNCH (First Hour)

### 38. Monitor Closely
- ⬜ Watch Sentry for errors (first 15 min)
- ⬜ Check server CPU/memory usage
- ⬜ Monitor database connection count
- ⬜ Watch for unusual traffic spikes

**Why**: Catch issues before they affect many users.

---

### 39. Test Again Live
- ⬜ Register new account from different device
- ⬜ Share app link with 3 friends → Get feedback
- ⬜ Check analytics → See real user activity

**Why**: Real-world usage finds issues tests miss.

---

### 40. Announce Launch
- ⬜ Post on social media (if applicable)
- ⬜ Send email to waitlist (if exists)
- ⬜ Update LinkedIn/Twitter status
- ⬜ Monitor user feedback

**Why**: You built it, now tell people!

---

## 🆘 EMERGENCY CONTACTS

**If something breaks:**

1. **Check Sentry** → See what error occurred
2. **Check server logs** → See what's happening
3. **Check Supabase dashboard** → DB still up?
4. **Check Upstash dashboard** → Redis still up?
5. **Rollback if needed** → Redeploy previous version

**Disaster Recovery:**
- Database backup: Supabase automatic backups (check dashboard)
- Code backup: Git repository (push to GitHub)
- Rollback: `git checkout <previous-tag>` → Redeploy

---

## ✅ CHECKLIST COMPLETE?

**Total items**: 40  
**Checked**: ___/40

**If 40/40**: 🎉 **LAUNCH NOW!**  
**If <40/40**: ⚠️ **Complete missing items first.**

---

## 📞 FINAL NOTES

**What's NOT included in this launch:**
- ❌ Stripe payments (add later)
- ❌ AWS backups (add later)
- ❌ OpenAI integration (Groq only)
- ❌ Premium plans (free only)

**What IS working:**
- ✅ User registration + OAuth
- ✅ CV creation with templates
- ✅ PDF export (with limits)
- ✅ ATS analysis (with limits)
- ✅ Multi-language (en, fr, ar)
- ✅ Mobile PWA
- ✅ Admin dashboard
- ✅ Email notifications
- ✅ Monitoring (Sentry)

**You're launching an MVP**. Perfect is the enemy of done. Ship it! 🚀

---

**Good luck with the launch! 🎊**

# 🔒 MonCVPro Security Checklist - Sprint 0

## 🎯 Objective: Harden application before production launch

## 📋 Security Issues Tracking

### ✅ COMPLETED

#### 1. **Backend Migration to Vercel + Supabase**
- ✅ Migrated all API routes from Node.js/Prisma to Vercel API routes
- ✅ Implemented Supabase Auth, Storage, and Database
- ✅ All API routes use proper authentication
- ✅ Graceful error handling for missing API keys

#### 2. **CI/CD Build Fixes**
- ✅ Fixed "CI Prisma not found" error
- ✅ Fixed "next-on-pages not found" error  
- ✅ Build completes successfully with all API routes

#### 3. **i18n Validation**
- ✅ Fixed missing French translation for "review"
- ✅ No MISSING_MESSAGE errors in build
- ✅ All navigation items properly translated

### 🚧 IN PROGRESS

#### 4. **Supabase Authentication Hardening**
- ⚠️ **Email Confirmation**: Need to enable in Supabase dashboard
- ⚠️ **Anonymous Sign-in**: Need to disable in Supabase dashboard
- ⚠️ **Redirect URLs**: Need to configure production/local URLs

#### 5. **Environment Variables Security**
- ⚠️ **Production Variables**: Need to set in Vercel dashboard
- ⚠️ **Secrets Management**: Verify no secrets in GitHub
- ⚠️ **Validation**: Ensure all required env vars are present

#### 6. **API Route Protection**
- ⚠️ **Authentication Check**: Verify all routes use `getAuthenticatedUser()`
- ⚠️ **Error Handling**: Ensure consistent JSON error responses
- ⚠️ **Timeout Configuration**: Set appropriate request timeouts

#### 7. **Supabase Storage Security**
- ⚠️ **Bucket Permissions**: Configure storage bucket policies
- ⚠️ **File Validation**: Implement file type/size checks
- ⚠️ **Public Access**: Ensure files are not publicly accessible

#### 8. **Frontend Performance**
- ⚠️ **Image Optimization**: Check next/image usage
- ⚠️ **Lazy Loading**: Implement for heavy components
- ⚠️ **Fetch Optimization**: Prevent blocking in layout

#### 9. **Legal & Compliance**
- ⚠️ **Privacy Policy**: Verify content completeness
- ⚠️ **Terms of Service**: Verify content completeness
- ⚠️ **Cookies/GDPR**: Verify content completeness

#### 10. **Monitoring & Logging**
- ⚠️ **Vercel Logs**: Enable and configure
- ⚠️ **Supabase Monitoring**: Set up auth/DB monitoring
- ⚠️ **Error Tracking**: Configure error reporting

## 🔐 Security Configuration

### Supabase Settings (Dashboard Configuration)

```bash
# Enable email confirmation
supabase auth update --require-email-confirmation

# Disable anonymous sign-in
supabase auth update --disable-anonymous-sign-in

# Set redirect URLs
supabase auth update \
  --redirect-urls "https://moncvpro.com/auth/callback,http://localhost:3000/auth/callback"

# Enable secure token settings
supabase auth update --jwt-expiry 3600 --refresh-token-expiry 86400
```

### Environment Variables (.env.example)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your-openai-key

# Application Configuration
NEXT_PUBLIC_APP_URL=https://moncvpro.com
NEXT_PUBLIC_API_URL=https://moncvpro.com/api
```

### Required Security Policies

#### 1. Email Confirmation
- Users must confirm email before login
- Prevents fake/spam accounts
- Required for production

#### 2. Anonymous Sign-in Disabled
- Prevents unauthorized access
- Forces proper authentication
- Required for security

#### 3. Secure Redirect URLs
- Prevents open redirect attacks
- Only allows trusted domains
- Required for OAuth security

#### 4. JWT Token Security
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (24 hours)
- Secure storage in HTTP-only cookies

## 🧪 Testing Checklist

### Authentication Tests
- [ ] User registration requires email confirmation
- [ ] Anonymous sign-in is disabled
- [ ] OAuth redirects work correctly
- [ ] Session tokens are secure

### API Security Tests
- [ ] All routes require authentication
- [ ] Unauthorized requests return 401
- [ ] Error responses are consistent JSON
- [ ] Timeouts prevent hanging requests

### Storage Security Tests
- [ ] File uploads are validated
- [ ] Only authorized users can access files
- [ ] Public access is disabled

### Performance Tests
- [ ] Page load time < 3s
- [ ] No layout shifts
- [ ] Lighthouse score > 80

### Compliance Tests
- [ ] Privacy Policy accessible
- [ ] Terms of Service accessible
- [ ] Cookie consent working

## 🚀 Launch Readiness

### Pre-Launch Checklist
- [ ] All security issues resolved
- [ ] Build is green (no errors)
- [ ] No runtime errors in production
- [ ] Monitoring is configured
- [ ] Legal pages are complete
- [ ] Domain is connected
- [ ] SEO is configured

### Definition of Done
✅ All security issues closed
✅ Build is green and stable
✅ No runtime errors
✅ Ready for production launch

## 📝 Notes

- Supabase configuration requires dashboard access
- Environment variables must be set in Vercel dashboard
- Storage bucket permissions need Supabase admin access
- Monitoring setup requires Vercel/Supabase integration

## 🔗 References

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security)

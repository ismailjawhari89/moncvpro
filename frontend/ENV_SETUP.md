# MonCVPro SaaS - Environment Configuration Guide

## Required Environment Variables

Create a `.env.local` file in the `frontend/` directory with the following variables:

### 🔐 SUPABASE (Authentication & Database)
Get these from: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🤖 AI SERVICES

**Replicate API** - for AI Photo Editor (Virtual Try-On)
Get from: [Replicate API Tokens](https://replicate.com/account/api-tokens)

```env
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Cloudflare Worker** - for AI Text Services
Deploy your worker and use its URL:

```env
NEXT_PUBLIC_WORKER_URL=https://moncvpro-worker.your-subdomain.workers.dev
```

### 📊 OPTIONAL

```env
# HuggingFace Token (for additional AI models)
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxx

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

## Quick Setup

1. Copy the example:
   ```bash
   # In frontend directory
   cp ENV_SETUP.md .env.local.example
   ```

2. Create your `.env.local`:
   ```bash
   touch .env.local
   ```

3. Edit `.env.local` with your actual values

4. Restart the dev server:
   ```bash
   npm run dev
   ```

## Verification

To verify your environment is correctly configured:

1. **Supabase**: Check console for "Supabase Config: { url: 'Defined', key: 'Defined' }"
2. **Replicate**: Try AI Photo Editor - should not say "Demo Mode"
3. **Worker**: Try AI features in CV Builder - should return AI results

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Supabase environment variables are missing" | Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY |
| "Demo Mode" in AI Photo Editor | Add REPLICATE_API_TOKEN |
| AI features timeout | Check NEXT_PUBLIC_WORKER_URL is correct |

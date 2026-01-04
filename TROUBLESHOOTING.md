# Troubleshooting Guide - MonCVPro

## Frontend Issues

### 1. Cookies not being saved (Login issues)
- **Symptoms:** User logs in but is immediately redirected back to login.
- **Fix:** Ensure the browser allows cookies from the subdomain. Check `domain` settings in cookies if using specialized environments.
- **Debug:** Check "Storage" tab in Browser DevTools for `auth_token` cookie.

### 2. PDF Export hangs
- **Symptoms:** Loading spinner never finishes.
- **Fix:** Check WebSockets status. If the socket fails, the UI won't receive the "finished" signal.
- **Debug:** Look for `WS_ERROR` in browser console.

## Backend Issues

### 1. Node Worker Crashes
- **Symptoms:** Jobs stay in "Pending" forever.
- **Fix:** Restart the worker process. Check if the worker is running out of memory (OOM).
- **Debug:** `railway logs -s worker-pdf`.

### 2. 504 Gateway Timeout
- **Symptoms:** Generic 504 page.
- **Fix:** Usually means the background job failed to respond or the request took > 30s.
- **Debug:** Check if the S3 upload for the exported file is failing.

## Database Issues

### 1. Too many connections
- **Symptoms:** "remaining connection slots are reserved for non-replication superuser connections".
- **Fix:** Enable Prisma Accelerate or use a PgBouncer connection pool.
- **Debug:** Run `SELECT count(*) FROM pg_stat_activity;` in SQL console.

## Environment Variables Missing
Always check if these are set after a deploy:
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `DATABASE_URL`
- `AWS_BACKUP_BUCKET`
- `GROQ_API_KEY`

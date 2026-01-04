# Operations Runbook - MonCVPro

## Deployment Procedures

### Automated Deployment (Recommended)
- **Staging:** Push to `develop` or merge PR to `main`.
- **Production:** Tag a commit with `v*.*.*` (e.g., `git tag v1.0.0 && git push --tags`).

### Manual Deployment
If CI fails, specialized deployments can be run:
```bash
# Backend to Railway
npm run build --prefix backend
railway up --service backend

# Frontend to Vercel
vercel --prod
```

## Monitoring & Health
- **System Health:** Check `https://api.moncvpro.com/health`.
- **Logs:** 
    - Real-time: `railway logs -s backend`
    - Error Tracking: Visit the [Sentry Dashboard](https://sentry.io).
- **Metrics:** Visit `https://api.moncvpro.com/admin/queues` for BullMQ stats.

## Incident Response

### Common Scenarios

#### 1. Database Connection Timeout
- **Check:** Verify `DATABASE_URL` in Railway variables.
- **Action:** Check Supabase/PostgreSQL status. Restart the backend service to clear old pools.

#### 2. Backup Failure Alert
- **Action:** Check if `AWS_BACKUP_BUCKET` is full. Verify S3 credentials. Run manual backup: `npm run backup --prefix backend`.

#### 3. High Latency on AI Features
- **Check:** Check Groq/Cloudflare AI status pages.
- **Action:** Verify provider API limits haven't been reached.

## Rollback Procedure
1. Identify the last stable tag: `git tag -l`.
2. Check out that tag: `git checkout v0.9.9`.
3. Force push to main (if necessary) or trigger a direct deploy from the tag in Vercel/Railway.

## On-Call Schedule
- **Level 1:** Automated health checks + Slack alerts.
- **Level 2:** DevOps Lead (Antigravity AI / System Admin).

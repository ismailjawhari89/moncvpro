# Disaster Recovery Plan - MonCVPro

## Business Continuity Goals
- **Recovery Time Objective (RTO):** 4 hours.
- **Recovery Point Objective (RPO):** 1 hour (Daily backups + WAL logs).

## Backup Strategy
- **Frequency:** Daily at 02:00 AM (Central Server Time).
- **Location:** AWS S3 (Off-site, cross-region replication enabled).
- **Retention:** 30 days.
- **Encryption:** AES-256 (Server-Side).

## Recovery Scenarios

### Scenario 1: Database Corruption/Loss
1. Stop all write traffic (Maintenance mode).
2. Download the latest successful backup from S3: `backups/backup-YYYY-MM-DD.sql`.
3. Provision a new PostgreSQL instance.
4. Restore data: `psql -f backup.sql DATABASE_URL`.
5. Point the backend service to the new DB URL.

### Scenario 2: Service Provider Outage (Vercel/Railway)
1. Redirect DNS to failover provider (e.g., Netlify/AWS Lambda).
2. Deploy the latest stable code using prebuild images from Docker Hub.
3. Update environment variables.

### Scenario 3: Compromised Account/Secrets
1. Rotate all secrets immediately (Railway/Vercel ENV).
2. Revoke all active JWT sessions: `prisma.refreshToken.updateMany({ data: { isRevoked: true } })`.
3. Invalidate current SSL certificates and reissue.

## Testing & Verification
- **Monthly Drill:** On the first Sunday of every month, restore a backup to a test environment.
- **Integrity Check:** Verify that users and encrypted CVs can still be decrypted after restoration.

# MonCVPro Operations Guide

## 🎯 Overview

This guide covers day-to-day operations, monitoring, and incident response for MonCVPro in production.

## 📊 Monitoring Dashboards

### Primary Dashboards

1. **Application Performance** (DataDog/New Relic)
   - URL: https://app.datadoghq.com/dashboard/moncvpro
   - Metrics: API latency, error rates, throughput

2. **Error Tracking** (Sentry)
   - URL: https://sentry.io/organizations/moncvpro
   - Real-time error alerts and stack traces

3. **Uptime Monitoring** (Pingdom)
   - URL: https://my.pingdom.com
   - 99.9% uptime SLA tracking

4. **Database Performance** (PostgreSQL)
   - Slow query log
   - Connection pool status
   - Index usage

## 🚨 Alert Configuration

### Critical Alerts (Immediate Response)

| Alert | Threshold | Action |
|-------|-----------|--------|
| API Down | 2 consecutive failures | Page on-call engineer |
| Error Rate > 5% | 5 minutes | Investigate immediately |
| Database CPU > 90% | 10 minutes | Scale database |
| Disk Space < 10% | N/A | Add storage |
| SSL Expiry < 7 days | N/A | Renew certificate |

### Warning Alerts (Monitor)

| Alert | Threshold | Action |
|-------|-----------|--------|
| API Latency > 500ms | p95 for 15 min | Review performance |
| Error Rate > 1% | 15 minutes | Monitor trends |
| Memory Usage > 80% | 30 minutes | Consider scaling |
| Cache Hit Rate < 60% | 1 hour | Review cache strategy |

## 🔍 Common Operations

### Checking Application Health

```bash
# Health check
curl https://api.moncvpro.com/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2026-01-02T00:00:00.000Z",
  "uptime": 86400,
  "checks": {
    "database": "OK",
    "redis": "OK",
    "diskSpace": "OK"
  }
}
```

### Viewing Logs

```bash
# Backend logs
docker-compose logs -f backend --tail=100

# Frontend logs
docker-compose logs -f frontend --tail=100

# Database logs
docker-compose logs -f postgres --tail=100

# Filter by error level
docker-compose logs backend | grep ERROR
```

### Database Operations

```bash
# Connect to database
docker-compose exec postgres psql -U moncvpro -d moncvpro

# Check active connections
SELECT count(*) FROM pg_stat_activity;

# Check database size
SELECT pg_size_pretty(pg_database_size('moncvpro'));

# Find slow queries
SELECT query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

### Redis Operations

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Check memory usage
INFO memory

# Monitor commands in real-time
MONITOR

# Check cache hit rate
INFO stats
```

## 🔧 Maintenance Tasks

### Daily Tasks

- [ ] Review error logs in Sentry
- [ ] Check uptime dashboard
- [ ] Verify backup completion
- [ ] Monitor API latency trends

### Weekly Tasks

- [ ] Review slow query log
- [ ] Analyze cache hit rates
- [ ] Check disk space usage
- [ ] Review security alerts
- [ ] Update dependencies (if needed)

### Monthly Tasks

- [ ] Review and optimize database indexes
- [ ] Audit user access logs
- [ ] Test disaster recovery procedures
- [ ] Review and update documentation
- [ ] Capacity planning review

## 🆘 Incident Response

### Severity Levels

**P0 - Critical (Production Down)**
- Response Time: Immediate
- Examples: API completely down, database unavailable
- Action: Page on-call, start war room

**P1 - High (Degraded Performance)**
- Response Time: 15 minutes
- Examples: High error rate, slow responses
- Action: Notify team, investigate

**P2 - Medium (Non-Critical Issues)**
- Response Time: 2 hours
- Examples: Minor bugs, isolated errors
- Action: Create ticket, fix in next sprint

**P3 - Low (Cosmetic Issues)**
- Response Time: Next business day
- Examples: UI glitches, typos
- Action: Backlog for future release

### Incident Response Playbook

#### 1. API Down

```bash
# Step 1: Verify the issue
curl https://api.moncvpro.com/health

# Step 2: Check service status
docker-compose ps

# Step 3: Check logs
docker-compose logs backend --tail=100

# Step 4: Restart if needed
docker-compose restart backend

# Step 5: Verify recovery
curl https://api.moncvpro.com/health
```

#### 2. High Error Rate

```bash
# Step 1: Check Sentry for error patterns
# Visit: https://sentry.io/organizations/moncvpro

# Step 2: Identify affected endpoints
docker-compose logs backend | grep ERROR

# Step 3: Check database performance
docker-compose exec postgres psql -U moncvpro -c "SELECT * FROM pg_stat_activity;"

# Step 4: Review recent deployments
git log --oneline -10

# Step 5: Rollback if necessary
# See DEPLOYMENT.md for rollback procedures
```

#### 3. Database Performance Issues

```bash
# Step 1: Check active queries
docker-compose exec postgres psql -U moncvpro -c "
  SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
  FROM pg_stat_activity 
  WHERE state = 'active' 
  ORDER BY duration DESC;
"

# Step 2: Kill long-running queries (if needed)
docker-compose exec postgres psql -U moncvpro -c "
  SELECT pg_terminate_backend(pid) 
  FROM pg_stat_activity 
  WHERE pid = <PID>;
"

# Step 3: Check connection pool
docker-compose exec postgres psql -U moncvpro -c "
  SELECT count(*) FROM pg_stat_activity;
"

# Step 4: Restart database (last resort)
docker-compose restart postgres
```

#### 4. Redis Connection Issues

```bash
# Step 1: Check Redis status
docker-compose exec redis redis-cli ping

# Step 2: Check memory usage
docker-compose exec redis redis-cli INFO memory

# Step 3: Clear cache if needed
docker-compose exec redis redis-cli FLUSHALL

# Step 4: Restart Redis
docker-compose restart redis
```

## 🔄 Deployment Procedures

### Standard Deployment

```bash
# 1. Pull latest code
git pull origin main

# 2. Run pre-deployment checks
cd backend && npx ts-node src/scripts/pre-deploy.ts

# 3. Run migrations
npx prisma migrate deploy

# 4. Build and deploy
docker-compose build
docker-compose up -d

# 5. Verify deployment
curl https://api.moncvpro.com/health
```

### Hotfix Deployment

```bash
# 1. Create hotfix branch
git checkout -b hotfix/critical-bug

# 2. Apply fix and test locally
npm run test

# 3. Merge to main
git checkout main
git merge hotfix/critical-bug

# 4. Deploy immediately
# (CI/CD will auto-deploy or trigger manually)

# 5. Monitor closely
docker-compose logs -f backend
```

## 📈 Performance Optimization

### Identifying Bottlenecks

```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s https://api.moncvpro.com/api/v1/users/profile

# Analyze database queries
docker-compose exec postgres psql -U moncvpro -c "
  SELECT query, calls, mean_exec_time, max_exec_time 
  FROM pg_stat_statements 
  ORDER BY mean_exec_time DESC 
  LIMIT 20;
"

# Check cache hit rate
docker-compose exec redis redis-cli INFO stats | grep keyspace_hits
```

### Optimization Actions

1. **Slow API Endpoints**
   - Add caching
   - Optimize database queries
   - Add indexes

2. **High Database Load**
   - Add read replicas
   - Optimize queries
   - Increase connection pool

3. **Low Cache Hit Rate**
   - Increase TTL
   - Warm cache on startup
   - Review cache strategy

## 🔐 Security Operations

### Security Monitoring

```bash
# Check failed login attempts
docker-compose exec postgres psql -U moncvpro -c "
  SELECT email, COUNT(*) as attempts 
  FROM \"LoginAttempt\" 
  WHERE success = false 
    AND \"createdAt\" > NOW() - INTERVAL '1 hour'
  GROUP BY email 
  ORDER BY attempts DESC 
  LIMIT 10;
"

# Check locked accounts
docker-compose exec postgres psql -U moncvpro -c "
  SELECT email, \"lockUntil\" 
  FROM \"User\" 
  WHERE \"isLocked\" = true;
"

# Review audit logs
docker-compose exec postgres psql -U moncvpro -c "
  SELECT action, \"userId\", \"createdAt\" 
  FROM \"AuditLog\" 
  ORDER BY \"createdAt\" DESC 
  LIMIT 50;
"
```

### Security Incident Response

1. **Suspected Breach**
   - Immediately rotate all secrets
   - Force logout all users
   - Review audit logs
   - Contact security team

2. **DDoS Attack**
   - Enable rate limiting
   - Contact hosting provider
   - Review access logs

## 📞 Escalation Contacts

| Role | Contact | Availability |
|------|---------|--------------|
| On-Call Engineer | oncall@moncvpro.com | 24/7 |
| DevOps Lead | devops@moncvpro.com | Business hours |
| CTO | cto@moncvpro.com | Emergencies |
| Security Team | security@moncvpro.com | 24/7 |

## 📚 Additional Resources

- [Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](https://api.moncvpro.com/api-docs)
- [Runbook Repository](https://github.com/moncvpro/runbooks)
- [Status Page](https://status.moncvpro.com)

---

**Last Updated:** 2026-01-02
**Version:** 1.0.0

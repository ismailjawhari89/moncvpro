# Security Policy - MonCVPro

## Data Protection Strategy
We take security seriously. MonCVPro implements "Security by Design" principles to ensure user data remains private and secure.

### 1. Encryption
- **At Rest:** Sensitive CV data is encrypted using **AES-256-GCM** before being saved to the database.
- **In Transit:** All communications are forced over **TLS 1.3/HTTPS**.
- **Passwords:** Hashed using **bcrypt** with a high cost factor (12). We nunca store plain-text passwords.

### 2. Authentication & Authorization
- **JWT Flow:** We use short-lived Access Tokens (15 min) and long-lived Refresh Tokens (7 days).
- **Security:** Refresh tokens are stored in **HttpOnly, Secure, SameSite=Strict** cookies to prevent XSS and CSRF.
- **MFA:** Multi-Factor Authentication (TOTP) is available for all accounts.

### 3. API Security
- **Rate Limiting:** Protects against brute-force and DDoS attacks.
- **Validation:** All inputs are strictly validated using **Zod** (Frontend) and **express-validator** (Backend).
- **Headers:** Secure headers (CSP, HSTS, X-Frame-Options) are enforced via Helmet.

### 4. Infrastructure Security
- **Backups:** Daily automated backups, encrypted and stored in off-site S3 buckets.
- **Audits:** Regular automated security audits via GitHub Actions.
- **Monitoring:** Real-time error tracking and security alerting via Sentry.

## Reporting a Vulnerability
If you discover a security vulnerability, please email **security@moncvpro.com**. 
- Please provide a detailed description and steps to reproduce.
- We will respond within 24 hours.
- We ask for a 90-day responsible disclosure period.

## GDPR Compliance
MonCVPro is fully GDPR compliant:
- **Right to Access:** Users can export all their data in JSON format.
- **Right to be Forgotten:** Account deletion permanently removes all personal data from our servers.
- **Consent:** Explicit consent tracking for analytics and marketing.

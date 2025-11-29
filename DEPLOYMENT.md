# Guide de Déploiement Production - CV Master AI

## 📋 Table des Matières

1. [Pré-requis](#pré-requis)
2. [Préparation du Monorepo](#préparation-du-monorepo)
3. [Configuration des Variables d'Environnement](#configuration-des-variables-denvironnement)
4. [Build et Test Local](#build-et-test-local)
5. [Déploiement Production](#déploiement-production)
6. [Optimisation et CDN](#optimisation-et-cdn)
7. [Monitoring et Maintenance](#monitoring-et-maintenance)
8. [Sécurité](#sécurité)

---

## 1️⃣ Pré-requis

### Logiciels Requis
- **Node.js** >= 20.x
- **npm** >= 9.x
- **Git** installé
- Compte sur une plateforme de déploiement:
  - [Vercel](https://vercel.com) (recommandé pour frontend)
  - [Railway](https://railway.app) (recommandé pour backend)
  - [Render](https://render.com) (alternative)

### API Keys (Optionnel)
- **Gemini API Key** ou **OpenAI API Key** pour les fonctionnalités AI
- **Google AdSense ID** pour la monétisation

---

## 2️⃣ Préparation du Monorepo

### Cloner et Installer

```bash
# Cloner le projet
git clone https://github.com/votre-compte/moncvpro.git
cd moncvpro

# Installer toutes les dépendances
npm run install:all
```

### Structure Vérifiée

```
/moncvpro
├── /frontend          # Application Next.js
├── /backend           # API Express + TypeScript
├── /storage           # Fichiers uploadés
├── package.json       # Scripts racine
├── README.md
├── DEPLOYMENT.md      # Ce fichier
├── .env.example
└── .gitignore
```

---

## 3️⃣ Configuration des Variables d'Environnement

### Frontend (.env.local)

Créer `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://votre-backend.railway.app
NEXT_PUBLIC_APP_NAME=CV Master AI

# AdSense (Optionnel)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxx

# Locale par défaut
NEXT_PUBLIC_DEFAULT_LOCALE=ar
```

### Backend (.env)

Créer `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL="file:./production.db"
# Pour PostgreSQL: DATABASE_URL="postgresql://user:password@host:5432/dbname"

# CORS
ALLOWED_ORIGINS=https://votre-frontend.vercel.app,https://cv-master-ai.com

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./storage/uploads

# AI Services (Optionnel)
GEMINI_API_KEY=votre-gemini-api-key
OPENAI_API_KEY=votre-openai-api-key

# JWT
JWT_SECRET=votre-secret-super-securise-changez-moi
JWT_EXPIRES_IN=7d
```

### Variables d'Environnement de Production

**⚠️ IMPORTANT**: Ne jamais committer les fichiers `.env` dans Git!

Ajouter à `.gitignore`:
```
.env
.env.local
.env.production
*.db
node_modules/
```

---

## 4️⃣ Build et Test Local

### Backend

```bash
cd backend

# Build TypeScript
npm run build

# Générer Prisma Client
npx prisma generate

# Migrer la base de données
npx prisma migrate deploy

# Démarrer en mode production
npm start
```

**Vérification**: http://localhost:3001

### Frontend

```bash
cd frontend

# Build Next.js
npm run build

# Démarrer en mode production
npm start
```

**Vérification**: http://localhost:3000

### Tests de Fonctionnalités

- [ ] Landing page s'affiche correctement
- [ ] Dashboard accessible
- [ ] Templates Gallery fonctionne (drag-drop, favoris, carousel)
- [ ] CV Editor avec live preview
- [ ] Changement de langue (AR/FR)
- [ ] AI Features (si API keys configurées)
- [ ] Export PDF/DOCX/PNG

---

## 5️⃣ Déploiement Production

### Option A: Vercel (Frontend) + Railway (Backend)

#### 🚀 Déployer le Frontend sur Vercel

1. **Connecter le Repository**
   - Aller sur [Vercel](https://vercel.com)
   - Importer le projet GitHub
   - Sélectionner le dossier `frontend`

2. **Configuration Vercel**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Variables d'Environnement**
   
   Dans Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://votre-backend.railway.app
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxx
   NEXT_PUBLIC_DEFAULT_LOCALE=ar
   ```

4. **Déployer**
   - Cliquer sur "Deploy"
   - Attendre la fin du build
   - Votre frontend sera disponible sur: `https://votre-app.vercel.app`

#### 🚂 Déployer le Backend sur Railway

1. **Créer un Nouveau Projet**
   - Aller sur [Railway](https://railway.app)
   - New Project → Deploy from GitHub repo
   - Sélectionner votre repository

2. **Configuration Railway**
   ```
   Root Directory: backend
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Variables d'Environnement**
   
   Dans Railway Dashboard → Variables:
   ```
   PORT=3001
   NODE_ENV=production
   DATABASE_URL=file:./production.db
   ALLOWED_ORIGINS=https://votre-app.vercel.app
   GEMINI_API_KEY=votre-key
   JWT_SECRET=votre-secret
   ```

4. **Générer un Domaine**
   - Settings → Generate Domain
   - Copier l'URL (ex: `https://moncvpro-backend.railway.app`)
   - Mettre à jour `NEXT_PUBLIC_API_URL` dans Vercel

5. **Déployer**
   - Railway déploie automatiquement
   - Vérifier les logs pour confirmer le démarrage

### Option B: Render (Full Stack)

#### Frontend sur Render

1. **Créer un Static Site**
   - New → Static Site
   - Connecter le repository
   - Root Directory: `frontend`
   - Build Command: `npm run build && npm run export`
   - Publish Directory: `out`

2. **Variables d'Environnement**
   ```
   NEXT_PUBLIC_API_URL=https://votre-backend.onrender.com
   ```

#### Backend sur Render

1. **Créer un Web Service**
   - New → Web Service
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

2. **Variables d'Environnement**
   - Ajouter toutes les variables du `.env`

---

## 6️⃣ Optimisation et CDN

### Frontend Optimization

#### Next.js Configuration

Mettre à jour `frontend/next.config.js`:

```javascript
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizations
  swcMinify: true,
  compress: true,
  
  // Images
  images: {
    domains: ['votre-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
```

### CDN Configuration

#### Vercel CDN (Automatique)
- Vercel active automatiquement le CDN global
- Caching automatique pour les assets statiques
- Edge Functions pour les API routes

#### Cloudflare (Optionnel)
1. Ajouter votre domaine à Cloudflare
2. Pointer les DNS vers Vercel
3. Activer le proxy CDN
4. Configurer les règles de cache

### Image Optimization

Backend - Compression avec Sharp:

```typescript
// backend/src/utils/imageOptimizer.ts
import sharp from 'sharp';

export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
}
```

---

## 7️⃣ Monitoring et Maintenance

### Logging

#### Backend Logging

Installer Winston:

```bash
cd backend
npm install winston
```

Créer `backend/src/utils/logger.ts`:

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

Utilisation:

```typescript
import logger from './utils/logger';

logger.info('CV exported successfully', { cvId, format: 'pdf' });
logger.error('Export failed', { error: error.message });
```

### Error Handling

Middleware global d'erreurs:

```typescript
// backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
  });
}
```

### Database Backups

#### SQLite Backup Script

Créer `backend/scripts/backup-db.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_FILE="./prisma/production.db"

mkdir -p $BACKUP_DIR
cp $DB_FILE "$BACKUP_DIR/backup_$DATE.db"

# Garder seulement les 30 derniers backups
ls -t $BACKUP_DIR/backup_*.db | tail -n +31 | xargs rm -f

echo "Backup created: backup_$DATE.db"
```

Ajouter à `package.json`:

```json
{
  "scripts": {
    "backup": "bash scripts/backup-db.sh"
  }
}
```

Cron job (Linux/Mac):

```bash
# Backup quotidien à 2h du matin
0 2 * * * cd /path/to/backend && npm run backup
```

#### Migration vers PostgreSQL (Recommandé pour Production)

1. **Installer PostgreSQL**

2. **Mettre à jour Prisma Schema**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Nouvelle DATABASE_URL**:

```env
DATABASE_URL="postgresql://user:password@host:5432/cvmasterai?schema=public"
```

4. **Migrer**:

```bash
npx prisma migrate deploy
```

### Monitoring Services

#### Vercel Analytics
- Activer dans Vercel Dashboard → Analytics
- Suivi automatique des performances

#### Railway Metrics
- Dashboard → Metrics
- CPU, Memory, Network usage

#### Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/nextjs
```

Configuration:

```typescript
// backend/src/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 8️⃣ Sécurité

### HTTPS
- ✅ Vercel et Railway fournissent HTTPS automatiquement
- ✅ Certificats SSL gratuits

### CORS
```typescript
// backend/src/index.ts
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

### Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite par IP
});

app.use('/api/', limiter);
```

### Helmet (Security Headers)

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

---

## 9️⃣ Analytics & Monetization

### Google AdSense

Déjà intégré! Vérifier:
- `frontend/src/app/[locale]/layout.tsx` - Script AdSense
- `frontend/src/components/ads/AdSense.tsx` - Composant

### Google Analytics

```bash
npm install @next/third-parties
```

```typescript
// frontend/src/app/[locale]/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
```

---

## 🎯 Checklist Post-Déploiement

### Fonctionnalités
- [ ] Landing page accessible
- [ ] Dashboard fonctionne
- [ ] Templates Gallery (drag-drop, favoris, carousel, color picker)
- [ ] CV Editor avec live preview
- [ ] Changement de langue AR/FR
- [ ] RTL/LTR correct
- [ ] Welcome Modal s'affiche
- [ ] AI Features fonctionnent
- [ ] Export PDF/DOCX/PNG

### Performance
- [ ] Lighthouse Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Images optimisées (WebP/AVIF)

### Sécurité
- [ ] HTTPS activé
- [ ] CORS configuré
- [ ] Rate limiting actif
- [ ] Headers de sécurité (Helmet)
- [ ] Variables sensibles dans .env

### Monitoring
- [ ] Logs backend fonctionnent
- [ ] Error tracking configuré
- [ ] Backups automatiques
- [ ] Analytics actif

---

## 🚀 Commandes Utiles

### Développement
```bash
npm run dev              # Démarrer frontend + backend
npm run install:all      # Installer toutes les dépendances
```

### Production
```bash
npm run build            # Build frontend + backend
npm run prisma:generate  # Générer Prisma Client
npm run prisma:migrate   # Migrer la DB
npm run backup           # Backup de la DB
```

### Maintenance
```bash
npm run prisma:studio    # Interface DB
npm run logs             # Voir les logs
```

---

## 📞 Support

Pour toute question ou problème:
- Documentation: [README.md](./README.md)
- API Docs: [API.md](./API.md)
- Issues: GitHub Issues

---

**Dernière mise à jour**: Novembre 2025  
**Version**: 1.0.0  
**Statut**: Production Ready 🚀

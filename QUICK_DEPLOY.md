# 🚀 Guide de Déploiement Rapide - CV Master AI

## Étape 1: Préparer le Code

### 1.1 Vérifier que tout fonctionne localement

```bash
# Backend
cd backend
npm run build
npm run dev

# Frontend (nouveau terminal)
cd frontend
npm run build
npm run dev
```

✅ Vérifier: http://localhost:3000 et http://localhost:3001

---

## Étape 2: Créer un Repository GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - CV Master AI"

# Créer un repo sur GitHub puis:
git remote add origin https://github.com/VOTRE-USERNAME/moncvpro.git
git branch -M main
git push -u origin main
```

---

## Étape 3: Déployer le Frontend sur Vercel

### 3.1 Aller sur [vercel.com](https://vercel.com)

1. **Sign up / Login** avec GitHub
2. **Import Project** → Sélectionner votre repository
3. **Configure Project**:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### 3.2 Ajouter les Variables d'Environnement

Dans Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://VOTRE-BACKEND.railway.app
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxx
NEXT_PUBLIC_DEFAULT_LOCALE=ar
```

⚠️ **Note**: Vous ajouterez l'URL du backend après l'étape 4

### 3.3 Déployer

- Cliquer sur **Deploy**
- Attendre 2-3 minutes
- Votre frontend sera sur: `https://VOTRE-APP.vercel.app`

---

## Étape 4: Déployer le Backend sur Railway

### 4.1 Aller sur [railway.app](https://railway.app)

1. **Sign up / Login** avec GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Sélectionner votre repository

### 4.2 Configurer le Service

1. **Settings** → **Root Directory**: `backend`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`

### 4.3 Ajouter les Variables d'Environnement

Dans Railway Dashboard → Variables:

```env
PORT=3001
NODE_ENV=production
DATABASE_URL=file:./production.db
ALLOWED_ORIGINS=https://VOTRE-APP.vercel.app
JWT_SECRET=CHANGEZ-MOI-SECRET-SUPER-SECURISE-123456
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./storage/uploads

# NOTE: Les clés API AI (Gemini/OpenAI) 
# sont maintenant gérées par le Cloudflare Worker via 'wrangler secret put'.
# Voir backend-worker/README.md ou utiliser ./set-secrets.sh

```

### 4.4 Générer un Domaine

1. **Settings** → **Generate Domain**
2. Copier l'URL (ex: `https://moncvpro-production.up.railway.app`)

### 4.5 Déployer

- Railway déploie automatiquement
- Vérifier les **Logs** pour confirmer le démarrage
- Tester: `https://VOTRE-BACKEND.railway.app/health`

---

## Étape 5: Connecter Frontend et Backend

### 5.1 Mettre à jour Vercel

1. Aller dans **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Modifier `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://VOTRE-BACKEND.railway.app
   ```
3. **Redéployer** le frontend (Deployments → ... → Redeploy)

### 5.2 Mettre à jour Railway

1. Aller dans **Railway Dashboard** → **Variables**
2. Modifier `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://VOTRE-APP.vercel.app
   ```
3. Railway redéploie automatiquement

---

## Étape 6: Initialiser la Base de Données

### 6.1 Via Railway CLI (Optionnel)

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Lier au projet
railway link

# Exécuter les migrations
railway run npx prisma migrate deploy
```

### 6.2 Via Railway Dashboard

1. **Settings** → **Deploy Trigger**
2. Ajouter un script de démarrage dans `package.json`:
   ```json
   {
     "scripts": {
       "start": "npx prisma migrate deploy && node dist/index.js"
     }
   }
   ```

---

## Étape 7: Vérification Finale

### ✅ Checklist

- [ ] Frontend accessible sur Vercel
- [ ] Backend accessible sur Railway
- [ ] Landing page s'affiche correctement
- [ ] Templates Gallery fonctionne
- [ ] Changement de langue (AR/FR) fonctionne
- [ ] CV Editor accessible
- [ ] Live preview fonctionne
- [ ] Drag & Drop fonctionne
- [ ] Favoris fonctionnent
- [ ] Color Picker fonctionne (Modern templates)
- [ ] Mobile responsive
- [ ] Export PDF fonctionne (si Puppeteer installé)

### 🧪 Tests

```bash
# Test Backend
curl https://VOTRE-BACKEND.railway.app/health

# Test Frontend
# Ouvrir https://VOTRE-APP.vercel.app dans le navigateur
```

---

## Étape 8: Configuration du Domaine Personnalisé (Optionnel)

### 8.1 Vercel (Frontend)

1. **Settings** → **Domains**
2. Ajouter votre domaine: `cv-master-ai.com`
3. Configurer les DNS chez votre registrar:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

### 8.2 Railway (Backend)

1. **Settings** → **Custom Domain**
2. Ajouter: `api.cv-master-ai.com`
3. Configurer les DNS:
   ```
   Type: CNAME
   Name: api
   Value: VOTRE-APP.up.railway.app
   ```

---

## 🔧 Dépannage

### Problème: Frontend ne peut pas contacter le Backend

**Solution**:
1. Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
2. Vérifier `ALLOWED_ORIGINS` dans Railway
3. Vérifier que le backend est démarré (Railway Logs)

### Problème: Erreur 500 sur le Backend

**Solution**:
1. Vérifier les **Logs** dans Railway
2. Vérifier que toutes les variables d'environnement sont définies
3. Vérifier que Prisma est généré: `npx prisma generate`

### Problème: Export PDF ne fonctionne pas

**Solution**:
1. Puppeteer nécessite des dépendances système
2. Railway les installe automatiquement
3. Vérifier les logs pour les erreurs Puppeteer

---

## 📊 Monitoring

### Vercel Analytics

1. **Analytics** → Activer
2. Voir les métriques de performance

### Railway Metrics

1. **Metrics** → Voir CPU, Memory, Network
2. Configurer des alertes si nécessaire

---

## 🔄 Mises à Jour

### Déploiement Automatique

Vercel et Railway déploient automatiquement à chaque push sur `main`:

```bash
git add .
git commit -m "Update: nouvelle fonctionnalité"
git push origin main
```

### Déploiement Manuel

**Vercel**:
- Dashboard → Deployments → Redeploy

**Railway**:
- Dashboard → Deploy → Redeploy

---

## 💡 Conseils

1. **Toujours tester localement** avant de déployer
2. **Utiliser des branches** pour les nouvelles fonctionnalités
3. **Monitorer les logs** régulièrement
4. **Faire des backups** de la base de données
5. **Documenter** les changements

---

## 🎉 Félicitations!

Votre plateforme **CV Master AI** est maintenant en production! 🚀

**URLs**:
- Frontend: `https://VOTRE-APP.vercel.app`
- Backend: `https://VOTRE-BACKEND.railway.app`
- API Health: `https://VOTRE-BACKEND.railway.app/health`

---

## 📞 Besoin d'Aide?

- 📖 [Documentation Complète](./DEPLOYMENT.md)
- 🐛 [GitHub Issues](https://github.com/VOTRE-USERNAME/moncvpro/issues)
- 💬 [Vercel Support](https://vercel.com/support)
- 🚂 [Railway Support](https://railway.app/help)

---

**Temps estimé**: 30-45 minutes  
**Coût**: Gratuit (tier gratuit Vercel + Railway)  
**Difficulté**: ⭐⭐☆☆☆ (Facile)

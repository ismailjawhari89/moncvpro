# CV Master AI

![CV Master AI](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Plateforme professionnelle de création de CV avec Intelligence Artificielle**

🌐 **Support Bilingue**: Arabe (RTL) + Français (LTR)  
🎨 **10 Modèles Professionnels**: Modern, Classic, Elegant  
🤖 **AI-Powered**: Smart Rewrite, ATS Optimization, Layout Suggestions  
📄 **Export Multi-Format**: PDF, DOCX, PNG

---

## ✨ Fonctionnalités

### 🎨 Templates Gallery
- **10 modèles professionnels** (4 Modern, 3 Classic, 3 Elegant)
- **Drag & Drop** pour réorganiser les templates
- **Système de favoris** avec localStorage
- **Color Picker** pour personnaliser les couleurs (Modern templates)
- **Mobile Carousel** avec Swiper
- **Live Preview** avec modal

### 🌍 Support Bilingue
- **Arabe** (RTL) avec police Cairo
- **Français** (LTR) avec police Inter
- **Language Switcher** intégré
- **Traductions complètes** de l'interface

### 🤖 AI Features
- **Smart Rewrite** - Réécriture intelligente par champ
- **Suggested Layouts** - Recommandation de template basée sur le profil
- **Enhanced ATS Score** - Score détaillé avec feedback
- **Image Enhancement** - Amélioration de la photo de profil

### 📤 Export System
- **PDF Export** - Haute qualité avec Puppeteer
- **DOCX Export** - Format Microsoft Word
- **PNG Export** - Image haute résolution

### 🎯 Onboarding & UX
- **Welcome Modal** - 3 étapes pour les nouveaux utilisateurs
- **Feature Tooltips** - Aide contextuelle
- **CV Steps Dynamiques** - Gestion depuis le backend

---

## 🚀 Démarrage Rapide

### Pré-requis
- Node.js >= 20.x
- npm >= 9.x

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-compte/moncvpro.git
cd moncvpro

# Installer toutes les dépendances
npm run install:all
```

### Configuration

1. **Frontend** - Créer `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxx
```

2. **Backend** - Créer `backend/.env`:
```env
PORT=3001
DATABASE_URL="file:./dev.db"
GEMINI_API_KEY=votre-api-key
JWT_SECRET=votre-secret
```

### Lancer en Développement

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 📁 Structure du Projet

```
/moncvpro
├── /frontend                 # Application Next.js 14
│   ├── /src
│   │   ├── /app             # Pages (App Router)
│   │   │   └── [locale]/    # Routes i18n
│   │   ├── /components
│   │   │   ├── /templates   # 10 CV templates
│   │   │   ├── /editor      # CV Editor
│   │   │   ├── /onboarding  # Welcome Modal, Tooltips
│   │   │   └── /landing     # Landing page
│   │   ├── /i18n            # Traductions (ar.json, fr.json)
│   │   ├── /lib             # Utilities
│   │   └── /types           # TypeScript types
│   └── middleware.ts        # i18n middleware
│
├── /backend                  # API Express + TypeScript
│   ├── /src
│   │   ├── /controllers     # Business logic
│   │   ├── /routes          # API routes
│   │   ├── /middleware      # Error handling, logging
│   │   └── /utils           # Logger, helpers
│   ├── /prisma
│   │   └── schema.prisma    # Database schema
│   └── /scripts             # Backup scripts
│
├── /storage                  # Uploaded files
├── DEPLOYMENT.md            # Guide de déploiement
├── API.md                   # Documentation API
└── package.json             # Scripts racine
```

---

## 🎨 Templates Disponibles

### Modern (4)
1. **Modern Blue** - Design épuré avec accents bleus
2. **Modern Green** - Palette verte vibrante
3. **Modern Orange** - Accents orange dynamiques
4. **Modern Violet** - En-tête dégradé élégant

### Classic (3)
5. **Classic Professional** - Style formel avec serif
6. **Classic Minimal** - Typographie légère
7. **Classic Corporate** - En-tête sombre corporate

### Elegant (3)
8. **Elegant Minimal** - Design ultra-propre
9. **Elegant Serif** - Layout centré
10. **Elegant Clean** - Lignes épurées

---

## 🔌 API Endpoints

### CV Operations
```
GET    /api/cv           # Liste des CVs
POST   /api/cv           # Créer un CV
GET    /api/cv/:id       # Récupérer un CV
PUT    /api/cv/:id       # Mettre à jour
DELETE /api/cv/:id       # Supprimer
```

### AI Services
```
POST /api/ai/suggest-layout    # Suggérer un template
POST /api/ai/smart-rewrite     # Réécriture intelligente
POST /api/ai/enhanced-ats      # Score ATS détaillé
POST /api/ai/enhance-image     # Améliorer l'image
```

### Export
```
POST /api/export/pdf     # Export PDF
POST /api/export/docx    # Export DOCX
POST /api/export/png     # Export PNG
```

### CV Steps
```
GET    /api/cv-steps     # Liste des étapes
POST   /api/cv-steps     # Créer une étape
PUT    /api/cv-steps/:id # Mettre à jour
DELETE /api/cv-steps/:id # Supprimer
```

---

## 🛠️ Technologies

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **ShadCN** - UI components
- **next-intl** - Internationalization
- **@dnd-kit** - Drag & Drop
- **Swiper** - Mobile carousel
- **react-color** - Color picker

### Backend
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **SQLite** - Database (dev)
- **Puppeteer** - PDF export
- **docx** - DOCX export
- **Sharp** - Image processing
- **Winston** - Logging

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement production
- **[API.md](./API.md)** - Documentation API complète
- **[FREE_FEATURES.md](./FREE_FEATURES.md)** - Liste des fonctionnalités gratuites

---

## 🚀 Déploiement Production

### Vercel (Frontend)
```bash
# Connecter à Vercel
vercel

# Définir les variables d'environnement
vercel env add NEXT_PUBLIC_API_URL

# Déployer
vercel --prod
```

### Railway (Backend)
```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Déployer
railway up
```

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet.

---

## 🔒 Sécurité

- ✅ HTTPS automatique (Vercel/Railway)
- ✅ CORS configuré
- ✅ Rate limiting
- ✅ Helmet (security headers)
- ✅ Variables d'environnement sécurisées
- ✅ JWT authentication ready

---

## 📊 Performance

- ✅ Next.js optimizations
- ✅ CDN global (Vercel)
- ✅ Image optimization
- ✅ Code splitting
- ✅ Caching strategy

---

## 🤝 Contribution

Les contributions sont les bienvenues! Veuillez:

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**CV Master AI Team**

- Website: [cv-master-ai.com](https://cv-master-ai.com)
- GitHub: [@votre-compte](https://github.com/votre-compte)

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Railway](https://railway.app/)
- [Prisma](https://www.prisma.io/)
- [ShadCN](https://ui.shadcn.com/)

---

## 📞 Support

Pour toute question ou problème:
- 📧 Email: support@cv-master-ai.com
- 💬 GitHub Issues: [Issues](https://github.com/votre-compte/moncvpro/issues)
- 📖 Documentation: [Docs](https://docs.cv-master-ai.com)

---

**Made with ❤️ by CV Master AI Team**
#   T r i g g e r   r e d e p l o y  
 
# 🏐 LCVB Scoreboard Pro - Plateforme Complète de Gestion Sportive

**Plateforme tout-en-un** pour la gestion complète d'un club de volley-ball : suivi live des matchs, statistiques avancées, diffusion OBS, gestion des équipes et analyse de performance.

Développé pour **Le Crès Volley-Ball** 🇫🇷

---

## 🚀 Démarrage Rapide

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/votre-org/LCVB-Scoreboard.git
cd LCVB-Scoreboard

# 2. Installer les dépendances backend
cd server && npm install && cd ..

# 3. Démarrer tout avec un seul script
./start.sh
```

Le script `start.sh` démarre automatiquement:
- ✅ PostgreSQL (Docker)
- ✅ Backend API (Node.js/Express)
- ✅ Frontend (serveur HTTP)

Accédez à **http://localhost:8000/login.html** pour commencer !

### Identifiants de test
- **Email:** test@test.com
- **Mot de passe:** test@test.com

---

## 📖 Table des Matières

1. [Vision Globale](#-vision-globale)
2. [Architecture](#-architecture)
3. [Modules de la Solution](#-modules-de-la-solution)
4. [Installation Détaillée](#-installation-détaillée)
5. [Utilisation](#-utilisation)
6. [API Documentation](#-api-documentation)
7. [Roadmap](#-roadmap)
8. [Contribution](#-contribution)

---

## 🎯 Vision Globale

LCVB Scoreboard Pro est la **plateforme centrale de gestion sportive** du club, regroupant :

### 🏐 Fonctionnalités Actuelles
- ✅ **Suivi live des matchs** avec scoreboard temps réel
- ✅ **Saisie et analyse des statistiques** détaillées par joueur
- ✅ **Intégration OBS** pour diffusion professionnelle
- ✅ **Statistiques par set** avec export JSON/CSV
- ✅ **Mode spectateur** pour affichage public
- ✅ **Thème dark/light** synchronisé
- ✅ **Backend API REST** avec PostgreSQL
- ✅ **Authentification** sécurisée (JWT)

### 🚧 En Développement
- 🔄 **Hub du club** avec gestion des équipes et joueurs
- 🔄 **Gestion des matchs** (calendrier, diffusions)
- 🔄 **Système de sponsors** rotatif pour les lives
- 🔄 **Actualités et événements** du club
- 🔄 **Dashboard VolleyAI** pour analyse avancée
- 🔄 **Templates de live** pré-configurés
- 🔄 **Export automatique** vers volleyai.twittiz.fr

### 🎯 Objectif Final
Permettre à chaque **coach** de consulter les statistiques détaillées de son équipe (attaques, réceptions, blocs, fautes, etc.) pour **améliorer la performance sportive** à partir des données collectées en match.

---

## 🏗️ Architecture

### Stack Technique

#### Frontend
- **HTML5 + CSS3** (Vanilla JS)
- **Thèmes dynamiques** (CSS Variables)
- **Chart.js** pour les graphiques
- **localStorage** + API REST

#### Backend
- **Node.js 18+** avec Express
- **PostgreSQL 15** (via Docker)
- **JWT** pour l'authentification
- **Helmet** + CORS pour la sécurité

#### Infrastructure
- **Docker Compose** pour PostgreSQL + pgAdmin
- **Nginx** (recommandé en production)
- **PM2** pour le process management

### Architecture Système

```
┌─────────────────────────────────────────────────┐
│           LCVB Scoreboard Pro                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (Browser)                             │
│  ├─ login.html          → Authentification     │
│  ├─ home.html           → Hub club             │
│  ├─ teams.html          → Gestion équipes      │
│  ├─ setup.html          → Config match         │
│  ├─ control.html        → Suivi live           │
│  ├─ control_mobile.html → Version mobile       │
│  ├─ stats.html          → Statistiques         │
│  ├─ spectator.html      → Mode public          │
│  └─ settings.html       → Paramètres           │
│                                                 │
│  Backend API (Node.js/Express)                  │
│  ├─ /api/auth          → Authentification      │
│  ├─ /api/teams         → CRUD équipes          │
│  ├─ /api/players       → CRUD joueurs          │
│  ├─ /api/matches       → CRUD matchs           │
│  ├─ /api/stats         → Statistiques          │
│  ├─ /api/sponsors      → Sponsors              │
│  ├─ /api/news          → Actualités            │
│  ├─ /api/events        → Événements            │
│  └─ /api/settings      → Paramètres            │
│                                                 │
│  Base de Données (PostgreSQL)                   │
│  ├─ users              → Utilisateurs          │
│  ├─ teams              → Équipes               │
│  ├─ players            → Joueurs               │
│  ├─ lineups            → Compositions (7 de base)│
│  ├─ matches            → Matchs                │
│  ├─ match_stats        → Stats complètes       │
│  ├─ player_match_stats → Stats joueurs         │
│  ├─ sponsors           → Sponsors              │
│  ├─ news               → Actualités            │
│  ├─ events             → Calendrier            │
│  ├─ settings           → Configuration         │
│  └─ activity_logs      → Audit                 │
│                                                 │
│  Intégrations Externes                          │
│  ├─ OBS Studio         → Diffusion live        │
│  ├─ VolleyAI           → Analyse avancée       │
│  └─ YouTube/Twitch     → Streaming             │
└─────────────────────────────────────────────────┘
```

---

## 📦 Modules de la Solution

### 1️⃣ Module Authentification & Hub Club
**Fichiers:** `login.html`, `home.html`

- Connexion sécurisée (JWT)
- Gestion des rôles (admin, coach, operator, statistician)
- Dashboard central du club
- Accès rapide aux fonctions clés
- Statistiques globales

### 2️⃣ Module Gestion des Équipes
**Fichiers:** `teams.html`, `lineups.html`

- ✅ CRUD équipes (création, modification, suppression)
- ✅ CRUD joueurs (numéro, nom, position, libéro)
- ✅ Gestion des "7 de base" sauvegardés (compositions)
- ✅ Positionnement visuel des joueurs (P1-P6 + libéro)
- ✅ Composition par défaut pour chaque équipe
- Photos et informations joueurs
- Historique par équipe

### 3️⃣ Module Configuration Match
**Fichier:** `setup.html`

- Sélection équipes (domicile/extérieur)
- Informations officielles (date, lieu, arbitre, compétition)
- Configuration diffusion (URL live, sponsors)
- Paramètres statistiques
- Sauvegarde brouillon

### 4️⃣ Module Suivi Live
**Fichiers:** `control.html`, `control_mobile.html`

- Scoreboard interactif temps réel
- Gestion sets et rotations
- Timeouts et cartons
- Changements de joueurs
- Actions directes (point eux/nous)
- Export JSON automatique

### 5️⃣ Module Statistiques
**Fichier:** `stats.html`

- Workflow complet volley (service → réception → passe → attaque → bloc → défense)
- Statistiques par set détaillées
- Statistiques globales par joueur
- Timeline des actions
- Export CSV pour analyse

### 6️⃣ Module Affichage Public
**Fichiers:** `spectator.html`, `display.html`

- Mode spectateur (lecture seule)
- Iframe pour stream live
- Affichage OBS (Browser Source)
- Rotation sponsors automatique
- Actualités en direct

### 7️⃣ Module Paramètres
**Fichier:** `settings.html`

- Personnalisation club (logo, couleurs)
- Gestion sponsors
- Configuration OBS
- Préférences utilisateur
- Thème dark/light

---

## 🛠️ Installation Détaillée

### Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **Docker Desktop** ([télécharger](https://www.docker.com/products/docker-desktop))
- **Git** ([télécharger](https://git-scm.com/))
- **Navigateur moderne** (Chrome, Firefox, Edge, Safari)

### Installation Complète

#### 1. Cloner le projet
```bash
git clone https://github.com/votre-org/LCVB-Scoreboard.git
cd LCVB-Scoreboard
```

#### 2. Configuration Backend
```bash
# Installer les dépendances
cd server
npm install

# Copier le fichier .env (déjà configuré pour le développement)
# Pas besoin de modification pour le dev local

# Revenir à la racine
cd ..
```

#### 3. Démarrer PostgreSQL
```bash
# Démarrer avec Docker Compose
docker-compose up -d

# Vérifier que c'est démarré
docker ps
```

Vous devriez voir:
- `lcvb_postgres` sur le port 5432
- `lcvb_pgadmin` sur le port 5050

#### 4. Démarrer le Backend
```bash
cd server
npm run dev
```

Le backend sera accessible sur **http://localhost:3000**

#### 5. Démarrer le Frontend
```bash
# Dans un nouveau terminal, à la racine du projet
# Option 1: Python 3
python3 -m http.server 8000

# Option 2: Python 2
python -m SimpleHTTPServer 8000

# Option 3: Node.js http-server
npx http-server -p 8000
```

Le frontend sera accessible sur **http://localhost:8000**

### ⚡ Méthode Rapide (Recommandée)

```bash
# À la racine du projet
./start.sh
```

Ce script démarre automatiquement PostgreSQL, Backend et Frontend.

Pour arrêter:
```bash
./stop.sh
```

---

## 🎮 Utilisation

### Première Connexion

1. Ouvrir **http://localhost:8000/login.html**
2. Se connecter avec:
   - Email: `test@test.com`
   - Mot de passe: `test@test.com`
3. Vous arrivez sur le **hub du club**

### Workflow Complet d'un Match

#### Avant le Match

1. **Créer les équipes** (si pas encore fait)
   - Aller dans "Gestion Équipes"
   - Ajouter équipe domicile et visiteurs
   - Ajouter les joueurs

2. **Définir les 7 de base** (optionnel)
   - Créer des compositions sauvegardées
   - Positions P1 à P6 + libéro

3. **Configurer le match**
   - Aller dans "Initialisation Match"
   - Sélectionner les équipes
   - Remplir infos officielles
   - Configurer diffusion si besoin
   - Valider

#### Pendant le Match

4. **Lancer le suivi live**
   - Accéder à "Contrôle Match" (desktop ou mobile)
   - Positionner les joueurs sur le terrain
   - Cliquer "Démarrer le Point"
   - Suivre le workflow: Service → Réception → Passe → Attaque → Bloc → Défense
   - Valider le point
   - Répéter

5. **Gérer le match**
   - Timeouts (max 2 par équipe par set)
   - Cartons (jaune/rouge)
   - Changements de joueurs
   - Passer au set suivant avec "Set +1"

#### Après le Match

6. **Terminer et analyser**
   - Cliquer "🏁 Fin"
   - Export JSON automatique
   - Redirection vers stats.html
   - Consulter statistiques détaillées
   - Export CSV si besoin

### Mode Spectateur

1. Ouvrir **spectator.html** sur un écran public
2. Configurer l'iframe (URL stream YouTube/Twitch)
3. Les spectateurs voient le score en temps réel

### Intégration OBS

1. Dans OBS, ajouter une **Browser Source**
2. URL: `http://localhost:8000/display.html`
3. Dimensions: 1920x1080
4. Les sponsors tournent automatiquement

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentification

Toutes les routes (sauf `/auth/login`) nécessitent un token JWT dans le header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Endpoints Principaux

#### Auth
```bash
# Login
POST /api/auth/login
Body: { "email": "test@test.com", "password": "test@test.com" }
Response: { "success": true, "token": "...", "user": {...} }

# Verify token
GET /api/auth/verify
Header: Authorization: Bearer TOKEN
Response: { "success": true, "user": {...} }
```

#### Teams
```bash
# Get all teams
GET /api/teams

# Get team by ID
GET /api/teams/:id

# Create team
POST /api/teams
Body: { "name": "Seniors M", "category": "Senior M", ... }

# Update team
PUT /api/teams/:id

# Delete team
DELETE /api/teams/:id
```

#### Players
```bash
# Get players (optionally filtered by team)
GET /api/players?team_id=1

# Create player
POST /api/players
Body: { "team_id": 1, "number": 12, "first_name": "John", ... }
```

#### Matches
```bash
# Get matches (filter by status or team)
GET /api/matches?status=live&team_id=1

# Create match
POST /api/matches
Body: { "home_team_id": 1, "away_team_id": 2, "match_date": "...", ... }
```

#### Statistics
```bash
# Get match stats
GET /api/stats/match/:match_id

# Save match stats (from control.html)
POST /api/stats/match/:match_id
Body: { "full_data": {...}, "set_stats": [...] }
```

Voir le fichier **`server/README.md`** pour la documentation complète.

---

## 🗓️ Roadmap

### Phase 1: Infrastructure ✅ (Terminée)
- [x] Backend Node.js/Express
- [x] PostgreSQL avec Docker
- [x] Authentification JWT
- [x] API REST complète
- [x] Page login
- [x] Thème dark/light

### Phase 2: Hub Club ✅ (Terminée)
- [x] Page teams.html (création/gestion équipes)
- [x] Page lineups.html (compositions "7 de base")
- [x] Transformation home.html en hub dynamique
- [x] Intégration stats globales du club
- [x] Migration setup.html vers PostgreSQL

### Phase 3: Gestion Live 🔄 (En cours)
- [x] Migration control.html → PostgreSQL (partielle)
- [ ] Migration stats.html → PostgreSQL
- [ ] Système de sponsors rotatif
- [ ] Page actualités
- [ ] Calendrier événements
- [ ] Templates de live pré-configurés

### Phase 4: Analytics 📅 (À venir)
- [ ] Export automatique vers VolleyAI
- [ ] Dashboard coach par équipe
- [ ] Graphiques avancés (tendances, patterns)
- [ ] Rapports PDF automatiques

### Phase 5: Optimisation 📅 (À venir)
- [ ] Mode hors-ligne (PWA)
- [ ] Notifications push
- [ ] Historique complet des matchs
- [ ] Comparaisons inter-équipes

---

## 🤝 Contribution

### Structure du Code

```
LCVB-Scoreboard/
├── server/                  # Backend Node.js
│   ├── config/             # Configuration BDD
│   ├── middleware/         # Authentification
│   ├── routes/             # Routes API
│   └── server.js           # Point d'entrée
├── database/               # Scripts SQL
│   └── schema.sql          # Schéma PostgreSQL
├── *.html                  # Pages frontend
├── *.css                   # Styles
├── *.js                    # Scripts frontend
├── docker-compose.yml      # Configuration Docker
├── start.sh                # Script de démarrage
└── stop.sh                 # Script d'arrêt
```

### Guidelines

1. **Code Style**
   - Utiliser des noms explicites
   - Commenter les sections complexes
   - Suivre les conventions ES6+

2. **Commits**
   - Préfixe emoji: ✨ (feature), 🐛 (bugfix), 📝 (docs), ♻️ (refactor)
   - Message clair et concis

3. **Tests**
   - Tester manuellement avant commit
   - Vérifier la compatibilité mobile

---

## 📄 Licence

© 2024 Le Crès Volley-Ball - Tous droits réservés

---

## 📞 Support

Pour toute question ou problème:
- 📧 Email: contact@le-cres-vb.fr
- 🌐 Site web: https://le-cres-vb.web.app
- 📱 GitHub Issues: [Créer un ticket](https://github.com/votre-org/LCVB-Scoreboard/issues)

---

**Fait avec ❤️ par l'équipe technique du LCVB** 🏐

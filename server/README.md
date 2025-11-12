# LCVB Scoreboard Pro - Backend API

Backend Node.js/Express avec base de données PostgreSQL pour la gestion complète du club.

## 🚀 Installation

### Prérequis
- Node.js 18+
- Docker & Docker Compose (pour PostgreSQL)

### Étapes

1. **Installer les dépendances**
```bash
cd server
npm install
```

2. **Démarrer PostgreSQL avec Docker**
```bash
# Depuis la racine du projet
docker-compose up -d
```

Cela va démarrer:
- PostgreSQL sur le port 5433
- pgAdmin sur http://localhost:5050 (admin@lcvb.com / admin)

3. **Configurer les variables d'environnement**
```bash
# Le fichier .env est déjà configuré pour le développement
# Pour la production, modifier les valeurs
```

4. **Démarrer le serveur**
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur **http://localhost:3000**

## 📊 Base de Données

### Accès pgAdmin
- URL: http://localhost:5050
- Email: admin@lcvb.com
- Password: admin

Pour connecter pgAdmin à PostgreSQL:
- Host: postgres (ou localhost si depuis votre machine)
- Port: 5433
- Database: lcvb_scoreboard
- Username: lcvb_user
- Password: lcvb_password_2024

### Schéma

La base de données contient les tables suivantes:
- `users` - Utilisateurs (admin, coach, operator, statistician)
- `teams` - Équipes du club
- `players` - Joueurs
- `lineups` - Compositions d'équipe (7 de base)
- `matches` - Matchs
- `match_stats` - Statistiques complètes des matchs
- `player_match_stats` - Statistiques individuelles par match
- `sponsors` - Sponsors pour les lives
- `news` - Actualités du club
- `events` - Calendrier des événements
- `settings` - Paramètres globaux
- `activity_logs` - Logs d'audit

## 🔐 Authentification

### Login de test
- Email: `test@test.com`
- Password: `test@test.com`

### Obtenir un token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test@test.com"}'
```

### Utiliser le token
```bash
curl http://localhost:3000/api/teams \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Connexion
- `GET /api/auth/verify` - Vérifier token
- `POST /api/auth/logout` - Déconnexion

### Teams
- `GET /api/teams` - Liste des équipes
- `GET /api/teams/:id` - Détails d'une équipe
- `POST /api/teams` - Créer une équipe (admin/coach)
- `PUT /api/teams/:id` - Modifier une équipe (admin/coach)
- `DELETE /api/teams/:id` - Supprimer une équipe (admin)

### Players
- `GET /api/players?team_id=X` - Liste des joueurs
- `GET /api/players/:id` - Détails d'un joueur
- `POST /api/players` - Créer un joueur (admin/coach)
- `PUT /api/players/:id` - Modifier un joueur (admin/coach)
- `DELETE /api/players/:id` - Supprimer un joueur (admin/coach)

### Matches
- `GET /api/matches?status=live&team_id=X` - Liste des matchs
- `GET /api/matches/:id` - Détails d'un match
- `POST /api/matches` - Créer un match (admin/operator)
- `PUT /api/matches/:id` - Modifier un match (admin/operator)
- `DELETE /api/matches/:id` - Supprimer un match (admin)

### Statistics
- `GET /api/stats/match/:match_id` - Stats globales d'un match
- `GET /api/stats/match/:match_id/players` - Stats joueurs d'un match
- `POST /api/stats/match/:match_id` - Sauvegarder les stats

### Sponsors
- `GET /api/sponsors` - Liste des sponsors actifs
- `POST /api/sponsors` - Créer un sponsor (admin)
- `PUT /api/sponsors/:id` - Modifier un sponsor (admin)
- `DELETE /api/sponsors/:id` - Supprimer un sponsor (admin)

### News
- `GET /api/news` - Liste des actualités publiées
- `POST /api/news` - Créer une actualité (admin/operator)
- `PUT /api/news/:id` - Modifier une actualité (admin/operator)
- `DELETE /api/news/:id` - Supprimer une actualité (admin)

### Events
- `GET /api/events?from_date=2024-01-01` - Liste des événements
- `POST /api/events` - Créer un événement (admin/operator)
- `DELETE /api/events/:id` - Supprimer un événement (admin/operator)

### Settings
- `GET /api/settings` - Tous les paramètres
- `GET /api/settings/:key` - Un paramètre spécifique
- `PUT /api/settings/:key` - Modifier un paramètre (admin)

## 🛠️ Développement

### Structure des dossiers
```
server/
├── config/
│   └── database.js       # Configuration PostgreSQL
├── middleware/
│   └── auth.js          # Middleware authentification
├── routes/
│   ├── auth.js          # Routes authentification
│   ├── teams.js         # Routes équipes
│   ├── players.js       # Routes joueurs
│   ├── matches.js       # Routes matchs
│   ├── stats.js         # Routes statistiques
│   ├── sponsors.js      # Routes sponsors
│   ├── news.js          # Routes actualités
│   ├── events.js        # Routes événements
│   └── settings.js      # Routes paramètres
├── .env                 # Variables d'environnement
├── package.json
└── server.js            # Point d'entrée
```

### Ajouter une nouvelle route

1. Créer le fichier dans `routes/`
2. Importer dans `server.js`
3. Ajouter `app.use('/api/nom', nomRoutes)`

## 🐛 Debug

### Voir les logs PostgreSQL
```bash
docker logs lcvb_postgres -f
```

### Arrêter les containers
```bash
docker-compose down
```

### Réinitialiser la BDD
```bash
docker-compose down -v  # Supprime aussi les volumes
docker-compose up -d    # Recrée tout
```

## 🔒 Sécurité

- Les mots de passe sont hashés avec bcrypt (10 rounds)
- JWT pour l'authentification
- CORS configuré
- Helmet pour les headers de sécurité
- Validation des entrées

## 📝 Logs

Toutes les actions importantes sont loggées dans `activity_logs`:
- Connexion/déconnexion
- Création/modification/suppression d'entités
- IP de l'utilisateur
- Timestamp

## 🚀 Déploiement

Pour la production:

1. Modifier `.env` avec des valeurs sécurisées
2. Changer `JWT_SECRET`
3. Utiliser une BDD PostgreSQL externe (pas Docker)
4. Configurer HTTPS
5. Utiliser PM2 ou un process manager

```bash
npm install -g pm2
pm2 start server.js --name lcvb-api
pm2 save
pm2 startup
```

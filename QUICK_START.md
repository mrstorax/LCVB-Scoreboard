# 🚀 Démarrage Rapide - Sans Docker

## Utiliser PostgreSQL Local

### 1. Créer la base de données
```bash
# Se connecter à PostgreSQL local
psql postgres

# Créer le user et la base
CREATE USER lcvb_user WITH PASSWORD 'lcvb_password_2024';
CREATE DATABASE lcvb_scoreboard OWNER lcvb_user;
GRANT ALL PRIVILEGES ON DATABASE lcvb_scoreboard TO lcvb_user;
\q

# Importer le schéma
psql -U lcvb_user -d lcvb_scoreboard < database/schema.sql
```

### 2. Démarrer l'application
```bash
# Backend
cd server
npm install
npm run dev

# Frontend (autre terminal)
python3 -m http.server 8000
```

### 3. Ouvrir
http://localhost:8000/login.html

---

## Alternative : Tout en localStorage (0 config)

Si tu veux juste tester **sans base de données** :

1. Utilise les anciennes pages (control.html, stats.html) qui fonctionnent avec localStorage
2. Les nouvelles pages (teams.html, lineups.html) nécessitent PostgreSQL
3. setup.html a été migré mais garde une copie de l'ancien si besoin

**Pour revenir en arrière :**
- teams.html et lineups.html = Besoin PostgreSQL
- Tout le reste = Fonctionne déjà en localStorage

---

## Configuration NAS (Future)

Quand tu passeras sur ton NAS :

1. Modifier `server/.env` :
```
DB_HOST=192.168.X.X  # IP du NAS
DB_PORT=5432
DB_NAME=lcvb_scoreboard
DB_USER=lcvb_user
DB_PASSWORD=ton_password
```

2. C'est tout ! Le code est déjà prêt.

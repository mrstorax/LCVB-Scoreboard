# 🚀 Guide de Déploiement - LCVB Scoreboard sur NAS

## 📋 Prérequis

- NAS ASUSTOR avec Docker installé
- Conteneur PostgreSQL 17 qui tourne (`postgres-17`)
- Accès SSH au NAS : `ssh admin@192.168.1.40`
- Git configuré sur votre machine locale
- Compte GitHub avec accès au repository

---

## 🗄️ Étape 1 : Initialiser la Base de Données sur le NAS

### Option A : Via SSH direct

```bash
# Se connecter au NAS
ssh admin@192.168.1.40

# Créer le rôle et la base de données
docker exec -it postgres-17 psql -U postgres

# Dans psql :
CREATE USER lcvb_user WITH PASSWORD 'lcvb_password_2024';
CREATE DATABASE lcvb_scoreboard OWNER lcvb_user;
GRANT ALL PRIVILEGES ON DATABASE lcvb_scoreboard TO lcvb_user;
\q

# Importer le schéma
cat database/schema.sql | docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard

# Appliquer la migration
cat database/migration_001_add_match_data.sql | docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard

# Vérifier
docker exec -it postgres-17 psql -U lcvb_user -d lcvb_scoreboard -c "\dt"
```

### Option B : Via script automatisé

```bash
# Depuis votre machine locale
chmod +x deploy/init-nas-db.sh

# Exécuter le script sur le NAS
ssh admin@192.168.1.40 'bash -s' < deploy/init-nas-db.sh

# Importer le schéma depuis votre machine
cat database/schema.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'

# Appliquer la migration
cat database/migration_001_add_match_data.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'
```

---

## ✅ Étape 2 : Tester la Connexion Locale

Avant de déployer sur le NAS, testons que tout fonctionne depuis ton Mac :

```bash
# Le .env est déjà configuré avec DB_HOST=192.168.1.40

# Installer les dépendances
cd server
npm install

# Tester la connexion
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: '192.168.1.40',
  port: 5433,
  database: 'lcvb_scoreboard',
  user: 'lcvb_user',
  password: 'lcvb_password_2024'
});
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌', err.message);
  } else {
    console.log('✅ PostgreSQL OK:', res.rows[0].now);
  }
  pool.end();
});
"

# Si ça marche, démarrer le backend
npm run dev

# Dans un autre terminal, démarrer le frontend
python3 -m http.server 8000

# Ouvrir http://localhost:8000/login.html
# Identifiants : test@test.com / test@test.com
```

---

## 🐳 Étape 3 : Déploiement Manuel sur le NAS

### Préparation du NAS

```bash
# Se connecter au NAS
ssh admin@192.168.1.40

# Créer la structure de répertoires
mkdir -p /volume1/docker/lcvb-scoreboard/{releases,current}
cd /volume1/docker/lcvb-scoreboard
```

### Premier déploiement

```bash
# Depuis votre machine locale
chmod +x deploy/deploy-to-nas.sh

# Exécuter le déploiement
./deploy/deploy-to-nas.sh v1.0.0
```

Le script va :
1. ✅ Créer une archive du projet
2. ✅ L'envoyer sur le NAS
3. ✅ Configurer Docker Compose et Nginx
4. ✅ Démarrer les conteneurs
5. ✅ Vérifier que tout fonctionne

---

## 🤖 Étape 4 : Configuration GitHub Actions (CI/CD)

### 4.1 Générer une clé SSH pour GitHub Actions

```bash
# Sur votre machine locale
ssh-keygen -t ed25519 -C "github-actions-lcvb" -f ~/.ssh/github_actions_nas

# Copier la clé publique sur le NAS
ssh-copy-id -i ~/.ssh/github_actions_nas.pub admin@192.168.1.40

# Afficher la clé privée (pour GitHub Secrets)
cat ~/.ssh/github_actions_nas
```

### 4.2 Configurer les Secrets GitHub

Aller sur : `https://github.com/VOTRE_USERNAME/LCVB-Scoreboard/settings/secrets/actions`

Ajouter ces secrets :

| Secret | Valeur | Description |
|--------|--------|-------------|
| `NAS_SSH_PRIVATE_KEY` | Contenu de `~/.ssh/github_actions_nas` | Clé SSH privée |
| `NAS_USER` | `admin` | Utilisateur SSH |
| `NAS_IP` | `192.168.1.40` | IP du NAS |
| `NAS_APP_DIR` | `/volume1/docker/lcvb-scoreboard` | Répertoire app |
| `JWT_SECRET` | `votre_secret_production` | Secret JWT pour production |

### 4.3 Tester le Workflow

```bash
# Commit et push
git add .
git commit -m "🚀 Setup CI/CD deployment"
git push origin main

# Le workflow se lance automatiquement !
# Suivre sur : https://github.com/VOTRE_USERNAME/LCVB-Scoreboard/actions
```

---

## 📦 Utilisation Quotidienne

### Déploiement Automatique

```bash
# 1. Faire vos modifications localement
git add .
git commit -m "✨ Nouvelle fonctionnalité"

# 2. Push sur GitHub
git push origin main

# 3. GitHub Actions déploie automatiquement sur le NAS ! 🎉
```

### Déploiement avec Tag (Version)

```bash
# Créer une version
git tag -a v1.0.1 -m "Version 1.0.1 - Fix bugs"
git push origin v1.0.1

# GitHub Actions :
# - Déploie automatiquement
# - Crée une GitHub Release
# - Archive la version
```

### Déploiement Manuel (si besoin)

```bash
./deploy/deploy-to-nas.sh v1.0.2
```

---

## 🔍 Monitoring et Debug

### Vérifier l'état des services

```bash
# Se connecter au NAS
ssh admin@192.168.1.40

# Voir les conteneurs
docker ps

# Logs backend
docker logs -f lcvb_backend

# Logs frontend
docker logs -f lcvb_frontend

# Logs Nginx
docker exec lcvb_frontend tail -f /var/log/nginx/lcvb_access.log
```

### Tester les services

```bash
# Backend health check
curl http://192.168.1.40:3000/health

# Frontend
curl -I http://192.168.1.40:8000

# API test
curl -X POST http://192.168.1.40:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test@test.com"}'
```

### Vérifier PostgreSQL

```bash
ssh admin@192.168.1.40

# Se connecter à la base
docker exec -it postgres-17 psql -U lcvb_user -d lcvb_scoreboard

# Dans psql :
\dt                          -- Lister les tables
SELECT COUNT(*) FROM users;  -- Vérifier les données
\q
```

---

## 🔄 Rollback (Retour en Arrière)

Si un déploiement pose problème :

```bash
# Se connecter au NAS
ssh admin@192.168.1.40
cd /volume1/docker/lcvb-scoreboard

# Lister les versions disponibles
ls -la releases/

# Revenir à la version précédente
rm current
ln -s releases/v1.0.0 current  # Remplacer par la bonne version

# Redémarrer
docker compose restart

# Ou avec le script
ssh admin@192.168.1.40 'cd /volume1/docker/lcvb-scoreboard && rm current && ln -s releases/20241110-143000 current && docker compose restart'
```

---

## 🗑️ Nettoyage des Anciennes Versions

```bash
# Se connecter au NAS
ssh admin@192.168.1.40
cd /volume1/docker/lcvb-scoreboard/releases

# Garder les 5 dernières, supprimer les autres
ls -t | tail -n +6 | xargs rm -rf
```

Le workflow GitHub Actions fait ça automatiquement.

---

## 📊 Architecture Déployée

```
┌─────────────────────────────────────────┐
│          NAS ASUSTOR (192.168.1.40)     │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  nginx:alpine (port 8000)         │  │
│  │  - Sert les fichiers HTML/CSS/JS │  │
│  │  - Proxy /api/* vers backend     │  │
│  └────────────┬──────────────────────┘  │
│               │                         │
│  ┌────────────▼──────────────────────┐  │
│  │  node:18-alpine (port 3000)       │  │
│  │  - API REST Express               │  │
│  │  - Authentification JWT           │  │
│  └────────────┬──────────────────────┘  │
│               │                         │
│  ┌────────────▼──────────────────────┐  │
│  │  postgres-17 (port 5433)          │  │
│  │  - Base lcvb_scoreboard           │  │
│  │  - User lcvb_user                 │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘

Workflow GitHub Actions
        ↓
    Push main
        ↓
   Build & Deploy
        ↓
      NAS
```

---

## 🔐 Sécurité

### Recommandations Production

1. **Changer le JWT_SECRET** dans les secrets GitHub
2. **Utiliser HTTPS** (Let's Encrypt avec reverse proxy)
3. **Firewall** : Ouvrir uniquement les ports nécessaires
4. **Backups automatiques** de PostgreSQL :

```bash
# Backup quotidien (crontab sur NAS)
0 2 * * * docker exec postgres-17 pg_dump -U lcvb_user lcvb_scoreboard > /volume1/backups/lcvb-$(date +\%Y\%m\%d).sql
```

5. **Logs rotatifs** pour éviter de remplir le disque

---

## ✅ Checklist de Déploiement

- [ ] PostgreSQL configuré sur NAS
- [ ] Base `lcvb_scoreboard` créée
- [ ] Schéma importé
- [ ] Migration appliquée
- [ ] Test connexion locale OK
- [ ] Clé SSH GitHub Actions générée
- [ ] Secrets GitHub configurés
- [ ] Premier déploiement manuel réussi
- [ ] Workflow GitHub Actions testé
- [ ] URLs fonctionnelles :
  - [ ] http://192.168.1.40:8000 (Frontend)
  - [ ] http://192.168.1.40:3000/health (Backend)
- [ ] Login test@test.com fonctionne
- [ ] Backup automatique configuré

---

## 🆘 Support

En cas de problème :

1. Vérifier les logs : `docker logs lcvb_backend`
2. Tester la connexion BDD
3. Vérifier les secrets GitHub
4. Rollback vers version précédente

---

**Fait avec ❤️ par l'équipe technique du LCVB** 🏐

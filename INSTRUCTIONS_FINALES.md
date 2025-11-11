# ✅ Instructions Finales - LCVB Scoreboard

## 🎯 Ce Qui a Été Fait

### 1. Code Applicatif ✅
- ✅ Page **lineups.html** - Gestion complète des compositions (800+ lignes)
- ✅ API **/api/lineups** - 7 endpoints REST complets
- ✅ Migration **setup.html** - Charge équipes depuis PostgreSQL
- ✅ Schéma BDD complet - Table lineups + match_data JSONB
- ✅ Backend configuré pour NAS (DB_HOST=192.168.1.40)

### 2. Infrastructure de Déploiement ✅
- ✅ **deploy/init-nas-db.sh** - Initialisation PostgreSQL sur NAS
- ✅ **deploy/deploy-to-nas.sh** - Déploiement automatique
- ✅ **deploy/test-nas-connection.sh** - Tests de connexion
- ✅ **deploy/docker-compose.nas.yml** - Configuration Docker pour NAS
- ✅ **deploy/nginx.conf** - Configuration Nginx avec proxy API
- ✅ **.github/workflows/deploy.yml** - CI/CD GitHub Actions

### 3. Documentation ✅
- ✅ **DEPLOY_GUIDE.md** - Guide complet de déploiement (100+ lignes)
- ✅ **SESSION_SUMMARY_20251110.md** - Résumé de session
- ✅ **MIGRATION_GUIDE.md** - Guide migration PostgreSQL
- ✅ **TEST_CHECKLIST.md** - Checklist de tests
- ✅ **NEXT_STEPS.md** - Roadmap développement

---

## 🚀 Ce Qu'il Te Reste à Faire (30 minutes)

### Étape 1 : Configurer SSH vers le NAS (5 min)

```bash
# Tester SSH
ssh admin@192.168.1.40

# Si ça demande un mot de passe, c'est OK
# Mot de passe : Capgemini2025=

# Une fois connecté, vérifier Docker
docker ps
docker ps | grep postgres
```

Si SSH ne fonctionne pas :
- Vérifier que le SSH est activé sur le NAS ASUSTOR (Paramètres > Services > SSH)
- Vérifier l'IP du NAS : `192.168.1.40` est correct ?

---

### Étape 2 : Initialiser PostgreSQL sur le NAS (10 min)

```bash
# Depuis ton Mac, exécuter :
ssh admin@192.168.1.40

# Une fois connecté au NAS :
# Créer le rôle et la base
docker exec -it postgres-17 psql -U postgres

# Dans psql, copier-coller :
CREATE USER lcvb_user WITH PASSWORD 'lcvb_password_2024';
CREATE DATABASE lcvb_scoreboard OWNER lcvb_user;
GRANT ALL PRIVILEGES ON DATABASE lcvb_scoreboard TO lcvb_user;
\q

# Sortir du NAS
exit
```

---

### Étape 3 : Importer le Schéma (5 min)

```bash
# Depuis ton Mac :
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard

# Importer le schéma principal
cat database/schema.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'

# Appliquer la migration
cat database/migration_001_add_match_data.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'

# Vérifier
ssh admin@192.168.1.40 'docker exec -it postgres-17 psql -U lcvb_user -d lcvb_scoreboard -c "\dt"'

# Tu devrais voir la liste des 12 tables
```

---

### Étape 4 : Tester Localement (5 min)

```bash
# Le .env est déjà configuré pour pointer vers le NAS
cd server

# Installer les dépendances si pas fait
npm install

# Tester la connexion
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: '192.168.1.40',
  port: 5432,
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

# Si ✅, démarrer le backend
npm run dev

# Dans un autre terminal :
python3 -m http.server 8000

# Ouvrir : http://localhost:8000/login.html
# Login : test@test.com / test@test.com
```

---

### Étape 5 : Premier Déploiement sur NAS (5 min)

```bash
# Depuis ton Mac
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard

# Déployer
./deploy/deploy-to-nas.sh v1.0.0

# Le script va :
# 1. Créer une archive
# 2. L'envoyer sur le NAS
# 3. Configurer Docker Compose
# 4. Démarrer les conteneurs
# 5. Vérifier que tout fonctionne

# Si tout OK, ouvrir :
# http://192.168.1.40:8000/home.html
```

---

### Étape 6 : Configurer GitHub Actions (Optionnel - 10 min)

Pour avoir les déploiements automatiques à chaque push :

1. **Générer une clé SSH :**
```bash
ssh-keygen -t ed25519 -C "github-actions-lcvb" -f ~/.ssh/github_actions_nas

# Copier sur le NAS
ssh-copy-id -i ~/.ssh/github_actions_nas.pub admin@192.168.1.40

# Afficher la clé privée
cat ~/.ssh/github_actions_nas
```

2. **Ajouter les secrets GitHub :**
   - Aller sur : https://github.com/TON_USERNAME/LCVB-Scoreboard/settings/secrets/actions
   - Ajouter :
     - `NAS_SSH_PRIVATE_KEY` : Le contenu de `~/.ssh/github_actions_nas`
     - `NAS_USER` : `admin`
     - `NAS_IP` : `192.168.1.40`
     - `NAS_APP_DIR` : `/volume1/docker/lcvb-scoreboard`

3. **Tester :**
```bash
git add .
git commit -m "🚀 Setup deployment"
git push origin main

# GitHub Actions va déployer automatiquement !
```

---

## 📊 Architecture Finale

```
Ton Mac (Dev)
     │
     ├─> server/.env (DB_HOST=192.168.1.40)
     │   npm run dev → Port 3000
     │
     └─> python3 -m http.server 8000
         http://localhost:8000 (Dev local)

         ↓ git push

GitHub Actions (CI/CD)
     │
     └─> Déploiement automatique

         ↓

NAS ASUSTOR (192.168.1.40)
     │
     ├─> nginx (port 8000)
     │   └─> Sert HTML/CSS/JS
     │       └─> Proxy /api/* → backend
     │
     ├─> node:18 (port 3000)
     │   └─> API Express + JWT
     │       └─> Connexion PostgreSQL
     │
     └─> postgres-17 (port 5432)
         └─> Base lcvb_scoreboard
             └─> 12 tables
```

---

## 🎯 Résumé Ultra-Rapide

**Si tu veux juste que ça marche MAINTENANT :**

```bash
# 1. Créer la BDD sur le NAS
ssh admin@192.168.1.40
docker exec -it postgres-17 psql -U postgres -c "CREATE USER lcvb_user WITH PASSWORD 'lcvb_password_2024'; CREATE DATABASE lcvb_scoreboard OWNER lcvb_user;"
exit

# 2. Importer le schéma
cat database/schema.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'

# 3. Tester localement
cd server && npm install && npm run dev
# Autre terminal : python3 -m http.server 8000
# Ouvrir : http://localhost:8000/login.html

# 4. Déployer sur NAS
./deploy/deploy-to-nas.sh v1.0.0
# Ouvrir : http://192.168.1.40:8000
```

---

## 🆘 Troubleshooting

### Problème : SSH ne fonctionne pas
**Solution :** Activer SSH sur le NAS (Paramètres ASUSTOR > Services > Terminal & SSH)

### Problème : PostgreSQL role doesn't exist
**Solution :** Exécuter l'étape 2 ci-dessus

### Problème : Backend ne démarre pas
**Solution :** Vérifier les logs : `docker logs lcvb_backend`

### Problème : Port 5432 inaccessible
**Solution :** Vérifier le firewall du NAS, autoriser port 5432

---

## ✅ Checklist Finale

- [ ] SSH vers NAS fonctionne
- [ ] PostgreSQL sur NAS actif
- [ ] Base `lcvb_scoreboard` créée
- [ ] Schéma importé (12 tables)
- [ ] Test local réussi (backend + frontend)
- [ ] Déploiement NAS réussi
- [ ] URLs fonctionnelles :
  - [ ] http://192.168.1.40:8000
  - [ ] http://192.168.1.40:3000/health
- [ ] Login test@test.com OK

**Une fois que tout fonctionne :**
- Configuration GitHub Actions (optionnel)
- Backup automatique PostgreSQL
- HTTPS avec Let's Encrypt (recommandé)

---

## 📞 Si Bloqué

Les scripts sont prêts, la structure est en place. Les seuls points de blocage possibles :
1. **SSH** : Vérifier qu'il est activé sur le NAS
2. **PostgreSQL** : Vérifier que le conteneur `postgres-17` tourne
3. **Réseau** : Vérifier que ton Mac peut atteindre `192.168.1.40:5432`

Tout est documenté dans `DEPLOY_GUIDE.md` avec tous les détails.

---

**Bonne chance ! 🚀🏐**

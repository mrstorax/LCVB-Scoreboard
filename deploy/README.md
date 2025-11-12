# 📦 Scripts de Déploiement LCVB Scoreboard

Ce dossier contient tous les scripts et configurations pour déployer LCVB Scoreboard sur le NAS ASUSTOR.

---

## 📁 Fichiers

| Fichier | Description | Usage |
|---------|-------------|-------|
| `test-nas-connection.sh` | Teste la connexion au NAS et PostgreSQL | `./deploy/test-nas-connection.sh` |
| `init-nas-db.sh` | Initialise la base de données sur le NAS | `ssh admin@192.168.1.40 'bash -s' < deploy/init-nas-db.sh` |
| `deploy-to-nas.sh` | Déploie l'application complète sur le NAS | `./deploy/deploy-to-nas.sh v1.0.0` |
| `docker-compose.nas.yml` | Configuration Docker pour le NAS | Utilisé automatiquement |
| `nginx.conf` | Configuration Nginx (reverse proxy) | Utilisé automatiquement |

---

## 🚀 Workflow de Déploiement

### 1. Premier Déploiement

```bash
# Tester la connexion
./deploy/test-nas-connection.sh

# Si tout est OK, déployer
./deploy/deploy-to-nas.sh v1.0.0
```

### 2. Mises à Jour

```bash
# Déployer une nouvelle version
./deploy/deploy-to-nas.sh v1.0.1

# Ou laisser GitHub Actions le faire automatiquement
git push origin main
```

### 3. Rollback

```bash
# Se connecter au NAS
ssh admin@192.168.1.40

# Lister les versions
cd /volume1/docker/lcvb-scoreboard/releases
ls -la

# Revenir en arrière
cd /volume1/docker/lcvb-scoreboard
rm current
ln -s releases/v1.0.0 current
docker compose restart
```

---

## 🔧 Configuration

### Variables d'Environnement

Les scripts utilisent ces valeurs par défaut :

- **NAS_HOST** : `admin@192.168.1.40`
- **DB_HOST** : `192.168.1.40`
- **DB_PORT** : `5433`
- **DB_NAME** : `lcvb_scoreboard`
- **DB_USER** : `lcvb_user`
- **DB_PASS** : `lcvb_password_2024`

Pour modifier, éditer les scripts ou passer en variables d'environnement :

```bash
export NAS_HOST="user@192.168.1.50"
./deploy/deploy-to-nas.sh
```

---

## 📊 Architecture Déployée

```
┌───────────────────────────────────────┐
│  NAS ASUSTOR (192.168.1.40)           │
├───────────────────────────────────────┤
│                                       │
│  /volume1/docker/lcvb-scoreboard/    │
│  ├── current/ (symlink)               │
│  ├── releases/                        │
│  │   ├── v1.0.0/                      │
│  │   ├── v1.0.1/                      │
│  │   └── v1.0.2/                      │
│  ├── docker-compose.yml               │
│  └── nginx.conf                       │
│                                       │
│  Conteneurs Docker:                   │
│  ├─> lcvb_frontend (nginx:alpine)    │
│  │   Port 8000                        │
│  │                                    │
│  ├─> lcvb_backend (node:18-alpine)   │
│  │   Port 3000                        │
│  │                                    │
│  └─> postgres-17 (existant)          │
│      Port 5433                        │
│                                       │
└───────────────────────────────────────┘
```

---

## 🔍 Debug

### Voir les logs

```bash
# Backend
ssh admin@192.168.1.40 'docker logs -f lcvb_backend'

# Frontend
ssh admin@192.168.1.40 'docker logs -f lcvb_frontend'

# Nginx access log
ssh admin@192.168.1.40 'docker exec lcvb_frontend tail -f /var/log/nginx/lcvb_access.log'
```

### Tester les services

```bash
# Backend health
curl http://192.168.1.40:3000/health

# Frontend
curl -I http://192.168.1.40:8000

# API login
curl -X POST http://192.168.1.40:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test@test.com"}'
```

---

## 📝 Notes

- Les scripts créent des archives compressées pour accélérer le transfert
- Les anciennes versions sont conservées pour permettre le rollback
- Le cleanup automatique garde les 5 dernières versions
- Les conteneurs utilisent `network_mode: host` pour simplifier la communication

---

## 🆘 Troubleshooting

### Erreur : "docker-compose: command not found"
**Solution :** Utiliser `docker compose` (sans tiret) sur les versions récentes

### Erreur : "Permission denied"
**Solution :** Rendre les scripts exécutables : `chmod +x deploy/*.sh`

### Erreur : "Connection refused"
**Solution :** Vérifier SSH : `ssh admin@192.168.1.40`

### Erreur : "postgres-17 not found"
**Solution :** Vérifier le nom du conteneur : `ssh admin@192.168.1.40 'docker ps'`

---

Pour plus de détails, voir **DEPLOY_GUIDE.md** à la racine du projet.

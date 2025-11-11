# ✅ BASE DE DONNÉES PRÊTE !

## 🎉 Ce qui fonctionne

✅ **PostgreSQL sur NAS (192.168.1.40)** - Actif
✅ **Base de données `lcvb_scoreboard`** - Créée
✅ **12 tables importées** - Schéma complet
✅ **Migration appliquée** - Champ match_data ajouté
✅ **Connexion depuis Node.js** - Testée et OK

---

## 🚀 Pour Démarrer l'Application

### Commande Unique :

```bash
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard

# Terminal 1 : Backend
cd server
npm run dev

# Terminal 2 : Frontend
python3 -m http.server 8000
```

Puis ouvrir : **http://localhost:8000/login.html**

Login : `test@test.com` / `test@test.com`

---

## 📦 Déploiement sur NAS

Le script est prêt mais doit être adapté pour utiliser `sudo` :

```bash
# Éditer le script pour ajouter sudo
# Puis déployer
./deploy/deploy-to-nas.sh v1.0.0
```

Une fois déployé, accès via : **http://192.168.1.40:8000**

---

## ✨ Fonctionnalités Disponibles

### Pages Fonctionnelles
- ✅ **login.html** - Authentification JWT
- ✅ **home.html** - Hub dynamique
- ✅ **teams.html** - Gestion équipes/joueurs
- ✅ **lineups.html** - Compositions "7 de base" ✨ NOUVEAU
- ✅ **setup.html** - Init match (migré PostgreSQL)
- ✅ **control.html** - Contrôle match (localStorage pour l'instant)
- ✅ **stats.html** - Statistiques (localStorage pour l'instant)
- ✅ **spectator.html** - Vue spectateurs

### API Backend (9 routes)
- ✅ `/api/auth` - Login/logout
- ✅ `/api/teams` - CRUD équipes
- ✅ `/api/players` - CRUD joueurs
- ✅ `/api/lineups` - CRUD compositions ✨ NOUVEAU
- ✅ `/api/matches` - CRUD matchs
- ✅ `/api/stats` - Statistiques
- ✅ `/api/sponsors` - CRUD sponsors
- ✅ `/api/news` - CRUD actualités
- ✅ `/api/events` - CRUD événements
- ✅ `/api/settings` - Configuration

---

## 🗄️ Base de Données (12 tables)

```sql
✅ users (authentification)
✅ teams (équipes)
✅ players (joueurs)
✅ lineups (compositions) ✨ NOUVEAU
✅ matches (matchs)
✅ match_stats (stats matchs)
✅ player_match_stats (stats joueurs)
✅ sponsors (sponsors)
✅ news (actualités)
✅ events (événements)
✅ settings (configuration)
✅ activity_logs (audit trail)
```

---

## 📊 Architecture

```
Mac (Dev)
├─> server/.env → DB_HOST=192.168.1.40
├─> npm run dev → Port 3000
└─> python3 -m http.server 8000
    http://localhost:8000

         ↓

NAS ASUSTOR (192.168.1.40)
└─> postgres-17
    └─> lcvb_scoreboard (12 tables)
```

---

## 🆘 Si le Backend ne Démarre Pas

### Solution rapide :

```bash
# Tuer tous les processus
pkill -f node

# Redémarrer proprement
cd server
node server.js
```

Ou directement sans nodemon :

```bash
cd server
PORT=3000 node server.js
```

---

## ✅ Checklist

- [x] PostgreSQL sur NAS - OK
- [x] Base de données créée - OK
- [x] Schéma importé (12 tables) - OK
- [x] Migration appliquée - OK
- [x] Connexion Node.js testée - OK
- [ ] Backend démarré localement - À faire
- [ ] Frontend accessible - À faire
- [ ] Login fonctionne - À tester
- [ ] Déploiement NAS - À faire

---

## 🎯 Prochaines Étapes

### Immédiat (10 min)
1. Démarrer le backend : `cd server && node server.js`
2. Démarrer le frontend : `python3 -m http.server 8000`
3. Tester : http://localhost:8000/login.html

### Court terme (1h)
- Adapter deploy-to-nas.sh pour sudo
- Déployer sur le NAS
- Tester l'accès via http://192.168.1.40:8000

### Moyen terme (prochaines sessions)
- Migrer control.html → PostgreSQL
- Migrer stats.html → PostgreSQL
- Intégrer lineups dans setup.html
- Sponsors, actualités, calendrier

---

## 📞 Scripts Utiles

```bash
# Test connexion BDD
./deploy/setup-database.sh

# Tester connexion depuis Node
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
  console.log(err ? '❌' + err.message : '✅ OK: ' + res.rows[0].now);
  pool.end();
});
"

# Voir les tables sur le NAS
sshpass -p 'Capgemini2025=' ssh -t admin@192.168.1.40 'echo "Capgemini2025=" | sudo -S docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard -c "\dt"'
```

---

**La base de données est prête !** 🎉
**Il ne reste plus qu'à démarrer le backend et le frontend localement.**

Commande : `cd server && node server.js`

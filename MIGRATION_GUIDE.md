# 🔄 Guide de Migration - PostgreSQL

Ce guide explique comment appliquer les migrations de base de données pour LCVB Scoreboard Pro.

---

## 📋 Migrations Disponibles

### Migration 001: Ajout match_data JSONB
**Fichier:** `database/migration_001_add_match_data.sql`
**Date:** 2025-01-10
**Description:** Ajoute le champ `match_data` JSONB dans la table `matches` pour stocker toutes les données du match (setup, équipes, joueurs, options).

---

## 🚀 Méthode 1: Installation Fresh (Recommandée)

Si vous installez LCVB Scoreboard Pro pour la première fois ou si vous pouvez réinitialiser la base de données :

### 1. Arrêter les services existants
```bash
./stop.sh
```

### 2. Supprimer les volumes Docker (ATTENTION: Supprime toutes les données)
```bash
docker-compose down -v
```

### 3. Redémarrer avec le nouveau schéma
```bash
docker-compose up -d
```

Le fichier `database/schema.sql` contient déjà toutes les migrations, donc votre base sera à jour automatiquement.

### 4. Vérifier la base de données
```bash
# Se connecter à PostgreSQL
docker exec -it lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard

# Vérifier que la colonne match_data existe
\d matches

# Quitter
\q
```

---

## 🔧 Méthode 2: Migration Progressive (Base Existante)

Si vous avez déjà des données dans votre base et souhaitez les conserver :

### 1. Sauvegarder votre base actuelle
```bash
docker exec lcvb_postgres pg_dump -U lcvb_user lcvb_scoreboard > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Appliquer la migration 001
```bash
docker exec -i lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard < database/migration_001_add_match_data.sql
```

### 3. Vérifier le résultat
```bash
docker exec -it lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard -c "\d matches"
```

Vous devriez voir la colonne `match_data` de type `jsonb`.

---

## 🧪 Tester les Nouvelles Fonctionnalités

### 1. Tester lineups.html

```bash
# Démarrer l'application
./start.sh

# Ouvrir dans le navigateur
open http://localhost:8000/login.html
```

1. Se connecter avec `test@test.com` / `test@test.com`
2. Aller sur "Compositions" depuis le hub
3. Sélectionner une équipe
4. Créer une composition avec les joueurs
5. Définir comme composition par défaut

### 2. Tester setup.html avec PostgreSQL

1. Aller sur "Nouveau match"
2. Vérifier que les équipes chargent depuis l'API
3. Configurer un match complet
4. Lancer le match
5. Vérifier dans pgAdmin que le match est créé dans la table `matches`

### 3. Vérifier dans pgAdmin

```bash
# Ouvrir pgAdmin
open http://localhost:5050
```

**Identifiants:**
- Email: admin@lcvb.com
- Password: admin

**Connexion PostgreSQL:**
- Host: lcvb_postgres (ou localhost si externe)
- Port: 5433
- Database: lcvb_scoreboard
- User: lcvb_user
- Password: lcvb_password_2024

**Requêtes de test:**

```sql
-- Vérifier les compositions
SELECT * FROM lineups;

-- Vérifier les matchs avec leurs données
SELECT id, status, match_date, match_data->>'general' as general_info
FROM matches
ORDER BY created_at DESC
LIMIT 5;

-- Compter les compositions par équipe
SELECT t.name, COUNT(l.id) as nb_compositions
FROM teams t
LEFT JOIN lineups l ON l.team_id = t.id AND l.active = true
GROUP BY t.name;
```

---

## 🔍 Troubleshooting

### Erreur: "Column match_data does not exist"

**Solution:** Appliquer la migration 001
```bash
docker exec -i lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard < database/migration_001_add_match_data.sql
```

### Erreur: "Cannot connect to PostgreSQL"

**Solution 1:** Vérifier que le container tourne
```bash
docker ps | grep lcvb_postgres
```

**Solution 2:** Redémarrer Docker Compose
```bash
docker-compose restart postgres
```

### Erreur: "Authentication failed" dans setup.html

**Solution:** Vérifier que vous êtes connecté
```bash
# Dans la console du navigateur
localStorage.getItem('lcvb_auth_token')
```

Si null, se reconnecter via login.html.

### Les équipes ne chargent pas dans setup.html

**Solution 1:** Vérifier que le backend tourne
```bash
curl http://localhost:3000/health
```

**Solution 2:** Vérifier les logs backend
```bash
cd server && npm run dev
```

---

## 📊 État de la Base Après Migration

### Tables créées/modifiées:

| Table | Nouveau | Modifié | Statut |
|-------|---------|---------|--------|
| users | - | - | ✅ Existant |
| teams | - | - | ✅ Existant |
| players | - | - | ✅ Existant |
| lineups | ✅ | - | 🆕 Nouveau |
| matches | - | ✅ | 📝 +match_data |
| match_stats | - | - | ✅ Existant |
| player_match_stats | - | - | ✅ Existant |
| sponsors | - | - | ✅ Existant |
| news | - | - | ✅ Existant |
| events | - | - | ✅ Existant |
| settings | - | - | ✅ Existant |
| activity_logs | - | - | ✅ Existant |

### Nouveaux index:

```sql
-- Index GIN pour les requêtes JSONB rapides
CREATE INDEX idx_matches_match_data ON matches USING gin (match_data);
```

---

## 🚦 Checklist Post-Migration

- [ ] Base de données PostgreSQL démarre correctement
- [ ] Migration 001 appliquée (colonne match_data existe)
- [ ] Backend API démarre sans erreur
- [ ] Frontend accessible sur http://localhost:8000
- [ ] Login fonctionne avec test@test.com
- [ ] Page teams.html charge les équipes depuis PostgreSQL
- [ ] Page lineups.html affiche et sauvegarde les compositions
- [ ] Page setup.html charge les équipes depuis PostgreSQL
- [ ] Création de match sauvegarde dans PostgreSQL
- [ ] pgAdmin accessible et affiche les données

---

## 📞 Support

Si vous rencontrez des problèmes:

1. Vérifier les logs Docker:
   ```bash
   docker-compose logs postgres
   ```

2. Vérifier les logs backend:
   ```bash
   cd server && npm run dev
   ```

3. Consulter la console du navigateur (F12)

4. Créer une issue sur GitHub avec:
   - Description du problème
   - Logs d'erreur
   - Étapes pour reproduire

---

**Fait avec ❤️ par l'équipe technique du LCVB** 🏐

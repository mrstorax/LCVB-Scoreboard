# Migration PostgreSQL : DSM → Docker ✅

**Date**: 2025-11-11
**Statut**: Migration réussie

## Résumé

La base de données a été migrée avec succès du PostgreSQL DSM (NAS Synology) vers le PostgreSQL Docker local. L'application ne dépend plus du NAS pour la base de données.

## Ce qui a été fait

### 1. Découverte initiale
- ✅ Le PostgreSQL DSM était complètement vide (aucune donnée à exporter)
- ✅ Toutes les données étaient déjà dans les volumes Docker locaux

### 2. Réinitialisation de la base Docker
- ✅ Arrêt des conteneurs Docker
- ✅ Suppression du volume PostgreSQL existant
- ✅ Création d'un nouveau volume propre
- ✅ Redémarrage du PostgreSQL Docker (port 5433)

### 3. Initialisation du schéma
- ✅ Exécution de `/database/schema.sql`
- ✅ Création de toutes les tables (14 tables au total)
  - users, teams, players, lineups
  - matches, match_stats, player_match_stats
  - events, ffvb_imports, sponsors, news
  - settings, activity_logs
  - **team_profiles** (nouvelle table)

### 4. Application de la migration 003
- ✅ Ajout de la colonne `is_captain` sur la table `players`
- ✅ Ajout des colonnes `captain_player_id` et `libero_player_id` sur la table `lineups`
- ✅ Création de la table `team_profiles` avec:
  - `captain_player_id` - Référence au joueur capitaine
  - `default_lineup_id` - Référence à la composition par défaut
  - `default_libero_id` - Référence au libéro par défaut
  - `default_positions` - Positions par défaut (JSONB)
  - `primary_venue` - Salle principale
  - `metadata` - Métadonnées additionnelles (JSONB)

### 5. Configuration mise à jour
- ✅ `/server/.env` modifié pour pointer vers `localhost:5433`
- ✅ `/.env` (racine) créé pour Docker Compose
- ✅ Connexion testée et validée depuis le host

## Architecture actuelle

```
┌─────────────────────────────────────────┐
│  Application (Host: localhost:8000)     │
│  ├─ Frontend (HTML/JS/CSS)              │
│  └─ Backend API (Node.js)               │
│     ↓ DB_HOST=localhost                 │
│     ↓ DB_PORT=5433                      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ PostgreSQL Docker               │   │
│  │ - Container: lcvb_postgres      │   │
│  │ - Port exposed: 5433→5432       │   │
│  │ - Volume: postgres_data         │   │
│  │ - Database: lcvb_scoreboard     │   │
│  │ - User: lcvb_user               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Tables de base de données (14 tables + team_profiles)

| Table | Description | Migration 003 |
|-------|-------------|---------------|
| `users` | Utilisateurs et authentification | - |
| `teams` | Équipes du club | - |
| `players` | Joueurs des équipes | ✅ `is_captain` |
| `lineups` | Compositions d'équipe | ✅ `captain_player_id`, `libero_player_id` |
| `team_profiles` | Profils enrichis par équipe | ✅ **NOUVELLE TABLE** |
| `matches` | Matchs du club | - |
| `match_stats` | Statistiques de match | - |
| `player_match_stats` | Statistiques joueur par match | - |
| `events` | Événements en direct | - |
| `ffvb_imports` | Imports FFVB | - |
| `sponsors` | Sponsors du club | - |
| `news` | Actualités | - |
| `settings` | Paramètres application | - |
| `activity_logs` | Logs d'activité | - |

## Commandes utiles

### Accéder à PostgreSQL
```bash
# Depuis le host
PGPASSWORD="lcvb_password_2024" psql -h localhost -p 5433 -U lcvb_user -d lcvb_scoreboard

# Depuis le conteneur
docker exec -it lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard
```

### Vérifier les tables
```bash
docker exec lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard -c "\dt"
```

### Vérifier les colonnes de migration 003
```bash
# Colonnes sur lineups
docker exec lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard -c "\d lineups"

# Colonne sur players
docker exec lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard -c "\d players"

# Table team_profiles
docker exec lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard -c "\d team_profiles"
```

### Gérer les conteneurs
```bash
# Démarrer tous les conteneurs
docker compose up -d

# Arrêter tous les conteneurs
docker compose down

# Voir les logs
docker compose logs -f app
docker compose logs -f postgres
```

## Prochaines étapes

1. ✅ Migration de la base de données terminée
2. ✅ Migration 003 appliquée
3. ⏳ En cours: Rebuild de l'image Docker de l'application
4. 🔜 Test des pages Teams et Lineups
5. 🔜 Vérifier que les capitaines/libéros sont bien persistés

## Notes importantes

- ⚠️ **Le PostgreSQL DSM (192.168.1.40:5433) n'est plus utilisé**
- ✅ **Le port 5433 est maintenant le PostgreSQL Docker local**
- ✅ **Aucune dépendance au NAS pour la base de données**
- ℹ️ Les fichiers de backup sont dans `/database/backups/`
- ℹ️ Le schéma est dans `/database/schema.sql`
- ℹ️ La migration 003 est dans `/database/migration_003_team_profiles.sql`

## Fichiers créés/modifiés

- ✅ `/database/migrate-to-docker-postgres.sh` - Script de migration automatique
- ✅ `/.env` - Configuration Docker Compose
- ✅ `/server/.env` - Configuration backend (DB_HOST=localhost)
- ✅ `/database/backups/dsm_export_*.sql` - Backup du DSM (vide)
- ✅ `/MIGRATION-COMPLETE.md` - Ce document

## Résolution des problèmes

### Les pages Teams/Lineups plantent
- Vérifier que les conteneurs tournent: `docker ps`
- Vérifier que la migration 003 est appliquée: `docker exec lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard -c "SELECT column_name FROM information_schema.columns WHERE table_name='lineups' AND column_name IN ('captain_player_id', 'libero_player_id');"`

### Connexion refuse
- Vérifier que PostgreSQL est démarré: `docker ps | grep lcvb_postgres`
- Vérifier le port: `lsof -i :5433`
- Vérifier les logs: `docker logs lcvb_postgres`

### Besoin de réinitialiser
```bash
# Arrêter et supprimer tout
docker compose down -v

# Redémarrer avec un volume propre
docker compose up -d postgres

# Attendre que PostgreSQL soit prêt
sleep 10

# Réappliquer le schéma et la migration
docker exec -i lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard < database/schema.sql
docker exec -i lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard < database/migration_003_team_profiles.sql

# Redémarrer l'application
docker compose up -d
```

---

**Migration réalisée par**: Claude Code Agent
**Documentation complète**: Ce fichier contient toutes les informations nécessaires pour comprendre la nouvelle architecture

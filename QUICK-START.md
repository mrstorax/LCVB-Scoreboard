# Guide de démarrage rapide

## Démarrer l'application

### Option 1 : Démarrage rapide (sans rebuild)
```bash
docker compose up -d
```

### Option 2 : Démarrage avec rebuild (si code modifié)
```bash
docker compose up -d --build
```

### Option 3 : Redémarrage complet
```bash
docker compose down
docker compose up -d
```

## Accéder à l'application

Une fois les conteneurs démarrés :

- **Interface web** : http://localhost:8000/home.html
- **API Backend** : http://localhost:5700
- **PostgreSQL** : localhost:5433
- **pgAdmin** : http://localhost:5050

## Vérifier l'état

```bash
# Voir les conteneurs en cours
docker ps

# Voir les logs de l'application
docker compose logs -f app

# Voir les logs de PostgreSQL
docker compose logs -f postgres

# Vérifier la santé de PostgreSQL
docker exec lcvb_postgres pg_isready -U lcvb_user
```

## Accéder à PostgreSQL

```bash
# Depuis le host
PGPASSWORD="lcvb_password_2024" psql -h localhost -p 5433 -U lcvb_user -d lcvb_scoreboard

# Depuis le conteneur
docker exec -it lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard
```

## Résolution de problèmes

### Les conteneurs ne démarrent pas
```bash
# Vérifier les erreurs
docker compose logs

# Redémarrer complètement
docker compose down -v
docker compose up -d
```

### L'application ne répond pas
```bash
# Vérifier que les ports sont disponibles
lsof -i :8000
lsof -i :5700
lsof -i :5433

# Redémarrer l'application
docker compose restart app
```

### La base de données est vide
```bash
# Réappliquer le schéma
docker exec -i lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard < database/schema.sql

# Appliquer la migration 003
docker exec -i lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard < database/migration_003_team_profiles.sql
```

## Arrêter l'application

```bash
# Arrêter les conteneurs (conserve les volumes)
docker compose down

# Arrêter ET supprimer les volumes (⚠️ perte de données)
docker compose down -v
```

## Notes importantes

- PostgreSQL est maintenant sur **localhost:5433** (pas le NAS)
- Les données sont dans un volume Docker local
- La migration 003 doit être appliquée pour que Teams/Lineups fonctionnent

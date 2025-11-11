#!/bin/bash

# Script d'initialisation de la base de données PostgreSQL sur le NAS ASUSTOR
# À exécuter sur le NAS : ssh admin@192.168.1.40 'bash -s' < deploy/init-nas-db.sh

set -e

echo "🚀 Initialisation de la base de données LCVB sur NAS..."

# Vérifier que Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé sur le NAS"
    exit 1
fi

# Vérifier si le conteneur postgres-17 existe et tourne
if ! docker ps | grep -q postgres-17; then
    echo "❌ Le conteneur postgres-17 ne tourne pas"
    echo "Veuillez démarrer le conteneur PostgreSQL sur votre NAS"
    exit 1
fi

echo "✅ Conteneur PostgreSQL trouvé"

# Créer le rôle lcvb_user s'il n'existe pas
echo "📝 Création du rôle lcvb_user..."
docker exec postgres-17 psql -U postgres -c "
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lcvb_user') THEN
        CREATE USER lcvb_user WITH PASSWORD 'lcvb_password_2024';
    END IF;
END
\$\$;
" 2>/dev/null || echo "⚠️  Rôle existe déjà ou erreur de création"

# Créer la base de données lcvb_scoreboard
echo "📊 Création de la base de données lcvb_scoreboard..."
docker exec postgres-17 psql -U postgres -c "
SELECT 'CREATE DATABASE lcvb_scoreboard OWNER lcvb_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lcvb_scoreboard')\gexec
" 2>/dev/null || echo "⚠️  Base existe déjà"

# Accorder tous les privilèges
echo "🔐 Attribution des privilèges..."
docker exec postgres-17 psql -U postgres -c "
GRANT ALL PRIVILEGES ON DATABASE lcvb_scoreboard TO lcvb_user;
ALTER DATABASE lcvb_scoreboard OWNER TO lcvb_user;
"

echo "✅ Base de données créée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Importer le schéma : cat database/schema.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'"
echo "2. Appliquer la migration : cat database/migration_001_add_match_data.sql | ssh admin@192.168.1.40 'docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard'"
echo "3. Tester depuis local : cd server && npm run dev"

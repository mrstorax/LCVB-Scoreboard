#!/bin/bash

# Script d'initialisation complète de la base de données sur le NAS
# Usage: ./deploy/setup-database.sh

set -e

NAS_PASSWORD="Capgemini2025="
NAS_HOST="admin@192.168.1.40"
DB_CONTAINER="postgres-17"

echo "🚀 Initialisation complète de la base de données..."
echo ""

# Helper pour exécuter des commandes sur le NAS
nas_exec() {
    sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S $1" 2>/dev/null
}

# Helper pour exécuter des commandes PostgreSQL
psql_exec() {
    local cmd="$1"
    nas_exec "docker exec -i $DB_CONTAINER psql -U postgres -c \"$cmd\""
}

# 1. Vérifier que le conteneur PostgreSQL existe
echo "📊 Vérification du conteneur PostgreSQL..."
if nas_exec "docker ps | grep -q $DB_CONTAINER"; then
    echo "✅ Conteneur $DB_CONTAINER trouvé"
else
    echo "❌ Conteneur $DB_CONTAINER non trouvé"
    echo "Veuillez démarrer PostgreSQL sur votre NAS"
    exit 1
fi

# 2. Créer le rôle lcvb_user
echo ""
echo "👤 Création du rôle lcvb_user..."
psql_exec "DO \\\$\\\$ BEGIN IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lcvb_user') THEN CREATE USER lcvb_user WITH PASSWORD 'lcvb_password_2024'; RAISE NOTICE 'Rôle créé'; ELSE RAISE NOTICE 'Rôle existe déjà'; END IF; END \\\$\\\$;" || echo "⚠️ Rôle existe peut-être déjà"

# 3. Créer la base de données
echo ""
echo "🗄️  Création de la base lcvb_scoreboard..."
psql_exec "SELECT 'CREATE DATABASE lcvb_scoreboard OWNER lcvb_user' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lcvb_scoreboard')\\gexec" || echo "⚠️ Base existe peut-être déjà"

# 4. Accorder les privilèges
echo ""
echo "🔐 Attribution des privilèges..."
psql_exec "GRANT ALL PRIVILEGES ON DATABASE lcvb_scoreboard TO lcvb_user; ALTER DATABASE lcvb_scoreboard OWNER TO lcvb_user;"

# 5. Importer le schéma
echo ""
echo "📋 Import du schéma principal..."
cat database/schema.sql | sshpass -p "$NAS_PASSWORD" ssh $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker exec -i $DB_CONTAINER psql -U lcvb_user -d lcvb_scoreboard" 2>/dev/null

# 6. Appliquer la migration
echo ""
echo "🔄 Application de la migration..."
cat database/migration_001_add_match_data.sql | sshpass -p "$NAS_PASSWORD" ssh $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker exec -i $DB_CONTAINER psql -U lcvb_user -d lcvb_scoreboard" 2>/dev/null || echo "⚠️ Migration déjà appliquée"

# 7. Vérifier les tables
echo ""
echo "✅ Vérification des tables..."
TABLE_COUNT=$(sshpass -p "$NAS_PASSWORD" ssh $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker exec -i $DB_CONTAINER psql -U lcvb_user -d lcvb_scoreboard -tAc 'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='\''public'\'''" 2>/dev/null)

echo "📊 $TABLE_COUNT tables créées"

# 8. Tester la connexion depuis le Mac
echo ""
echo "🧪 Test de connexion depuis votre Mac..."
cd server
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: '192.168.1.40',
  port: 5433,
  database: 'lcvb_scoreboard',
  user: 'lcvb_user',
  password: 'lcvb_password_2024'
});
pool.query('SELECT NOW() as time, COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='\''public'\''', (err, res) => {
  if (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Connexion réussie !');
    console.log('   Heure serveur:', res.rows[0].time);
    console.log('   Tables:', res.rows[0].table_count);
  }
  pool.end();
});
" 2>/dev/null || { cd ..; echo "⚠️ Installer les dépendances: cd server && npm install"; }
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Base de données prête !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📍 Prochaines étapes:"
echo ""
echo "1. Tester localement:"
echo "   cd server && npm install && npm run dev"
echo "   Puis dans un autre terminal:"
echo "   python3 -m http.server 8000"
echo "   Ouvrir: http://localhost:8000/login.html"
echo ""
echo "2. Déployer sur le NAS:"
echo "   ./deploy/deploy-to-nas.sh v1.0.0"
echo ""

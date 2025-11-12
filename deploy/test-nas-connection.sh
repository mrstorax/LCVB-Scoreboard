#!/bin/bash

# Script de test de connexion au NAS et PostgreSQL
# Usage: ./deploy/test-nas-connection.sh

set -e

echo "🧪 Test de connexion au NAS ASUSTOR..."
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAS_HOST="admin@192.168.1.40"
DB_HOST="192.168.1.40"
DB_PORT="5433"
DB_NAME="lcvb_scoreboard"
DB_USER="lcvb_user"
DB_PASS="lcvb_password_2024"

# Test 1: SSH
echo -e "${YELLOW}Test 1: Connexion SSH au NAS...${NC}"
if ssh -o ConnectTimeout=5 ${NAS_HOST} "echo 'OK'" &>/dev/null; then
    echo -e "${GREEN}✅ SSH OK${NC}"
else
    echo -e "${RED}❌ SSH FAIL - Vérifiez l'accès SSH${NC}"
    exit 1
fi

# Test 2: Docker
echo -e "${YELLOW}Test 2: Docker sur le NAS...${NC}"
if ssh ${NAS_HOST} "docker --version" &>/dev/null; then
    VERSION=$(ssh ${NAS_HOST} "docker --version")
    echo -e "${GREEN}✅ Docker OK - ${VERSION}${NC}"
else
    echo -e "${RED}❌ Docker non disponible${NC}"
    exit 1
fi

# Test 3: Conteneur PostgreSQL
echo -e "${YELLOW}Test 3: Conteneur PostgreSQL...${NC}"
if ssh ${NAS_HOST} "docker ps | grep postgres-17" &>/dev/null; then
    echo -e "${GREEN}✅ Conteneur postgres-17 actif${NC}"
else
    echo -e "${RED}❌ Conteneur postgres-17 non trouvé${NC}"
    echo "Veuillez démarrer le conteneur PostgreSQL sur le NAS"
    exit 1
fi

# Test 4: Connexion PostgreSQL depuis le NAS
echo -e "${YELLOW}Test 4: Connexion PostgreSQL depuis NAS...${NC}"
if ssh ${NAS_HOST} "docker exec postgres-17 psql -U postgres -c 'SELECT 1' &>/dev/null"; then
    echo -e "${GREEN}✅ PostgreSQL répond${NC}"
else
    echo -e "${RED}❌ PostgreSQL ne répond pas${NC}"
    exit 1
fi

# Test 5: Base de données existe
echo -e "${YELLOW}Test 5: Base de données lcvb_scoreboard...${NC}"
if ssh ${NAS_HOST} "docker exec postgres-17 psql -U postgres -lqt | grep -q lcvb_scoreboard"; then
    echo -e "${GREEN}✅ Base de données existe${NC}"
else
    echo -e "${YELLOW}⚠️  Base de données n'existe pas encore${NC}"
    echo "Créer avec: ssh ${NAS_HOST} 'docker exec postgres-17 psql -U postgres -c \"CREATE DATABASE lcvb_scoreboard\"'"
fi

# Test 6: Rôle lcvb_user existe
echo -e "${YELLOW}Test 6: Rôle lcvb_user...${NC}"
if ssh ${NAS_HOST} "docker exec postgres-17 psql -U postgres -tAc \"SELECT 1 FROM pg_roles WHERE rolname='lcvb_user'\"" | grep -q 1; then
    echo -e "${GREEN}✅ Rôle lcvb_user existe${NC}"
else
    echo -e "${YELLOW}⚠️  Rôle lcvb_user n'existe pas${NC}"
    echo "Créer avec: ssh ${NAS_HOST} 'docker exec postgres-17 psql -U postgres -c \"CREATE USER lcvb_user WITH PASSWORD '\\''lcvb_password_2024'\\''\"'"
fi

# Test 7: Tables existent
echo -e "${YELLOW}Test 7: Tables de la base...${NC}"
TABLE_COUNT=$(ssh ${NAS_HOST} "docker exec postgres-17 psql -U ${DB_USER} -d ${DB_NAME} -tAc \"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public'\"" 2>/dev/null || echo "0")
if [ "$TABLE_COUNT" -gt "0" ]; then
    echo -e "${GREEN}✅ ${TABLE_COUNT} tables trouvées${NC}"
else
    echo -e "${YELLOW}⚠️  Aucune table - Schéma non importé${NC}"
    echo "Importer avec: cat database/schema.sql | ssh ${NAS_HOST} 'docker exec -i postgres-17 psql -U ${DB_USER} -d ${DB_NAME}'"
fi

# Test 8: Connexion depuis la machine locale
echo -e "${YELLOW}Test 8: Connexion depuis votre Mac...${NC}"
if command -v psql &> /dev/null; then
    if PGPASSWORD=${DB_PASS} psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} -c "SELECT 1" &>/dev/null; then
        echo -e "${GREEN}✅ Connexion locale OK${NC}"
    else
        echo -e "${RED}❌ Connexion locale FAIL${NC}"
        echo "Vérifiez que le port 5433 est accessible depuis votre réseau"
    fi
else
    echo -e "${YELLOW}⚠️  psql non installé localement (pas grave)${NC}"
fi

# Test 9: Node.js peut se connecter
echo -e "${YELLOW}Test 9: Test Node.js...${NC}"
if [ -d "server/node_modules" ]; then
    cd server
    TEST_RESULT=$(node -e "
    const { Pool } = require('pg');
    const pool = new Pool({
      host: '${DB_HOST}',
      port: ${DB_PORT},
      database: '${DB_NAME}',
      user: '${DB_USER}',
      password: '${DB_PASS}'
    });
    pool.query('SELECT NOW()', (err, res) => {
      if (err) {
        console.log('FAIL');
        process.exit(1);
      } else {
        console.log('OK');
        process.exit(0);
      }
      pool.end();
    });
    " 2>/dev/null || echo "FAIL")
    cd ..

    if [ "$TEST_RESULT" = "OK" ]; then
        echo -e "${GREEN}✅ Node.js peut se connecter${NC}"
    else
        echo -e "${RED}❌ Node.js ne peut pas se connecter${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  node_modules non installé - Exécutez: cd server && npm install${NC}"
fi

# Résumé
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Tests terminés !${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Configuration actuelle:"
echo "   NAS:      ${NAS_HOST}"
echo "   Database: ${DB_NAME}"
echo "   User:     ${DB_USER}"
echo "   Host:     ${DB_HOST}:${DB_PORT}"
echo ""

# Commandes utiles
echo "💡 Commandes utiles:"
echo ""
echo "Initialiser la BDD:"
echo "  ./deploy/init-nas-db.sh"
echo ""
echo "Importer le schéma:"
echo "  cat database/schema.sql | ssh ${NAS_HOST} 'docker exec -i postgres-17 psql -U ${DB_USER} -d ${DB_NAME}'"
echo ""
echo "Se connecter à PostgreSQL:"
echo "  ssh ${NAS_HOST} 'docker exec -it postgres-17 psql -U ${DB_USER} -d ${DB_NAME}'"
echo ""
echo "Déployer l'application:"
echo "  ./deploy/deploy-to-nas.sh v1.0.0"
echo ""

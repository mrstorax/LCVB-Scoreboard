#!/bin/bash
# Migration complète : DSM PostgreSQL → Docker PostgreSQL
# Ce script exporte les données du NAS et les importe dans le conteneur Docker

set -e  # Stop on error

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Migration PostgreSQL DSM → Docker${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration
PROJECT_DIR="/Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard"
BACKUP_DIR="${PROJECT_DIR}/database/backups"
BACKUP_FILE="${BACKUP_DIR}/dsm_export_$(date +%Y%m%d_%H%M%S).sql"

# Paramètres DSM PostgreSQL (source)
DSM_HOST="192.168.1.40"
DSM_PORT="5433"
DSM_DB="lcvb_scoreboard"
DSM_USER="lcvb_user"
DSM_PASSWORD="lcvb_password_2024"

# Paramètres Docker PostgreSQL (destination)
DOCKER_CONTAINER="lcvb_postgres"
DOCKER_DB="lcvb_scoreboard"
DOCKER_USER="lcvb_user"
DOCKER_PASSWORD="lcvb_password_2024"

# Créer le répertoire de backup
mkdir -p "${BACKUP_DIR}"

# ============================================
# ÉTAPE 1 : Export depuis DSM PostgreSQL
# ============================================
echo -e "\n${YELLOW}[1/6] Export des données depuis DSM PostgreSQL...${NC}"

# Vérifier que pg_dump est disponible
if ! command -v pg_dump &> /dev/null; then
    echo -e "${RED}Erreur: pg_dump n'est pas installé${NC}"
    echo "Installez PostgreSQL client avec: brew install postgresql@15"
    exit 1
fi

# Export complet (schéma + données)
echo "Export vers: ${BACKUP_FILE}"
PGPASSWORD="${DSM_PASSWORD}" pg_dump \
    -h "${DSM_HOST}" \
    -p "${DSM_PORT}" \
    -U "${DSM_USER}" \
    -d "${DSM_DB}" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    -F p \
    -f "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Export réussi ($(du -h "${BACKUP_FILE}" | cut -f1))${NC}"
else
    echo -e "${RED}✗ Erreur lors de l'export${NC}"
    exit 1
fi

# ============================================
# ÉTAPE 2 : Arrêt des conteneurs Docker
# ============================================
echo -e "\n${YELLOW}[2/6] Arrêt des conteneurs Docker...${NC}"
cd "${PROJECT_DIR}"
docker compose down

# ============================================
# ÉTAPE 3 : Suppression du volume PostgreSQL
# ============================================
echo -e "\n${YELLOW}[3/6] Suppression du volume PostgreSQL existant...${NC}"
docker volume rm lcvb-scoreboard_postgres_data 2>/dev/null || true
echo -e "${GREEN}✓ Volume supprimé${NC}"

# ============================================
# ÉTAPE 4 : Redémarrage avec base vide
# ============================================
echo -e "\n${YELLOW}[4/6] Démarrage du PostgreSQL Docker...${NC}"
docker compose up -d postgres

# Attendre que PostgreSQL soit prêt
echo "Attente du démarrage de PostgreSQL..."
for i in {1..30}; do
    if docker exec "${DOCKER_CONTAINER}" pg_isready -U "${DOCKER_USER}" -d "${DOCKER_DB}" &>/dev/null; then
        echo -e "${GREEN}✓ PostgreSQL est prêt${NC}"
        break
    fi
    if [ $i -eq 30 ]; then
        echo -e "${RED}✗ Timeout: PostgreSQL ne démarre pas${NC}"
        exit 1
    fi
    echo -n "."
    sleep 2
done

# ============================================
# ÉTAPE 5 : Import des données
# ============================================
echo -e "\n${YELLOW}[5/6] Import des données dans Docker PostgreSQL...${NC}"

# Copier le fichier SQL dans le conteneur
docker cp "${BACKUP_FILE}" "${DOCKER_CONTAINER}:/tmp/import.sql"

# Importer les données
docker exec -i "${DOCKER_CONTAINER}" psql \
    -U "${DOCKER_USER}" \
    -d "${DOCKER_DB}" \
    -f /tmp/import.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Import réussi${NC}"
else
    echo -e "${RED}✗ Erreur lors de l'import${NC}"
    exit 1
fi

# Nettoyer le fichier temporaire
docker exec "${DOCKER_CONTAINER}" rm /tmp/import.sql

# ============================================
# ÉTAPE 6 : Exécution de la migration 003
# ============================================
echo -e "\n${YELLOW}[6/6] Exécution de la migration 003...${NC}"

MIGRATION_FILE="${PROJECT_DIR}/database/migration_003_team_profiles.sql"

if [ -f "${MIGRATION_FILE}" ]; then
    docker exec -i "${DOCKER_CONTAINER}" psql \
        -U "${DOCKER_USER}" \
        -d "${DOCKER_DB}" \
        < "${MIGRATION_FILE}"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Migration 003 appliquée avec succès${NC}"
    else
        echo -e "${RED}✗ Erreur lors de la migration 003${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Fichier migration_003_team_profiles.sql introuvable${NC}"
    exit 1
fi

# ============================================
# Vérification finale
# ============================================
echo -e "\n${YELLOW}Vérification des tables créées...${NC}"
docker exec -i "${DOCKER_CONTAINER}" psql \
    -U "${DOCKER_USER}" \
    -d "${DOCKER_DB}" \
    -c "\dt" \
    -c "\d lineups" \
    -c "SELECT column_name FROM information_schema.columns WHERE table_name='lineups' AND column_name IN ('captain_player_id', 'libero_player_id');"

# ============================================
# Redémarrage complet de l'application
# ============================================
echo -e "\n${YELLOW}Redémarrage complet de l'application...${NC}"
cd "${PROJECT_DIR}"
docker compose up -d

# Attendre que l'app soit prête
sleep 5

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Migration terminée avec succès ! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Résumé:"
echo "  • Backup DSM: ${BACKUP_FILE}"
echo "  • PostgreSQL Docker: localhost:5433"
echo "  • Base de données: ${DOCKER_DB}"
echo "  • Migration 003: Appliquée"
echo ""
echo "Prochaines étapes:"
echo "  1. Tester l'accès: docker exec lcvb_postgres psql -U lcvb_user -d lcvb_scoreboard"
echo "  2. Tester l'API: curl http://localhost:5700/api/teams"
echo "  3. Tester les pages Teams et Lineups dans l'interface"
echo ""
echo -e "${YELLOW}Important: L'application ne dépend plus du PostgreSQL DSM${NC}"
echo -e "${YELLOW}Les .env pointent maintenant vers le conteneur Docker${NC}"

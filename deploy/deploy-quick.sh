#!/bin/bash
# Déploiement rapide vers le NAS - Une seule commande
# Usage: ./deploy/deploy-quick.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Déploiement rapide → NAS${NC}"
echo -e "${GREEN}========================================${NC}"

NAS_HOST="192.168.1.40"
NAS_USER="admin"
NAS_PATH="/volume1/docker/lcvb-scoreboard"
PROJECT_DIR="/Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard"

cd "${PROJECT_DIR}"

echo -e "\n${YELLOW}Copie des fichiers vers le NAS...${NC}"
echo "Mot de passe: Capgemini2025="

# Créer une archive locale
tar -czf /tmp/lcvb-deploy.tar.gz \
    login.html \
    home.html \
    home2.html \
    teams.html \
    lineups.html \
    setup.html \
    control.html \
    stats.html \
    settings.html \
    display.html \
    spectator.html \
    themes.css \
    shared-style.css \
    style.css \
    control-style.css \
    theme.js 2>/dev/null || true

# Copier + extraire + redémarrer en UNE SEULE connexion SSH
sshpass -p 'Capgemini2025=' ssh -o StrictHostKeyChecking=no "${NAS_USER}@${NAS_HOST}" << 'EOF'
cd /volume1/docker/lcvb-scoreboard
mkdir -p backups
BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "backups/$BACKUP_NAME" *.html *.css *.js 2>/dev/null || true
echo "✓ Backup créé: backups/$BACKUP_NAME"
EOF

# Copier l'archive
sshpass -p 'Capgemini2025=' scp -o StrictHostKeyChecking=no /tmp/lcvb-deploy.tar.gz "${NAS_USER}@${NAS_HOST}:${NAS_PATH}/"

# Extraire et redémarrer
sshpass -p 'Capgemini2025=' ssh -o StrictHostKeyChecking=no "${NAS_USER}@${NAS_HOST}" << 'EOF'
cd /volume1/docker/lcvb-scoreboard
tar -xzf lcvb-deploy.tar.gz
rm lcvb-deploy.tar.gz
echo "✓ Fichiers extraits"

# Redémarrer le conteneur
if docker ps | grep -q lcvb; then
    docker restart $(docker ps | grep lcvb | grep -v postgres | awk '{print $1}') 2>/dev/null || true
    echo "✓ Conteneur redémarré"
else
    echo "⚠ Redémarrez manuellement via DSM"
fi
EOF

# Nettoyer
rm -f /tmp/lcvb-deploy.tar.gz

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Déploiement terminé !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Prochaines étapes:"
echo "  1. Vider le cache Cloudflare"
echo "  2. Tester: https://lcvb.twittiz.fr/login.html"
echo "  3. Vérifier: Plus d'erreur CORS (F12)"
echo ""

#!/bin/bash
# Script de déploiement du frontend vers le NAS
# Pousse les fichiers HTML/CSS/JS modifiés vers le NAS et redémarre le frontend

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Déploiement Frontend → NAS${NC}"
echo -e "${GREEN}========================================${NC}"

# Configuration NAS
NAS_HOST="${NAS_HOST:-192.168.1.40}"
NAS_USER="${NAS_USER:-admin}"
NAS_PATH="${NAS_PATH:-/volume1/docker/lcvb-scoreboard}"
PROJECT_DIR="/Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard"

echo -e "\n${YELLOW}Configuration:${NC}"
echo "  NAS Host: ${NAS_HOST}"
echo "  NAS User: ${NAS_USER}"
echo "  NAS Path: ${NAS_PATH}"
echo ""

# ==========================================
# ÉTAPE 1 : Vérifier la connexion au NAS
# ==========================================
echo -e "${YELLOW}[1/4] Test de connexion au NAS...${NC}"
if ! ssh -o ConnectTimeout=5 "${NAS_USER}@${NAS_HOST}" "echo 'Connexion OK'" 2>/dev/null; then
    echo -e "${RED}✗ Impossible de se connecter au NAS${NC}"
    echo ""
    echo "Vérifiez que :"
    echo "  1. Le NAS est accessible : ping ${NAS_HOST}"
    echo "  2. SSH est activé sur le NAS (DSM → Panneau de configuration → Terminal & SNMP)"
    echo "  3. Vous pouvez vous connecter : ssh ${NAS_USER}@${NAS_HOST}"
    echo ""
    echo "Pour configurer l'accès SSH sans mot de passe :"
    echo "  ssh-copy-id ${NAS_USER}@${NAS_HOST}"
    exit 1
fi
echo -e "${GREEN}✓ Connexion au NAS OK${NC}"

# ==========================================
# ÉTAPE 2 : Créer un backup sur le NAS
# ==========================================
echo -e "\n${YELLOW}[2/4] Création d'un backup sur le NAS...${NC}"
BACKUP_NAME="frontend_backup_$(date +%Y%m%d_%H%M%S)"
ssh "${NAS_USER}@${NAS_HOST}" "cd ${NAS_PATH} && mkdir -p backups && tar -czf backups/${BACKUP_NAME}.tar.gz *.html *.css *.js themes.css shared-style.css 2>/dev/null || true"
echo -e "${GREEN}✓ Backup créé : backups/${BACKUP_NAME}.tar.gz${NC}"

# ==========================================
# ÉTAPE 3 : Copier les fichiers modifiés
# ==========================================
echo -e "\n${YELLOW}[3/4] Copie des fichiers vers le NAS...${NC}"

# Liste des fichiers à déployer
FILES_TO_DEPLOY=(
    "login.html"
    "home.html"
    "home2.html"
    "teams.html"
    "lineups.html"
    "setup.html"
    "control.html"
    "stats.html"
    "settings.html"
    "display.html"
    "spectator.html"
    "themes.css"
    "shared-style.css"
    "style.css"
    "control-style.css"
    "theme.js"
)

cd "${PROJECT_DIR}"

# Copier les fichiers un par un
for file in "${FILES_TO_DEPLOY[@]}"; do
    if [ -f "$file" ]; then
        echo -n "  • $file ... "
        if scp -q "$file" "${NAS_USER}@${NAS_HOST}:${NAS_PATH}/" 2>/dev/null; then
            echo -e "${GREEN}✓${NC}"
        else
            echo -e "${RED}✗${NC}"
        fi
    else
        echo -e "  • $file ... ${YELLOW}[non trouvé, ignoré]${NC}"
    fi
done

echo -e "${GREEN}✓ Fichiers copiés${NC}"

# ==========================================
# ÉTAPE 4 : Redémarrer le conteneur frontend
# ==========================================
echo -e "\n${YELLOW}[4/4] Redémarrage du frontend sur le NAS...${NC}"

# Vérifier si docker-compose est disponible
if ssh "${NAS_USER}@${NAS_HOST}" "command -v docker &> /dev/null"; then
    echo "  Redémarrage via Docker..."

    # Essayer de redémarrer le conteneur frontend
    if ssh "${NAS_USER}@${NAS_HOST}" "cd ${NAS_PATH} && docker compose restart frontend 2>/dev/null || docker restart lcvb_frontend 2>/dev/null"; then
        echo -e "${GREEN}✓ Frontend redémarré${NC}"
    else
        echo -e "${YELLOW}⚠ Impossible de redémarrer le frontend automatiquement${NC}"
        echo "  Redémarrez manuellement via DSM → Docker"
    fi
else
    echo -e "${YELLOW}⚠ Docker non accessible via SSH${NC}"
    echo "  Redémarrez le conteneur frontend manuellement via DSM"
fi

# ==========================================
# Résumé
# ==========================================
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Déploiement terminé ! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Résumé :"
echo "  • Fichiers copiés vers ${NAS_HOST}:${NAS_PATH}/"
echo "  • Backup disponible : backups/${BACKUP_NAME}.tar.gz"
echo ""
echo "Prochaines étapes :"
echo "  1. Testez l'application : https://lcvb.twittiz.fr/login.html"
echo "  2. Vérifiez les logs dans DSM → Docker → lcvb_frontend"
echo "  3. Si problème, restaurez le backup :"
echo "     ssh ${NAS_USER}@${NAS_HOST} 'cd ${NAS_PATH}/backups && tar -xzf ${BACKUP_NAME}.tar.gz -C ..'"
echo ""
echo -e "${YELLOW}Important :${NC}"
echo "  • Videz le cache Cloudflare si les changements ne sont pas visibles"
echo "  • Ctrl+Shift+R dans le navigateur pour forcer le rechargement"
echo ""

#!/bin/bash
# Déploiement ultra-rapide - copie tous les fichiers en UNE commande
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Déploiement Frontend → NAS${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Mot de passe NAS: Capgemini2025="
echo ""

cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard

# Copier TOUS les fichiers en une seule commande SCP
# (va demander le mot de passe UNE SEULE FOIS)
scp -o StrictHostKeyChecking=no \
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
    theme.js \
    admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Fichiers copiés avec succès !${NC}"
    echo ""
    echo "Prochaines étapes:"
    echo "  1. DSM → Container Manager → Restart 'lcvb_frontend'"
    echo "  2. Cloudflare → Purge Cache"
    echo "  3. Tester: https://lcvb.twittiz.fr/login.html"
    echo ""
else
    echo -e "${RED}❌ Erreur lors de la copie${NC}"
    exit 1
fi

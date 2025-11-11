#!/bin/bash

# LCVB Scoreboard Pro - Script de démarrage
# Ce script démarre PostgreSQL + Backend + Frontend

echo "🏐 ========================================="
echo "   LCVB Scoreboard Pro - Démarrage"
echo "🏐 ========================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    echo "Veuillez installer Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Veuillez installer Node.js: https://nodejs.org/"
    exit 1
fi

# 1. Démarrer PostgreSQL avec Docker
echo -e "${YELLOW}📊 Démarrage de PostgreSQL...${NC}"
# Essayer docker compose (nouveau) puis docker-compose (ancien)
if docker compose up -d 2>/dev/null; then
    echo -e "${GREEN}✅ PostgreSQL démarré${NC}"
elif docker-compose up -d 2>/dev/null; then
    echo -e "${GREEN}✅ PostgreSQL démarré${NC}"
else
    echo -e "${RED}❌ Erreur lors du démarrage de PostgreSQL${NC}"
    exit 1
fi

# Attendre que PostgreSQL soit prêt
echo -e "${YELLOW}⏳ Attente de PostgreSQL...${NC}"
sleep 5

# 2. Installer les dépendances du backend si nécessaire
if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances backend...${NC}"
    cd server && npm install && cd ..
    echo -e "${GREEN}✅ Dépendances installées${NC}"
fi

# 3. Démarrer le backend
echo -e "${YELLOW}🚀 Démarrage du backend API...${NC}"
cd server
npm run dev &
BACKEND_PID=$!
cd ..

sleep 3
echo -e "${GREEN}✅ Backend démarré (PID: $BACKEND_PID)${NC}"

# 4. Démarrer le frontend (serveur HTTP simple)
echo -e "${YELLOW}🌐 Démarrage du frontend...${NC}"

# Vérifier si Python est disponible
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000 &
    FRONTEND_PID=$!
elif command -v python &> /dev/null; then
    python -m http.server 8000 &
    FRONTEND_PID=$!
else
    echo -e "${RED}❌ Python n'est pas installé pour le serveur HTTP${NC}"
    echo "Alternative: installez http-server avec npm install -g http-server"
    exit 1
fi

sleep 2
echo -e "${GREEN}✅ Frontend démarré (PID: $FRONTEND_PID)${NC}"

# Affichage final
echo ""
echo -e "${GREEN}🏐 ========================================="
echo "   LCVB Scoreboard Pro - Prêt !"
echo "🏐 =========================================${NC}"
echo ""
echo -e "${YELLOW}📍 URLs disponibles:${NC}"
echo "   • Frontend:    http://localhost:8000"
echo "   • Backend API: http://localhost:3000"
echo "   • pgAdmin:     http://localhost:5050"
echo ""
echo -e "${YELLOW}🔐 Identifiants:${NC}"
echo "   • Application: test@test.com / test@test.com"
echo "   • pgAdmin:     admin@lcvb.com / admin"
echo ""
echo -e "${YELLOW}📝 Commandes utiles:${NC}"
echo "   • Arrêter:     ./stop.sh"
echo "   • Logs BDD:    docker logs lcvb_postgres -f"
echo "   • Logs API:    cd server && npm run dev"
echo ""
echo -e "${GREEN}✨ Ouvrez http://localhost:8000/home.html pour commencer !${NC}"
echo ""

# Garder le script actif
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter tous les services${NC}"

# Trap Ctrl+C
trap 'echo ""; echo "🛑 Arrêt des services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; docker compose down 2>/dev/null || docker-compose down 2>/dev/null; echo "✅ Services arrêtés"; exit 0' INT

# Attendre
wait

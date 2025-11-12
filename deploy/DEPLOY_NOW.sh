#!/bin/bash

# Déploiement Simple sur NAS - Version Robuste
# Usage: ./deploy/DEPLOY_NOW.sh

set -e

NAS_PASSWORD="Capgemini2025="
NAS_HOST="admin@192.168.1.40"
APP_DIR="/volume1/docker/lcvb-scoreboard"
IMAGE_NAME="lcvb_app:latest"
CONTAINER_NAME="lcvb_app"

FRONT_PORT=5700
API_PORT=3000
SSH_OPTS="-o StrictHostKeyChecking=no -o PreferredAuthentications=password -o PubkeyAuthentication=no"

echo "🚀 Déploiement LCVB Scoreboard sur NAS..."

# 1. Préparer l'archive de build (contexte Docker complet)
echo "📦 Création archive..."
tar -czf /tmp/lcvb-app.tar.gz \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='server/node_modules' \
    --exclude='tests' \
    --exclude='deploy' \
    --exclude='*.log' \
    --exclude='*.bak' \
    Dockerfile \
    start-services.sh \
    nginx-docker.conf \
    package*.json \
    server/ \
    *.html \
    *.css \
    *.js \
    logo-club/ \
    logos/ \
    data/ 2>/dev/null

# 2. Créer la structure sur le NAS
echo "📁 Création répertoire..."
sshpass -p "$NAS_PASSWORD" ssh $SSH_OPTS $NAS_HOST << REMOTE
echo '$NAS_PASSWORD' | sudo -S mkdir -p $APP_DIR
echo '$NAS_PASSWORD' | sudo -S chown admin:administrators $APP_DIR
REMOTE

# 3. Copier l'archive
echo "📤 Envoi fichiers..."
sshpass -p "$NAS_PASSWORD" scp $SSH_OPTS /tmp/lcvb-app.tar.gz $NAS_HOST:$APP_DIR/

# 4. Extraire
echo "📂 Extraction..."
sshpass -p "$NAS_PASSWORD" ssh $SSH_OPTS $NAS_HOST << REMOTE
cd $APP_DIR
tar -xzf lcvb-app.tar.gz
rm lcvb-app.tar.gz
REMOTE

# 5. Nettoyer les anciens conteneurs
echo "🧹 Nettoyage anciens conteneurs..."
sshpass -p "$NAS_PASSWORD" ssh -t $SSH_OPTS $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker stop lcvb_backend lcvb_frontend $CONTAINER_NAME 2>/dev/null || true"
sshpass -p "$NAS_PASSWORD" ssh -t $SSH_OPTS $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker rm lcvb_backend lcvb_frontend $CONTAINER_NAME 2>/dev/null || true"

# 6. Construire l'image unique
echo "🔨 Build Docker (mono-conteneur)..."
sshpass -p "$NAS_PASSWORD" ssh -t $SSH_OPTS $NAS_HOST "cd $APP_DIR && echo '$NAS_PASSWORD' | sudo -S docker build -t $IMAGE_NAME ."

# 7. Démarrer le conteneur unique sur 5700
echo "🚀 Démarrage conteneur $CONTAINER_NAME..."
sshpass -p "$NAS_PASSWORD" ssh -t $SSH_OPTS $NAS_HOST << REMOTE
echo '$NAS_PASSWORD' | sudo -S docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $FRONT_PORT:$FRONT_PORT \
    -p $API_PORT:$API_PORT \
    -e NODE_ENV=production \
    -e PORT=$API_PORT \
    -e DB_HOST=192.168.1.40 \
    -e DB_PORT=5433 \
    -e DB_NAME=lcvb_scoreboard \
    -e DB_USER=lcvb_user \
    -e DB_PASSWORD=lcvb_password_2024 \
    -e JWT_SECRET=lcvb_production_secret_2024 \
    -e CORS_ORIGIN=http://192.168.1.40:$FRONT_PORT \
    $IMAGE_NAME
REMOTE

echo ""
echo "⏳ Attente démarrage (20s)..."
sleep 20

# 8. Vérifier
echo "✅ Vérification..."
curl -sf http://192.168.1.40:$API_PORT/health && echo "✓ Backend OK" || echo "⚠ Backend en cours..."
curl -sf http://192.168.1.40:$FRONT_PORT && echo "✓ Frontend OK" || echo "⚠ Frontend en cours..."

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Déploiement terminé !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Accès: http://192.168.1.40:$FRONT_PORT/login.html"
echo "👤 Login: test@test.com / test@test.com"
echo ""
echo "📊 Logs:"
echo "  ssh admin@192.168.1.40 'sudo docker logs -f $CONTAINER_NAME'"
echo ""

# Cleanup
rm /tmp/lcvb-app.tar.gz

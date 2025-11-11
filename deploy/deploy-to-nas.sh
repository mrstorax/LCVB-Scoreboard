#!/bin/bash
set -e

# Configuration
NAS_PASSWORD="Capgemini2025="
NAS_HOST="admin@192.168.1.40"
APP_NAME="lcvb-scoreboard"
APP_DIR="/volume1/docker/$APP_NAME"
IMAGE_NAME="lcvb-web:latest"
CONTAINER_NAME="lcvb-container"
PORT=5700

echo "🚀 Déploiement LCVB Scoreboard sur NAS..."

# 1. Arrêter et supprimer les anciens containers
echo "🧹 Nettoyage des anciens containers..."
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker stop lcvb_backend lcvb_frontend 2>/dev/null || true"
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker rm lcvb_backend lcvb_frontend 2>/dev/null || true"
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker stop $CONTAINER_NAME 2>/dev/null || true"
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker rm $CONTAINER_NAME 2>/dev/null || true"

# 2. Créer le répertoire sur le NAS
echo "📁 Création du répertoire $APP_DIR..."
sshpass -p "$NAS_PASSWORD" ssh $NAS_HOST "mkdir -p $APP_DIR"

# 3. Créer l'archive de l'application (sans node_modules)
echo "📦 Création de l'archive..."
tar -czf /tmp/lcvb-deploy.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='deploy' \
    --exclude='*.md' \
    --exclude='database' \
    --exclude='.github' \
    Dockerfile \
    nginx-docker.conf \
    start-services.sh \
    server/ \
    *.html \
    *.css \
    *.js \
    data/ 2>/dev/null || true

# 4. Copier l'archive sur le NAS
echo "📤 Upload sur le NAS..."
sshpass -p "$NAS_PASSWORD" scp /tmp/lcvb-deploy.tar.gz $NAS_HOST:$APP_DIR/

# 5. Extraire l'archive sur le NAS
echo "📂 Extraction de l'archive..."
sshpass -p "$NAS_PASSWORD" ssh $NAS_HOST "cd $APP_DIR && tar -xzf lcvb-deploy.tar.gz"

# 6. Build de l'image Docker sur le NAS
echo "🔨 Build de l'image Docker..."
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker build -t $IMAGE_NAME $APP_DIR"

# 7. Démarrer le nouveau container
echo "🚀 Démarrage du container..."
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p $PORT:$PORT \
    -e DB_HOST=192.168.1.40 \
    -e DB_PORT=5432 \
    -e DB_NAME=lcvb_scoreboard \
    -e DB_USER=lcvb_user \
    -e DB_PASSWORD=lcvb_password_2024 \
    -e CORS_ORIGIN=http://192.168.1.40:$PORT \
    $IMAGE_NAME"

# 8. Vérifier que le container tourne
echo "🔍 Vérification du container..."
sleep 3
sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S docker ps | grep $CONTAINER_NAME"

# 9. Nettoyer
rm /tmp/lcvb-deploy.tar.gz

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🌐 Accès à l'application:"
echo "   http://192.168.1.40:$PORT/login.html"
echo ""
echo "👤 Identifiants par défaut:"
echo "   Email: test@test.com"
echo "   Mot de passe: test@test.com"
echo ""
echo "📊 Commandes utiles:"
echo "   Logs: ssh admin@192.168.1.40 \"sudo docker logs -f $CONTAINER_NAME\""
echo "   Restart: ssh admin@192.168.1.40 \"sudo docker restart $CONTAINER_NAME\""
echo "   Stop: ssh admin@192.168.1.40 \"sudo docker stop $CONTAINER_NAME\""
echo ""

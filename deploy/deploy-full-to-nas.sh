#!/bin/bash

# Déploiement complet LCVB Scoreboard sur NAS ASUSTOR
# L'application sera accessible sur http://192.168.1.40:8000

set -e

NAS_PASSWORD="Capgemini2025="
NAS_HOST="admin@192.168.1.40"
NAS_APP_DIR="/volume1/docker/lcvb-scoreboard"
VERSION=${1:-$(date +%Y%m%d-%H%M%S)}

echo "🚀 Déploiement LCVB Scoreboard sur NAS..."
echo "📦 Version: $VERSION"
echo ""

# Helper pour exécuter des commandes sur le NAS
nas_exec() {
    sshpass -p "$NAS_PASSWORD" ssh -t $NAS_HOST "echo '$NAS_PASSWORD' | sudo -S $1" 2>/dev/null
}

# 1. Créer la structure sur le NAS
echo "📁 Création de la structure..."
nas_exec "mkdir -p $NAS_APP_DIR/{releases/$VERSION,current}"

# 2. Créer l'archive (exclure fichiers inutiles)
echo "📦 Création de l'archive..."
tar -czf /tmp/lcvb-$VERSION.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='tests' \
    --exclude='*.md' \
    --exclude='deploy' \
    server/ \
    *.html \
    *.css \
    *.js \
    themes.css \
    shared-style.css \
    data/

echo "✅ Archive créée ($(du -h /tmp/lcvb-$VERSION.tar.gz | cut -f1))"

# 3. Copier sur le NAS
echo "📤 Envoi vers le NAS..."
sshpass -p "$NAS_PASSWORD" scp /tmp/lcvb-$VERSION.tar.gz $NAS_HOST:/tmp/

# 4. Extraire sur le NAS
echo "📂 Extraction..."
nas_exec "tar -xzf /tmp/lcvb-$VERSION.tar.gz -C $NAS_APP_DIR/releases/$VERSION/"
nas_exec "rm /tmp/lcvb-$VERSION.tar.gz"
rm /tmp/lcvb-$VERSION.tar.gz

# 5. Créer docker-compose.yml
echo "🐳 Configuration Docker..."
cat > /tmp/docker-compose.yml << 'DOCKER_EOF'
version: '3.8'

services:
  lcvb-backend:
    image: node:18-alpine
    container_name: lcvb_backend
    restart: unless-stopped
    working_dir: /app
    command: sh -c "npm install --production && npm start"
    volumes:
      - ./current/server:/app
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DB_HOST=192.168.1.40
      - DB_PORT=5432
      - DB_NAME=lcvb_scoreboard
      - DB_USER=lcvb_user
      - DB_PASSWORD=lcvb_password_2024
      - JWT_SECRET=lcvb_super_secret_key_production_2024
      - CORS_ORIGIN=http://192.168.1.40:8000
    network_mode: host

  lcvb-frontend:
    image: nginx:alpine
    container_name: lcvb_frontend
    restart: unless-stopped
    volumes:
      - ./current:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    network_mode: host
DOCKER_EOF

sshpass -p "$NAS_PASSWORD" scp /tmp/docker-compose.yml $NAS_HOST:$NAS_APP_DIR/
rm /tmp/docker-compose.yml

# 6. Créer nginx.conf
cat > /tmp/nginx.conf << 'NGINX_EOF'
server {
    listen 8000;
    server_name _;
    root /usr/share/nginx/html;
    index home.html index.html;

    # Logs
    access_log /var/log/nginx/lcvb_access.log;
    error_log /var/log/nginx/lcvb_error.log;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Cache statique
    location ~* \.(css|js|jpg|png|svg|ico)$ {
        expires 7d;
        add_header Cache-Control "public";
    }

    # HTML sans cache
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-store";
    }

    # Proxy API vers backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Servir les fichiers
    location / {
        try_files $uri $uri/ /home.html;
    }
}
NGINX_EOF

sshpass -p "$NAS_PASSWORD" scp /tmp/nginx.conf $NAS_HOST:$NAS_APP_DIR/
rm /tmp/nginx.conf

# 7. Mettre à jour le lien symbolique
echo "🔗 Activation version $VERSION..."
nas_exec "cd $NAS_APP_DIR && rm -f current && ln -s releases/$VERSION current"

# 8. Redémarrer les conteneurs
echo "🔄 Redémarrage des services..."
nas_exec "cd $NAS_APP_DIR && docker compose down 2>/dev/null || true"
sleep 2
nas_exec "cd $NAS_APP_DIR && docker compose up -d"

# 9. Attendre le démarrage
echo "⏳ Démarrage des services..."
sleep 10

# 10. Vérifier
echo ""
echo "✅ Vérification..."

# Backend
if curl -sf http://192.168.1.40:3000/health > /dev/null 2>&1; then
    echo "✅ Backend: http://192.168.1.40:3000 ✓"
else
    echo "⚠️  Backend: En cours de démarrage..."
fi

# Frontend
if curl -sf http://192.168.1.40:8000 > /dev/null 2>&1; then
    echo "✅ Frontend: http://192.168.1.40:8000 ✓"
else
    echo "⚠️  Frontend: En cours de démarrage..."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Déploiement terminé !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Application accessible:"
echo "   http://192.168.1.40:8000/login.html"
echo ""
echo "👤 Identifiants:"
echo "   test@test.com / test@test.com"
echo ""
echo "📊 Monitoring:"
echo "   Backend logs:  ssh admin@192.168.1.40 'sudo docker logs -f lcvb_backend'"
echo "   Frontend logs: ssh admin@192.168.1.40 'sudo docker logs -f lcvb_frontend'"
echo ""

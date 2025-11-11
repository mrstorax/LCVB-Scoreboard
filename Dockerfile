FROM node:18-alpine

WORKDIR /app

# Installer nginx + outils nécessaires
RUN apk add --no-cache bash nginx postgresql-client make g++ python3

# Installer les dépendances backend
COPY server/package*.json server/
RUN cd server && npm install --omit=dev

# Copier le backend
COPY server/ server/

# Copier le frontend (HTML/CSS/JS + assets)
COPY *.html ./
COPY *.css ./
COPY *.js ./
COPY logo-club/ ./logo-club/
COPY logos/ ./logos/
COPY data/ ./data/

# Configuration Nginx
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx-docker.conf /etc/nginx/nginx.conf

# Script de démarrage
COPY start-services.sh /start-services.sh
RUN chmod +x /start-services.sh

# Ports exposés
EXPOSE 5700 3000

# Variables d'environnement par défaut (surchargées via Docker/Compose)
ENV NODE_ENV=production \
    PORT=3000 \
    DB_HOST=postgres \
    DB_PORT=5432 \
    DB_NAME=lcvb_scoreboard \
    DB_USER=lcvb_user \
    DB_PASSWORD=lcvb_password_2024 \
    JWT_SECRET=lcvb_super_secret_key_change_in_production_2024 \
    CORS_ORIGIN=http://localhost:5700

CMD ["/start-services.sh"]

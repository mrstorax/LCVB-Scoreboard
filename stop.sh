#!/bin/bash

echo "🛑 Arrêt de LCVB Scoreboard Pro..."

# Arrêter les process Node.js sur le port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Arrêter les process Python sur le port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Arrêter Docker Compose
docker compose down 2>/dev/null || docker-compose down 2>/dev/null

echo "✅ Tous les services sont arrêtés"

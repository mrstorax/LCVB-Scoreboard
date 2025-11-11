#!/bin/bash
set -euo pipefail

echo "🚀 Démarrage LCVB Scoreboard..."

cleanup() {
    echo "🛑 Arrêt des services..."
    if [[ -n "${NGINX_PID:-}" ]]; then kill "$NGINX_PID" 2>/dev/null || true; fi
    if [[ -n "${NODE_PID:-}" ]]; then kill "$NODE_PID" 2>/dev/null || true; fi
}

trap cleanup SIGINT SIGTERM

echo "⚙️  Démarrage Backend Node.js..."
cd /app/server
node server.js &
NODE_PID=$!

echo "📦 Démarrage Nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

echo "✅ Services démarrés!"
echo "   - Frontend: http://localhost:5700"
echo "   - Backend API: http://localhost:3000"

wait -n "$NODE_PID" "$NGINX_PID"
cleanup

#!/usr/bin/env python3
"""
Serveur HTTP local pour LCVB Scoreboard
Permet la synchronisation automatique entre control.html et index.html dans OBS
"""

import http.server
import socketserver
import json
import os
import sys
from pathlib import Path

PORT = 8000
SCORE_FILE = "data/score-data.json"

# Créer le dossier data s'il n'existe pas
os.makedirs("data", exist_ok=True)

class ScoreboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        """Gère les requêtes GET (lecture du fichier JSON et fichiers statiques)"""
        # Route spéciale pour score-data.json
        if self.path == '/score-data.json' or self.path == '/data/score-data.json':
            try:
                if os.path.exists(SCORE_FILE):
                    with open(SCORE_FILE, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'no-cache')
                    self.end_headers()
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.end_headers()
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        # Route spéciale pour sponsors/sponsors.json (si existe)
        elif self.path == '/sponsors/sponsors.json':
            try:
                sponsors_file = "sponsors/sponsors.json"
                if os.path.exists(sponsors_file):
                    with open(sponsors_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'no-cache')
                    self.end_headers()
                    self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
                else:
                    self.send_response(404)
                    self.end_headers()
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            # Servir les fichiers statiques normalement (index.html, sponsors.html, logos, etc.)
            super().do_GET()
    
    def do_POST(self):
        """Gère les requêtes POST (écriture du fichier JSON)"""
        if self.path == '/update-score':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                # Sauvegarder dans le fichier
                with open(SCORE_FILE, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'ok'}).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(str(e).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        """Gère les requêtes CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    # Changer vers le répertoire du script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Créer le dossier data s'il n'existe pas
    os.makedirs("data", exist_ok=True)
    
    with socketserver.TCPServer(("", PORT), ScoreboardHandler) as httpd:
        print(f"🚀 Serveur LCVB Scoreboard démarré sur http://localhost:{PORT}")
        print(f"📁 Dossier : {script_dir}")
        print(f"📝 Ouvrez http://localhost:{PORT}/control.html dans votre navigateur")
        print(f"📺 Dans OBS, utilisez http://localhost:{PORT}/index.html comme Browser Source")
        print(f"💰 Sponsors : http://localhost:{PORT}/sponsors.html")
        print(f"\n⚠️  Appuyez sur Ctrl+C pour arrêter le serveur\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Serveur arrêté")

if __name__ == "__main__":
    main()

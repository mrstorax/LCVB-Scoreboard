#!/bin/bash

# Script de préparation des fichiers HTML pour le NAS
# Remplace les URLs localhost par les URLs du NAS

NAS_IP="192.168.1.40"

echo "🔧 Préparation des fichiers pour le NAS..."

# Trouver tous les fichiers HTML
for file in *.html; do
    if [ -f "$file" ]; then
        # Créer une sauvegarde
        cp "$file" "$file.bak"
        
        # Remplacer les URLs
        sed -i.tmp \
            -e "s|http://localhost:3000|http://$NAS_IP:3000|g" \
            -e "s|http://localhost:8000|http://$NAS_IP:8000|g" \
            "$file"
        
        rm "$file.tmp"
        echo "✅ $file"
    fi
done

echo ""
echo "✅ Fichiers préparés pour le NAS ($NAS_IP)"
echo ""
echo "Pour revenir à localhost:"
echo "  for f in *.html.bak; do mv \$f \${f%.bak}; done"

#!/bin/bash
# Script automatique pour copier score-data.json depuis Téléchargements vers data/
# Usage : ./auto-copy.sh (lancer en arrière-plan ou via cron)

SCOREBOARD_DIR="/Users/romainguery-odelin/Pictures/LCVB_Scoreboard"
DOWNLOADS_DIR="$HOME/Downloads"
TARGET_FILE="$SCOREBOARD_DIR/data/score-data.json"

# Surveiller le dossier Téléchargements
while true; do
    if [ -f "$DOWNLOADS_DIR/data/score-data.json" ]; then
        # Créer le dossier data s'il n'existe pas
        mkdir -p "$SCOREBOARD_DIR/data"
        # Copier le fichier
        cp "$DOWNLOADS_DIR/data/score-data.json" "$TARGET_FILE"
        echo "$(date): Fichier copié vers $TARGET_FILE"
        # Supprimer le fichier source
        rm "$DOWNLOADS_DIR/data/score-data.json"
    elif [ -f "$DOWNLOADS_DIR/score-data.json" ]; then
        # Cas où le fichier est directement dans Downloads (sans sous-dossier data)
        mkdir -p "$SCOREBOARD_DIR/data"
        cp "$DOWNLOADS_DIR/score-data.json" "$TARGET_FILE"
        echo "$(date): Fichier copié vers $TARGET_FILE"
        rm "$DOWNLOADS_DIR/score-data.json"
    fi
    sleep 1
done



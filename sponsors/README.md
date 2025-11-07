# Dossier Sponsors

Ce dossier contient les logos des sponsors à afficher sur le scoreboard.

## Utilisation

**C'est très simple !** Placez simplement vos fichiers logo dans ce dossier avec les noms suivants :

- `sponsor1.png`, `sponsor2.png`, `sponsor3.png`, etc.
- Ou `logo1.jpg`, `logo2.jpg`, etc.
- Ou `sponsor-1.png`, `sponsor-2.png`, etc.

**Formats supportés :** PNG, JPG, JPEG, SVG, GIF, WEBP

Les logos sont **détectés automatiquement** et affichés en rotation toutes les 3 secondes.

## Affichage

Les logos sont affichés en rotation automatique sur la page `sponsors.html` dans OBS.

Pour activer l'affichage des sponsors :
1. Cliquez sur le bouton "💰 Sponsors" dans le panneau de contrôle
2. Ajoutez une Browser Source dans OBS pointant vers `http://localhost:8000/sponsors.html`
3. Configurez les dimensions : 1920x120 pixels
4. Les logos se chargeront automatiquement depuis ce dossier


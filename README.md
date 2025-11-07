# LCVB Scoreboard - Scoreboard Volley Local pour OBS

Scoreboard autonome et local pour Le Crès Volley-Ball, utilisable dans OBS sans connexion Internet.

## 📁 Structure du projet

```
LCVB_Scoreboard/
├── index.html      → Affichage du scoreboard (Browser Source OBS)
├── control.html    → Interface de contrôle (boutons, réglages)
├── style.css       → Styles avec charte graphique LCVB
├── script.js       → Logique de gestion (localStorage)
├── server.py       → Serveur local Python pour synchronisation OBS
└── logos/          → Logos des équipes et du club
```

## 🚀 Utilisation

### Méthode recommandée : avec serveur local

1. Lancez le serveur : `python3 server.py`
2. Ouvrez http://localhost:8000/control.html dans votre navigateur
3. Dans OBS, utilisez http://localhost:8000/index.html comme Browser Source
4. Modifiez les scores dans control.html, le scoreboard se met à jour automatiquement

### Configuration OBS

1. Ajoutez une **Source Navigateur** (Browser Source)
2. URL : `http://localhost:8000/index.html` (ou `index.html` en local)
3. Dimensions : 1920x120 (standard) ou 400x110 (template PRO)
4. Cochez "Rafraîchir le navigateur quand la scène devient active"

## 🎨 Templates disponibles

- **Actuel** : Couleurs du club (Rose/Noir)
- **Neutre** : Minimaliste sans couleurs
- **Sobre** : Couleurs adoucies
- **Pro** : Style professionnel broadcast (400x110px)
- **Personnalisé** : Choisissez vos couleurs

## 🔧 Fonctionnalités

- ✅ Gestion complète des scores et sets
- ✅ Niveaux de compétition (Départemental, Régional, National...)
- ✅ Match amical
- ✅ Affichage/masquage des logos
- ✅ Système de sponsors rotatifs
- ✅ Synchronisation temps réel pour OBS
- ✅ Sauvegarde des configurations de couleurs

## 📝 Notes techniques

- Compatible avec tous les navigateurs modernes
- Stockage via localStorage + fichier JSON
- Serveur Python local pour synchronisation OBS
- 100% offline après installation

---

**Le Crès Volley-Ball** - Scoreboard Local v1.0
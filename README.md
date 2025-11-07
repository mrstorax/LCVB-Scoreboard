# LCVB Scoreboard - Scoreboard Volley Local pour OBS

Scoreboard autonome et local pour Le Crès Volley-Ball, utilisable dans OBS sans connexion Internet.

## 📁 Structure du projet

```
LCVB_Scoreboard/
├── index.html      → Affichage du scoreboard (Browser Source OBS)
├── control.html    → Interface de contrôle (boutons, réglages)
├── style.css       → Styles avec charte graphique LCVB
├── script.js       → Logique de gestion (localStorage)
├── README.md       → Ce fichier
└── assets/
    ├── logo-lcvb.png        → Logo Le Crès Volley-Ball (à ajouter)
    └── logo-equipe2.png    → Logo équipe 2 (placeholder)
```

## 🚀 Utilisation dans OBS

### 1. Préparation
- Placez les logos dans le dossier `assets/`
- Ouvrez `control.html` dans votre navigateur pour gérer le score

### 2. Configuration OBS
1. Dans OBS, ajoutez une **Source Navigateur** (Browser Source)
2. Sélectionnez "Fichier local"
3. Naviguez vers : `LCVB_Scoreboard/index.html`
4. Définissez la taille (ex: 1920x1080)
5. Cochez "Shutdown source when not visible" (optionnel)

### 3. Utilisation
- Ouvrez `control.html` dans un navigateur séparé
- Modifiez les noms d'équipes, logos, scores et sets
- Le scoreboard (`index.html`) se met à jour automatiquement via localStorage

## 🎨 Charte graphique

- **Rose** : #E91E63 (principale), #FF69B4 (clair)
- **Noir** : #000000 (fond)
- **Blanc** : #FFFFFF (texte)

## 🔧 Fonctionnalités

### Via control.html :
- ✅ Modifier les noms d'équipes
- ✅ Changer les logos (chemins relatifs)
- ✅ Ajuster les scores (+ / −)
- ✅ Gérer les sets individuels
- ✅ Passer au set suivant
- ✅ Réinitialiser le set actuel
- ✅ Réinitialiser tout le match

### Communication :
- Les deux pages (`index.html` et `control.html`) communiquent via `localStorage`
- Mise à jour automatique toutes les 100ms
- 100% offline, aucune connexion Internet requise

## 📝 Notes techniques

- Compatible avec tous les navigateurs modernes
- Responsive (s'adapte à différentes tailles)
- Stockage persistant via localStorage
- Pas de serveur nécessaire

## 🎯 Prochaines étapes

1. Ajouter vos logos dans `assets/`
2. Tester dans OBS avec Browser Source
3. Personnaliser les couleurs si nécessaire dans `style.css`

---

**Le Crès Volley-Ball** - Scoreboard Local v1.0



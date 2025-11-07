# LCVB Scoreboard - Scoreboard Volley Local pour OBS

Scoreboard autonome et local pour Le Crès Volley-Ball, utilisable dans OBS sans connexion Internet.

## 📁 Structure du projet

```
LCVB-Scoreboard/
├── index.html          → Affichage du scoreboard (Browser Source OBS)
├── control.html        → Interface de contrôle (boutons, réglages)
├── sponsors.html       → Affichage des sponsors (Browser Source OBS optionnel)
├── style.css           → Styles avec charte graphique LCVB
├── script.js           → Logique de gestion (localStorage + serveur)
├── server.py           → Serveur HTTP local optionnel (Python 3)
├── config.json         → Configuration par défaut
├── README.md           → Ce fichier
│
├── assets/             → Logos d'équipes (format alternatif)
│   ├── logo-lcvb.png
│   └── logo-equipe2.png
│
├── logos/              → Logos d'équipes (utilisé par défaut)
│   ├── logo-lcvb.png
│   └── logo-equipe2.png
│
├── logo-club/          → Logo du club (pour template PRO)
│   └── logo-club.png
│
├── sponsors/           → Logos des sponsors
│   └── (logos des sponsors)
│
└── data/               → Données JSON (généré automatiquement)
    └── score-data.json
```

## 🚀 Utilisation dans OBS

### Mode 1 : Sans serveur (Fichiers locaux)

#### 1. Préparation
- Placez les logos dans le dossier `logos/` ou `assets/`
- Placez le logo du club dans `logo-club/` (pour le template PRO)

#### 2. Configuration OBS
1. Dans OBS, ajoutez une **Source Navigateur** (Browser Source)
2. Sélectionnez "Fichier local"
3. Naviguez vers : `LCVB-Scoreboard/index.html`
4. Définissez la taille :
   - **Template standard** : 1920x120 pixels
   - **Template PRO** : 400x110 pixels
5. Cochez "Shutdown source when not visible" (optionnel)

#### 3. Utilisation
- Ouvrez `control.html` dans votre navigateur (fichier local)
- Modifiez les noms d'équipes, logos, scores et sets
- Le scoreboard (`index.html`) se met à jour automatiquement via localStorage
- Le fichier `data/score-data.json` se télécharge automatiquement à chaque modification

### Mode 2 : Avec serveur local (Recommandé pour OBS)

#### 1. Démarrer le serveur
```bash
python3 server.py
```
Le serveur démarre sur `http://localhost:8000`

#### 2. Configuration OBS
1. Dans OBS, ajoutez une **Source Navigateur** (Browser Source)
2. Sélectionnez "URL locale"
3. Entrez : `http://localhost:8000/index.html`
4. Définissez la taille (1920x120 pour standard, 400x110 pour PRO)
5. Cochez "Shutdown source when not visible" (optionnel)

#### 3. Utilisation
- Ouvrez `http://localhost:8000/control.html` dans votre navigateur
- Toutes les modifications sont synchronisées automatiquement via le serveur
- Plus réactif et fiable pour OBS Browser Source

## 🎨 Charte graphique

- **Rose** : #E91E63 (principale), #FF69B4 (clair)
- **Noir** : #000000 (fond)
- **Blanc** : #FFFFFF (texte)

## 🎭 Templates disponibles

Le scoreboard propose 5 styles d'affichage :

1. **Actuel** (Club - Rose/Noir) - Par défaut
   - Style avec les couleurs du club LCVB
   - Bordures et effets lumineux

2. **Neutre** (Minimaliste)
   - Style épuré sans couleurs du club
   - Pas de bordures ni d'effets

3. **Sobre** (Couleurs adoucies)
   - Version adoucie du style actuel
   - Moins de néons, plus discret

4. **Pro** (Style professionnel)
   - Format compact 400x110 pixels
   - Style broadcast professionnel
   - Affiche le logo du club, date du match, niveaux des équipes

5. **Custom** (Couleurs personnalisées)
   - Personnalisation complète des couleurs
   - Sauvegarde de configurations multiples

## 🔧 Fonctionnalités

### Via control.html :

#### Informations des équipes
- ✅ Modifier les noms d'équipes
- ✅ Sélectionner le niveau (Loisirs, Départemental, Régional, National, etc.)
- ✅ Changer les logos (sélection de fichier ou chemin manuel)
- ✅ Afficher/Masquer les logos

#### Gestion du score
- ✅ Ajuster les scores (+ / −)
- ✅ Saisie directe du score
- ✅ Réinitialiser le score d'une équipe

#### Gestion des sets
- ✅ Gérer les scores de chaque set individuellement
- ✅ Passer au set suivant (sauvegarde automatique)
- ✅ Changer de set manuellement
- ✅ Réinitialiser le set actuel

#### Options du match
- ✅ Marquer comme "Match amical"
- ✅ Choisir le template/style d'affichage
- ✅ Personnaliser les couleurs (template Custom)
- ✅ Sauvegarder/Charger des configurations de couleurs

#### Fonctionnalités avancées
- ✅ Affichage des sponsors (`sponsors.html`)
- ✅ Guide pour le partage sur les réseaux sociaux
- ✅ Réinitialisation complète du match

### Communication :

#### Sans serveur :
- Les deux pages (`index.html` et `control.html`) communiquent via `localStorage`
- Mise à jour automatique toutes les 33ms (~30 FPS)
- Téléchargement automatique de `data/score-data.json` à chaque modification
- 100% offline, aucune connexion Internet requise

#### Avec serveur :
- Synchronisation via serveur HTTP local (`server.py`)
- Mise à jour en temps réel via requêtes HTTP
- Plus fiable pour OBS Browser Source
- Fichier JSON automatiquement sauvegardé dans `data/score-data.json`

## 📝 Notes techniques

- Compatible avec tous les navigateurs modernes
- Responsive (s'adapte à différentes tailles)
- Stockage persistant via localStorage
- Serveur optionnel en Python 3 (pour meilleure synchronisation OBS)
- Support des logos PNG, JPG, SVG
- Gestion automatique des erreurs de chargement d'images

## 🎯 Prochaines étapes

1. ✅ Ajouter vos logos dans `logos/` ou `assets/`
2. ✅ Ajouter le logo du club dans `logo-club/` (pour template PRO)
3. ✅ Tester dans OBS avec Browser Source
4. ✅ Personnaliser les couleurs si nécessaire (template Custom)
5. ✅ Configurer les sponsors dans `sponsors/` (optionnel)

## 📚 Documentation supplémentaire

- `OBS_SETUP.md` - Guide détaillé pour OBS
- `OBS_FIX.md` - Solutions aux problèmes courants OBS
- `OBS_SOLUTION.md` - Solutions avancées
- `SERVEUR_LOCAL.md` - Guide du serveur local

---

**Le Crès Volley-Ball** - Scoreboard Local v2.0



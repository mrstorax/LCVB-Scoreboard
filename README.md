# 🏐 LCVB Scoreboard Pro - Gestion Complète de Match de Volley-Ball

**Outil professionnel tout-en-un** pour la gestion de matchs de volley-ball : scoreboard, statistiques avancées, analyse et diffusion OBS.  
Développé pour **Le Crès Volley-Ball** et adaptable à tous les clubs.

---

## ✨ Fonctionnalités principales

### 🔧 Module 1 : Initialisation du Match
- Configuration complète pré-match
- Gestion des équipes et joueurs
- Informations officiels (arbitres, lieu, date)
- Options techniques (streaming, sponsors)

### 📊 Module 2 : Suivi Live
- Scoreboard interactif temps réel
- Chronomètres automatiques (match + sets)
- Gestion scores et sets
- Intégration OBS professionnelle
- 5 templates d'affichage

### 📈 Module 3 : Statistiques Avancées *(en développement)*
- Saisie rapide des actions
- Attaques, services, blocs, réceptions
- Analyse en temps réel
- Historique des actions

### 📉 Module 4 : Dashboard & Analyse *(en développement)*
- Tableaux statistiques complets
- Graphiques visuels (Chart.js)
- Analyse par joueur
- Export PDF/CSV
- Partage réseaux sociaux

---

## 📁 Structure du projet

```
LCVB-Scoreboard/
├── index.html          → Redirection vers home.html
├── home.html           → Page d'accueil / navigation
├── setup.html          → Module 1 - Initialisation
├── control.html        → Module 2 - Suivi live
├── stats.html          → Module 3 - Statistiques (à venir)
├── dashboard.html      → Module 4 - Analyse (à venir)
├── display.html        → Affichage OBS (Browser Source)
│
├── shared-style.css    → Styles communs à tous les modules
├── control-style.css   → Styles spécifiques contrôle
├── style.css           → Styles affichage OBS
├── script.js           → Logique principale
├── server.py           → Serveur HTTP local (optionnel)
│
├── data/
│   ├── players.json    → Base de joueurs du club
│   ├── matches/        → Historique des matchs
│   └── score-data.json → Données scoreboard (auto-généré)
│
├── logos/              → Logos d'équipes
├── logo-club/          → Logo du club
├── sponsors/           → Images sponsors
│
└── docs/
    ├── ARCHITECTURE_VISION.md  → Vision complète du projet
    └── USER_GUIDE.md           → Guide utilisateur
```

---

## 🚀 Démarrage rapide

### 1. Ouvrir l'application
Ouvrez `index.html` dans votre navigateur (redirecte vers `home.html`)

### 1bis. Mode Docker tout-en-un
```bash
cp .env.docker.example .env.docker          # (une seule fois)
docker compose --env-file .env.docker up --build app
```
Le conteneur expose le frontend sur `http://localhost:5700` et l’API sur `http://localhost:3000`.  
Toutes les variables (BDD locale, secret JWT, ports) sont surchargeables via `.env.docker`.

### 1ter. Modes préprod / prod (versionnées)

| Contexte | Commande | Particularité |
|----------|----------|---------------|
| **Préprod** (stack dédiée) | `cp .env.preprod.example .env.preprod`<br>`docker compose -f docker-compose.preprod.yml --env-file .env.preprod up -d --build` | Lance `app + postgres` sur des ports isolés (`5701/3001`) avec un `APP_VERSION=preprod` |
| **Prod** (serveur live / NAS) | `cp .env.prod.example .env.prod`<br>`APP_IMAGE=lcvb-scoreboard-app:latest docker compose -f docker-compose.prod.yml --env-file .env.prod up -d` | Utilise une image pré-buildée, se connecte à la BDD existante, expose `5700/3000` |

- Le fichier `/health` expose désormais la version en ligne :  
  ```bash
  curl http://<host>:3000/health
  # => { "status":"OK", "version":"1.0.0", ... }
  ```
- Change `APP_VERSION` dans chaque `.env` avant déploiement (ex : `APP_VERSION=$(git rev-parse --short HEAD)`).
- Pour promouvoir préprod → prod : rebuild l’image (`docker compose -f docker-compose.preprod.yml build app`), push vers ton registry (`docker tag ...` + `docker push`), puis relance `docker-compose.prod.yml` en pointant sur l’image.

### 2. Créer un nouveau match
1. Cliquez sur "Nouveau match" ou allez dans **Module 1 - Initialisation**
2. Remplissez les informations du match
3. Sélectionnez les joueurs de l'équipe locale
4. Ajoutez l'équipe adverse
5. Configurez les options techniques
6. Cliquez sur "Lancer le match"

### 3. Contrôler le match
L'interface de contrôle s'ouvre automatiquement (ou allez dans **Module 2 - Suivi Live**)
- Gérez les scores avec les boutons +/-
- Les chronomètres démarrent automatiquement au premier point
- Passez au set suivant avec le bouton dédié

### 4. Afficher dans OBS
Voir section "Intégration OBS" ci-dessous

---

## 🔄 Synchronisation FFVB (équipes & calendriers)

1. Ouvre `settings.html` et clique sur l’onglet **FFVB & Calendriers**.
2. Dans le champ **Lien ou code FFVB du club**, colle l’URL officielle (ex. `https://www.ffvbbeach.org/...cnclub=0348589`) ou saisis simplement le code numérique.
3. Choisis la saison si besoin (sinon l’appli détecte celle en cours) puis clique sur **Importer depuis la FFVB**.
4. Le backend `server/services/ffvbService.js` scrape `planning_club_class.php`, détecte automatiquement les équipes du club, génère les liens `vbspo_calendrier.php` pour chacune et importe le calendrier CSV associé.
5. Le panneau affiche alors chaque équipe avec : entité/poule/code équipe, un lien direct vers le calendrier officiel FFVB et les 5 prochains matchs importés. La dernière synchro est historisée pour rejouer un import en un clic.

> ℹ️ Les données sont conservées dans `ffvb_imports` (PostgreSQL) et exposées via `/api/ffvb/imports/latest`. Cela permet d’alimenter ensuite l’onboarding des matchs et la sélection rapide des rencontres à initier dans `setup.html`.

---

## 🎥 Intégration OBS

### Mode 1 : Sans serveur (Fichiers locaux)

#### 1. Configuration OBS
1. Dans OBS, ajoutez une **Source Navigateur** (Browser Source)
2. Sélectionnez "Fichier local"
3. Naviguez vers : `LCVB-Scoreboard/display.html`
4. Définissez la taille :
   - **Template standard** : 1920x120 pixels
   - **Template PRO** : 400x110 pixels
5. Cochez "Shutdown source when not visible" (optionnel)

#### 2. Utilisation
- Ouvrez `home.html` dans votre navigateur
- Initialisez et contrôlez votre match
- Le scoreboard (`display.html`) se met à jour automatiquement via localStorage
- Le fichier `data/score-data.json` se télécharge automatiquement à chaque modification

### Mode 2 : Avec serveur local (Recommandé)

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

1. ✅ Ajouter vos logos dans `logos/`
2. ✅ Ajouter le logo du club dans `logo-club/` (pour template PRO)
3. ✅ Tester dans OBS avec Browser Source
4. ✅ Personnaliser les couleurs si nécessaire (template Custom)

## 📚 Documentation supplémentaire

- `OBS_SETUP.md` - Guide détaillé pour OBS
- `OBS_FIX.md` - Solutions aux problèmes courants OBS
- `OBS_SOLUTION.md` - Solutions avancées
- `SERVEUR_LOCAL.md` - Guide du serveur local

---

**Le Crès Volley-Ball** - Scoreboard Local v2.0

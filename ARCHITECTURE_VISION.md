# 🏐 LCVB Scoreboard - Vision Architecture Professionnelle

## Vue d'ensemble

Évolution du scoreboard simple vers un **outil complet de gestion et statistiques de match de volley-ball** pour clubs et staffs techniques.

---

## 📐 Architecture en 4 Modules

### 🔧 Module 1 : Initialisation du Match
**Fichier :** `setup.html`  
**Objectif :** Configuration pré-match complète

#### Sections

**1.1 Informations générales**
- Type de rencontre : Championnat / Coupe / Amical
- Division / Catégorie
- Date & heure
- Lieu (domicile/extérieur)
- Gymnase / Salle
- Arbitres (principal + adjoint)
- Observateur / Délégué (optionnel)

**1.2 Équipe locale (Le Crès VB)**
- Sélection des joueurs depuis base de données
  - Nom, Numéro, Poste (Passeur / Pointu / Central / Récep / Libéro)
  - Photo joueur (optionnel)
  - Checkbox actif/remplaçant
- Coach / Staff
- Composition de départ (6 joueurs + libéro)

**1.3 Équipe adverse**
- Création manuelle ou import simplifié
- Nom du club
- Couleur maillot
- Division
- Liste joueurs (simplifiée)
- Logo équipe (optionnel)

**1.4 Options techniques**
- Mode de diffusion
  - ☐ OBS / Streaming actif
  - ☐ YouTube / Twitch
  - URL du stream (optionnel)
- Sponsors à afficher
  - Sélection via checkboxes
  - Ordre d'affichage
- Mode statistiques
  - ☐ Statistiques complètes (module 3)
  - ☐ Statistiques simplifiées
  - ☐ Scores uniquement

**Données générées :**
```json
{
  "matchId": "LCVB-2025-001",
  "type": "championnat",
  "date": "2025-11-08",
  "time": "20:00",
  "location": "Salle Le Crès",
  "homeTeam": {
    "name": "Le Crès Volley-Ball",
    "players": [...],
    "coach": "...",
    "composition": [...]
  },
  "awayTeam": {...},
  "officials": {
    "referee1": "...",
    "referee2": "...",
    "observer": "..."
  },
  "options": {
    "streaming": true,
    "sponsors": ["sponsor1", "sponsor2"],
    "statsMode": "complete"
  }
}
```

---

### 📊 Module 2 : Suivi du Match (EN COURS)
**Fichiers :** `control.html` + `index.html`  
**Objectif :** Interface live pour le déroulement du match

#### ✅ Fonctionnalités existantes
- Scoreboard interactif (scores, sets)
- Chronomètres (match + sets)
- Informations équipes (noms, niveaux, logos)
- Templates d'affichage (5 styles)
- Intégration OBS
- Historique / Undo
- Sponsors dynamiques

#### 🔄 Améliorations prévues
- Indicateur de service actif (icône balle)
- Gestion timeout / substitutions
- Affichage composition terrain
- Changements de joueurs (interface tactile)
- Chrono de set visible dans OBS
- Alertes automatiques (25 points, etc.)
- État du match (pause, fin de set, fin de match)

---

### 📈 Module 3 : Statistiques Avancées
**Fichier :** `stats.html`  
**Objectif :** Saisie rapide et ergonomique des actions de jeu

#### Actions suivies

**3.1 Attaque**
- Type : Réussie / Bloquée / Faute / Out
- Joueur
- Zone de frappe (1-9)
- Type d'attaque : Puissance / Placé / Contre-pied
- Réception précédente (A, B, C)

**3.2 Service**
- Type : Ace / Faute / Mise en jeu
- Joueur
- Zone de service
- Qualité réception adverse (A, B, C, D)

**3.3 Bloc**
- Résultat : Point direct / Touché / Faute filet
- Joueur(s) au bloc
- Adversaire attaquant
- Zone

**3.4 Réception**
- Qualité : Parfaite (A) / Moyenne (B) / Ratée (C) / Faute (D)
- Joueur
- Type de service reçu
- Zone de réception

**3.5 Défense**
- Dig réussi / Raté
- Joueur
- Zone

**3.6 Erreurs**
- Type : Faute / Double / Filet / Position / 4 touches
- Joueur
- Contexte

#### Interface de saisie
```
┌─────────────────────────────────────┐
│  SET 1 | 12-10 | LCVB SERVICE       │
├─────────────────────────────────────┤
│                                     │
│  ACTION RAPIDE:                     │
│  [Attaque] [Service] [Bloc]         │
│  [Réception] [Défense] [Erreur]     │
│                                     │
│  JOUEUR: #12 Dupont                 │
│                                     │
│  RÉSULTAT:                          │
│  ✅ Réussie  ❌ Faute  ⏸️ Neutre     │
│                                     │
│  ZONE: [1][2][3][4][5][6][7][8][9]  │
│                                     │
│  [VALIDER] [ANNULER]                │
└─────────────────────────────────────┘
```

#### Données générées
```json
{
  "matchId": "LCVB-2025-001",
  "actions": [
    {
      "timestamp": "2025-11-08T20:05:32",
      "set": 1,
      "score": {"home": 12, "away": 10},
      "type": "attaque",
      "player": {"id": 12, "name": "Dupont"},
      "result": "reussie",
      "zone": 4,
      "detail": {
        "attackType": "puissance",
        "receptionQuality": "B"
      }
    }
  ]
}
```

---

### 📉 Module 4 : Tableau de Bord Post-Match
**Fichier :** `dashboard.html`  
**Objectif :** Analyse visuelle et export des données

#### 4.1 Résumé global
- Score final (sets + points)
- Durée totale + durée par set
- % réussite globale
  - Attaques : XX%
  - Services : XX%
  - Réception : XX%
  - Blocs : XX pts

#### 4.2 Analyse équipe

**Graphiques principaux :**
- Répartition des points (camembert)
  - Attaques : XX%
  - Services (aces) : XX%
  - Blocs : XX%
  - Erreurs adverses : XX%
- Évolution du score (ligne)
- Points par set (barres)

**Statistiques détaillées :**
```
┌──────────────────────────────────────────┐
│ ATTAQUES                                 │
│ Total : 45 | Réussies : 32 (71%)        │
│ Bloquées : 8 | Fautes : 5               │
├──────────────────────────────────────────┤
│ SERVICES                                 │
│ Total : 38 | Aces : 6 (16%)             │
│ Fautes : 4 | Mise en jeu : 28           │
├──────────────────────────────────────────┤
│ RÉCEPTION                                │
│ A : 12 | B : 18 | C : 6 | D : 2         │
│ Efficacité : 78%                         │
└──────────────────────────────────────────┘
```

#### 4.3 Analyse par joueur

**Tableau statistiques joueurs :**
| # | Joueur | Poste | Attaques | % Att. | Services | Aces | Blocs | Pts |
|---|--------|-------|----------|--------|----------|------|-------|-----|
| 12| Dupont | PO    | 15       | 67%    | 8        | 2    | 3     | 13  |
| 7 | Martin | CE    | 8        | 75%    | 6        | 0    | 5     | 11  |
| ...

**Graphiques joueur :**
- Radar chart (attaque, service, bloc, défense, réception)
- Top 3 scoreurs
- MVP du match

#### 4.4 Comparatif adversaire
- Tableau comparatif côte à côte
- Forces/Faiblesses identifiées
- Points marqués par zone

#### 4.5 Export
- **PDF récapitulatif**
  - Charte graphique club
  - Logo, scores, statistiques clés
  - Graphiques
  - Top joueurs
- **CSV/Excel**
  - Données brutes pour analyse saison
  - Compatible avec outils externes
- **Partage**
  - Réseaux sociaux (image générée)
  - Email (envoi automatique staff)
  - Google Drive / Cloud

---

## 🔗 Flux de données entre modules

```
┌──────────────┐
│   Module 1   │
│ Initialisation│
└──────┬───────┘
       │ matchData
       ↓
┌──────────────┐
│   Module 2   │──────┐
│  Suivi Live  │      │ actions → Module 3
└──────┬───────┘      │ (si activé)
       │ finalScore   │
       ↓              ↓
┌──────────────┐  ┌──────────────┐
│   Module 4   │←─│   Module 3   │
│  Dashboard   │  │ Statistiques │
└──────────────┘  └──────────────┘
```

---

## 🎨 Charte graphique unifiée

**Palette professionnelle épurée** (appliquée à tous les modules)

### Couleurs principales
```css
--control-bg-primary: #f8f9fa;      /* Fond clair */
--control-bg-secondary: #ffffff;     /* Cartes blanches */
--control-bg-tertiary: #f1f3f5;      /* Fond sections */
--control-text-primary: #212529;     /* Texte sombre */
--control-text-secondary: #6c757d;   /* Texte secondaire */
--control-accent: #2563eb;           /* Bleu accent */
--control-success: #10b981;          /* Vert succès */
--control-danger: #ef4444;           /* Rouge erreur */
--control-warning: #f59e0b;          /* Orange attention */
```

### Composants réutilisables
- Cards avec ombre légère
- Boutons arrondis (8px)
- Inputs cohérents
- Navigation fluide entre pages
- Icônes consistantes
- Typographie : system fonts

---

## 🛠️ Architecture technique

### Stack technologique
```
Frontend:
  - HTML5 / CSS3 (variables CSS)
  - JavaScript Vanilla (modularisé)
  - Optional: Vue.js / Alpine.js (pour stats)

Stockage:
  - localStorage (dev/local)
  - JSON files (export/import)
  - Future: SQLite / IndexedDB

Diffusion:
  - OBS Browser Source (existant)
  - WebSocket (temps réel - futur)

Export:
  - jsPDF (génération PDF)
  - Papa Parse / SheetJS (CSV/Excel)
```

### Structure de fichiers
```
LCVB-Scoreboard/
├── index.html              # Page d'accueil / navigation
├── setup.html              # Module 1: Initialisation
├── control.html            # Module 2: Suivi live (existant)
├── stats.html              # Module 3: Statistiques
├── dashboard.html          # Module 4: Analyse
├── display.html            # Affichage OBS (actuel index.html renommé)
├── style.css               # Styles affichage OBS
├── control-style.css       # Styles interface contrôle (existant)
├── shared-style.css        # Styles communs modules
├── script.js               # Core logic (existant)
├── stats-logic.js          # Logique statistiques
├── dashboard-logic.js      # Logique dashboard
├── data/
│   ├── matches/            # Données matches (JSON)
│   ├── players/            # Base joueurs
│   └── exports/            # PDF/CSV générés
├── assets/
│   ├── icons/              # Icônes actions (attaque, service, etc.)
│   └── charts/             # Bibliothèque graphiques
└── docs/
    ├── ARCHITECTURE_VISION.md (ce fichier)
    ├── README.md
    └── USER_GUIDE.md
```

---

## 📅 Plan de développement progressif

### Phase 1 : Consolidation (actuelle) ✅
- [x] Module 2 : Interface de suivi fonctionnelle
- [x] Chronomètres automatiques
- [x] Historique/Undo
- [x] Nouveau design épuré
- [x] Intégration OBS

### Phase 2 : Navigation & Structure (prochaine)
- [ ] Page d'accueil avec navigation vers modules
- [ ] Système de routing simple (hash navigation)
- [ ] Styles partagés (`shared-style.css`)
- [ ] Menu de navigation commun
- [ ] Gestion des sessions match

### Phase 3 : Module 1 - Initialisation
- [ ] Interface de configuration match
- [ ] Base de données joueurs (JSON)
- [ ] Formulaires de saisie ergonomiques
- [ ] Sauvegarde configuration match
- [ ] Lancement vers Module 2

### Phase 4 : Module 3 - Statistiques
- [ ] Interface de saisie rapide
- [ ] Enregistrement actions
- [ ] Liaison avec scores en temps réel
- [ ] Historique des actions
- [ ] Undo/Redo statistiques

### Phase 5 : Module 4 - Dashboard
- [ ] Tableaux statistiques
- [ ] Graphiques (Chart.js ou similaire)
- [ ] Analyse par joueur
- [ ] Export PDF
- [ ] Export CSV/Excel

### Phase 6 : Intégrations & Polish
- [ ] Partage réseaux sociaux
- [ ] Impression optimisée
- [ ] Mode offline complet
- [ ] Synchronisation cloud (optionnel)
- [ ] Documentation utilisateur complète

---

## 🎯 Objectifs finaux

**Pour le club :**
- Outil professionnel tout-en-un
- Gain de temps (automatisation)
- Analyse performance
- Communication améliorée (stats visuelles)

**Pour le staff technique :**
- Décisions éclairées (stats temps réel)
- Suivi joueurs
- Comparaison matchs/adversaires
- Historique saison

**Pour les spectateurs :**
- Affichage professionnel
- Informations enrichies
- Expérience améliorée

---

## 📝 Notes techniques

### Compatibilité
- Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- Tablettes (interface tactile optimisée)
- OBS Browser Source
- Impression / PDF

### Performance
- Chargement rapide (<2s)
- Responsive design
- Optimisation images
- Lazy loading modules

### Sécurité & Données
- Données locales par défaut
- Pas de dépendances externes critiques
- Export régulier recommandé
- Backup automatique (optionnel)

---

**Version :** 0.3.0 (Vision)  
**Dernière mise à jour :** 8 novembre 2025  
**Auteur :** Le Crès Volley-Ball


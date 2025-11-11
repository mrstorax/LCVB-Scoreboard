# Control Mobile - Fonctionnalités

## ✅ Corrections appliquées

### 1. Erreur `LCVBScoreboard.addPoint` non trouvé
- **Problème** : La fonction n'existe pas dans script.js
- **Solution** : Création d'une fonction locale `addPoint(team)` qui incrémente le score et sauvegarde

### 2. Erreur `undoLastAction().success` null
- **Problème** : `LCVBScoreboard.undoLastAction()` retourne null
- **Solution** : Réécriture complète de `undoLast()` avec gestion manuelle de l'historique

### 3. Historique manquant
- **Solution** : Création de `showHistory()` avec modal plein écran affichant les 20 derniers points

## 🎯 Nouvelles fonctionnalités

### Actions directes (hors workflow)
- **❌ Point EUX** : Ajoute un point adverse (faute directe)
- **✅ Point NOUS** : Ajoute un point pour nous (faute adverse)
- Gère automatiquement rotation et changement de service
- Enregistre dans l'historique

### Historique détaillé
- Modal plein écran avec fond sombre
- Affiche les 20 derniers points
- Chaque point montre :
  - Winner (✅ ou ❌)
  - Numéro du point
  - Set concerné
  - Résumé des actions (Service → Réception → Attaque, etc.)
- Bordure colorée (verte = nous, rouge = eux)
- Bouton fermer en haut à droite

### Undo amélioré
- Retire le dernier point du score
- Retire le dernier rally de l'historique
- Recalcule les stats
- Notification de confirmation

## 📱 Interface mobile optimisée

### Header sticky
- Score toujours visible
- Indicateur de service (⚡)
- 3 boutons rapides : Historique / Annuler / Menu

### Court tactile
- Grille 3x2 visuelle
- Numéros de joueurs en gros
- Highlight rose lors de sélection
- Libéro en violet

### Stats en temps réel
- Services/ACE
- Attaques (% de réussite)
- Blocs totaux

### Workflow rapide
- Panel glissant du bas
- Boutons larges (min 1.25rem padding)
- Couleurs cohérentes (Vert/Rouge/Violet)
- Feedback tactile (:active scale)

## 🔧 Workflow complet

1. **Setup initial** : Modal de positionnement automatique
2. **Choix service** : 2 gros boutons (ON SERT / ILS SERVENT)
3. **Actions directes** : 2 boutons visibles en permanence
4. **Démarrer point** : Workflow automatique selon qui sert
5. **Historique** : Modal avec tous les points
6. **Annuler** : Retire le dernier point

## 📊 Statistiques

Toutes les actions sont enregistrées dans `matchStats.rallies[]` avec :
- Type d'action
- Joueur concerné
- Résultat
- Metadata (service, rotation)

Permet de recalculer toutes les stats joueurs à tout moment.

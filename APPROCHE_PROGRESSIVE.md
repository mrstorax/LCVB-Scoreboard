# 🎯 Approche Progressive - Réimplémentation v0.2.0

## Principe

**Une fonctionnalité à la fois, testée avant de passer à la suivante.**

## Plan d'action

### Étape 1 : Chronomètre du match uniquement
- ✅ Ajouter la structure de données `timers` dans `DEFAULT_SCORE_DATA`
- ✅ Créer `startMatchTimer()`, `pauseMatchTimer()`, `resetMatchTimer()`, `getMatchElapsedTime()`
- ✅ Exporter les fonctions dans `window.LCVBScoreboard`
- ✅ Ajouter l'interface dans `control.html` (boutons + affichage)
- ✅ Ajouter l'affichage dans `index.html`
- ✅ **TESTER** : Vérifier que le chronomètre démarre, s'incrémente, se met en pause
- ✅ **VALIDER** : Tout fonctionne avant de continuer

### Étape 2 : Chronomètre par set
- ✅ Ajouter les fonctions pour les sets
- ✅ Interface dans control.html
- ✅ Affichage dans index.html
- ✅ **TESTER** : Vérifier que chaque set a son propre chronomètre
- ✅ **VALIDER** : Tout fonctionne avant de continuer

### Étape 3 : Historique et Undo
- ✅ Ajouter la structure `history` dans les données
- ✅ Créer `addToHistory()` et `undoLastAction()`
- ✅ Intégrer dans `updateScore()` et autres fonctions
- ✅ Bouton Undo dans control.html
- ✅ **TESTER** : Vérifier que l'undo fonctionne correctement
- ✅ **VALIDER** : Tout fonctionne avant de continuer

### Étape 4 : Raccourcis clavier
- ✅ Ajouter les event listeners pour les raccourcis
- ✅ **TESTER** : Vérifier chaque raccourci
- ✅ **VALIDER** : Tout fonctionne avant de continuer

### Étape 5 : Informations du match
- ✅ Ajouter `matchInfo` dans les données
- ✅ Champs dans control.html
- ✅ Affichage dans index.html (template PRO)
- ✅ **TESTER** : Vérifier la sauvegarde et l'affichage
- ✅ **VALIDER** : Tout fonctionne avant de continuer

## Règles strictes

1. **Une seule fonctionnalité à la fois**
2. **Tester immédiatement après implémentation**
3. **Ne pas passer à l'étape suivante si l'étape actuelle ne fonctionne pas**
4. **Commit après chaque étape validée**
5. **Tests Playwright pour chaque fonctionnalité**

## Tests à effectuer à chaque étape

1. Ouvrir `control.html` dans le navigateur
2. Vérifier la console (F12) - pas d'erreurs
3. Tester la fonctionnalité manuellement
4. Vérifier que les données sont sauvegardées dans localStorage
5. Vérifier que `index.html` affiche correctement
6. Lancer les tests Playwright pour cette fonctionnalité

## Avantages de cette approche

- ✅ Base stable à chaque étape
- ✅ Problèmes identifiés rapidement
- ✅ Code plus simple et maintenable
- ✅ Confiance dans chaque fonctionnalité
- ✅ Possibilité de revenir en arrière facilement


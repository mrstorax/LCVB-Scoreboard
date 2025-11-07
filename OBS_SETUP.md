# Configuration OBS - LCVB Scoreboard

## 🎯 Configuration Browser Source

1. **Ajouter la source** :
   - Dans OBS, cliquez droit dans la liste des sources → Ajouter → Source Navigateur (Browser Source)

2. **Configurer la source** :
   - **Nom** : "LCVB Scoreboard"
   - **URL** : Cliquez sur "Fichier local" et naviguez vers `index.html`
   - **Largeur** : 1920 (ou selon votre résolution)
   - **Hauteur** : 120 (hauteur du bandeau)
   - **Contrôles personnalisés** : Décoché (non nécessaire)

3. **Paramètres avancés** (optionnel) :
   - Décochez "Shutdown source when not visible" pour éviter les problèmes de rafraîchissement

## 🔧 Résolution des problèmes de synchronisation

### Problème : Les changements dans control.html ne s'affichent pas dans OBS

**Solutions** :

1. **Vérifier que les deux pages partagent le même localStorage** :
   - Ouvrez `control.html` dans votre navigateur
   - Ouvrez aussi `index.html` dans une autre fenêtre
   - Si les changements se synchronisent entre les deux fenêtres du navigateur, mais pas dans OBS, c'est un problème d'isolation localStorage d'OBS

2. **Solution OBS - Forcer le rafraîchissement** :
   - Dans OBS, faites un clic droit sur la source Browser Source
   - Sélectionnez "Interagir" (ou "Refresh" selon votre version)
   - OU fermez et rouvrez la source Browser Source

3. **Solution alternative - Utiliser le même navigateur** :
   - Dans les paramètres du Browser Source d'OBS, vous pouvez spécifier un navigateur personnalisé
   - Assurez-vous que le navigateur utilisé par OBS partage le localStorage avec votre navigateur système

4. **Vérifier les permissions localStorage** :
   - Le Browser Source doit avoir accès au localStorage
   - Certaines versions d'OBS peuvent bloquer localStorage
   - Essayez de changer les paramètres de sécurité du Browser Source

## ⚡ Test rapide

1. Ouvrez `control.html` dans votre navigateur
2. Changez un score avec les boutons +/-
3. Regardez `index.html` dans une autre fenêtre → doit se mettre à jour automatiquement
4. Si ça fonctionne dans le navigateur mais pas dans OBS, suivez les solutions ci-dessus

## 📝 Notes techniques

- Le système utilise un **timestamp** pour détecter les changements (plus fiable que le hash seul)
- **Polling toutes les 50ms** pour réactivité maximale
- **Vérification de sécurité toutes les secondes** en cas de problème de synchronisation
- Compatible avec les événements `storage` pour multi-fenêtres

## 🔄 Si rien ne fonctionne

1. **Utilisez le bouton "🔄 Refresh OBS"** dans control.html après chaque modification
2. Vérifiez que les fichiers sont dans le même dossier
3. Vérifiez que le chemin vers `index.html` est correct dans OBS
4. **Important** : Dans OBS, le Browser Source peut avoir un localStorage isolé. Solution :
   - Ouvrez `control.html` DANS OBS aussi (ajoutez-le comme une autre Browser Source)
   - OU utilisez le bouton "Refresh" dans OBS sur la source Browser Source après chaque modification
5. Essayez de redémarrer OBS
6. Vérifiez la console du navigateur (F12 dans control.html) pour voir s'il y a des erreurs

## 💡 Solution RECOMMANDÉE (fonctionne à 100%)

**Le problème** : Si vous ouvrez `control.html` dans votre navigateur système et `index.html` dans OBS Browser Source, ils ne partagent PAS le localStorage (isolation de sécurité).

**La solution** : Ouvrez **les deux dans OBS** comme Browser Sources :

1. **Première source (affichage)** :
   - Nom : "LCVB Scoreboard Display"
   - Fichier : `index.html`
   - Largeur : 1920, Hauteur : 120
   - Visible dans le stream : OUI

2. **Deuxième source (contrôle)** :
   - Nom : "LCVB Scoreboard Control"
   - Fichier : `control.html`
   - Largeur : 1400, Hauteur : 1080 (ou selon votre écran)
   - Visible dans le stream : NON (décochez dans les propriétés de la source)
   - OU placez-la en dehors de la zone visible de votre canvas

Comme ça, les deux sources partagent le même localStorage dans OBS et la synchronisation fonctionne parfaitement !

**Alternative** : Utilisez `control.html` en mode fenêtre flottante dans OBS (clic droit sur la source → "Interagir")


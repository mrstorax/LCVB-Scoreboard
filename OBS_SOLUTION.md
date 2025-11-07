# 🎯 Solution OBS - Système Hybride JSON + localStorage

## 🔄 Nouvelle Méthode

Le système utilise maintenant **deux méthodes** en parallèle :
1. **localStorage** (pour navigation web normale)
2. **Fichier JSON** `score-data.json` (pour OBS Browser Source)

## 📝 Comment ça fonctionne

### Dans control.html (navigateur) :
- Quand vous modifiez les scores, le système :
  1. Sauvegarde dans localStorage
  2. **Télécharge automatiquement** `score-data.json` dans votre dossier Téléchargements
  3. Vous devez **copier ce fichier** dans le dossier `LCVB_Scoreboard/`

### Dans index.html (OBS) :
- Le système lit périodiquement `score-data.json` (toutes les 500ms)
- Si le fichier est plus récent que localStorage, il l'utilise
- Mise à jour automatique !

## ⚡ Utilisation rapide

1. **Modifiez les scores** dans `control.html` (navigateur)
2. Le fichier `data/score-data.json` se télécharge **automatiquement** dans votre dossier Téléchargements (max 1 par seconde)
3. **Copiez-le** depuis Téléchargements vers `LCVB_Scoreboard/data/` (remplacez l'ancien)
4. Le scoreboard dans OBS se met à jour automatiquement (toutes les 300ms) !

## 🔧 Automatisation - Configurer le téléchargement automatique

### Option 1 : Chrome/Edge
1. Ouvrez les paramètres de téléchargement
2. Changez le dossier de téléchargement vers `LCVB_Scoreboard/data/`
3. Activez "Demander où enregistrer" → Désactivez
4. Le fichier se télécharge directement au bon endroit !

### Option 2 : Firefox
1. Paramètres → Général → Téléchargements
2. Choisissez le dossier `LCVB_Scoreboard/data/`
3. Décochez "Toujours demander où enregistrer"

**Note** : Le téléchargement est maintenant **automatique** à chaque modification (limité à 1 par seconde pour éviter la surcharge).

### Option 3 : Script automatique (Mac/Linux)
Un script `auto-copy.sh` est disponible :
1. Modifiez le chemin dans le script si nécessaire
2. Lancez-le : `./auto-copy.sh`
3. Il surveille automatiquement le dossier Téléchargements et copie le fichier dans `data/`

**Ou configurez un alias de dossier** : Créez un alias/symlink de `Téléchargements/data/` vers `LCVB_Scoreboard/data/`

## 💡 Alternative : Serveur HTTP local (RECOMMANDÉ)

Si vous avez Python installé, je peux créer un petit serveur HTTP local qui :
- ✅ Écoute les modifications
- ✅ Met à jour automatiquement `score-data.json`
- ✅ Fonctionne sans copie manuelle
- ✅ 100% automatique !

**Voulez-vous que je crée ce serveur ?**

---

**Note** : Le fichier se télécharge automatiquement à chaque modification. Le nom est toujours `score-data.json`, il écrase le précédent.


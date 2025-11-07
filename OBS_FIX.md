# 🔧 Solution pour OBS - Synchronisation ne fonctionne pas

## ⚠️ Problème

Si `control.html` est ouvert dans votre **navigateur** et `index.html` dans **OBS Browser Source**, ils **ne partagent PAS le localStorage** (isolation de sécurité du navigateur).

## ✅ Solution 100% fonctionnelle

**Ajoutez `control.html` aussi dans OBS comme Browser Source** :

1. Dans OBS, **ajoutez une deuxième Browser Source**
2. **Nom** : "LCVB Control" 
3. **Fichier** : `control.html`
4. **Taille** : 1400x1080 (ou selon votre écran)
5. **Important** : Décochez "Visible" dans les propriétés de la source OU placez-la **hors du canvas**
6. **Alternative** : Utilisez "Interagir" (clic droit sur la source) pour une fenêtre flottante

**Comme ça, les deux partagent le même localStorage dans OBS et ça fonctionne !**

## 🔄 Si vous devez utiliser control.html dans le navigateur

1. Après chaque modification, **cliquez sur "🔄 Refresh OBS"**
2. **OU** : Dans OBS, faites un clic droit sur la source Browser Source → **"Refresh"** ou **"Interagir"** → F5 pour forcer le rafraîchissement

## 📝 Vérification

- ✅ Ouvre `control.html` dans OBS aussi → **Fonctionne parfaitement**
- ❌ Ouvre `control.html` dans le navigateur → **Problème de synchronisation**



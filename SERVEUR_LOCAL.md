# 🌐 Serveur Local - Solution 100% Automatique

## ✨ Pourquoi un serveur local ?

Le serveur HTTP local permet :
- ✅ **Synchronisation automatique** entre control.html et index.html
- ✅ **Pas de copie manuelle** de fichiers
- ✅ **Fonctionne parfaitement avec OBS**
- ✅ **100% automatique** - aucune manipulation nécessaire

## 🚀 Démarrage rapide

### 1. Démarrer le serveur

```bash
# Dans le dossier LCVB_Scoreboard
python3 server.py
```

Ou si Python n'est pas dans le PATH :
```bash
python server.py
```

### 2. Utiliser les URLs dans le navigateur et OBS

- **control.html** : `http://localhost:8000/control.html`
- **index.html dans OBS** : `http://localhost:8000/index.html`

C'est tout ! La synchronisation fonctionne automatiquement.

## 📝 Configuration OBS

1. Dans OBS, ajoutez une **Browser Source**
2. **URL** : `http://localhost:8000/index.html` (au lieu de fichier local)
3. **Taille** : 1920x120
4. ✅ C'est tout !

## 🔧 Arrêter le serveur

Appuyez sur `Ctrl+C` dans le terminal où le serveur tourne.

## 💡 Astuce

Pour que le serveur démarre automatiquement au lancement de l'ordinateur, je peux vous aider à créer un script de démarrage automatique.

---

**Note** : Le serveur doit rester lancé pendant l'utilisation du scoreboard.



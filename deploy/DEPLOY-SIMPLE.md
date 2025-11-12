# 🚀 Déploiement Simple vers le NAS

Puisque SSH n'est pas configuré, voici la méthode la plus simple pour déployer.

## Option 1 : Via DSM File Station (Le plus simple)

### Étape 1 : Copier les fichiers

1. **Ouvrir DSM** : http://192.168.1.40:5000
2. **Ouvrir File Station**
3. **Naviguer vers** : `docker/lcvb-scoreboard/`
4. **Glisser-déposer ces fichiers depuis votre Mac** :
   - `login.html`
   - `home.html`
   - `teams.html`
   - `lineups.html`
   - `setup.html`

### Étape 2 : Redémarrer le conteneur frontend

1. **DSM → Container Manager**
2. **Trouver le conteneur** `lcvb_frontend` ou `frontend`
3. **Clic droit → Restart** (ou bouton Redémarrer)
4. **Attendre 10 secondes**

### Étape 3 : Vider le cache Cloudflare

1. **Aller sur** : https://dash.cloudflare.com
2. **Sélectionner** : `twittiz.fr`
3. **Caching → Purge Cache → Purge Everything**
4. **Confirmer**

### Étape 4 : Tester

1. **Ouvrir** : https://lcvb.twittiz.fr/login.html
2. **Ouvrir la console** : F12 (ou Cmd+Option+I sur Mac)
3. **Vérifier** : Plus d'erreur CORS ni Mixed Content
4. **Essayer de se connecter**

---

## Option 2 : Script automatique (après configuration SSH)

Si tu veux automatiser, configure d'abord SSH :

### Configuration SSH (une seule fois)

```bash
# 1. Générer une clé SSH
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_nas
# Appuyer sur Entrée 3 fois (pas de passphrase)

# 2. Copier la clé vers le NAS
cat ~/.ssh/id_rsa_nas.pub | ssh admin@192.168.1.40 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
# Entrer le mot de passe admin du NAS

# 3. Configurer SSH pour utiliser cette clé
cat >> ~/.ssh/config << 'EOF'
Host nas
    HostName 192.168.1.40
    User admin
    IdentityFile ~/.ssh/id_rsa_nas
EOF

# 4. Tester
ssh nas "echo 'SSH OK'"
```

### Ensuite utiliser le script automatique

```bash
./deploy/deploy-frontend-to-nas.sh
```

---

## Option 3 : Commande rapide via SCP (avec mot de passe)

```bash
# Depuis le dossier du projet
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard

# Copier les fichiers (va demander le mot de passe)
scp login.html home.html teams.html lineups.html setup.html admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/
```

Ensuite redémarrer le conteneur via DSM.

---

## ⚡ Méthode ultra-rapide (copier-coller)

```bash
# Tout en une commande (va demander le mot de passe 1 fois)
scp login.html home.html home2.html teams.html lineups.html setup.html control.html stats.html settings.html display.html spectator.html themes.css shared-style.css style.css admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/ && echo "✅ Fichiers copiés ! Redémarrez le conteneur dans DSM"
```

---

## 📋 Checklist après déploiement

- [ ] Fichiers copiés vers le NAS
- [ ] Conteneur frontend redémarré dans DSM
- [ ] Cache Cloudflare vidé
- [ ] Testé https://lcvb.twittiz.fr/login.html
- [ ] Plus d'erreur CORS dans la console (F12)
- [ ] Connexion fonctionne

---

## ❓ Problèmes fréquents

### "Mixed Content" persiste

→ Videz le cache du navigateur : **Cmd+Shift+R** (Mac) ou **Ctrl+Shift+R** (Windows)

### "CORS policy" persiste

→ Vérifiez que le backend a bien redémarré :
1. DSM → Container Manager
2. Vérifier que `lcvb_backend` ou `app` est bien démarré
3. Si non, le redémarrer

### Les changements ne sont pas visibles

→ Cache Cloudflare :
1. https://dash.cloudflare.com
2. twittiz.fr → Caching → Purge Everything

---

## 🎯 Ce qui a été corrigé

Tous les fichiers HTML utilisent maintenant :
```javascript
const API_URL = window.location.origin;
```

Au lieu de :
```javascript
const API_URL = 'http://192.168.1.40:5700'; // ❌ Ancien code
```

**Résultat** :
- ✅ En local : `API_URL = http://localhost:8000`
- ✅ En prod : `API_URL = https://lcvb.twittiz.fr`
- ✅ Plus de Mixed Content
- ✅ Plus de CORS
- ✅ Fonctionne partout sans modification

---

**Temps estimé** : 2-3 minutes par déploiement (méthode File Station)

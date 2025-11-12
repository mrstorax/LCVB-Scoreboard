# 🚀 Commande de déploiement - Copier-coller

## Une seule commande - Le mot de passe sera demandé UNE FOIS

```bash
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard && scp -o PreferredAuthentications=password -o PubkeyAuthentication=no login.html home.html home2.html teams.html lineups.html setup.html control.html stats.html settings.html display.html spectator.html themes.css shared-style.css style.css control-style.css theme.js admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/ && echo "" && echo "✅ FICHIERS COPIÉS !" && echo "" && echo "Prochaines étapes:" && echo "1. DSM → Container Manager → Restart 'frontend' ou 'lcvb_frontend'" && echo "2. Cloudflare → Purge Cache" && echo "3. Test: https://lcvb.twittiz.fr/login.html"
```

**Mot de passe** : `Capgemini2025=`

---

## Après le déploiement

### 1. Redémarrer le conteneur frontend

**Via DSM** :
1. Ouvrir http://192.168.1.40:5000
2. Container Manager
3. Chercher `frontend` ou `lcvb_frontend`
4. Clic droit → Restart

**Ou via SSH** (si disponible) :
```bash
ssh admin@192.168.1.40
# Mot de passe: Capgemini2025=
cd /volume1/docker/lcvb-scoreboard
docker compose restart frontend
# ou
docker restart $(docker ps | grep frontend | awk '{print $1}')
```

### 2. Vider le cache Cloudflare

1. https://dash.cloudflare.com
2. Sélectionner `twittiz.fr`
3. Caching → Purge Everything
4. Confirmer

### 3. Tester

1. Ouvrir https://lcvb.twittiz.fr/login.html
2. F12 (Console développeur)
3. Vérifier : **Plus d'erreur CORS** ✅
4. Essayer de se connecter

---

## Variante : Fichiers essentiels seulement (plus rapide)

Si tu veux déployer uniquement les fichiers critiques :

```bash
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard && scp -o PreferredAuthentications=password -o PubkeyAuthentication=no login.html home.html teams.html lineups.html setup.html admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/
```

---

## En cas d'erreur "Permission denied"

Essaie avec l'option interactive :

```bash
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard
sftp admin@192.168.1.40
# Entrer le mot de passe: Capgemini2025=
cd /volume1/docker/lcvb-scoreboard
put login.html
put home.html
put teams.html
put lineups.html
put setup.html
quit
```

---

## Vérification après déploiement

Console navigateur **AVANT** (F12) :
```
❌ Mixed Content: ...http://192.168.1.40:5700...
❌ CORS policy: ...
```

Console navigateur **APRÈS** (F12) :
```
✅ POST https://lcvb.twittiz.fr/api/auth/login 200 OK
✅ Aucune erreur
```

---

**Temps total** : 1-2 minutes (copie + redémarrage + test)

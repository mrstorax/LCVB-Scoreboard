# Guide de déploiement vers le NAS

## Déploiement rapide (recommandé)

```bash
cd /Users/romainguery-odelin/Documents/GitHub/LCVB-Scoreboard
./deploy/deploy-frontend-to-nas.sh
```

Ce script va automatiquement :
1. ✅ Tester la connexion au NAS
2. ✅ Créer un backup des fichiers actuels
3. ✅ Copier les fichiers modifiés vers le NAS
4. ✅ Redémarrer le conteneur frontend

---

## Configuration SSH (première fois)

Pour utiliser le script sans entrer de mot de passe à chaque fois :

```bash
# 1. Générer une clé SSH si vous n'en avez pas
ssh-keygen -t rsa -b 4096

# 2. Copier la clé vers le NAS
ssh-copy-id admin@192.168.1.40

# 3. Tester la connexion
ssh admin@192.168.1.40
```

---

## Configuration personnalisée

Vous pouvez personnaliser le déploiement avec des variables d'environnement :

```bash
# Utiliser un autre utilisateur
NAS_USER=monuser ./deploy/deploy-frontend-to-nas.sh

# Utiliser une autre IP
NAS_HOST=192.168.1.50 ./deploy/deploy-frontend-to-nas.sh

# Utiliser un autre chemin
NAS_PATH=/volume2/docker/app ./deploy/deploy-frontend-to-nas.sh

# Combinaison
NAS_USER=admin NAS_HOST=192.168.1.40 ./deploy/deploy-frontend-to-nas.sh
```

---

## Déploiement manuel (si le script ne fonctionne pas)

### Méthode 1 : Via SCP

```bash
# Copier tous les fichiers HTML
scp *.html admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/

# Copier les CSS
scp *.css admin@192.168.1.40:/volume1/docker/lcvb-scoreboard/

# Redémarrer le conteneur via SSH
ssh admin@192.168.1.40 "cd /volume1/docker/lcvb-scoreboard && docker compose restart frontend"
```

### Méthode 2 : Via DSM File Station

1. Ouvrir DSM → File Station
2. Naviguer vers `/docker/lcvb-scoreboard/`
3. Glisser-déposer les fichiers modifiés depuis votre Mac
4. DSM → Docker → Container Manager → Restart `lcvb_frontend`

---

## Fichiers déployés

Le script déploie automatiquement ces fichiers :

### Pages HTML (avec API_URL corrigé)
- ✅ `login.html` - Page de connexion
- ✅ `home.html` - Page d'accueil
- ✅ `home2.html` - Page d'accueil (design system)
- ✅ `teams.html` - Gestion des équipes
- ✅ `lineups.html` - Gestion des compositions
- ✅ `setup.html` - Configuration des matchs
- ✅ `control.html` - Contrôle du match
- ✅ `stats.html` - Statistiques
- ✅ `settings.html` - Paramètres
- ✅ `display.html` - Affichage public
- ✅ `spectator.html` - Vue spectateur

### Fichiers CSS/JS
- ✅ `themes.css` - Thèmes light/dark
- ✅ `shared-style.css` - Styles partagés
- ✅ `style.css` - Styles généraux
- ✅ `control-style.css` - Styles page contrôle
- ✅ `theme.js` - Gestion des thèmes

---

## Vérification après déploiement

### 1. Vider le cache Cloudflare

Si les changements ne sont pas visibles :

1. Cloudflare Dashboard → https://dash.cloudflare.com
2. Sélectionner votre domaine `twittiz.fr`
3. Caching → Purge Everything
4. Confirmer

### 2. Forcer le rechargement du navigateur

```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### 3. Vérifier les logs du conteneur

Via DSM :
1. Docker → Container Manager
2. Sélectionner `lcvb_frontend`
3. Details → Log

Via SSH :
```bash
ssh admin@192.168.1.40
cd /volume1/docker/lcvb-scoreboard
docker logs lcvb_frontend
```

### 4. Tester l'application

Ouvrir dans le navigateur :
- https://lcvb.twittiz.fr/login.html
- Ouvrir la Console développeur (F12)
- Vérifier qu'il n'y a plus d'erreur CORS/Mixed Content

---

## Restaurer un backup

Si quelque chose ne fonctionne pas, restaurez le backup :

```bash
# Via SSH
ssh admin@192.168.1.40
cd /volume1/docker/lcvb-scoreboard/backups

# Lister les backups disponibles
ls -lh

# Restaurer le dernier backup (exemple)
tar -xzf frontend_backup_20251112_010000.tar.gz -C ..

# Redémarrer le frontend
cd ..
docker compose restart frontend
```

---

## Troubleshooting

### Erreur : "Permission denied"

```bash
# Vérifier les permissions SSH
ssh admin@192.168.1.40 "ls -la /volume1/docker/lcvb-scoreboard"

# Si nécessaire, corriger les permissions
ssh admin@192.168.1.40 "sudo chown -R admin:users /volume1/docker/lcvb-scoreboard"
```

### Erreur : "Connection refused"

```bash
# Vérifier que le NAS est accessible
ping 192.168.1.40

# Vérifier que SSH est activé
# DSM → Panneau de configuration → Terminal & SNMP → SSH activé
```

### Erreur : "docker command not found"

Le script peut quand même copier les fichiers. Redémarrez le conteneur manuellement via DSM.

---

## Déploiement automatique (GitHub Actions - optionnel)

Pour déployer automatiquement à chaque push :

1. Créer `.github/workflows/deploy.yml`
2. Configurer les secrets GitHub (NAS_HOST, NAS_USER, SSH_KEY)
3. Pusher sur la branche `main` déclenchera le déploiement

Exemple de workflow disponible dans `deploy/github-actions-example.yml`

---

## Notes importantes

⚠️ **Ce qu'il faut savoir** :

1. **API_URL dynamique** : Tous les fichiers HTML utilisent maintenant `window.location.origin`, donc ils fonctionnent automatiquement en local ET en production
2. **Pas de rebuild nécessaire** : Les fichiers HTML/CSS/JS sont statiques, pas besoin de reconstruire Docker
3. **CORS déjà configuré** : Le backend accepte déjà `https://lcvb.twittiz.fr`
4. **Cache Cloudflare** : Pensez à le vider après chaque déploiement

✅ **Ce qui est corrigé** :

- Plus d'IP locale en dur (`192.168.1.40`)
- Plus d'erreur CORS
- Plus d'erreur Mixed Content (HTTP/HTTPS)
- Fonctionne en local et en production sans modification

---

**Besoin d'aide ?** Consultez `MIGRATION-COMPLETE.md` pour plus de détails sur l'architecture.

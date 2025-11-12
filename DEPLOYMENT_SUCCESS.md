# 🎉 Déploiement Réussi - LCVB Scoreboard Pro

## ✅ Application Déployée

Votre application **LCVB Scoreboard Pro** est maintenant déployée sur votre NAS et accessible 24/7 !

### 🌐 Accès à l'application

**URL principale**: http://192.168.1.40:5700/login.html

### 👤 Identifiants de test

- **Email**: test@test.com
- **Mot de passe**: test@test.com

---

## 📊 Architecture Déployée

### Container Docker Unique
Le déploiement utilise un container Docker unique qui embarque:
- **Nginx** (serveur web pour le frontend sur port 5700)
- **Node.js Backend** (API REST sur port 3000 interne)
- **PostgreSQL** (base de données externe sur le NAS)

### Configuration
- **Image**: lcvb-web:latest
- **Container**: lcvb-container
- **Port public**: 5700
- **Réseau**: Bridge mode avec mapping de port
- **Restart policy**: unless-stopped (redémarre automatiquement)

---

## 🔧 Commandes Utiles

### Voir les logs en temps réel
```bash
ssh admin@192.168.1.40 "sudo docker logs -f lcvb-container"
```

### Redémarrer l'application
```bash
ssh admin@192.168.1.40 "sudo docker restart lcvb-container"
```

### Arrêter l'application
```bash
ssh admin@192.168.1.40 "sudo docker stop lcvb-container"
```

### Démarrer l'application
```bash
ssh admin@192.168.1.40 "sudo docker start lcvb-container"
```

### Vérifier le statut
```bash
ssh admin@192.168.1.40 "sudo docker ps | grep lcvb"
```

---

## 🚀 Redéployer une Nouvelle Version

Pour déployer une nouvelle version après des modifications:

```bash
bash deploy/deploy-to-nas.sh
```

Ce script va automatiquement:
1. Nettoyer les anciens containers
2. Créer une archive du code source
3. L'uploader sur le NAS
4. Construire la nouvelle image Docker
5. Démarrer le nouveau container

**Durée**: ~2-3 minutes

---

## 📦 Structure du Déploiement sur le NAS

```
/volume1/docker/lcvb-scoreboard/
├── Dockerfile                  # Configuration de l'image Docker
├── nginx-docker.conf          # Configuration Nginx
├── start-services.sh          # Script de démarrage
├── server/                    # Backend Node.js
│   ├── server.js
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── node_modules/
├── *.html                     # Pages frontend
├── *.css                      # Styles
├── *.js                       # Scripts frontend
└── data/                      # Données statiques
```

---

## 🔒 Base de Données PostgreSQL

### Connexion
- **Host**: 192.168.1.40
- **Port**: 5433
- **Database**: lcvb_scoreboard
- **User**: lcvb_user
- **Container**: postgres-17

### Tables Créées (12)
1. users - Utilisateurs du système
2. clubs - Clubs de volleyball
3. teams - Équipes
4. players - Joueurs
5. matches - Matchs
6. match_events - Événements de match
7. match_stats - Statistiques de match
8. seasons - Saisons
9. lineups - Compositions d'équipe
10. match_data - Données de match
11. settings - Paramètres système
12. logs - Logs système

---

## 🛠 Maintenance

### Sauvegarder la base de données
```bash
ssh admin@192.168.1.40 "sudo docker exec postgres-17 pg_dump -U lcvb_user lcvb_scoreboard > /volume1/backups/lcvb_$(date +%Y%m%d_%H%M%S).sql"
```

### Restaurer la base de données
```bash
cat backup.sql | ssh admin@192.168.1.40 "sudo docker exec -i postgres-17 psql -U lcvb_user -d lcvb_scoreboard"
```

### Voir l'utilisation des ressources
```bash
ssh admin@192.168.1.40 "sudo docker stats lcvb-container --no-stream"
```

---

## 🎯 Pages Disponibles

1. **/login.html** - Page de connexion
2. **/home.html** - Hub principal
3. **/setup.html** - Configuration de match
4. **/control.html** - Contrôle de match (desktop)
5. **/control_mobile.html** - Contrôle de match (mobile)
6. **/display.html** - Affichage public
7. **/stats.html** - Statistiques de match
8. **/teams.html** - Gestion des équipes
9. **/lineups.html** - Compositions "7 de base"
10. **/spectator.html** - Vue spectateur
11. **/settings.html** - Paramètres

---

## 🆘 Dépannage

### L'application ne répond pas
1. Vérifier que le container tourne: `docker ps | grep lcvb`
2. Vérifier les logs: `docker logs lcvb-container`
3. Redémarrer: `docker restart lcvb-container`

### Erreur de connexion à la base de données
1. Vérifier que PostgreSQL tourne: `docker ps | grep postgres`
2. Tester la connexion: `docker exec postgres-17 psql -U lcvb_user -d lcvb_scoreboard -c "SELECT 1"`

### Port 5700 déjà utilisé
1. Vérifier les processus: `sudo netstat -tulpn | grep 5700`
2. Modifier le port dans `docker-compose.yml` ou le script de déploiement

---

## 📈 Prochaines Étapes

- [ ] Migrer control.html vers PostgreSQL
- [ ] Migrer stats.html vers PostgreSQL
- [ ] Intégrer lineups.html dans setup.html
- [ ] Configurer HTTPS avec Let's Encrypt
- [ ] Mettre en place des sauvegardes automatiques
- [ ] Ajouter un nom de domaine (optionnel)

---

## 🎊 Félicitations !

Votre application de gestion de matchs de volleyball est maintenant **en production** et accessible depuis votre réseau local 24/7 !

**Comparaison avec VolleyAI**:
- VolleyAI: http://192.168.1.40:5600 (port 5600)
- LCVB Scoreboard: http://192.168.1.40:5700 (port 5700)

Les deux applications cohabitent parfaitement sur le même NAS.

# 🚀 Prochaines Étapes - LCVB Scoreboard Pro

Ce document liste les prochaines tâches à effectuer pour finaliser la plateforme.

---

## 🎯 Priorité 1 - Finaliser Migration PostgreSQL

### A. Migrer control.html vers PostgreSQL ⏳

**Objectif:** Sauvegarder les actions de match en temps réel dans PostgreSQL au lieu de localStorage.

**Tâches:**
1. [ ] Créer endpoint `/api/matches/:id/actions` pour POST actions
2. [ ] Modifier `control.html` pour envoyer chaque action à l'API:
   - Service
   - Réception
   - Attaque
   - Bloc
   - Défense
   - Points
   - Timeouts
   - Cartons
   - Changements de joueurs
3. [ ] Sauvegarder l'état du match (score, set actuel) à chaque changement
4. [ ] Garder localStorage comme fallback en cas de perte de connexion
5. [ ] Implémenter retry automatique si échec API

**Endpoints à créer:**
```javascript
// Sauvegarder une action
POST /api/matches/:id/actions
Body: {
    type: 'service', 'attack', 'block', 'dig', 'point', etc.
    player_id: 123,
    team: 'home' | 'away',
    result: 'success' | 'error' | 'neutral',
    set_number: 1,
    timestamp: '2025-01-10T19:15:30',
    metadata: { ... }
}

// Mettre à jour le score
PUT /api/matches/:id/score
Body: {
    home_sets_won: 2,
    away_sets_won: 1,
    set_scores: [
        {set: 1, home: 25, away: 23},
        {set: 2, home: 25, away: 20},
        {set: 3, home: 15, away: 17}
    ],
    current_set: 3
}

// Terminer le match
PUT /api/matches/:id/finish
Body: {
    final_score: { home: 2, away: 1 },
    duration_minutes: 90,
    notes: 'Match très serré'
}
```

**Estimation:** 4-6 heures

---

### B. Migrer stats.html vers PostgreSQL ⏳

**Objectif:** Charger les statistiques depuis PostgreSQL au lieu de localStorage.

**Tâches:**
1. [ ] Modifier `stats.html` pour charger depuis `/api/stats/match/:id`
2. [ ] Afficher les mêmes statistiques qu'actuellement:
   - Stats globales par joueur
   - Stats par set
   - Timeline des actions
   - Graphiques Chart.js
3. [ ] Bouton export CSV depuis les données PostgreSQL
4. [ ] Fallback localStorage si match pas encore en BDD

**Endpoints à utiliser:**
```javascript
// Récupérer stats complètes d'un match
GET /api/stats/match/:id

// Récupérer stats d'un joueur pour un match
GET /api/stats/match/:id/player/:playerId

// Récupérer timeline des actions
GET /api/matches/:id/actions?set=1
```

**Estimation:** 3-4 heures

---

### C. Intégrer les Compositions dans setup.html ⏳

**Objectif:** Permettre de charger une composition pré-enregistrée lors de l'initialisation du match.

**Tâches:**
1. [ ] Ajouter un bouton "📋 Charger une composition" dans l'étape 2 de setup.html
2. [ ] Modal listant les compositions de l'équipe
3. [ ] Clic sur une composition → pré-sélectionne les 6 joueurs
4. [ ] Indication visuelle des positions (P1-P6)
5. [ ] Libéro automatiquement sélectionné si défini

**Workflow:**
```
Étape 2: Joueurs Présents
├─ Tous les joueurs affichés
├─ Bouton "📋 Charger une composition"
│  └─ Modal avec liste des compositions
│     ├─ "Composition type" (⭐ Par défaut)
│     ├─ "Match important"
│     └─ "Formation 5-1"
├─ Clic sur composition → joueurs pré-sélectionnés
└─ Possibilité d'ajuster manuellement
```

**Estimation:** 2-3 heures

---

## 🎯 Priorité 2 - Sponsors & Médias

### A. Page sponsors.html 📅

**Objectif:** Interface CRUD pour gérer les sponsors du club.

**Fonctionnalités:**
- [ ] Liste des sponsors avec aperçu logo
- [ ] Création sponsor:
  - Nom
  - Logo (URL ou upload)
  - Site web
  - Durée d'affichage (secondes)
  - Priorité (1-10)
  - Actif/Inactif
- [ ] Modification sponsor
- [ ] Suppression sponsor
- [ ] Prévisualisation rotation

**Endpoint API (déjà créé):**
- GET /api/sponsors
- POST /api/sponsors
- PUT /api/sponsors/:id
- DELETE /api/sponsors/:id

**Estimation:** 3-4 heures

---

### B. Rotation Sponsors dans display.html 📅

**Objectif:** Afficher les sponsors en rotation sur l'overlay OBS.

**Fonctionnalités:**
- [ ] Charger sponsors actifs depuis PostgreSQL
- [ ] Rotation automatique selon durée définie
- [ ] Transition fluide (fade)
- [ ] Respect priorité (sponsor priorité 10 affiché 2x plus)
- [ ] Pause rotation si aucun sponsor actif

**Implémentation:**
```javascript
// Dans display.html
async function loadSponsors() {
    const response = await fetch('http://localhost:3000/api/sponsors?active=true');
    const data = await response.json();
    sponsors = data.sponsors;
    startRotation();
}

function startRotation() {
    setInterval(() => {
        currentIndex = (currentIndex + 1) % sponsors.length;
        displaySponsor(sponsors[currentIndex]);
    }, sponsors[currentIndex].display_duration * 1000);
}
```

**Estimation:** 2-3 heures

---

## 🎯 Priorité 3 - Actualités & Calendrier

### A. Page news.html 📅

**Objectif:** Gérer les actualités du club.

**Fonctionnalités:**
- [ ] Liste des actualités
- [ ] Création actualité:
  - Titre
  - Contenu (Markdown?)
  - Image
  - Date de publication
  - Afficher pendant les lives (checkbox)
- [ ] Modification actualité
- [ ] Suppression actualité
- [ ] Prévisualisation

**Endpoint API (déjà créé):**
- GET /api/news
- POST /api/news
- PUT /api/news/:id
- DELETE /api/news/:id

**Estimation:** 3-4 heures

---

### B. Page events.html 📅

**Objectif:** Calendrier des événements du club.

**Fonctionnalités:**
- [ ] Vue calendrier (mois/semaine)
- [ ] Liste des événements
- [ ] Création événement:
  - Titre
  - Description
  - Date et heure
  - Type (match, entraînement, tournoi, réunion, autre)
  - Lieu
  - Lien équipe si match
- [ ] Modification événement
- [ ] Suppression événement
- [ ] Export iCal

**Librairie recommandée:** FullCalendar.js

**Endpoint API (déjà créé):**
- GET /api/events
- POST /api/events
- PUT /api/events/:id
- DELETE /api/events/:id

**Estimation:** 4-5 heures

---

## 🎯 Priorité 4 - Analytics & Dashboard Coach

### A. Dashboard par Équipe 📅

**Objectif:** Page dédiée pour chaque coach avec les stats de son équipe.

**Fonctionnalités:**
- [ ] Authentification coach → voir uniquement son équipe
- [ ] Statistiques globales de l'équipe:
  - Nombre de matchs joués
  - Victoires/Défaites
  - Sets gagnés/perdus
  - Ratio attaques réussies
  - Ratio réceptions positives
  - Ratio blocs
- [ ] Top 5 joueurs par catégorie
- [ ] Graphiques d'évolution (Chart.js)
- [ ] Comparaison match par match
- [ ] Export PDF

**Estimation:** 6-8 heures

---

### B. Export vers VolleyAI 📅

**Objectif:** Exporter automatiquement les statistiques vers volleyai.twittiz.fr.

**Tâches:**
1. [ ] Étudier l'API de VolleyAI
2. [ ] Créer endpoint `/api/export/volleyai/:matchId`
3. [ ] Transformer les données au format VolleyAI
4. [ ] Bouton "Exporter vers VolleyAI" dans stats.html
5. [ ] Export automatique à la fin du match (optionnel)

**Estimation:** 4-6 heures (selon complexité API VolleyAI)

---

## 🎯 Priorité 5 - Optimisations & UX

### A. Mode Hors-Ligne (PWA) 📅

**Objectif:** Permettre l'utilisation sans connexion internet.

**Fonctionnalités:**
- [ ] Service Worker pour cache des assets
- [ ] Manifest.json pour PWA
- [ ] Sauvegarde locale des actions de match
- [ ] Synchronisation automatique quand connexion rétablie
- [ ] Indication visuelle du statut de connexion

**Estimation:** 6-8 heures

---

### B. Notifications Push 📅

**Objectif:** Alertes en temps réel.

**Cas d'usage:**
- [ ] Début de match
- [ ] Fin de set
- [ ] Fin de match
- [ ] Nouvelle actualité publiée
- [ ] Prochain événement dans X heures

**Technologies:**
- Firebase Cloud Messaging ou
- Web Push API native

**Estimation:** 4-5 heures

---

### C. Historique Complet des Matchs 📅

**Objectif:** Consultation de tous les matchs passés.

**Fonctionnalités:**
- [ ] Page `history.html`
- [ ] Liste filtrable:
  - Par équipe
  - Par saison
  - Par compétition
  - Par résultat (V/D)
- [ ] Clic sur match → Voir statistiques
- [ ] Export global CSV (tous les matchs)
- [ ] Graphiques tendances sur la saison

**Estimation:** 4-5 heures

---

## 📊 Timeline Recommandée

### Sprint 1 (1-2 semaines)
- ✅ Lineups.html (FAIT)
- ✅ Migration setup.html (FAIT)
- ⏳ Migration control.html
- ⏳ Migration stats.html

### Sprint 2 (1-2 semaines)
- Intégration compositions dans setup.html
- Page sponsors.html
- Rotation sponsors display.html

### Sprint 3 (1-2 semaines)
- Page news.html
- Page events.html
- Affichage actualités dans spectator.html

### Sprint 4 (2-3 semaines)
- Dashboard coach par équipe
- Export VolleyAI
- Graphiques avancés

### Sprint 5 (2-3 semaines)
- Mode hors-ligne PWA
- Notifications push
- Historique complet
- Optimisations performance

---

## 🔧 Améliorations Techniques

### Backend
- [ ] Rate limiting sur les endpoints publics
- [ ] Validation Joi pour tous les endpoints
- [ ] Tests unitaires (Jest)
- [ ] Documentation Swagger/OpenAPI
- [ ] Logs structurés (Winston)
- [ ] Monitoring (Prometheus?)

### Frontend
- [ ] Lazy loading des images
- [ ] Code splitting (modules)
- [ ] Minification CSS/JS
- [ ] Service Worker pour cache
- [ ] Bundle analysis

### Database
- [ ] Backup automatique quotidien
- [ ] Monitoring performance requêtes
- [ ] Index optimisés
- [ ] Partitioning de la table match_stats (si volume élevé)

### DevOps
- [ ] CI/CD GitHub Actions
- [ ] Docker multi-stage builds
- [ ] Déploiement Nginx + PM2
- [ ] Certificat SSL (Let's Encrypt)
- [ ] Monitoring uptime (UptimeRobot?)

---

## 📝 Notes

### Décisions Architecturales

1. **Pourquoi localStorage en parallèle de PostgreSQL?**
   - Garantir compatibilité pendant migration progressive
   - Fallback si perte connexion pendant match
   - Sera supprimé une fois migration complète validée

2. **Pourquoi soft delete (active=true/false)?**
   - Préserver historique et audit trail
   - Permettre restauration si suppression accidentelle
   - Respecter contraintes RGPD (anonymisation possible)

3. **Pourquoi JSONB pour match_data?**
   - Flexibilité pour données évolutives
   - Performance avec index GIN
   - Éviter migrations fréquentes pour ajout de champs

---

## 🎯 Objectif Final

**Une plateforme complète de gestion sportive permettant:**

✅ Gestion centralisée des équipes et joueurs
✅ Suivi live des matchs avec statistiques détaillées
✅ Analyse de performance pour les coachs
✅ Diffusion professionnelle avec sponsors
✅ Communication club (actualités, événements)
✅ Export vers outils d'analyse externe (VolleyAI)
✅ Historique complet et comparaisons
✅ Utilisable hors-ligne

**Pour qui?**
- Administrateurs club
- Coachs
- Opérateurs de live
- Statisticiens
- Spectateurs

---

**Fait avec ❤️ par l'équipe technique du LCVB** 🏐

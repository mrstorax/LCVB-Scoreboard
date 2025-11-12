# ✅ Checklist de Test - LCVB Scoreboard Pro

## 🎯 Tests à Effectuer Après Installation

### 1. Infrastructure ✅

#### Docker & PostgreSQL
- [ ] `docker ps` affiche `lcvb_postgres` et `lcvb_pgadmin`
- [ ] Connexion à pgAdmin fonctionne (http://localhost:5050)
  - Email: admin@lcvb.com
  - Password: admin
- [ ] Base de données `lcvb_scoreboard` visible dans pgAdmin
- [ ] Table `lineups` existe
- [ ] Table `matches` contient la colonne `match_data` (type jsonb)

#### Backend API
- [ ] `curl http://localhost:3000/health` retourne `{"status":"OK"}`
- [ ] Logs backend affichent "✅ Base de données connectée"
- [ ] Aucune erreur dans les logs

#### Frontend
- [ ] http://localhost:8000/login.html charge correctement
- [ ] Thème dark/light fonctionne (bouton 🌙)
- [ ] Aucune erreur dans la console navigateur (F12)

---

### 2. Authentification 🔐

#### Login
- [ ] Auto-remplissage avec test@test.com fonctionne
- [ ] Connexion avec test@test.com / test@test.com réussit
- [ ] Message "✅ Connexion réussie !"
- [ ] Redirection automatique vers home.html
- [ ] Token JWT sauvegardé dans localStorage

#### Vérification Token
```javascript
// Dans la console du navigateur (F12)
localStorage.getItem('lcvb_auth_token')
// Devrait retourner un long string JWT
```

#### Déconnexion
- [ ] Bouton "Se déconnecter" visible dans home.html
- [ ] Clic sur "Se déconnecter" vide localStorage
- [ ] Redirection vers login.html

---

### 3. Hub du Club (home.html) 🏠

#### Affichage
- [ ] Avatar utilisateur affiché (lettre T pour Test)
- [ ] Nom "Test Admin" visible
- [ ] Rôle "Administrateur" affiché
- [ ] Hero section avec "🏐 Hub du Club"
- [ ] Section "Matchs en Direct" (vide pour l'instant)
- [ ] 5 boutons d'actions rapides visibles:
  - 👥 Gérer les équipes
  - 📋 Compositions
  - ➕ Nouveau match
  - ▶️ Reprendre un match
  - ⚙️ Paramètres

#### Statistiques du Club
- [ ] 4 cartes statistiques affichées:
  - Total équipes
  - Total joueurs
  - Matchs joués
  - Victoires
- [ ] Chiffres correctement chargés depuis PostgreSQL

#### Navigation
- [ ] Clic sur "Gérer les équipes" → teams.html
- [ ] Clic sur "Compositions" → lineups.html
- [ ] Clic sur "Nouveau match" → setup.html

---

### 4. Gestion des Équipes (teams.html) 👥

#### Chargement Initial
- [ ] Page charge sans erreur
- [ ] Titre "Gestion des Équipes" visible
- [ ] Bouton "➕ Créer une équipe" visible
- [ ] Liste des équipes s'affiche (vide si première fois)

#### Création d'Équipe
1. [ ] Clic sur "➕ Créer une équipe"
2. [ ] Modal s'ouvre avec formulaire
3. [ ] Remplir les champs:
   - Nom: "Seniors M"
   - Catégorie: "Senior M"
   - Couleur primaire: #E91E63 (rose)
   - Couleur secondaire: #FF69B4 (rose clair)
4. [ ] Clic sur "💾 Enregistrer"
5. [ ] Message "✅ Équipe créée avec succès !"
6. [ ] Modal se ferme
7. [ ] Nouvelle équipe apparaît dans la grille

#### Affichage Carte Équipe
- [ ] Nom de l'équipe affiché
- [ ] Catégorie affichée
- [ ] Nombre de joueurs affiché (0 pour nouvelle équipe)
- [ ] 2 pastilles de couleur visibles
- [ ] 2 boutons d'action: ✏️ Modifier, 🗑️ Supprimer

#### Ajout de Joueurs
1. [ ] Clic sur une carte d'équipe
2. [ ] Modal détails s'ouvre
3. [ ] Section "Joueurs de l'équipe" visible
4. [ ] Bouton "➕ Ajouter un joueur"
5. [ ] Clic sur "Ajouter un joueur"
6. [ ] Modal joueur s'ouvre
7. [ ] Remplir:
   - Numéro: 12
   - Prénom: John
   - Nom: Doe
   - Position: Attaquant
   - Libéro: Non
8. [ ] Sauvegarder
9. [ ] Joueur apparaît dans la liste

#### Modification d'Équipe
1. [ ] Clic sur ✏️ d'une équipe
2. [ ] Modal pré-remplie avec données existantes
3. [ ] Modifier le nom
4. [ ] Sauvegarder
5. [ ] Message "✅ Équipe modifiée"
6. [ ] Changement visible dans la grille

#### Suppression
- [ ] Clic sur 🗑️
- [ ] Confirmation demandée
- [ ] Après confirmation, équipe disparaît
- [ ] Équipe n'est pas supprimée en BDD (soft delete, active=false)

---

### 5. Compositions (lineups.html) 📋

#### Chargement Initial
- [ ] Page charge sans erreur
- [ ] Titre "Compositions d'équipe" visible
- [ ] Dropdown "Sélectionnez une équipe" fonctionnel
- [ ] Équipes chargées depuis PostgreSQL

#### Sélection d'Équipe
1. [ ] Sélectionner une équipe dans le dropdown
2. [ ] Section compositions s'affiche
3. [ ] Message "Aucune composition créée" si première fois

#### Création de Composition
1. [ ] Clic sur "➕ Nouvelle composition"
2. [ ] Vérifier qu'il y a au moins 6 joueurs dans l'équipe
3. [ ] Modal s'ouvre avec:
   - Champ "Nom de la composition"
   - Grille de terrain visuel (6 positions)
   - Section libéro
4. [ ] Remplir nom: "Composition type"
5. [ ] Sélectionner un joueur pour chaque position P1-P6
6. [ ] Optionnel: Sélectionner un libéro
7. [ ] Clic sur "💾 Enregistrer"
8. [ ] Message "✅ Composition créée"
9. [ ] Nouvelle composition apparaît dans la grille

#### Validation Anti-Doublons
1. [ ] Essayer de sélectionner le même joueur sur 2 positions
2. [ ] Message d'erreur: "⚠️ Un joueur ne peut pas être positionné plusieurs fois"

#### Affichage Carte Composition
- [ ] Nom de la composition visible
- [ ] 6 lignes de positions (P1-P6)
- [ ] Chaque ligne affiche: numéro + nom du joueur
- [ ] Ligne libéro si défini (🟡 L)
- [ ] 3 boutons d'action:
  - ☆ Définir par défaut
  - ✏️ Modifier
  - 🗑️ Supprimer

#### Définir Composition Par Défaut
1. [ ] Clic sur ☆ d'une composition
2. [ ] Étoile devient pleine: ⭐
3. [ ] Badge "⭐ Par défaut" apparaît en haut de la carte
4. [ ] Bordure verte sur la carte
5. [ ] Si clic sur ☆ d'une autre composition, la première perd le statut

#### Modification de Composition
1. [ ] Clic sur ✏️
2. [ ] Modal pré-remplie avec joueurs actuels
3. [ ] Modifier des positions
4. [ ] Sauvegarder
5. [ ] Message "✅ Composition modifiée"

#### Suppression
- [ ] Clic sur 🗑️
- [ ] Confirmation demandée
- [ ] Composition disparaît après confirmation

---

### 6. Initialisation Match (setup.html) ➕

#### Étape 1: Informations Générales
- [ ] Page charge sans erreur
- [ ] Barre de progression avec 4 étapes
- [ ] Dropdown "Équipe qui joue" chargé depuis PostgreSQL
- [ ] Sélection d'une équipe fonctionne
- [ ] Champs date/heure pré-remplis (aujourd'hui)
- [ ] Champs lieu, arbitre, compétition disponibles
- [ ] Bouton "Suivant" actif

#### Étape 2: Joueurs Présents
1. [ ] Après "Suivant", étape 2 s'affiche
2. [ ] Tous les joueurs de l'équipe affichés
3. [ ] Tous les joueurs pré-sélectionnés par défaut (présents)
4. [ ] Clic sur un joueur → le rend absent (décoché)
5. [ ] Re-clic → le remet présent
6. [ ] Compteur de joueurs présents mis à jour en temps réel

#### Étape 3: Équipe Adverse
1. [ ] Nom équipe adverse (champ texte)
2. [ ] Textarea pour saisir numéros adverses
3. [ ] Saisir "1, 3, 5, 7, 9, 11" ou "1 3 5 7 9 11"
4. [ ] Aperçu des numéros s'affiche avec badges
5. [ ] Compteur: "6 joueurs"

#### Étape 4: Options
- [ ] Case à cocher "Activer le streaming"
- [ ] Si cochée, champ URL stream visible
- [ ] Radios "Mode statistiques": Complet / Simplifié

#### Lancement du Match
1. [ ] Clic sur "🚀 Lancer le match"
2. [ ] Requête POST vers `/api/matches` envoyée
3. [ ] Match créé dans PostgreSQL (vérifier dans pgAdmin)
4. [ ] Message "✅ Match créé avec succès"
5. [ ] Redirection automatique vers control.html
6. [ ] localStorage contient `lcvb_current_match` avec matchId

---

### 7. Vérifications PostgreSQL 💾

#### Via pgAdmin (http://localhost:5050)

##### Connexion
1. [ ] Login avec admin@lcvb.com / admin
2. [ ] Ajouter serveur:
   - Name: LCVB Local
   - Host: lcvb_postgres
   - Port: 5433
   - Database: lcvb_scoreboard
   - Username: lcvb_user
   - Password: lcvb_password_2024

##### Vérifier les Données

**Teams:**
```sql
SELECT * FROM teams WHERE active = true;
```
- [ ] Équipes créées visibles
- [ ] Colonnes: id, name, category, coach_id, primary_color, secondary_color

**Players:**
```sql
SELECT p.*, t.name as team_name
FROM players p
JOIN teams t ON p.team_id = t.id
WHERE p.active = true;
```
- [ ] Joueurs visibles avec leur équipe
- [ ] Numéros corrects
- [ ] Libéros identifiés (is_libero = true)

**Lineups:**
```sql
SELECT l.*, t.name as team_name
FROM lineups l
JOIN teams t ON l.team_id = t.id
WHERE l.active = true;
```
- [ ] Compositions créées visibles
- [ ] Colonne `positions` contient JSON: {"p1": 1, "p2": 2, ...}
- [ ] `is_default` à true pour les compos par défaut

**Matches:**
```sql
SELECT
    id,
    status,
    match_date,
    location,
    match_data->>'general' as general_info
FROM matches
ORDER BY created_at DESC
LIMIT 5;
```
- [ ] Matchs créés visibles
- [ ] Colonne `match_data` contient JSON complet
- [ ] Status = 'live'

**Activity Logs:**
```sql
SELECT
    al.*,
    u.email as user_email
FROM activity_logs al
JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC
LIMIT 10;
```
- [ ] Actions loggées: create_team, create_player, create_lineup, etc.
- [ ] Utilisateur associé: test@test.com

---

### 8. Tests API via cURL 🔧

#### Health Check
```bash
curl http://localhost:3000/health
```
- [ ] Retourne `{"status":"OK","timestamp":"...","uptime":...}`

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test@test.com"}'
```
- [ ] Retourne `{"success":true,"token":"...","user":{...}}`

#### Get Teams (avec token)
```bash
TOKEN="YOUR_TOKEN_HERE"
curl http://localhost:3000/api/teams \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Retourne `{"success":true,"teams":[...]}`

#### Get Lineups
```bash
curl "http://localhost:3000/api/lineups?team_id=1" \
  -H "Authorization: Bearer $TOKEN"
```
- [ ] Retourne compositions pour l'équipe ID 1

---

### 9. Tests Navigateur (Console) 🖥️

Ouvrir la console (F12) et exécuter:

#### Vérifier le Token
```javascript
console.log(localStorage.getItem('lcvb_auth_token'));
```
- [ ] Affiche un JWT valide

#### Vérifier les Données de Match
```javascript
console.log(JSON.parse(localStorage.getItem('lcvb_current_match')));
```
- [ ] Affiche l'objet match avec matchId

#### Tester une Requête API
```javascript
const token = localStorage.getItem('lcvb_auth_token');
fetch('http://localhost:3000/api/teams', {
    headers: { 'Authorization': `Bearer ${token}` }
})
.then(r => r.json())
.then(data => console.log(data));
```
- [ ] Affiche la liste des équipes

---

### 10. Tests Responsive 📱

#### Desktop (>1024px)
- [ ] home.html: 5 boutons sur une ligne
- [ ] teams.html: Grille 3 colonnes
- [ ] lineups.html: Cartes sur 2-3 colonnes

#### Tablet (768px - 1024px)
- [ ] home.html: boutons wrap sur 2 lignes
- [ ] teams.html: Grille 2 colonnes
- [ ] lineups.html: Cartes sur 2 colonnes

#### Mobile (<768px)
- [ ] home.html: boutons en colonne
- [ ] teams.html: Grille 1 colonne
- [ ] lineups.html: Cartes en colonne
- [ ] Grille terrain: 2 colonnes au lieu de 3

---

### 11. Tests Thème Dark/Light 🌓

#### Toggle Thème
- [ ] Bouton 🌙 visible en haut à droite de chaque page
- [ ] Clic sur bouton toggle le thème
- [ ] Emoji change: 🌙 (dark) ↔️ ☀️ (light)
- [ ] Couleurs changent instantanément
- [ ] Thème sauvegardé dans localStorage
- [ ] Thème persiste après rechargement de page
- [ ] Thème synchronisé entre toutes les pages

#### Contraste
- [ ] Texte lisible dans les 2 thèmes
- [ ] Boutons bien visibles
- [ ] Bordures des cartes visibles
- [ ] Modals bien contrastés

---

## 📊 Résumé des Tests

### Obligatoires (Blocker) 🔴
- [ ] Backend API démarre et répond
- [ ] PostgreSQL connecté
- [ ] Login fonctionne
- [ ] Teams CRUD fonctionne
- [ ] Lineups CRUD fonctionne
- [ ] Setup charge équipes depuis PostgreSQL
- [ ] Match créé dans PostgreSQL

### Importants (Major) 🟠
- [ ] pgAdmin accessible
- [ ] Thème dark/light fonctionne
- [ ] Navigation entre pages OK
- [ ] Responsive mobile OK
- [ ] Activity logs enregistrés

### Optionnels (Minor) 🟡
- [ ] Animations fluides
- [ ] Messages de succès/erreur
- [ ] Tooltips sur boutons
- [ ] Auto-remplissage login

---

## ✅ Checklist Finale

Une fois tous les tests ci-dessus validés:

- [ ] J'ai testé la création d'équipe
- [ ] J'ai testé la création de composition
- [ ] J'ai testé l'initialisation d'un match
- [ ] Les données apparaissent dans PostgreSQL
- [ ] Aucune erreur dans les consoles (backend + navigateur)
- [ ] La migration est un succès ! 🎉

---

**Fait avec ❤️ par l'équipe technique du LCVB** 🏐

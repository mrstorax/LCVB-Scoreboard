# 🎯 ROADMAP D'IMPLÉMENTATION - LCVB Scoreboard

**Date de création:** 2025-11-09
**Référence club:** Le Crès Volley-Ball - https://le-cres-vb.web.app/agenda

---

## 📋 FEATURES À IMPLÉMENTER

### ✅ Phase 1 - COMPLÉTÉE (Session actuelle)
- [x] Système de cartons complet (jaune/rouge)
- [x] Système de timeouts (0/2 par équipe)
- [x] Bouton "Set suivant" avec réinit timeouts
- [x] Bouton "Fin du match"
- [x] Affichage postes joueurs sur terrain
- [x] Page stats.html avec export JSON/CSV
- [x] Suppression individuelle d'actions historique

---

### 🔄 Phase 2 - EN COURS (Priorité immédiate)

#### **9. Statistiques par set détaillées**
**Statut:** À faire (desktop + mobile)
**Description:**
- Afficher stats détaillées pour CHAQUE set (pas juste le score)
- Performance de chaque joueur PAR set
- Évolution des stats entre les sets
- Comparaison set par set

**Implémentation:**
- Ajouter dans `matchStats.setStats[]` avec structure:
  ```json
  {
    "setNumber": 1,
    "playerStats": {...},
    "teamStats": {...},
    "rallies": [...],
    "duration": "...",
    "timeouts": {...}
  }
  ```
- Affichage dans stats.html avec onglets par set
- Mini-panneau dans control.html/control_mobile.html

---

#### **Export JSON automatique à la fin du match**
**Statut:** À faire
**Description:**
- Lorsque clic sur "🏁 Fin", déclencher automatiquement le téléchargement JSON
- Garder aussi la sauvegarde localStorage
- Nom du fichier: `match_YYYYMMDD_HHMMSS_team1_vs_team2.json`

**Implémentation:**
```javascript
function endMatch() {
    // ... existing code ...

    // Auto-export JSON
    const filename = `match_${new Date().toISOString().replace(/[:.]/g, '-')}_${team1Name}_vs_${team2Name}.json`;
    const dataStr = JSON.stringify(matchData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    // Then redirect to stats.html
    setTimeout(() => { window.location.href = 'stats.html'; }, 1000);
}
```

---

#### **12. Toggle mode sombre/clair**
**Statut:** À faire (desktop + mobile)
**Description:**
- Bouton toggle dans le header
- Sauvegarde préférence dans localStorage
- Application du thème sur toutes les pages

**Implémentation:**
- Ajouter dans header: `<button onclick="toggleTheme()">🌙/☀️</button>`
- CSS variables pour les couleurs
- `localStorage.setItem('lcvb_theme', 'dark'|'light')`

**Palette:**
- **Light mode:** Fond blanc, texte noir, accents bleus
- **Dark mode:** Fond #0f172a, texte blanc, accents bleus/violets

---

### 🗄️ Phase 3 - Base de données (Priorité élevée)

#### **15. Système BDD pour persistence**
**Statut:** À faire
**Description:**
- Chaque match lancé doit être enregistré en BDD
- Statut: "en_cours", "terminé", "annulé"
- Éviter perte de données si rechargement page
- Historique de tous les matchs

**Architecture:**
```
Base de données (Firebase/NAS)
├── matches/
│   ├── match_id_1/
│   │   ├── setup
│   │   ├── score
│   │   ├── stats
│   │   ├── status: "en_cours"
│   │   └── lastUpdate: timestamp
│   ├── match_id_2/
│   └── ...
└── clubs/
    └── le-cres-vb/
        ├── settings
        ├── players
        └── teams
```

**Actions:**
- [ ] Choisir BDD: Firebase Realtime DB ou base sur NAS
- [ ] Créer structure de données
- [ ] Implémenter sync auto toutes les 30s
- [ ] Modal "Match en cours détecté - Reprendre ?"
- [ ] Bouton "Annuler le match" avec confirmation

---

#### **33. Configuration BDD hébergée sur NAS**
**Statut:** À faire
**Description:**
- Hébergement sur NAS personnel
- API REST ou WebSocket
- Authentification sécurisée

**Options:**
1. **PostgreSQL + API Node.js** sur NAS
2. **MongoDB + API Express** sur NAS
3. **Firebase** (cloud mais plus simple)

**Besoins:**
- Adresse IP/domaine du NAS
- Port ouvert (ex: 3001)
- SSL/TLS pour sécurité
- Authentification (JWT ou Firebase Auth)

---

### 📺 Phase 4 - Mode spectateur (Priorité moyenne)

#### **16. Page mode spectateur**
**Statut:** À faire
**Description:**
- URL publique pour suivre le match en direct
- iframe du live stream
- Statistiques en temps réel (selon config)
- Pas de possibilité de modification

**Setup dans setup.html:**
```html
<div class="spectator-config">
    <h3>Mode Spectateur</h3>
    <label>
        <input type="checkbox" id="enable-spectator">
        Activer le mode spectateur
    </label>

    <label>URL du live stream (iframe):
        <input type="url" id="live-stream-url"
               placeholder="https://youtube.com/embed/...">
    </label>

    <label>Niveau de statistiques:
        <select id="stats-level">
            <option value="minimal">Minimal (score uniquement)</option>
            <option value="standard">Standard (score + sets)</option>
            <option value="complet">Complet (toutes stats)</option>
        </select>
    </label>

    <button onclick="generateSpectatorLink()">
        🔗 Générer lien spectateur
    </button>
    <div id="spectator-link"></div>
</div>
```

**Page spectator.html:**
- URL: `spectator.html?matchId=xxx`
- Lecture seule
- Auto-refresh toutes les 5s (ou WebSocket)
- Affichage:
  - iframe du live en haut
  - Score en temps réel
  - Statistiques selon niveau choisi
  - Historique des points

---

### 📊 Phase 5 - Graphiques temps réel (Priorité moyenne)

#### **30. Graphiques en temps réel**
**Statut:** À faire
**Description:**
- Évolution du score (courbe)
- Répartition des points par type (camembert)
- Performance par joueur (barres)
- Timeline du match

**Bibliothèque:** Chart.js ou ApexCharts

**Graphiques:**
1. **Évolution score** (line chart)
   - Axe X: Points (1, 2, 3...)
   - Axe Y: Score (0-25)
   - 2 courbes (nous vs eux)

2. **Répartition points** (pie chart)
   - ACE: 15%
   - Attack: 60%
   - Block: 10%
   - Fautes adverses: 15%

3. **Performance joueurs** (bar chart)
   - Joueurs en X
   - Points marqués en Y

**Implémentation:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<div class="charts-grid">
    <canvas id="score-evolution"></canvas>
    <canvas id="points-distribution"></canvas>
    <canvas id="player-performance"></canvas>
</div>
```

---

### 🎨 Phase 6 - Personnalisation club

#### **Page personnalisation club/interface**
**Statut:** À faire
**Description:**
- Page de configuration du style
- Upload logo club
- Choix des couleurs (primaire, secondaire)
- Police personnalisée
- Application sur toutes les pages

**Référence:** https://le-cres-vb.web.app/agenda

**settings.html:**
```html
<div class="club-settings">
    <h2>⚙️ Personnalisation du Club</h2>

    <!-- Logo -->
    <div class="setting-group">
        <h3>Logo du club</h3>
        <input type="file" id="club-logo" accept="image/*">
        <img id="logo-preview" src="">
    </div>

    <!-- Couleurs -->
    <div class="setting-group">
        <h3>Couleurs</h3>
        <label>Couleur primaire:
            <input type="color" id="color-primary" value="#3b82f6">
        </label>
        <label>Couleur secondaire:
            <input type="color" id="color-secondary" value="#8b5cf6">
        </label>
        <label>Couleur accent:
            <input type="color" id="color-accent" value="#10b981">
        </label>
    </div>

    <!-- Nom du club -->
    <div class="setting-group">
        <h3>Informations</h3>
        <label>Nom du club:
            <input type="text" id="club-name" placeholder="Le Crès Volley-Ball">
        </label>
        <label>Ville:
            <input type="text" id="club-city" placeholder="Le Crès">
        </label>
    </div>

    <!-- Police -->
    <div class="setting-group">
        <h3>Typographie</h3>
        <select id="font-family">
            <option value="system">Système par défaut</option>
            <option value="roboto">Roboto</option>
            <option value="opensans">Open Sans</option>
            <option value="montserrat">Montserrat</option>
        </select>
    </div>

    <!-- Prévisualisation -->
    <div class="preview-panel">
        <h3>Prévisualisation</h3>
        <div id="style-preview">
            <!-- Exemple de carte avec les styles appliqués -->
        </div>
    </div>

    <button class="btn-save" onclick="saveClubSettings()">
        💾 Enregistrer les paramètres
    </button>
</div>
```

**CSS dynamique:**
```javascript
function applyClubTheme() {
    const settings = JSON.parse(localStorage.getItem('lcvb_club_settings'));
    if (!settings) return;

    // Apply colors
    document.documentElement.style.setProperty('--color-primary', settings.colorPrimary);
    document.documentElement.style.setProperty('--color-secondary', settings.colorSecondary);
    document.documentElement.style.setProperty('--color-accent', settings.colorAccent);

    // Apply font
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);

    // Apply logo
    document.querySelectorAll('.club-logo').forEach(el => {
        el.src = settings.logoUrl;
    });
}

// Call on every page load
window.addEventListener('DOMContentLoaded', applyClubTheme);
```

---

### 📝 Phase 7 - Logs et debugging

#### **35. Système de logs**
**Statut:** À faire
**Description:**
- Logger toutes les actions importantes
- Stockage en BDD
- Interface de visualisation
- Export des logs

**Structure:**
```json
{
  "timestamp": "2025-11-09T14:32:15.123Z",
  "level": "info|warn|error",
  "category": "match|system|user",
  "message": "Point marqué par #12",
  "data": {...},
  "matchId": "match_123"
}
```

**Implémentation:**
```javascript
class Logger {
    static log(level, category, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            data,
            matchId: currentMatchId,
            userAgent: navigator.userAgent
        };

        // Store in localStorage (max 1000 entries)
        const logs = JSON.parse(localStorage.getItem('lcvb_logs') || '[]');
        logs.push(logEntry);
        if (logs.length > 1000) logs.shift();
        localStorage.setItem('lcvb_logs', JSON.stringify(logs));

        // Send to BDD if connected
        if (dbConnected) {
            sendLogToDB(logEntry);
        }

        // Console log
        console[level](message, data);
    }

    static info(category, message, data) {
        this.log('info', category, message, data);
    }

    static warn(category, message, data) {
        this.log('warn', category, message, data);
    }

    static error(category, message, data) {
        this.log('error', category, message, data);
    }
}

// Usage
Logger.info('match', 'Point marqué', { player: 12, type: 'ace' });
Logger.error('system', 'Erreur de sauvegarde', { error: e.message });
```

**Page logs.html:**
- Filtres (niveau, catégorie, date)
- Recherche
- Export CSV
- Statistiques d'erreurs

---

## 🗂️ ARCHITECTURE FINALE

### Structure fichiers
```
LCVB-Scoreboard/
├── home.html                 # Page d'accueil
├── setup.html                # Configuration match
├── control.html              # Interface desktop
├── control_mobile.html       # Interface mobile
├── stats.html               # Statistiques post-match ✅
├── spectator.html           # Mode spectateur 🔄
├── settings.html            # Personnalisation club 🔄
├── logs.html                # Visualisation logs 🔄
├── script.js                # Core logic
├── db.js                    # Database layer 🔄
├── logger.js                # Logging system 🔄
├── charts.js                # Graphiques 🔄
└── styles/
    ├── theme-light.css      # Thème clair 🔄
    ├── theme-dark.css       # Thème sombre 🔄
    └── club-custom.css      # Styles club 🔄
```

### Structure BDD
```
Firebase/NAS Database
├── /clubs/
│   └── /le-cres-vb/
│       ├── settings
│       ├── players
│       └── teams
├── /matches/
│   ├── /match_20251109_143215/
│   │   ├── setup
│   │   ├── status: "en_cours"
│   │   ├── score
│   │   ├── stats
│   │   ├── setStats[]
│   │   ├── logs[]
│   │   └── lastUpdate
│   └── ...
└── /spectators/
    └── /match_20251109_143215/
        ├── enabled: true
        ├── streamUrl
        └── statsLevel
```

---

## 📅 PLANNING

### Semaine 1
- [x] Phase 1 complétée
- [ ] Stats par set détaillées (9)
- [ ] Export JSON auto
- [ ] Toggle dark/light (12)

### Semaine 2
- [ ] Architecture BDD (15, 33)
- [ ] Sync temps réel
- [ ] Logs système (35)

### Semaine 3
- [ ] Mode spectateur (16)
- [ ] Graphiques temps réel (30)

### Semaine 4
- [ ] Page personnalisation club
- [ ] Tests complets
- [ ] Documentation

---

## 🎯 OBJECTIFS

**Court terme (1 mois):**
- Application complète et stable
- BDD fonctionnelle
- Mode spectateur opérationnel
- Personnalisation club

**Moyen terme (3 mois):**
- Statistiques avancées
- Multi-matchs
- Analyse de performance

**Long terme (1 an):**
- Tendances et patterns (27)
- Comparaison historique (28)
- Integration volley-ai

---

## 📊 MÉTRIQUES DE SUCCÈS

- ✅ Temps de notation < 3s par action
- ✅ Taux d'erreur < 1%
- ✅ 100% des matchs sauvegardés
- ✅ Mode spectateur accessible à 100+ personnes simultanément
- ✅ Synchronisation < 5s
- ✅ Export données en < 2s

---

**Dernière mise à jour:** 2025-11-09
**Version:** 0.5.0
**Statut:** En développement actif

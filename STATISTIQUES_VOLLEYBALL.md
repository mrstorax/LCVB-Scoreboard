# 📊 STATISTIQUES COMPLÈTES - LCVB Scoreboard

## Vue d'ensemble
Document de référence pour l'implémentation du **Module 3 - Statistiques Avancées**.  
Liste exhaustive des statistiques à suivre par joueur, par rôle et pour l'équipe.

---

## 🏐 STATISTIQUES GÉNÉRALES D'ÉQUIPE

### Points marqués
- **Total points** (somme de tous les sets)
- **Points par set** (détail set 1, 2, 3, 4, 5)
- **Répartition des points** :
  - Points sur attaque
  - Points sur service (aces)
  - Points sur bloc
  - Points sur erreur adverse
  - Points gagnés de manière indéterminée

### Durée et tempo
- **Durée totale du match** (HH:MM:SS)
- **Durée par set** (set 1, 2, 3, 4, 5)
- **Moyenne de durée par point** (secondes)
- **Nombre total d'échanges**
- **Durée moyenne d'un échange** (secondes)

### Résultat
- **Score final** (sets gagnés/perdus)
- **Score de chaque set** (25-23, 20-25, etc.)
- **Nombre de sets joués**
- **Match ball(s)** (nombre de balles de match)
- **Set ball(s)** (nombre de balles de set)

---

## 📈 STATISTIQUES D'ÉQUIPE PAR CATÉGORIE

### 1️⃣ SERVICE

#### Données brutes
- **Total services** (nombre)
- **Aces** (service gagnant direct)
- **Fautes de service** (service dans le filet ou hors limites)
- **Services en jeu** (mis en jeu avec succès)

#### Efficacité
- **% Aces** = (Aces / Total services) × 100
- **% Fautes** = (Fautes / Total services) × 100
- **% Réussite** = (Services en jeu / Total services) × 100
- **Efficacité service** = (Aces - Fautes) / Total services

#### Détail par qualité (impact sur réception adverse)
- **Services excellents** → Réception C ou D adverse (met en difficulté)
- **Services moyens** → Réception B adverse
- **Services faciles** → Réception A adverse (parfaite)

#### Zones de service
- **Services zone 1** (arrière droite)
- **Services zone 6** (centre arrière)
- **Services zone 5** (arrière gauche)

#### Types de service
- **Services flottants** (float)
- **Services smashés** (jump serve)
- **Services tennis**

---

### 2️⃣ RÉCEPTION

#### Données brutes
- **Total réceptions** (nombre)
- **Réceptions A** (parfaite - passe idéale pour le passeur)
- **Réceptions B** (bonne - passe jouable mais pas parfaite)
- **Réceptions C** (difficile - passe compromise)
- **Réceptions D** (ratée - point adverse direct)

#### Efficacité
- **% Réception parfaite** = (Récep. A / Total récep.) × 100
- **% Réception positive** = ((Récep. A + Récep. B) / Total récep.) × 100
- **% Réception ratée** = (Récep. D / Total récep.) × 100
- **Efficacité réception** = ((A×3 + B×2 + C×1) / (Total récep. × 3)) × 100

#### Par zone de réception
- **Zone 1** (arrière droite)
- **Zone 6** (centre arrière)  
- **Zone 5** (arrière gauche)

#### Par type de service reçu
- **Réception sur float**
- **Réception sur jump serve**
- **Réception sur service tennis**

---

### 3️⃣ ATTAQUE

#### Données brutes
- **Total attaques** (frappes tentées)
- **Attaques réussies** (kill - point marqué)
- **Attaques bloquées** (point adversaire)
- **Attaques out** (balle sortie)
- **Attaques faute filet** (touche filet)
- **Attaques défendues** (balle récupérée par adversaire)
- **Attaques hors système** (sur passe compromise)

#### Efficacité
- **% Réussite attaque** = (Att. réussies / Total attaques) × 100
- **% Kill** = (Points attaque / Total attaques) × 100
- **% Erreur** = ((Att. bloquées + Out + Fautes) / Total attaques) × 100
- **Efficacité** = ((Réussies - Erreurs) / Total attaques) × 100

#### Par zone de frappe
- **Zone 1** (arrière droite)
- **Zone 2** (avant droite)
- **Zone 3** (centre avant)
- **Zone 4** (avant gauche)
- **Zone 5** (arrière gauche)
- **Zone 6** (centre arrière / attaque du passeur)
- **Zone pipe** (attaque centrale derrière le passeur)

#### Par type d'attaque
- **Attaques puissantes** (smash)
- **Attaques placées** (placement)
- **Attaques feintées** (tip/touch)
- **Contre-pieds**

#### Par tempo
- **1er tempo** (rapide, central)
- **2ème tempo** (mi-rapide)
- **3ème tempo** (haute, sur ailes)
- **Attaque arrière** (back row attack)

#### Par qualité de passe
- **Attaque sur passe A** (système)
- **Attaque sur passe B**
- **Attaque sur passe C** (hors système)

---

### 4️⃣ BLOC

#### Données brutes
- **Total tentatives de bloc**
- **Blocs gagnants** (point direct)
- **Blocs touchés** (ralentissement, récupérable)
- **Blocs non touchés** (traversé)
- **Fautes de bloc** (touche filet, franchissement, etc.)

#### Efficacité
- **% Blocs gagnants** = (Blocs gagnants / Total tentatives) × 100
- **% Blocs touchés** = ((Blocs gagnants + Touchés) / Total tentatives) × 100
- **Points sur bloc** (total)

#### Type de bloc
- **Blocs simples** (1 joueur)
- **Blocs doubles** (2 joueurs)
- **Blocs triples** (3 joueurs - rare)

#### Par position
- **Blocs en zone 2** (avant droit)
- **Blocs en zone 3** (centre)
- **Blocs en zone 4** (avant gauche)

---

### 5️⃣ DÉFENSE

#### Données brutes
- **Total défenses tentées**
- **Défenses réussies** (dig - balle récupérée)
- **Défenses ratées** (point adverse)

#### Efficacité
- **% Défense réussie** = (Déf. réussies / Total défenses) × 100
- **Digs par set**

#### Par zone
- **Défenses zone 1** (arrière droit)
- **Défenses zone 5** (arrière gauche)
- **Défenses zone 6** (centre arrière)

#### Par type
- **Défenses sur smash**
- **Défenses sur tip/touch**
- **Défenses sur bloc touché**

---

### 6️⃣ PASSE (SETTING)

#### Données brutes
- **Total passes**
- **Passes parfaites** (A - attaque facile)
- **Passes bonnes** (B - attaque moyenne)
- **Passes difficiles** (C - hors système)
- **Passes ratées** (erreur directe)

#### Efficacité
- **% Passes parfaites** = (Passes A / Total passes) × 100
- **% Passes positives** = ((Passes A + B) / Total passes) × 100
- **Assists** (passes ayant mené à un point)
- **% Assists** = (Assists / Total passes) × 100

#### Répartition
- **Passes zone 4** (avant gauche - pointu)
- **Passes zone 3** (centre - central)
- **Passes zone 2** (avant droite - opposé)
- **Passes zone 1** (arrière droite)
- **Passes zone 6** (pipe centrale)

---

### 7️⃣ ERREURS

#### Par type
- **Fautes de rotation** (mauvaise position)
- **Doubles contacts**
- **Portés**
- **Fautes de filet**
- **Touches de filet**
- **Quatre touches**
- **Franchissements**
- **Retard de rotation**
- **Autres erreurs**

#### Total
- **Total erreurs directes** (points donnés à l'adversaire)
- **Erreurs par set**

---

### 8️⃣ ACTIONS SPÉCIALES

#### Temps morts
- **Temps morts pris** (nombre)
- **Temps morts restants**
- **Timing des temps morts** (score quand pris)

#### Changements
- **Nombre de substitutions**
- **Substitutions restantes**
- **Changements libéro** (nombre)

#### Challenges
- **Challenges demandés** (si applicable)
- **Challenges gagnés**
- **Challenges perdus**

---

## 👤 STATISTIQUES PAR RÔLE/POSTE

### 🏐 PASSEUR (Setter)

#### Statistiques principales
**Passe (priorité #1)**
- Total passes : X
- Passes parfaites (A) : X (XX%)
- Passes bonnes (B) : X (XX%)
- Passes difficiles (C) : X (XX%)
- Assists (passes → point) : X (XX%)
- Erreurs de passe : X

**Répartition de jeu**
- % Passes zone 4 (pointu gauche)
- % Passes zone 3 (central)
- % Passes zone 2 (opposé)
- % Passes arrière (pipe)

**Service**
- Services : X
- Aces : X (XX%)
- Fautes : X (XX%)

**Attaque (secondaire)**
- Attaques (2ème main) : X
- Points attaque : X (XX%)

**Défense**
- Défenses réussies : X
- % Défense : XX%

**Bloc (minime)**
- Blocs : X
- Points bloc : X

#### KPIs passeur
- **Efficacité passe** = ((A×3 + B×2 + C×1) / (Total × 3)) × 100
- **Taux d'assists** = Assists / Total passes
- **Répartition équilibrée** = Écart-type entre zones

---

### 🔥 POINTU / RÉCEPTIONNEUR-ATTAQUANT (Outside Hitter)

#### Statistiques principales
**Attaque (priorité #1)**
- Total attaques : X
- Points attaque : X (XX% kill)
- Attaques bloquées : X
- Attaques out : X
- Efficacité : +XX (Réussies - Erreurs / Total)

**Par zone**
- Attaques zone 4 : X (XX% réussite)
- Attaques zone 5 (arrière) : X (XX%)
- Attaques zone 2 (rotation) : X (XX%)

**Réception (priorité #2)**
- Total réceptions : X
- Réceptions A : X (XX%)
- Réceptions B : X (XX%)
- Réceptions C : X (XX%)
- Réceptions D (ratées) : X (XX%)
- Efficacité réception : XX%

**Service**
- Services : X
- Aces : X (XX%)
- Fautes : X (XX%)

**Défense**
- Défenses réussies : X
- Digs : X

**Bloc**
- Blocs : X
- Points bloc : X

#### KPIs pointu
- **Efficacité attaque** = (Points - Erreurs) / Total attaques
- **% Réception positive** = (A + B) / Total réceptions
- **Polyvalence** = Score moyen sur 4 compétences (Att/Réc/Ser/Déf)

---

### 🧱 CENTRAL (Middle Blocker)

#### Statistiques principales
**Bloc (priorité #1)**
- Total blocs tentés : X
- Blocs gagnants : X (XX%)
- Blocs touchés : X
- Points bloc : X
- Fautes bloc : X

**Attaque (priorité #2)**
- Total attaques : X
- Points attaque : X (XX%)
- Attaques 1er tempo : X (XX% réussite)
- Attaques 2ème tempo : X
- Efficacité attaque : +XX

**Par zone**
- Attaques zone 3 (centre) : X
- Attaques zone 2 (rotation) : X

**Service**
- Services : X
- Aces : X (XX%)
- Fautes : X (XX%)

**Défense (limitée)**
- Défenses : X

**Réception**
- ⚠️ Pas de réception (sauf exception)

#### KPIs central
- **Points bloc / set** = Total points bloc / Nombre sets
- **% Blocs gagnants** = Blocs gagnants / Total tentatives
- **% Attaque 1er tempo** = Réussite sur 1er tempo (vitesse)
- **Présence filet** = (Blocs touchés + gagnants) / Attaques adverses

---

### ⚡ OPPOSÉ (Opposite Hitter)

#### Statistiques principales
**Attaque (priorité #1)**
- Total attaques : X
- Points attaque : X (XX% kill)
- Attaques zone 2 : X (XX%)
- Attaques arrière (zone 1) : X (XX%)
- Efficacité : +XX

**Par tempo**
- Attaques haute (3ème tempo) : X
- Attaques mi-rapide : X
- Attaques arrière : X

**Bloc (priorité #2)**
- Total blocs : X
- Blocs gagnants : X
- Points bloc : X

**Service**
- Services : X
- Aces : X (XX%)
- Fautes : X (XX%)

**Défense**
- Défenses : X
- Digs : X

**Réception**
- ⚠️ Peu ou pas de réception (système moderne)
- Si applicable : X réceptions (XX% A+B)

#### KPIs opposé
- **Efficacité attaque** = (Points - Erreurs) / Total
- **% Kill zone 2** = Points zone 2 / Attaques zone 2
- **Attaque arrière** = % Réussite en zone 1
- **Points totaux** = Attaques + Blocs + Aces

---

### 🛡️ LIBÉRO (Libero)

#### Statistiques principales
**Réception (priorité #1)**
- Total réceptions : X
- Réceptions A (parfaites) : X (XX%)
- Réceptions B : X (XX%)
- Réceptions C : X (XX%)
- Réceptions D (ratées) : X (XX%)
- Efficacité réception : XX%

**Par zone**
- Réceptions zone 5 (gauche) : X
- Réceptions zone 6 (centre) : X
- Réceptions zone 1 (droite) : X

**Défense (priorité #2)**
- Total défenses : X
- Défenses réussies : X (XX%)
- Digs : X
- Digs par set : X

**Par zone défensive**
- Défenses zone 5 : X
- Défenses zone 6 : X
- Défenses zone 1 : X

**Couverture bloc**
- Couvertures réussies : X
- Couvertures ratées : X

**Service**
- ⚠️ PAS DE SERVICE (règlement)

**Attaque**
- ⚠️ PAS D'ATTAQUE au-dessus du filet (règlement)

**Bloc**
- ⚠️ PAS DE BLOC (règlement)

#### KPIs libéro
- **% Réception parfaite** = Réceptions A / Total
- **% Réception positive** = (A + B) / Total
- **Défenses / set** = Total défenses / Nombre sets
- **Efficacité défensive** = Défenses réussies / Total tentatives
- **Couverture** = Couvertures réussies / Total couvertures

---

## 📊 RATIOS ET INDICES AVANCÉS

### Indices d'efficacité individuels

**Indice d'attaque**
```
Efficacité = (Kills - Erreurs) / Total attaques × 100
```
- Excellent : > 40%
- Bon : 30-40%
- Moyen : 20-30%
- Faible : < 20%

**Indice de réception**
```
Efficacité = (A×3 + B×2 + C×1 + D×0) / (Total × 3) × 100
```
- Excellent : > 2.5 / 3 (83%)
- Bon : 2.0 - 2.5 / 3 (67-83%)
- Moyen : 1.5 - 2.0 / 3 (50-67%)
- Faible : < 1.5 / 3 (< 50%)

**Indice de service**
```
Efficacité = (Aces×2 - Fautes×2 + Services difficiles×1) / Total services
```

**Score de performance globale** (Joueur de champ)
```
Score = (Points attaque × 1) + (Aces × 2) + (Blocs × 2) + 
        (Réceptions A × 1) - (Erreurs directes × 1.5)
```

### Ratios d'équipe

**Ratio Break Point**
```
% Break = Points marqués sur service adverse / Total points adverses × 100
```

**Ratio Side-Out**
```
% Side-Out = Points marqués sur notre service / Total rotations × 100
```

**Efficacité transition**
```
% Transition = Points marqués après défense / Total défenses réussies × 100
```

**Équilibre offensif**
```
Écart-type des points entre attaquants (plus faible = meilleur équilibre)
```

---

## 🎯 STATISTIQUES COMPARATIVES

### Comparaison par match
- Meilleur match (efficacité %)
- Pire match
- Moyenne saison
- Progression (+/- %)

### Comparaison par adversaire
- Statistiques vs équipe A
- Statistiques vs équipe B
- Forces / Faiblesses identifiées

### Classement interne
- Top 3 attaquants (% kill)
- Top 3 serveurs (aces)
- Top 3 bloqueurs (points bloc)
- Top 3 réceptionneurs (% A+B)
- Top 3 défenseurs (digs)

### MVP du match
Calcul composite basé sur :
- Points marqués (30%)
- Efficacité (30%)
- Actions décisives (20%)
- Polyvalence (20%)

---

## 📱 AFFICHAGE RECOMMANDÉ

### Interface de saisie (Module 3)
```
┌─────────────────────────────────────────┐
│ SET 2 | 18-15 | LCVB SERVICE           │
├─────────────────────────────────────────┤
│ ACTION: [Attaque] [Service] [Réception] │
│         [Bloc] [Défense] [Erreur]       │
│                                          │
│ JOUEUR: #7 Martin (Central)             │
│                                          │
│ RÉSULTAT:                                │
│   🟢 Réussi  🔴 Erreur  ⚪ Neutre        │
│                                          │
│ ZONE: [1] [2] [3]                        │
│       [4] [5] [6]                        │
│       [7] [8] [9]                        │
│                                          │
│ [VALIDER] [ANNULER] [UNDO]               │
└─────────────────────────────────────────┘
```

### Dashboard joueur (Module 4)
```
┌────────────────────────────────────────────────┐
│ #12 - DUPONT Jean (Pointu)                     │
├────────────────────────────────────────────────┤
│ ATTAQUE                                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 18/25 (72%)   Exc. ✓     │
│                                                 │
│ RÉCEPTION                                       │
│ A: 12 (40%) | B: 10 (33%) | C: 5 (17%) | D: 3  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ Efficacité: 78%           │
│                                                 │
│ SERVICE                                         │
│ Aces: 3 | Fautes: 2 | % Réussite: 92%          │
│                                                 │
│ DÉFENSE                                         │
│ Digs: 8 | % Réussite: 89%                      │
│                                                 │
│ ⭐ TOTAL POINTS: 21 pts                         │
│ (18 att. + 3 aces + 0 bloc)                    │
└────────────────────────────────────────────────┘
```

### Tableau comparatif équipe
```
┌──────────────────────────────────────────────────────────────┐
│                    LCVB    vs    ADVERSAIRE                   │
├────────────────────┬──────────────┬──────────────┬───────────┤
│ CATÉGORIE          │ LCVB         │ ADVERSAIRE   │ DIFF      │
├────────────────────┼──────────────┼──────────────┼───────────┤
│ Points totaux      │ 75           │ 68           │ +7        │
│ Attaques           │ 45 (71%)     │ 52 (65%)     │ +6%   ✓   │
│ Services (aces)    │ 6            │ 3            │ +3    ✓   │
│ Blocs              │ 8            │ 11           │ -3    ✗   │
│ Réception (A+B)    │ 78%          │ 71%          │ +7%   ✓   │
│ Erreurs directes   │ 12           │ 18           │ -6    ✓   │
└────────────────────┴──────────────┴──────────────┴───────────┘
```

---

## 💾 FORMAT DE DONNÉES JSON

### Structure recommandée pour stockage

```json
{
  "matchId": "LCVB-2025-001",
  "date": "2025-11-08",
  "teams": {
    "home": "Le Crès VB",
    "away": "Équipe Adverse"
  },
  "finalScore": {
    "sets": {"home": 3, "away": 1},
    "points": [
      {"set": 1, "home": 25, "away": 20},
      {"set": 2, "home": 23, "away": 25},
      {"set": 3, "home": 25, "away": 18},
      {"set": 4, "home": 25, "away": 22}
    ]
  },
  "duration": {
    "total": "01:45:32",
    "sets": ["00:25:12", "00:28:45", "00:23:18", "00:28:17"]
  },
  "teamStats": {
    "home": {
      "attacks": {
        "total": 45,
        "kills": 32,
        "errors": 8,
        "blocked": 5,
        "efficiency": 53.3
      },
      "serves": {
        "total": 38,
        "aces": 6,
        "faults": 4,
        "percentage": 89.5
      },
      "reception": {
        "total": 35,
        "perfect": 12,
        "good": 18,
        "poor": 3,
        "fault": 2,
        "efficiency": 78.6
      },
      "blocks": {
        "total": 15,
        "kills": 8,
        "touched": 7,
        "faults": 2
      },
      "digs": {
        "total": 28,
        "successful": 25,
        "percentage": 89.3
      },
      "errors": {
        "total": 12,
        "rotation": 1,
        "double": 2,
        "net": 3,
        "other": 6
      }
    },
    "away": { /* ... */ }
  },
  "playerStats": [
    {
      "playerId": 12,
      "name": "Dupont Jean",
      "number": 12,
      "position": "Pointu",
      "timeOnCourt": "01:30:00",
      "attacks": {
        "total": 18,
        "kills": 13,
        "errors": 3,
        "blocked": 2,
        "efficiency": 55.6,
        "byZone": {
          "zone4": {"attempts": 12, "kills": 9},
          "zone2": {"attempts": 4, "kills": 3},
          "zone1": {"attempts": 2, "kills": 1}
        }
      },
      "serves": {
        "total": 8,
        "aces": 3,
        "faults": 2,
        "inPlay": 5
      },
      "reception": {
        "total": 15,
        "perfect": 6,
        "good": 5,
        "poor": 3,
        "fault": 1,
        "efficiency": 73.3
      },
      "blocks": {
        "kills": 0,
        "touched": 2
      },
      "digs": {
        "successful": 8,
        "total": 9
      },
      "points": {
        "attack": 13,
        "serve": 3,
        "block": 0,
        "total": 16
      },
      "sets": [
        {
          "setNumber": 1,
          "attacks": {"total": 5, "kills": 4},
          "serves": {"total": 2, "aces": 1},
          "points": 5
        },
        /* ... autres sets ... */
      ]
    },
    /* ... autres joueurs ... */
  ],
  "actions": [
    {
      "id": 1,
      "timestamp": "2025-11-08T20:05:32",
      "set": 1,
      "score": {"home": 12, "away": 10},
      "rotation": {"home": "R3", "away": "R4"},
      "server": {"team": "home", "playerId": 12},
      "type": "attack",
      "player": {"id": 12, "name": "Dupont", "number": 12},
      "result": "kill",
      "zone": 4,
      "details": {
        "attackType": "power",
        "tempo": 3,
        "receptionQuality": "B"
      }
    },
    /* ... toutes les actions ... */
  ]
}
```

---

## ✅ CHECKLIST D'IMPLÉMENTATION

### Phase 1 : Actions de base
- [ ] Attaque (réussie/erreur)
- [ ] Service (ace/faute/en jeu)
- [ ] Bloc (point/touché)
- [ ] Réception (A/B/C/D)
- [ ] Erreur directe

### Phase 2 : Détails avancés
- [ ] Zones d'action (1-9)
- [ ] Types d'attaque
- [ ] Qualité de passe
- [ ] Défense (dig)
- [ ] Couverture

### Phase 3 : Calculs automatiques
- [ ] Efficacités en temps réel
- [ ] Totaux par joueur
- [ ] Totaux équipe
- [ ] Comparatifs

### Phase 4 : Visualisation
- [ ] Graphiques
- [ ] Heat maps zones
- [ ] Évolution dans le match
- [ ] Radars par joueur

### Phase 5 : Export
- [ ] Export JSON complet
- [ ] Export CSV
- [ ] Export PDF récapitulatif
- [ ] Partage graphiques

---

## 🎓 GLOSSAIRE VOLLEYBALL

| Terme | Définition |
|-------|------------|
| **Ace** | Service gagnant direct (réception ratée = point) |
| **Kill** | Attaque gagnante (point direct) |
| **Dig** | Défense réussie sur une attaque adverse |
| **Assist** | Passe ayant mené directement à un point |
| **Side-out** | Point marqué sur service adverse |
| **Break point** | Point marqué alors qu'on sert |
| **Tempo** | Vitesse de l'attaque (1er = rapide, 3ème = haute) |
| **Pipe** | Attaque centrale derrière le passeur (zone 6) |
| **Float serve** | Service flottant (trajectoire imprévisible) |
| **Jump serve** | Service smashé avec élan |
| **Touch** | Feinte (attaque douce/amortie) |
| **Tip** | Attaque légère du bout des doigts |
| **Overpass** | Passe qui passe directement côté adverse |
| **Free ball** | Balle facile renvoyée (non attaquée) |

---

## 📚 SOURCES ET NORMES

### Normes internationales
- **FIVB** (Fédération Internationale de Volleyball)
- **CEV** (Confédération Européenne de Volleyball)
- **FFVB** (Fédération Française de Volleyball)

### Statistiques standards
Basé sur les normes utilisées en :
- Ligue A (France)
- NCAA Volleyball (USA)
- Volleyball Nations League
- Championnats du monde

---

**Version :** 1.0  
**Date :** 8 novembre 2025  
**Projet :** LCVB Scoreboard  
**Auteur :** Le Crès Volley-Ball

---

## 💡 NOTES D'IMPLÉMENTATION

### Priorités de développement

**Niveau 1 - Essentiel** (MVP)
- Actions de base (attaque, service, bloc, réception)
- Compteurs simples
- Totaux par joueur
- Efficacités principales

**Niveau 2 - Important**
- Zones d'action
- Types détaillés
- Statistiques avancées
- Comparatifs équipe

**Niveau 3 - Bonus**
- Heat maps
- Analyses prédictives
- Comparaisons historiques
- Machine learning (tendances)

### Ergonomie de saisie
- ⚡ **Rapidité** : maximum 3 clics par action
- 📱 **Tactile** : boutons larges (min. 44px)
- ⌨️ **Clavier** : raccourcis disponibles
- 🔙 **Undo** : toujours possible (historique)
- 💾 **Autosave** : toutes les 30s

### Performance
- Calculs en temps réel (< 100ms)
- Stockage optimisé (localStorage + IndexedDB)
- Export rapide (< 2s pour PDF)
- Compatible tablette/mobile

---

*Document vivant - À mettre à jour selon les besoins du club et l'évolution du projet.*


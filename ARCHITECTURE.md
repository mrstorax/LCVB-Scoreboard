# 🏗️ Architecture du Site LCVB Scoreboard

## 📐 Structure Commune des Pages

Toutes les pages suivent cette architecture standardisée :

```
┌─────────────────────────────────────────────────────────────┐
│                    🌙 Theme Toggle (Fixed)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                  DS-CONTAINER                         │ │
│  │  (max-width: 1600px, centré, padding responsive)     │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │            TOP BAR (ds-topbar)                  │ │ │
│  │  │  ┌────────────────┐        ┌────────────────┐  │ │ │
│  │  │  │ 👤 User Info   │        │  🚪 Logout    │  │ │ │
│  │  │  │  Jean Dupont   │        │  ← Retour     │  │ │ │
│  │  │  │  Admin         │        └────────────────┘  │ │ │
│  │  │  └────────────────┘                            │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │      HERO SECTION (optionnel - ds-hero)        │ │ │
│  │  │                                                 │ │ │
│  │  │          🏐 Titre Principal                     │ │ │
│  │  │        Sous-titre descriptif                    │ │ │
│  │  │                                                 │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │      NAVIGATION (optionnel - ds-nav)           │ │ │
│  │  │  [Accueil] [Équipes] [Match] [Stats] [Params] │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │                                                 │ │ │
│  │  │           CONTENU PRINCIPAL (main)              │ │ │
│  │  │                                                 │ │ │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  │ │ │
│  │  │  │  Card 1   │  │  Card 2   │  │  Card 3   │  │ │ │
│  │  │  │           │  │           │  │           │  │ │ │
│  │  │  └───────────┘  └───────────┘  └───────────┘  │ │ │
│  │  │                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────┐   │ │ │
│  │  │  │         Section Formulaire              │   │ │ │
│  │  │  └─────────────────────────────────────────┘   │ │ │
│  │  │                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────┐   │ │ │
│  │  │  │         Section Liste                   │   │ │ │
│  │  │  └─────────────────────────────────────────┘   │ │ │
│  │  │                                                 │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │           FOOTER (optionnel)                    │ │ │
│  │  │       © 2025 Le Crès Volley-Ball                │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                                                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Hiérarchie des Fichiers CSS

### Ordre de Chargement

```html
<head>
    <!-- 1. Design System (BASE - obligatoire) -->
    <link rel="stylesheet" href="design-system.css">

    <!-- 2. Styles spécifiques page (optionnel) -->
    <link rel="stylesheet" href="page-specific.css">
</head>
```

### Cascade CSS

```
┌──────────────────────────────────────────┐
│     design-system.css (BASE)             │
│  ┌────────────────────────────────────┐  │
│  │  1. Variables CSS (tokens)         │  │
│  │  2. Reset & Base styles            │  │
│  │  3. Layout system (grid, flex)     │  │
│  │  4. Components (cards, buttons...) │  │
│  │  5. Utilities (spacing, text...)   │  │
│  │  6. Themes (dark/light)            │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────┐
│     page-specific.css (OPTIONNEL)        │
│  ┌────────────────────────────────────┐  │
│  │  Styles très spécifiques           │  │
│  │  qui étendent le DS                │  │
│  │  (à utiliser avec parcimonie)      │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 📦 Composants Disponibles

### Layout Components

```
ds-container          → Container principal (max-width, centré)
ds-container-sm       → Container petit (640px)
ds-container-md       → Container moyen (768px)
ds-container-lg       → Container large (1024px)

ds-grid               → Grid display
ds-grid-cols-1/2/3/4  → Nombre de colonnes
ds-grid-responsive    → Grid auto-fill responsive

ds-flex               → Flexbox display
ds-flex-col           → Direction colonne
ds-items-center       → Align items center
ds-justify-between    → Justify content space-between
```

### UI Components

```
ds-card               → Card de base
  ds-card-header      → En-tête de card
  ds-card-title       → Titre de card
  ds-card-subtitle    → Sous-titre
  ds-card-body        → Contenu principal
  ds-card-footer      → Pied de card
  ds-card-interactive → Card avec hover effect
  ds-card-compact     → Padding réduit

ds-btn                → Bouton de base
  ds-btn-primary      → Bouton primaire (bleu)
  ds-btn-secondary    → Bouton secondaire (gris)
  ds-btn-success      → Bouton succès (vert)
  ds-btn-danger       → Bouton danger (rouge)
  ds-btn-warning      → Bouton warning (orange)
  ds-btn-ghost        → Bouton fantôme
  ds-btn-outline      → Bouton outlined
  ds-btn-sm/lg/xl     → Tailles

ds-badge              → Badge
  ds-badge-primary/success/danger/warning/info

ds-alert              → Alert
  ds-alert-primary/success/danger/warning/info
```

### Form Components

```
ds-form-group         → Groupe de formulaire
ds-form-label         → Label
ds-form-label-required → Label avec *
ds-form-input         → Input texte
ds-form-textarea      → Textarea
ds-form-select        → Select
ds-form-checkbox      → Checkbox
ds-form-radio         → Radio
ds-form-help          → Texte d'aide
ds-form-error         → Message d'erreur
```

### Navigation Components

```
ds-nav                → Navigation
ds-nav-link           → Lien de navigation
ds-nav-link.is-active → Lien actif

ds-topbar             → Barre supérieure
  ds-topbar-user      → Section utilisateur
  ds-topbar-avatar    → Avatar
  ds-topbar-user-info → Infos utilisateur
  ds-topbar-user-name → Nom
  ds-topbar-user-role → Rôle
```

### Autres

```
ds-hero               → Section hero
  ds-hero-title       → Titre principal
  ds-hero-subtitle    → Sous-titre

ds-spinner            → Loading spinner
  ds-spinner-sm/lg    → Tailles

ds-theme-toggle       → Bouton toggle theme
```

---

## 🎯 Variables CSS Principales

### Couleurs

```css
--ds-primary           /* Bleu primaire */
--ds-success           /* Vert succès */
--ds-danger            /* Rouge danger */
--ds-warning           /* Orange warning */
--ds-info              /* Cyan info */

--ds-bg-primary        /* Background principal */
--ds-bg-secondary      /* Background secondaire */
--ds-bg-tertiary       /* Background tertiaire */

--ds-text-primary      /* Texte principal */
--ds-text-secondary    /* Texte secondaire */
--ds-text-tertiary     /* Texte tertiaire */

--ds-border-color      /* Couleur bordure */
```

### Espacements

```css
--ds-space-1    /* 4px */
--ds-space-2    /* 8px */
--ds-space-3    /* 12px */
--ds-space-4    /* 16px */
--ds-space-6    /* 24px */
--ds-space-8    /* 32px */
--ds-space-12   /* 48px */
```

### Typographie

```css
--ds-text-xs    /* 12px */
--ds-text-sm    /* 14px */
--ds-text-base  /* 16px */
--ds-text-lg    /* 18px */
--ds-text-xl    /* 20px */
--ds-text-2xl   /* 24px */
--ds-text-3xl   /* 30px */

--ds-font-normal    /* 400 */
--ds-font-medium    /* 500 */
--ds-font-semibold  /* 600 */
--ds-font-bold      /* 700 */
```

### Border Radius

```css
--ds-radius-sm   /* 4px */
--ds-radius-md   /* 8px */
--ds-radius-lg   /* 12px */
--ds-radius-xl   /* 16px */
--ds-radius-full /* 9999px (cercle) */
```

### Shadows

```css
--ds-shadow-xs
--ds-shadow-sm
--ds-shadow-md
--ds-shadow-lg
--ds-shadow-xl
```

---

## 🌓 Système de Thèmes

### Implémentation

Le thème est contrôlé par l'attribut `data-theme` sur `<html>` :

```html
<html data-theme="light">  <!-- Mode clair -->
<html data-theme="dark">   <!-- Mode sombre -->
```

### JavaScript

```javascript
// Basculer le thème
ThemeManager.toggle()

// Obtenir le thème actuel
ThemeManager.getCurrentTheme()  // 'light' ou 'dark'

// Vérifier si dark mode
ThemeManager.isDarkMode()  // true/false

// Forcer un thème
ThemeManager.enableDarkMode()
ThemeManager.enableLightMode()
```

### Variables Adaptatives

Toutes les variables CSS s'adaptent automatiquement :

```css
:root {
    --ds-bg-primary: #f8f9fa;     /* Clair en mode light */
    --ds-text-primary: #212529;
}

[data-theme="dark"] {
    --ds-bg-primary: #0f172a;     /* Sombre en mode dark */
    --ds-text-primary: #ffffff;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
--ds-breakpoint-sm: 640px    /* Mobile */
--ds-breakpoint-md: 768px    /* Tablet */
--ds-breakpoint-lg: 1024px   /* Desktop */
--ds-breakpoint-xl: 1280px   /* Large Desktop */
```

### Media Queries Intégrées

Le design system gère automatiquement :

- **Mobile (< 768px)** :
  - Grid → 1 colonne
  - Topbar → Empilé verticalement
  - Container → Padding réduit

- **Tablet (768-1024px)** :
  - Grid 3-4 cols → 2 colonnes
  - Navigation → Wrap

- **Desktop (> 1024px)** :
  - Layout complet
  - Toutes les fonctionnalités

---

## 🔄 Workflow de Développement

### 1. Nouvelle Page

```bash
# Copier le template
cp template-page.html ma-nouvelle-page.html

# Éditer le contenu
# ✅ Utiliser les classes DS
# ❌ Éviter les styles inline
```

### 2. Composant Custom

```css
/* Si vraiment nécessaire, créer dans page-specific.css */
.ma-page-component-special {
    /* Utiliser les variables du DS */
    background: var(--ds-bg-secondary);
    padding: var(--ds-space-4);
    border-radius: var(--ds-radius-lg);
}
```

### 3. Testing

- [ ] Tester en mode clair
- [ ] Tester en mode sombre
- [ ] Tester sur mobile
- [ ] Tester sur tablet
- [ ] Tester sur desktop
- [ ] Valider l'accessibilité

---

## 📚 Ressources

- **Documentation complète** : `DESIGN-SYSTEM-GUIDE.md`
- **Showcase visuel** : `design-system-showcase.html`
- **Template** : `template-page.html`
- **CSS** : `design-system.css`
- **JS Theme** : `theme.js`

---

## 🎯 Checklist Migration Page

Pour migrer une page existante :

- [ ] Remplacer les imports CSS par `design-system.css`
- [ ] Supprimer les styles inline
- [ ] Wrapper dans `ds-container`
- [ ] Ajouter `ds-topbar` avec user info
- [ ] Convertir les cards en `ds-card`
- [ ] Convertir les boutons en `ds-btn`
- [ ] Utiliser `ds-grid` pour les layouts
- [ ] Convertir les formulaires avec `ds-form-*`
- [ ] Ajouter le theme toggle
- [ ] Tester responsive
- [ ] Tester thèmes clair/sombre

---

**Dernière mise à jour** : 2025
**Mainteneur** : Équipe LCVB Scoreboard

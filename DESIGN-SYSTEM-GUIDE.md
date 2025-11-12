# 🎨 Guide du Design System LCVB Scoreboard

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Installation et Utilisation](#installation-et-utilisation)
4. [Composants](#composants)
5. [Layouts Standards](#layouts-standards)
6. [Thèmes](#thèmes)
7. [Bonnes Pratiques](#bonnes-pratiques)
8. [Migration des Pages Existantes](#migration-des-pages-existantes)

---

## Introduction

Ce design system fournit une bibliothèque de composants réutilisables, modulaires et cohérents pour l'ensemble du site LCVB Scoreboard.

### Objectifs

- ✅ **Cohérence visuelle** : Uniformité sur toutes les pages
- ✅ **Maintenabilité** : Code centralisé et facile à modifier
- ✅ **Accessibilité** : Composants respectant les standards
- ✅ **Performance** : CSS optimisé et minimal
- ✅ **Thèmes** : Support dark/light mode
- ✅ **Responsive** : S'adapte à tous les écrans

---

## Architecture

### Structure des Fichiers

```
LCVB-Scoreboard/
├── design-system.css              # 🎨 Design System complet
├── design-system-showcase.html    # 📚 Documentation visuelle
├── theme.js                       # 🌓 Gestion des thèmes
└── pages/
    ├── home.html     	             # ✅ Utilise le DS
    ├── teams.html                 # ⚠️ À migrer
    ├── control.html               # ⚠️ À migrer
    └── ...
```

### Hiérarchie CSS

1. **design-system.css** (Base - Toujours charger en premier)
   - Variables CSS
   - Reset & Base
   - Composants
   - Utilitaires
   - Thèmes

2. **page-specific.css** (Optionnel - Styles spécifiques à la page)
   - Seulement pour des cas très particuliers
   - Doit étendre le DS, pas le remplacer

---

## Installation et Utilisation

### 1. Intégrer le Design System

Dans toutes vos pages HTML :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0f172a">
    <title>Titre de la Page - LCVB Scoreboard</title>

    <!-- ✅ Design System (obligatoire) -->
    <link rel="stylesheet" href="design-system.css">

    <!-- ⚠️ Styles spécifiques (optionnel) -->
    <link rel="stylesheet" href="page-specific.css">
</head>
<body>
    <!-- Theme Toggle -->
    <button class="ds-theme-toggle" onclick="ThemeManager.toggle()">
        <span id="theme-icon">🌙</span>
    </button>

    <!-- Contenu de la page -->
    <div class="ds-container">
        <!-- Votre contenu ici -->
    </div>

    <!-- Script theme -->
    <script src="theme.js"></script>
</body>
</html>
```

### 2. Structure de Page Standard

Toutes les pages doivent suivre cette structure :

```html
<body>
    <!-- 1. Theme Toggle (fixed top-right) -->
    <button class="ds-theme-toggle">🌙</button>

    <!-- 2. Container principal -->
    <div class="ds-container">

        <!-- 3. Top Bar (header avec user info) -->
        <div class="ds-topbar">
            <div class="ds-topbar-user">
                <div class="ds-topbar-avatar">JD</div>
                <div class="ds-topbar-user-info">
                    <div class="ds-topbar-user-name">Jean Dupont</div>
                    <div class="ds-topbar-user-role">Administrateur</div>
                </div>
            </div>
            <button class="ds-btn ds-btn-danger ds-btn-sm">Déconnexion</button>
        </div>

        <!-- 4. Hero Section (optionnel - pour page d'accueil) -->
        <div class="ds-hero">
            <div class="ds-hero-title">🏐 Titre Principal</div>
            <div class="ds-hero-subtitle">Sous-titre descriptif</div>
        </div>

        <!-- 5. Navigation (optionnel) -->
        <nav class="ds-nav">
            <a href="home.html" class="ds-nav-link is-active">Accueil</a>
            <a href="teams.html" class="ds-nav-link">Équipes</a>
            <a href="setup.html" class="ds-nav-link">Match</a>
        </nav>

        <!-- 6. Contenu principal -->
        <main>
            <!-- Vos sections de contenu -->
        </main>

        <!-- 7. Footer (optionnel) -->
        <footer>
            <!-- Contenu du footer -->
        </footer>
    </div>
</body>
```

---

## Composants

### Cards

**Usage basique :**
```html
<div class="ds-card">
    <div class="ds-card-header">
        <h3 class="ds-card-title">Titre de la Card</h3>
        <p class="ds-card-subtitle">Sous-titre</p>
    </div>
    <div class="ds-card-body">
        <p>Contenu principal</p>
    </div>
    <div class="ds-card-footer">
        <button class="ds-btn ds-btn-primary">Action</button>
    </div>
</div>
```

**Variantes :**
- `ds-card-compact` : Padding réduit
- `ds-card-large` : Padding augmenté
- `ds-card-interactive` : Effet hover avec élévation

### Boutons

**Variantes :**
```html
<!-- Couleurs -->
<button class="ds-btn ds-btn-primary">Primary</button>
<button class="ds-btn ds-btn-secondary">Secondary</button>
<button class="ds-btn ds-btn-success">Success</button>
<button class="ds-btn ds-btn-danger">Danger</button>
<button class="ds-btn ds-btn-warning">Warning</button>
<button class="ds-btn ds-btn-ghost">Ghost</button>
<button class="ds-btn ds-btn-outline">Outline</button>

<!-- Tailles -->
<button class="ds-btn ds-btn-primary ds-btn-sm">Small</button>
<button class="ds-btn ds-btn-primary">Default</button>
<button class="ds-btn ds-btn-primary ds-btn-lg">Large</button>
<button class="ds-btn ds-btn-primary ds-btn-xl">Extra Large</button>

<!-- Avec icône -->
<button class="ds-btn ds-btn-primary">
    <span>➕</span>
    <span>Ajouter</span>
</button>

<!-- États -->
<button class="ds-btn ds-btn-primary" disabled>Disabled</button>
```

### Formulaires

```html
<div class="ds-form-group">
    <label class="ds-form-label ds-form-label-required">Nom</label>
    <input type="text" class="ds-form-input" placeholder="Entrez votre nom">
    <small class="ds-form-help">Aide contextuelle</small>
</div>

<div class="ds-form-group">
    <label class="ds-form-label">Message</label>
    <textarea class="ds-form-textarea" placeholder="Votre message"></textarea>
</div>

<div class="ds-form-group">
    <label class="ds-form-label">Catégorie</label>
    <select class="ds-form-select">
        <option>Option 1</option>
        <option>Option 2</option>
    </select>
</div>

<!-- États de validation -->
<input type="text" class="ds-form-input is-error">
<input type="text" class="ds-form-input is-success">
<small class="ds-form-error">Message d'erreur</small>
```

### Badges

```html
<span class="ds-badge ds-badge-primary">Primary</span>
<span class="ds-badge ds-badge-success">Success</span>
<span class="ds-badge ds-badge-danger">Danger</span>
<span class="ds-badge ds-badge-warning">Warning</span>
<span class="ds-badge ds-badge-info">Info</span>
```

### Alerts

```html
<div class="ds-alert ds-alert-success">
    <strong>Succès :</strong> Opération effectuée avec succès !
</div>

<div class="ds-alert ds-alert-danger">
    <strong>Erreur :</strong> Une erreur est survenue.
</div>

<div class="ds-alert ds-alert-warning">
    <strong>Attention :</strong> Action requise.
</div>

<div class="ds-alert ds-alert-info">
    <strong>Info :</strong> Information importante.
</div>
```

### Loading Spinner

```html
<div class="ds-spinner"></div>
<div class="ds-spinner ds-spinner-sm"></div>
<div class="ds-spinner ds-spinner-lg"></div>
```

---

## Layouts Standards

### Grilles

```html
<!-- Grid 2 colonnes -->
<div class="ds-grid ds-grid-cols-2">
    <div>Colonne 1</div>
    <div>Colonne 2</div>
</div>

<!-- Grid 3 colonnes -->
<div class="ds-grid ds-grid-cols-3">
    <div>Col 1</div>
    <div>Col 2</div>
    <div>Col 3</div>
</div>

<!-- Grid responsive (auto-fill) -->
<div class="ds-grid ds-grid-responsive">
    <div class="ds-card">Card 1</div>
    <div class="ds-card">Card 2</div>
    <div class="ds-card">Card 3</div>
</div>

<!-- Gap personnalisé -->
<div class="ds-grid ds-grid-cols-2 ds-gap-8">
    <div>Content</div>
    <div>Content</div>
</div>
```

### Flexbox

```html
<!-- Flex row -->
<div class="ds-flex ds-items-center ds-justify-between">
    <div>Gauche</div>
    <div>Droite</div>
</div>

<!-- Flex column -->
<div class="ds-flex ds-flex-col ds-gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
</div>
```

### Container

```html
<!-- Container standard (max-width: 1600px) -->
<div class="ds-container">
    <!-- Contenu -->
</div>

<!-- Container small (max-width: 640px) -->
<div class="ds-container ds-container-sm">
    <!-- Contenu -->
</div>
```

---

## Thèmes

### Changer de Thème

**JavaScript :**
```javascript
// Fichier theme.js inclus
const ThemeManager = {
    toggle: function() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('lcvb-theme', newTheme);

        // Mettre à jour l'icône
        document.getElementById('theme-icon').textContent =
            newTheme === 'dark' ? '☀️' : '🌙';
    },

    init: function() {
        const savedTheme = localStorage.getItem('lcvb-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.getElementById('theme-icon').textContent =
            savedTheme === 'dark' ? '☀️' : '🌙';
    }
};

// Initialiser au chargement
window.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});
```

### Variables de Thème

Toutes les couleurs s'adaptent automatiquement :

```css
/* Light Theme (default) */
--ds-bg-primary: #f8f9fa;
--ds-text-primary: #212529;

/* Dark Theme */
[data-theme="dark"] {
    --ds-bg-primary: #0f172a;
    --ds-text-primary: #ffffff;
}
```

---

## Bonnes Pratiques

### ✅ À FAIRE

1. **Utiliser les classes du DS** au lieu de créer des styles custom
   ```html
   ✅ <button class="ds-btn ds-btn-primary">Valider</button>
   ❌ <button style="background: blue; padding: 10px;">Valider</button>
   ```

2. **Utiliser les variables CSS** pour les valeurs
   ```css
   ✅ padding: var(--ds-space-4);
   ❌ padding: 16px;
   ```

3. **Respecter la hiérarchie** des composants
   ```html
   ✅ <div class="ds-card">
        <div class="ds-card-header">...</div>
        <div class="ds-card-body">...</div>
      </div>
   ```

4. **Utiliser les utilitaires** pour les espacements
   ```html
   ✅ <div class="ds-mt-4 ds-mb-8">...</div>
   ❌ <div style="margin-top: 1rem; margin-bottom: 2rem;">...</div>
   ```

### ❌ À ÉVITER

1. **Styles inline** (sauf cas exceptionnel)
2. **Créer des classes custom** quand une classe DS existe
3. **Surcharger les styles DS** avec `!important`
4. **Valeurs hardcodées** au lieu des variables
5. **Dupliquer du code CSS** déjà dans le DS

### 📝 Conventions de Nommage

Toutes les classes du design system commencent par `ds-` :

- **Composants** : `ds-card`, `ds-btn`, `ds-badge`
- **Modifieurs** : `ds-btn-primary`, `ds-card-compact`
- **États** : `is-active`, `is-error`, `is-success`
- **Layout** : `ds-container`, `ds-grid`, `ds-flex`
- **Utilitaires** : `ds-mt-4`, `ds-text-center`, `ds-font-bold`

---

## Migration des Pages Existantes

### Plan de Migration

**Priorité Haute** 🔴
1. **control.html** - Refonte complète nécessaire
2. **stats.html** - Harmonisation importante

**Priorité Moyenne** 🟡
3. **login.html** - Refonte légère
4. **settings.html** - Ajustements
5. **teams.html** - Ajustements

**Priorité Basse** 🟢
6. **setup.html** - Déjà bien
7. **display.html / spectator.html / lineups.html** - Ajustements mineurs

### Checklist de Migration

Pour chaque page :

- [ ] Remplacer `<link rel="stylesheet" href="style.css">` par `design-system.css`
- [ ] Supprimer les styles inline dans `<style>` tags
- [ ] Remplacer les classes custom par les classes DS
- [ ] Ajouter le bouton theme toggle
- [ ] Structurer avec `ds-container`
- [ ] Utiliser `ds-topbar` pour le header
- [ ] Remplacer les cards custom par `ds-card`
- [ ] Remplacer les boutons custom par `ds-btn`
- [ ] Utiliser les grilles `ds-grid`
- [ ] Tester en mode clair et sombre
- [ ] Tester responsive (mobile, tablet, desktop)

### Exemple de Migration : control.html

**AVANT :**
```html
<link rel="stylesheet" href="control-style.css">

<div class="control-panel">
    <button class="btn-plus">+</button>
    <div class="score-display">12</div>
</div>
```

**APRÈS :**
```html
<link rel="stylesheet" href="design-system.css">

<div class="ds-card">
    <button class="ds-btn ds-btn-primary">+</button>
    <div class="ds-text-2xl ds-font-bold">12</div>
</div>
```

---

## Support et Documentation

- **Documentation visuelle** : Ouvrir `design-system-showcase.html`
- **Variables CSS** : Toutes documentées dans `design-system.css`
- **Exemples** : Voir `home.html` pour une implémentation complète

---

## Feuille de Route

### Version 1.0 (Actuelle)
✅ Variables CSS complètes
✅ Composants de base
✅ Système de thèmes
✅ Grilles et layouts
✅ Documentation

### Version 1.1 (À venir)
- [ ] Composants de modal
- [ ] Système de tabs
- [ ] Tooltips
- [ ] Dropdowns
- [ ] Toast notifications
- [ ] Animations avancées

---

**Maintenu par l'équipe LCVB Scoreboard**
Dernière mise à jour : 2025

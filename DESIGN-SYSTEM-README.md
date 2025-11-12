# 🎨 Design System LCVB Scoreboard

> Système de design modulaire, cohérent et accessible pour l'ensemble du site LCVB Scoreboard Pro

---

## 🚀 Démarrage Rapide

### 1. Inclure le Design System

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ma Page - LCVB Scoreboard</title>

    <!-- Design System -->
    <link rel="stylesheet" href="design-system.css">
</head>
<body>
    <!-- Theme Toggle -->
    <button class="ds-theme-toggle" onclick="ThemeManager.toggle()">🌙</button>

    <!-- Contenu -->
    <div class="ds-container">
        <h1>Bonjour le monde !</h1>
    </div>

    <!-- Scripts -->
    <script src="theme.js"></script>
</body>
</html>
```

### 2. Utiliser les Composants

```html
<!-- Card -->
<div class="ds-card">
    <h3 class="ds-card-title">Titre</h3>
    <p>Contenu de la card</p>
</div>

<!-- Bouton -->
<button class="ds-btn ds-btn-primary">Valider</button>

<!-- Formulaire -->
<div class="ds-form-group">
    <label class="ds-form-label">Nom</label>
    <input type="text" class="ds-form-input" placeholder="Votre nom">
</div>
```

---

## 📁 Fichiers du Design System

| Fichier | Description | Usage |
|---------|-------------|-------|
| `design-system.css` | 🎨 **Fichier principal** | Obligatoire sur toutes les pages |
| `design-system-showcase.html` | 📚 **Documentation visuelle** | Voir tous les composants |
| `DESIGN-SYSTEM-GUIDE.md` | 📖 **Guide complet** | Documentation détaillée |
| `ARCHITECTURE.md` | 🏗️ **Architecture** | Structure des pages |
| `template-page.html` | 📄 **Template** | Base pour nouvelles pages |
| `theme.js` | 🌓 **Gestion thèmes** | Script mode clair/sombre |

---

## 🎯 Fonctionnalités

### ✅ Ce qui est inclus

- **Variables CSS** : Tokens pour couleurs, espacements, typographie
- **Reset CSS** : Styles de base normalisés
- **Layout System** : Grid et flexbox utilities
- **Composants** : Cards, boutons, formulaires, navigation, alerts...
- **Thèmes** : Mode clair/sombre avec sauvegarde localStorage
- **Responsive** : Breakpoints mobile, tablet, desktop
- **Utilitaires** : Classes helper pour spacing, texte, display...
- **Accessibilité** : Focus states, aria labels, contrastes

### 🎨 Composants Disponibles

#### Layout
- Container (responsive)
- Grid system (1-6 colonnes)
- Flexbox utilities

#### UI Components
- Cards (standard, interactive, compact)
- Buttons (7 variantes, 4 tailles)
- Badges (5 couleurs)
- Alerts (4 types)
- Navigation
- Top Bar avec user info
- Hero Section
- Loading Spinner

#### Forms
- Inputs
- Textarea
- Select
- Checkbox / Radio
- Labels avec validation
- États error/success

---

## 📖 Documentation

### Ouvrir la Documentation Visuelle

```bash
# Ouvrir dans le navigateur
open design-system-showcase.html
```

### Lire les Guides

1. **DESIGN-SYSTEM-GUIDE.md** : Guide complet d'utilisation
2. **ARCHITECTURE.md** : Structure et architecture des pages
3. **design-system-showcase.html** : Exemples visuels interactifs

---

## 🎨 Palette de Couleurs

### Mode Clair (Default)

```css
Background : #f8f9fa (gris clair)
Texte      : #212529 (noir)
Primary    : #2563eb (bleu)
Success    : #10b981 (vert)
Danger     : #ef4444 (rouge)
Warning    : #f59e0b (orange)
```

### Mode Sombre

```css
Background : #0f172a (bleu nuit)
Texte      : #ffffff (blanc)
Primary    : #2563eb (bleu)
Success    : #10b981 (vert)
Danger     : #ef4444 (rouge)
Warning    : #f59e0b (orange)
```

---

## 🔧 Exemples Pratiques

### Créer une Card Interactive

```html
<div class="ds-card ds-card-interactive">
    <div class="ds-card-header">
        <h3 class="ds-card-title">Équipe Séniors M</h3>
        <p class="ds-card-subtitle">Régional 2</p>
    </div>
    <div class="ds-card-body">
        <p>12 joueurs • 8 matchs joués</p>
    </div>
    <div class="ds-card-footer">
        <button class="ds-btn ds-btn-primary ds-btn-sm">Voir</button>
    </div>
</div>
```

### Formulaire avec Validation

```html
<form>
    <div class="ds-form-group">
        <label class="ds-form-label ds-form-label-required">
            Nom de l'équipe
        </label>
        <input
            type="text"
            class="ds-form-input"
            placeholder="Ex: Séniors M"
            required>
        <small class="ds-form-help">
            Le nom apparaîtra sur le scoreboard
        </small>
    </div>

    <div class="ds-form-group">
        <label class="ds-form-label">Catégorie</label>
        <select class="ds-form-select">
            <option>Régional 1</option>
            <option>Régional 2</option>
            <option>Départemental</option>
        </select>
    </div>

    <button type="submit" class="ds-btn ds-btn-primary">
        <span>✓</span>
        <span>Créer l'équipe</span>
    </button>
</form>
```

### Grid Responsive

```html
<div class="ds-grid ds-grid-cols-3 ds-gap-6">
    <div class="ds-card">Card 1</div>
    <div class="ds-card">Card 2</div>
    <div class="ds-card">Card 3</div>
</div>
```

---

## 🌓 Gestion des Thèmes

### JavaScript API

```javascript
// Basculer entre clair/sombre
ThemeManager.toggle()

// Obtenir le thème actuel
const theme = ThemeManager.getCurrentTheme()  // 'light' ou 'dark'

// Vérifier si mode sombre
if (ThemeManager.isDarkMode()) {
    console.log('Mode sombre actif')
}

// Forcer un thème
ThemeManager.enableDarkMode()
ThemeManager.enableLightMode()

// Réinitialiser (revient à la préférence système)
ThemeManager.reset()

// Écouter les changements
window.addEventListener('themechange', (e) => {
    console.log('Nouveau thème:', e.detail.theme)
})
```

---

## 📱 Responsive Design

Le design system s'adapte automatiquement :

- **Mobile (< 768px)** : 1 colonne, padding réduit
- **Tablet (768-1024px)** : 2 colonnes
- **Desktop (> 1024px)** : Layout complet

```css
/* Breakpoints */
--ds-breakpoint-sm: 640px
--ds-breakpoint-md: 768px
--ds-breakpoint-lg: 1024px
--ds-breakpoint-xl: 1280px
```

---

## ✅ Bonnes Pratiques

### À FAIRE

```html
✅ <button class="ds-btn ds-btn-primary">Valider</button>
✅ <div style="padding: var(--ds-space-4);">
✅ <div class="ds-card ds-mt-4">
```

### À ÉVITER

```html
❌ <button style="background: blue; padding: 10px;">
❌ <div style="padding: 16px;">
❌ .my-custom-card { /* duplication du DS */ }
```

### Conventions

- Préfixer toutes les classes par `ds-`
- Utiliser les variables CSS pour les valeurs
- Éviter les styles inline
- Utiliser les composants existants avant d'en créer

---

## 🔄 Migration des Pages Existantes

### Pages à Migrer (par priorité)

**Priorité Haute** 🔴
1. `control.html` - Refonte complète nécessaire
2. `stats.html` - Harmonisation importante

**Priorité Moyenne** 🟡
3. `login.html` - Refonte légère
4. `settings.html` - Ajustements
5. `teams.html` - Ajustements

**Priorité Basse** 🟢
6. `setup.html` - Déjà bien aligné
7. `display.html` / `spectator.html` / `lineups.html`

### Checklist de Migration

```markdown
- [ ] Remplacer les imports CSS
- [ ] Supprimer les styles inline
- [ ] Wrapper dans ds-container
- [ ] Ajouter ds-topbar
- [ ] Convertir les cards
- [ ] Convertir les boutons
- [ ] Utiliser ds-grid
- [ ] Convertir les formulaires
- [ ] Ajouter theme toggle
- [ ] Tester responsive
- [ ] Tester thèmes
```

---

## 🎯 Architecture Standard

```
┌─────────────────────────────────────┐
│     🌙 Theme Toggle (Fixed)         │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │     ds-container              │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  ds-topbar (User+Logout)│  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  ds-hero (optionnel)    │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  ds-nav (optionnel)     │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  <main>                 │  │  │
│  │  │    Contenu de la page   │  │  │
│  │  │  </main>                │  │  │
│  │  └─────────────────────────┘  │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  <footer> (optionnel)   │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 🛠️ Développement

### Ajouter un Nouveau Composant

1. Créer dans `design-system.css` sous la section `4. COMPONENTS`
2. Documenter dans `design-system-showcase.html`
3. Ajouter exemple dans `DESIGN-SYSTEM-GUIDE.md`
4. Préfixer les classes par `ds-`

### Modifier une Variable

```css
/* Dans design-system.css */
:root {
    --ds-primary: #2563eb;  /* Modifier ici */
}

[data-theme="dark"] {
    --ds-primary: #2563eb;  /* Et ici si différent */
}
```

---

## 📊 Statistiques

- **Variables CSS** : 100+
- **Composants** : 30+
- **Classes utilitaires** : 50+
- **Lignes de CSS** : ~1500
- **Taille** : ~40KB (non minifié)
- **Compatibilité** : Tous navigateurs modernes

---

## 🤝 Contribution

Pour contribuer au design system :

1. Suivre les conventions de nommage (`ds-*`)
2. Utiliser les variables CSS existantes
3. Documenter les nouveaux composants
4. Tester en mode clair ET sombre
5. Vérifier le responsive

---

## 📝 Changelog

### Version 1.0.0 (2025)

**Ajouts initiaux :**
- ✅ Variables CSS complètes (tokens)
- ✅ Reset & base styles
- ✅ Layout system (grid, flexbox)
- ✅ Composants de base (cards, buttons, forms...)
- ✅ Système de thèmes clair/sombre
- ✅ Responsive design
- ✅ Documentation complète

**À venir dans v1.1 :**
- [ ] Composants modal
- [ ] Système de tabs
- [ ] Tooltips
- [ ] Dropdowns
- [ ] Toast notifications
- [ ] Animations avancées

---

## 📞 Support

- **Documentation** : `DESIGN-SYSTEM-GUIDE.md`
- **Architecture** : `ARCHITECTURE.md`
- **Showcase** : `design-system-showcase.html`
- **Template** : `template-page.html`

---

## 📄 Licence

Ce design system est propriété de **Le Crès Volley-Ball** et fait partie du projet LCVB Scoreboard Pro.

---

**Maintenu par l'équipe LCVB Scoreboard**
**Dernière mise à jour** : 2025
**Version** : 1.0.0

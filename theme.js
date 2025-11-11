/**
 * LCVB Scoreboard - Theme Management
 * Gestion du mode sombre/clair
 */

const ThemeManager = {
    STORAGE_KEY: 'lcvb_theme',

    // Initialize theme on page load
    init() {
        const savedTheme = this.getTheme();
        this.applyTheme(savedTheme);
        this.updateToggleButton(savedTheme);
    },

    // Get current theme from localStorage
    getTheme() {
        return localStorage.getItem(this.STORAGE_KEY) || 'dark'; // Default: dark
    },

    // Save theme to localStorage
    saveTheme(theme) {
        localStorage.setItem(this.STORAGE_KEY, theme);
    },

    // Toggle between dark and light
    toggle() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
        this.updateToggleButton(newTheme);
    },

    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
        }
    },

    // Update toggle button text/icon
    updateToggleButton(theme) {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
            toggleBtn.title = theme === 'dark' ? 'Mode clair' : 'Mode sombre';
        }
    }
};

// Auto-initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
    ThemeManager.init();
}

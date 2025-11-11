// ==========================================
// LCVB LOGGER - Système de logs et debugging
// ==========================================

const LCVBLogger = {
    STORAGE_KEY: 'lcvb_logs',
    MAX_LOGS: 1000, // Maximum de logs à conserver

    // Niveaux de log
    LEVELS: {
        DEBUG: 'DEBUG',
        INFO: 'INFO',
        WARN: 'WARN',
        ERROR: 'ERROR'
    },

    // Configuration
    config: {
        enabled: true,
        consoleOutput: true,
        storageEnabled: true,
        level: 'DEBUG' // Niveau minimum à logger
    },

    /**
     * Initialiser le logger
     */
    init() {
        // Charger la configuration depuis localStorage
        const savedConfig = localStorage.getItem('lcvb_logger_config');
        if (savedConfig) {
            this.config = { ...this.config, ...JSON.parse(savedConfig) };
        }

        // Vérifier et nettoyer les anciens logs si nécessaire
        this.cleanup();

        this.info('Logger initialisé', { config: this.config });
    },

    /**
     * Logger un message de debug
     */
    debug(message, data = {}) {
        this.log(this.LEVELS.DEBUG, message, data);
    },

    /**
     * Logger un message d'information
     */
    info(message, data = {}) {
        this.log(this.LEVELS.INFO, message, data);
    },

    /**
     * Logger un avertissement
     */
    warn(message, data = {}) {
        this.log(this.LEVELS.WARN, message, data);
    },

    /**
     * Logger une erreur
     */
    error(message, data = {}) {
        this.log(this.LEVELS.ERROR, message, data);
    },

    /**
     * Fonction principale de logging
     */
    log(level, message, data = {}) {
        if (!this.config.enabled) return;

        // Créer l'entrée de log
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level,
            message: message,
            data: data,
            page: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 100) // Limité pour économiser l'espace
        };

        // Console output si activé
        if (this.config.consoleOutput) {
            const style = this.getConsoleStyle(level);
            console.log(`%c[${level}]%c ${message}`, style, '', data);
        }

        // Sauvegarder dans localStorage si activé
        if (this.config.storageEnabled) {
            this.saveLog(logEntry);
        }
    },

    /**
     * Sauvegarder un log dans localStorage
     */
    saveLog(logEntry) {
        try {
            let logs = this.getLogs();
            logs.push(logEntry);

            // Limiter le nombre de logs
            if (logs.length > this.MAX_LOGS) {
                logs = logs.slice(-this.MAX_LOGS);
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du log:', error);
            // Si quota dépassé, nettoyer et réessayer
            if (error.name === 'QuotaExceededError') {
                this.clear();
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify([logEntry]));
            }
        }
    },

    /**
     * Récupérer tous les logs
     */
    getLogs() {
        try {
            const logs = localStorage.getItem(this.STORAGE_KEY);
            return logs ? JSON.parse(logs) : [];
        } catch (error) {
            console.error('Erreur lors de la lecture des logs:', error);
            return [];
        }
    },

    /**
     * Filtrer les logs par niveau
     */
    getLogsByLevel(level) {
        return this.getLogs().filter(log => log.level === level);
    },

    /**
     * Filtrer les logs par période
     */
    getLogsByDate(startDate, endDate) {
        const logs = this.getLogs();
        return logs.filter(log => {
            const logDate = new Date(log.timestamp);
            return logDate >= startDate && logDate <= endDate;
        });
    },

    /**
     * Rechercher dans les logs
     */
    search(query) {
        const logs = this.getLogs();
        return logs.filter(log => {
            const searchString = JSON.stringify(log).toLowerCase();
            return searchString.includes(query.toLowerCase());
        });
    },

    /**
     * Nettoyer les anciens logs (garder seulement les 7 derniers jours)
     */
    cleanup() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const logs = this.getLogs();
        const recentLogs = logs.filter(log => {
            return new Date(log.timestamp) > sevenDaysAgo;
        });

        if (recentLogs.length < logs.length) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentLogs));
            console.log(`🧹 ${logs.length - recentLogs.length} anciens logs supprimés`);
        }
    },

    /**
     * Effacer tous les logs
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('🗑️ Tous les logs ont été effacés');
    },

    /**
     * Exporter les logs en JSON
     */
    exportJSON() {
        const logs = this.getLogs();
        const dataStr = JSON.stringify(logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.href = url;
        link.download = `lcvb_logs_${timestamp}.json`;
        link.click();
        URL.revokeObjectURL(url);

        this.info('Logs exportés', { count: logs.length });
    },

    /**
     * Exporter les logs en CSV
     */
    exportCSV() {
        const logs = this.getLogs();

        // En-têtes CSV
        let csv = 'Timestamp,Level,Page,Message,Data\n';

        // Lignes
        logs.forEach(log => {
            const dataStr = JSON.stringify(log.data).replace(/"/g, '""');
            csv += `"${log.timestamp}","${log.level}","${log.page}","${log.message}","${dataStr}"\n`;
        });

        const dataBlob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.href = url;
        link.download = `lcvb_logs_${timestamp}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        this.info('Logs exportés en CSV', { count: logs.length });
    },

    /**
     * Obtenir les statistiques des logs
     */
    getStats() {
        const logs = this.getLogs();
        const stats = {
            total: logs.length,
            byLevel: {
                DEBUG: 0,
                INFO: 0,
                WARN: 0,
                ERROR: 0
            },
            byPage: {},
            oldest: logs.length > 0 ? logs[0].timestamp : null,
            newest: logs.length > 0 ? logs[logs.length - 1].timestamp : null
        };

        logs.forEach(log => {
            // Compter par niveau
            stats.byLevel[log.level]++;

            // Compter par page
            const page = log.page || 'unknown';
            stats.byPage[page] = (stats.byPage[page] || 0) + 1;
        });

        return stats;
    },

    /**
     * Configurer le logger
     */
    configure(options) {
        this.config = { ...this.config, ...options };
        localStorage.setItem('lcvb_logger_config', JSON.stringify(this.config));
        this.info('Configuration mise à jour', { config: this.config });
    },

    /**
     * Obtenir le style de console selon le niveau
     */
    getConsoleStyle(level) {
        switch (level) {
            case this.LEVELS.DEBUG:
                return 'background: #3b82f6; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;';
            case this.LEVELS.INFO:
                return 'background: #10b981; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;';
            case this.LEVELS.WARN:
                return 'background: #f59e0b; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;';
            case this.LEVELS.ERROR:
                return 'background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-weight: bold;';
            default:
                return '';
        }
    },

    /**
     * Capturer les erreurs JavaScript globales
     */
    captureErrors() {
        window.addEventListener('error', (event) => {
            this.error('Erreur JavaScript non gérée', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.error('Promise rejetée non gérée', {
                reason: event.reason,
                promise: event.promise
            });
        });

        this.info('Capture d\'erreurs activée');
    },

    /**
     * Logger l'activité utilisateur
     */
    logUserAction(action, details = {}) {
        this.info(`Action utilisateur: ${action}`, details);
    },

    /**
     * Logger une performance
     */
    logPerformance(operation, duration) {
        const level = duration > 1000 ? this.LEVELS.WARN : this.LEVELS.DEBUG;
        this.log(level, `Performance: ${operation}`, { duration: `${duration}ms` });
    }
};

// Auto-initialisation
if (typeof window !== 'undefined') {
    LCVBLogger.init();
    LCVBLogger.captureErrors();
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LCVBLogger;
}

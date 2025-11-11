const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const pkg = require('./package.json');
const APP_VERSION = process.env.APP_VERSION || pkg.version || 'dev';

const { testConnection } = require('./config/database');

// Import des routes
const authRoutes = require('./routes/auth');
const teamsRoutes = require('./routes/teams');
const playersRoutes = require('./routes/players');
const lineupsRoutes = require('./routes/lineups');
const matchesRoutes = require('./routes/matches');
const statsRoutes = require('./routes/stats');
const sponsorsRoutes = require('./routes/sponsors');
const newsRoutes = require('./routes/news');
const eventsRoutes = require('./routes/events');
const settingsRoutes = require('./routes/settings');
const ffvbRoutes = require('./routes/ffvb');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MIDDLEWARES
// ==========================================

// Sécurité
app.use(helmet({
    contentSecurityPolicy: false, // Désactiver pour permettre les inline scripts
}));

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
    credentials: true
}));

// Parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ==========================================
// ROUTES
// ==========================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: APP_VERSION
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/lineups', lineupsRoutes);
app.use('/api/matches', matchesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ffvb', ffvbRoutes);

// Route 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        path: req.path
    });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('❌ Erreur serveur:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Erreur serveur interne',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================

const startServer = async () => {
    try {
        // Test de connexion à la BDD
        const dbConnected = await testConnection();
        if (!dbConnected) {
            console.error('❌ Impossible de se connecter à la base de données');
            process.exit(1);
        }

        // Démarrage du serveur HTTP
        app.listen(PORT, () => {
            console.log('\n🚀 ========================================');
            console.log(`🏐 LCVB Scoreboard Pro - Backend API`);
            console.log(`🌐 Serveur démarré sur http://localhost:${PORT}`);
            console.log(`📊 Environnement: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💾 Base de données: ${process.env.DB_NAME}`);
            console.log(`🏷️  Version: ${APP_VERSION}`);
            console.log('🚀 ========================================\n');
        });

    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

// Gestion de l'arrêt propre
process.on('SIGTERM', () => {
    console.log('👋 Signal SIGTERM reçu, arrêt du serveur...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 Signal SIGINT reçu, arrêt du serveur...');
    process.exit(0);
});

// Démarrage
startServer();

module.exports = app;

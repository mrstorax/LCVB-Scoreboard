const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Middleware pour vérifier l'authentification
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier que l'utilisateur existe et est actif
        const result = await query(
            'SELECT id, email, role, first_name, last_name FROM users WHERE id = $1 AND active = true',
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur invalide' });
        }

        // Ajouter l'utilisateur à req pour les routes suivantes
        req.user = result.rows[0];
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        return res.status(401).json({ error: 'Token invalide' });
    }
};

// Middleware pour vérifier les rôles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Non authentifié' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Accès refusé - Permissions insuffisantes' });
        }

        next();
    };
};

module.exports = {
    authenticate,
    authorize
};

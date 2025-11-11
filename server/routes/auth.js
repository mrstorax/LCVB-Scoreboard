const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

const router = express.Router();

// ==========================================
// LOGIN
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }

        // Pour le mode développement avec test@test.com
        if (email === 'test@test.com' && password === 'test@test.com') {
            // Vérifier si l'utilisateur existe dans la BDD
            let result = await query('SELECT * FROM users WHERE email = $1', [email]);

            let user;
            if (result.rows.length === 0) {
                // Créer l'utilisateur test s'il n'existe pas
                const passwordHash = await bcrypt.hash(password, 10);
                result = await query(
                    'INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [email, passwordHash, 'admin', 'Test', 'Admin']
                );
                user = result.rows[0];
            } else {
                user = result.rows[0];
            }

            // Générer le token JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
            );

            // Mettre à jour last_login
            await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

            // Log de l'action
            await query(
                'INSERT INTO activity_logs (user_id, action, ip_address) VALUES ($1, $2, $3)',
                [user.id, 'login', req.ip]
            );

            return res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    firstName: user.first_name,
                    lastName: user.last_name
                }
            });
        }

        // Récupérer l'utilisateur
        const result = await query('SELECT * FROM users WHERE email = $1 AND active = true', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        const user = result.rows[0];

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // Mettre à jour last_login
        await query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

        // Log de l'action
        await query(
            'INSERT INTO activity_logs (user_id, action, ip_address) VALUES ($1, $2, $3)',
            [user.id, 'login', req.ip]
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name
            }
        });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// ==========================================
// VÉRIFICATION TOKEN
// ==========================================
router.get('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier que l'utilisateur existe toujours
        const result = await query('SELECT id, email, role, first_name, last_name FROM users WHERE id = $1 AND active = true', [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur invalide' });
        }

        res.json({
            success: true,
            user: {
                id: result.rows[0].id,
                email: result.rows[0].email,
                role: result.rows[0].role,
                firstName: result.rows[0].first_name,
                lastName: result.rows[0].last_name
            }
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        res.status(401).json({ error: 'Token invalide' });
    }
});

// ==========================================
// LOGOUT (optionnel, côté client surtout)
// ==========================================
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Log de l'action
            await query(
                'INSERT INTO activity_logs (user_id, action, ip_address) VALUES ($1, $2, $3)',
                [decoded.id, 'logout', req.ip]
            );
        }

        res.json({ success: true, message: 'Déconnexion réussie' });

    } catch (error) {
        res.json({ success: true, message: 'Déconnexion réussie' });
    }
});

module.exports = router;

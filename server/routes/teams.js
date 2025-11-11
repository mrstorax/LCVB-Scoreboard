const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// ==========================================
// GET ALL TEAMS
// ==========================================
router.get('/', authenticate, async (req, res) => {
    try {
        const result = await query(`
            SELECT
                t.*,
                u.first_name || ' ' || u.last_name as coach_name,
                (SELECT COUNT(*) FROM players WHERE team_id = t.id AND active = true) as player_count
            FROM teams t
            LEFT JOIN users u ON t.coach_id = u.id
            WHERE t.active = true
            ORDER BY t.category, t.name
        `);

        res.json({
            success: true,
            teams: result.rows
        });

    } catch (error) {
        console.error('Erreur GET teams:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des équipes' });
    }
});

// ==========================================
// GET TEAM BY ID
// ==========================================
router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT
                t.*,
                u.first_name || ' ' || u.last_name as coach_name,
                (SELECT COUNT(*) FROM players WHERE team_id = t.id AND active = true) as player_count
            FROM teams t
            LEFT JOIN users u ON t.coach_id = u.id
            WHERE t.id = $1 AND t.active = true
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Récupérer les joueurs
        const playersResult = await query(`
            SELECT * FROM players
            WHERE team_id = $1 AND active = true
            ORDER BY is_libero DESC, number
        `, [id]);

        res.json({
            success: true,
            team: {
                ...result.rows[0],
                players: playersResult.rows
            }
        });

    } catch (error) {
        console.error('Erreur GET team:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'équipe' });
    }
});

// ==========================================
// CREATE TEAM
// ==========================================
router.post('/', authenticate, authorize('admin', 'coach'), async (req, res) => {
    try {
        const { name, category, logo_url, primary_color, secondary_color, coach_id } = req.body;

        // Validation
        if (!name || !category) {
            return res.status(400).json({ error: 'Nom et catégorie requis' });
        }

        const result = await query(`
            INSERT INTO teams (name, category, logo_url, primary_color, secondary_color, coach_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [name, category, logo_url || null, primary_color || '#E91E63', secondary_color || '#FF69B4', coach_id || null]);

        // Log de l'action
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'create_team', 'team', result.rows[0].id]
        );

        res.status(201).json({
            success: true,
            team: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur CREATE team:', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'équipe' });
    }
});

// ==========================================
// UPDATE TEAM
// ==========================================
router.put('/:id', authenticate, authorize('admin', 'coach'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, logo_url, primary_color, secondary_color, coach_id } = req.body;

        const result = await query(`
            UPDATE teams
            SET name = COALESCE($1, name),
                category = COALESCE($2, category),
                logo_url = COALESCE($3, logo_url),
                primary_color = COALESCE($4, primary_color),
                secondary_color = COALESCE($5, secondary_color),
                coach_id = COALESCE($6, coach_id)
            WHERE id = $7 AND active = true
            RETURNING *
        `, [name, category, logo_url, primary_color, secondary_color, coach_id, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Log de l'action
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'update_team', 'team', id]
        );

        res.json({
            success: true,
            team: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur UPDATE team:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'équipe' });
    }
});

// ==========================================
// DELETE TEAM (soft delete)
// ==========================================
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(`
            UPDATE teams
            SET active = false
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // Log de l'action
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'delete_team', 'team', id]
        );

        res.json({
            success: true,
            message: 'Équipe supprimée'
        });

    } catch (error) {
        console.error('Erreur DELETE team:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'équipe' });
    }
});

module.exports = router;

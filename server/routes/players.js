const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET all players (optionally filtered by team)
router.get('/', authenticate, async (req, res) => {
    try {
        const { team_id } = req.query;

        let sql = 'SELECT * FROM players WHERE active = true';
        const params = [];

        if (team_id) {
            sql += ' AND team_id = $1';
            params.push(team_id);
        }

        sql += ' ORDER BY number';

        const result = await query(sql, params);
        res.json({ success: true, players: result.rows });
    } catch (error) {
        console.error('Erreur GET players:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des joueurs' });
    }
});

// GET player by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const result = await query('SELECT * FROM players WHERE id = $1 AND active = true', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Joueur non trouvé' });
        }
        res.json({ success: true, player: result.rows[0] });
    } catch (error) {
        console.error('Erreur GET player:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du joueur' });
    }
});

// CREATE player
router.post('/', authenticate, authorize('admin', 'coach'), async (req, res) => {
    try {
        const { team_id, number, first_name, last_name, position, is_libero, photo_url, birth_date, height } = req.body;

        if (!team_id || !number || !first_name || !last_name) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        const result = await query(`
            INSERT INTO players (team_id, number, first_name, last_name, position, is_libero, photo_url, birth_date, height)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [team_id, number, first_name, last_name, position, is_libero || false, photo_url, birth_date, height]);

        await query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'create_player', 'player', result.rows[0].id]);

        res.status(201).json({ success: true, player: result.rows[0] });
    } catch (error) {
        console.error('Erreur CREATE player:', error);
        res.status(500).json({ error: 'Erreur lors de la création du joueur' });
    }
});

// UPDATE player
router.put('/:id', authenticate, authorize('admin', 'coach'), async (req, res) => {
    try {
        const { number, first_name, last_name, position, is_libero, photo_url, birth_date, height } = req.body;

        const result = await query(`
            UPDATE players
            SET number = COALESCE($1, number),
                first_name = COALESCE($2, first_name),
                last_name = COALESCE($3, last_name),
                position = COALESCE($4, position),
                is_libero = COALESCE($5, is_libero),
                photo_url = COALESCE($6, photo_url),
                birth_date = COALESCE($7, birth_date),
                height = COALESCE($8, height)
            WHERE id = $9 AND active = true
            RETURNING *
        `, [number, first_name, last_name, position, is_libero, photo_url, birth_date, height, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Joueur non trouvé' });
        }

        await query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'update_player', 'player', req.params.id]);

        res.json({ success: true, player: result.rows[0] });
    } catch (error) {
        console.error('Erreur UPDATE player:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du joueur' });
    }
});

// DELETE player (soft delete)
router.delete('/:id', authenticate, authorize('admin', 'coach'), async (req, res) => {
    try {
        const result = await query('UPDATE players SET active = false WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Joueur non trouvé' });
        }

        await query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'delete_player', 'player', req.params.id]);

        res.json({ success: true, message: 'Joueur supprimé' });
    } catch (error) {
        console.error('Erreur DELETE player:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du joueur' });
    }
});

module.exports = router;

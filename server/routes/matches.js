const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// GET all matches
router.get('/', authenticate, async (req, res) => {
    try {
        const { status, team_id, limit = 50 } = req.query;

        let sql = `
            SELECT
                m.*,
                t1.name as home_team_name, t1.logo_url as home_team_logo,
                t2.name as away_team_name, t2.logo_url as away_team_logo
            FROM matches m
            JOIN teams t1 ON m.home_team_id = t1.id
            JOIN teams t2 ON m.away_team_id = t2.id
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (status) {
            sql += ` AND m.status = $${paramCount++}`;
            params.push(status);
        }

        if (team_id) {
            sql += ` AND (m.home_team_id = $${paramCount} OR m.away_team_id = $${paramCount})`;
            params.push(team_id);
            paramCount++;
        }

        sql += ` ORDER BY m.match_date DESC LIMIT $${paramCount}`;
        params.push(limit);

        const result = await query(sql, params);
        res.json({ success: true, matches: result.rows });
    } catch (error) {
        console.error('Erreur GET matches:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des matchs' });
    }
});

// GET match by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
        const result = await query(`
            SELECT
                m.*,
                t1.name as home_team_name, t1.logo_url as home_team_logo,
                t2.name as away_team_name, t2.logo_url as away_team_logo
            FROM matches m
            JOIN teams t1 ON m.home_team_id = t1.id
            JOIN teams t2 ON m.away_team_id = t2.id
            WHERE m.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match non trouvé' });
        }

        res.json({ success: true, match: result.rows[0] });
    } catch (error) {
        console.error('Erreur GET match:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du match' });
    }
});

// CREATE match
router.post('/', authenticate, authorize('admin', 'operator'), async (req, res) => {
    try {
        const { home_team_id, away_team_id, match_date, location, competition, referee, has_live, live_url } = req.body;

        if (!home_team_id || !away_team_id || !match_date) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        const result = await query(`
            INSERT INTO matches (home_team_id, away_team_id, match_date, location, competition, referee, has_live, live_url, operator_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [home_team_id, away_team_id, match_date, location, competition, referee, has_live || false, live_url, req.user.id]);

        await query('INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'create_match', 'match', result.rows[0].id]);

        res.status(201).json({ success: true, match: result.rows[0] });
    } catch (error) {
        console.error('Erreur CREATE match:', error);
        res.status(500).json({ error: 'Erreur lors de la création du match' });
    }
});

// UPDATE match
router.put('/:id', authenticate, authorize('admin', 'operator'), async (req, res) => {
    try {
        const { status, home_sets_won, away_sets_won, set_scores, live_url, replay_url, notes } = req.body;

        const result = await query(`
            UPDATE matches
            SET status = COALESCE($1, status),
                home_sets_won = COALESCE($2, home_sets_won),
                away_sets_won = COALESCE($3, away_sets_won),
                set_scores = COALESCE($4, set_scores),
                live_url = COALESCE($5, live_url),
                replay_url = COALESCE($6, replay_url),
                notes = COALESCE($7, notes),
                finished_at = CASE WHEN $1 = 'finished' THEN NOW() ELSE finished_at END
            WHERE id = $8
            RETURNING *
        `, [status, home_sets_won, away_sets_won, set_scores, live_url, replay_url, notes, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Match non trouvé' });
        }

        res.json({ success: true, match: result.rows[0] });
    } catch (error) {
        console.error('Erreur UPDATE match:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du match' });
    }
});

// DELETE match
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        await query('DELETE FROM matches WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Match supprimé' });
    } catch (error) {
        console.error('Erreur DELETE match:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression du match' });
    }
});

module.exports = router;

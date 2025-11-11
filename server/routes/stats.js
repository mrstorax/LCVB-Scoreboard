const express = require('express');
const { query } = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET stats for a match
router.get('/match/:match_id', authenticate, async (req, res) => {
    try {
        const result = await query('SELECT * FROM match_stats WHERE match_id = $1', [req.params.match_id]);
        res.json({ success: true, stats: result.rows[0] || null });
    } catch (error) {
        console.error('Erreur GET match stats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

// GET player stats for a match
router.get('/match/:match_id/players', authenticate, async (req, res) => {
    try {
        const result = await query(`
            SELECT pms.*, p.first_name, p.last_name, p.number
            FROM player_match_stats pms
            JOIN players p ON pms.player_id = p.id
            WHERE pms.match_id = $1
            ORDER BY p.number
        `, [req.params.match_id]);
        res.json({ success: true, playerStats: result.rows });
    } catch (error) {
        console.error('Erreur GET player stats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques joueurs' });
    }
});

// SAVE match stats (from control.html/control_mobile.html)
router.post('/match/:match_id', authenticate, async (req, res) => {
    try {
        const { match_id } = req.params;
        const { full_data, set_stats } = req.body;

        // Calculate summary stats
        const rallies = full_data.stats?.rallies || [];
        const total_rallies = rallies.length;
        const total_points_home = rallies.filter(r => r.rallyResult?.winner === 'us').length;
        const total_points_away = rallies.filter(r => r.rallyResult?.winner === 'them').length;

        let total_aces = 0, total_blocks = 0, total_digs = 0;
        rallies.forEach(r => {
            r.actions?.forEach(a => {
                if (a.type === 'service' && a.result === 'ace') total_aces++;
                if (a.type === 'block' && a.result === 'point') total_blocks++;
                if (a.type === 'dig' && a.result === 'recovered') total_digs++;
            });
        });

        const result = await query(`
            INSERT INTO match_stats (match_id, full_data, set_stats, total_rallies, total_points_home, total_points_away, total_aces, total_blocks, total_digs, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
            ON CONFLICT (match_id) DO UPDATE SET
                full_data = $2, set_stats = $3, total_rallies = $4, total_points_home = $5,
                total_points_away = $6, total_aces = $7, total_blocks = $8, total_digs = $9, updated_at = NOW()
            RETURNING *
        `, [match_id, full_data, set_stats, total_rallies, total_points_home, total_points_away, total_aces, total_blocks, total_digs]);

        res.json({ success: true, stats: result.rows[0] });
    } catch (error) {
        console.error('Erreur SAVE match stats:', error);
        res.status(500).json({ error: 'Erreur lors de la sauvegarde des statistiques' });
    }
});

module.exports = router;

const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const { from_date } = req.query;
        let sql = 'SELECT * FROM events WHERE 1=1';
        const params = [];

        if (from_date) {
            sql += ' AND event_date >= $1';
            params.push(from_date);
        }

        sql += ' ORDER BY event_date ASC';

        const result = await query(sql, params);
        res.json({ success: true, events: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
});

router.post('/', authenticate, authorize('admin', 'operator'), async (req, res) => {
    try {
        const { title, description, event_date, event_type, location, team_id } = req.body;
        const result = await query(
            'INSERT INTO events (title, description, event_date, event_type, location, team_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, event_date, event_type, location, team_id]
        );
        res.status(201).json({ success: true, event: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'événement' });
    }
});

router.delete('/:id', authenticate, authorize('admin', 'operator'), async (req, res) => {
    try {
        await query('DELETE FROM events WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Événement supprimé' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'événement' });
    }
});

module.exports = router;

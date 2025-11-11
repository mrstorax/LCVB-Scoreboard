const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM sponsors WHERE is_active = true ORDER BY priority DESC, name');
        res.json({ success: true, sponsors: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des sponsors' });
    }
});

router.post('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { name, logo_url, website_url, display_duration, priority } = req.body;
        const result = await query(
            'INSERT INTO sponsors (name, logo_url, website_url, display_duration, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, logo_url, website_url || null, display_duration || 15, priority || 0]
        );
        res.status(201).json({ success: true, sponsor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du sponsor' });
    }
});

router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { name, logo_url, website_url, display_duration, priority, is_active } = req.body;
        const result = await query(
            'UPDATE sponsors SET name = COALESCE($1, name), logo_url = COALESCE($2, logo_url), website_url = COALESCE($3, website_url), display_duration = COALESCE($4, display_duration), priority = COALESCE($5, priority), is_active = COALESCE($6, is_active) WHERE id = $7 RETURNING *',
            [name, logo_url, website_url, display_duration, priority, is_active, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Sponsor non trouvé' });
        res.json({ success: true, sponsor: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du sponsor' });
    }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        await query('DELETE FROM sponsors WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Sponsor supprimé' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression du sponsor' });
    }
});

module.exports = router;

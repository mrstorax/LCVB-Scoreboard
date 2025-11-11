const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const result = await query('SELECT * FROM settings');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des paramètres' });
    }
});

router.get('/:key', authenticate, async (req, res) => {
    try {
        const result = await query('SELECT * FROM settings WHERE key = $1', [req.params.key]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Paramètre non trouvé' });
        res.json({ success: true, setting: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du paramètre' });
    }
});

router.put('/:key', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { value, description } = req.body;
        const result = await query(
            'INSERT INTO settings (key, value, description, updated_at) VALUES ($1, $2, $3, NOW()) ON CONFLICT (key) DO UPDATE SET value = $2, description = COALESCE($3, settings.description), updated_at = NOW() RETURNING *',
            [req.params.key, value, description]
        );
        res.json({ success: true, setting: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour du paramètre' });
    }
});

module.exports = router;

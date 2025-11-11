const express = require('express');
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM news WHERE is_published = true ORDER BY publish_date DESC LIMIT 20');
        res.json({ success: true, news: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des actualités' });
    }
});

router.post('/', authenticate, authorize('admin', 'operator'), async (req, res) => {
    try {
        const { title, content, image_url, display_on_live } = req.body;
        const result = await query(
            'INSERT INTO news (title, content, image_url, display_on_live, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, content, image_url, display_on_live || false, req.user.id]
        );
        res.status(201).json({ success: true, news: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'actualité' });
    }
});

router.put('/:id', authenticate, authorize('admin', 'operator'), async (req, res) => {
    try {
        const { title, content, image_url, is_published, display_on_live } = req.body;
        const result = await query(
            'UPDATE news SET title = COALESCE($1, title), content = COALESCE($2, content), image_url = COALESCE($3, image_url), is_published = COALESCE($4, is_published), display_on_live = COALESCE($5, display_on_live) WHERE id = $6 RETURNING *',
            [title, content, image_url, is_published, display_on_live, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Actualité non trouvée' });
        res.json({ success: true, news: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'actualité' });
    }
});

router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        await query('DELETE FROM news WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Actualité supprimée' });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'actualité' });
    }
});

module.exports = router;

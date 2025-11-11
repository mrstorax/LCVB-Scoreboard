const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { importClubFromFFVB, getLatestImport, getUpcomingMatches } = require('../services/ffvbService');

const router = express.Router();

router.post('/import', authenticate, authorize('admin', 'coach', 'operator'), async (req, res) => {
    try {
        const { clubCode, clubUrl, season } = req.body;
        if (!clubCode && !clubUrl) {
            return res.status(400).json({ error: 'Lien ou code club FFVB requis' });
        }
        const result = await importClubFromFFVB({ clubCode, clubUrl, season });
        res.json({ success: true, importId: result.importId, createdAt: result.createdAt, data: result.payload });
    } catch (error) {
        console.error('FFVB import error:', error);
        res.status(500).json({ error: error.message || 'Erreur durant l\'import FFVB' });
    }
});

router.get('/imports/latest', authenticate, async (req, res) => {
    try {
        const { clubCode } = req.query;
        if (!clubCode) {
            return res.status(400).json({ error: 'Paramètre clubCode requis' });
        }
        const latest = await getLatestImport(clubCode);
        if (!latest) {
            return res.status(404).json({ error: 'Aucun import pour ce club' });
        }
        res.json({ success: true, import: latest });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du dernier import' });
    }
});

router.get('/upcoming', authenticate, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 3, 20);
        const matches = await getUpcomingMatches({ clubCode: req.query.clubCode, limit });
        res.json({ success: true, matches });
    } catch (error) {
        console.error('FFVB upcoming error:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des matchs FFVB' });
    }
});

module.exports = router;

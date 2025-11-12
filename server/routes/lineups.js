const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');
const { ensureProfile, updateProfile, getProfile } = require('../services/teamProfileService');

// All routes require authentication
router.use(authenticate);

const toPositionsObject = (raw) => {
    if (!raw) return {};
    if (typeof raw === 'object') {
        return { ...raw };
    }
    try {
        return JSON.parse(raw);
    } catch {
        return {};
    }
};

const sanitizePositionsPayload = (positions = {}, extras = {}) => {
    const parsedPositions = toPositionsObject(positions);

    const slots = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    const cleanPositions = {};

    slots.forEach(slot => {
        const raw = parsedPositions[slot] ?? parsedPositions[slot.toUpperCase()];
        const parsed = raw !== undefined && raw !== null ? parseInt(raw, 10) : null;
        cleanPositions[slot] = Number.isInteger(parsed) ? parsed : null;
    });

    const normalizedLibero = extras.liberoId ?? parsedPositions.libero;
    if (normalizedLibero) {
        const val = parseInt(normalizedLibero, 10);
        cleanPositions.libero = Number.isInteger(val) ? val : null;
    }

    const normalizedCaptain = extras.captainId ?? parsedPositions.captain;
    if (normalizedCaptain) {
        const val = parseInt(normalizedCaptain, 10);
        cleanPositions.captain = Number.isInteger(val) ? val : null;
    }

    return cleanPositions;
};

const toNullableInt = (value) => {
    if (value === null || value === undefined || value === '') {
        return null;
    }
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? null : parsed;
};

const hydrateLineupMeta = (lineup) => {
    const positions = toPositionsObject(lineup.positions);
    const resolvedCaptain = lineup.captain_player_id || positions.captain || null;
    const resolvedLibero = lineup.libero_player_id || positions.libero || null;

    return {
        ...lineup,
        positions,
        libero_id: resolvedLibero,
        captain_id: resolvedCaptain
    };
};

/**
 * GET /api/lineups
 * Get all lineups (optionally filtered by team_id)
 */
router.get('/', async (req, res) => {
    try {
        const { team_id } = req.query;

        let sql = `
            SELECT
                l.*,
                t.name as team_name,
                t.category as team_category
            FROM lineups l
            LEFT JOIN teams t ON l.team_id = t.id
            WHERE 1=1
        `;

        const params = [];

        if (team_id) {
            sql += ' AND l.team_id = $1';
            params.push(team_id);
        }

        sql += ' ORDER BY l.is_default DESC, l.name';

        const result = await query(sql, params);

        res.json({
            success: true,
            lineups: result.rows.map(hydrateLineupMeta)
        });
    } catch (error) {
        console.error('Erreur GET /api/lineups:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des compositions' });
    }
});

/**
 * GET /api/lineups/:id
 * Get a specific lineup by ID with full details
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT
                l.*,
                t.name as team_name,
                t.category as team_category
            FROM lineups l
            LEFT JOIN teams t ON l.team_id = t.id
            WHERE l.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Composition non trouvée' });
        }

        // Get player details for each position
        const lineup = hydrateLineupMeta(result.rows[0]);
        const positions = lineup.positions || {};
        const playerIds = Object.values(positions).filter(id => id);

        if (playerIds.length > 0) {
            const playersResult = await query(
                `SELECT id, number, first_name, last_name, position, is_libero
                 FROM players
                 WHERE id = ANY($1) AND active = true`,
                [playerIds]
            );

            lineup.players = playersResult.rows;
        } else {
            lineup.players = [];
        }

        // Get libero details if exists
        if (lineup.libero_id) {
            const liberoResult = await query(
                `SELECT id, number, first_name, last_name, is_libero
                 FROM players
                 WHERE id = $1 AND active = true`,
                [lineup.libero_id]
            );

            if (liberoResult.rows.length > 0) {
                lineup.libero = liberoResult.rows[0];
            }
        }

        res.json({
            success: true,
            lineup
        });
    } catch (error) {
        console.error('Erreur GET /api/lineups/:id:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la composition' });
    }
});

/**
 * POST /api/lineups
 * Create a new lineup
 */
router.post('/', authorize('admin', 'coach'), async (req, res) => {
    try {
        const { team_id, name, positions, libero_id, captain_id, is_default } = req.body;

        // Validation
        if (!team_id || !name || !positions) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        // Verify team exists
        const teamCheck = await query(
            'SELECT id FROM teams WHERE id = $1 AND active = true',
            [team_id]
        );

        if (teamCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Équipe non trouvée' });
        }

        // If this lineup should be default, unset other defaults for this team
        if (is_default) {
            await query(
                'UPDATE lineups SET is_default = false WHERE team_id = $1',
                [team_id]
            );
        }

        const cleansedPositions = sanitizePositionsPayload(positions, {
            liberoId: libero_id,
            captainId: captain_id
        });

        const captainValue = cleansedPositions.captain || null;
        const liberoValue = cleansedPositions.libero || null;

        const result = await query(`
            INSERT INTO lineups (team_id, name, positions, is_default, captain_player_id, libero_player_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [team_id, name, JSON.stringify(cleansedPositions), is_default || false, captainValue, liberoValue]);

        // Log activity
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details) VALUES ($1, $2, $3, $4, $5)',
            [req.user.id, 'create_lineup', 'lineup', result.rows[0].id, JSON.stringify({ team_id, name })]
        );

        res.status(201).json({
            success: true,
            lineup: hydrateLineupMeta(result.rows[0]),
            message: 'Composition créée avec succès'
        });
    } catch (error) {
        console.error('Erreur POST /api/lineups:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la composition' });
    }
});

/**
 * PUT /api/lineups/:id
 * Update a lineup
 */
router.put('/:id', authorize('admin', 'coach'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, positions, libero_id, captain_id, is_default } = req.body;

        // Check lineup exists
        const checkResult = await query(
            'SELECT * FROM lineups WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Composition non trouvée' });
        }

        const existingLineup = checkResult.rows[0];

        // If setting as default, unset other defaults
        if (is_default && !existingLineup.is_default) {
            await query(
                'UPDATE lineups SET is_default = false WHERE team_id = $1 AND id != $2',
                [existingLineup.team_id, id]
            );
        }

        const updates = [];
        const params = [];
        let paramCount = 1;
        const existingPositions = toPositionsObject(existingLineup.positions);
        let nextPositions = existingPositions;
        let nextCaptainId = existingLineup.captain_player_id || existingPositions.captain || null;
        let nextLiberoId = existingLineup.libero_player_id || existingPositions.libero || null;
        let positionsChanged = false;

        if (name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            params.push(name);
        }

        if (positions !== undefined) {
            const cleansed = sanitizePositionsPayload(positions, {
                liberoId: libero_id,
                captainId: captain_id
            });
            nextPositions = cleansed;
            nextCaptainId = cleansed.captain || null;
            nextLiberoId = cleansed.libero || null;
            positionsChanged = true;
        } else {
            if (captain_id !== undefined) {
                nextCaptainId = toNullableInt(captain_id);
                nextPositions = {
                    ...nextPositions,
                    captain: nextCaptainId
                };
                positionsChanged = true;
            }

            if (libero_id !== undefined) {
                nextLiberoId = toNullableInt(libero_id);
                nextPositions = {
                    ...nextPositions,
                    libero: nextLiberoId
                };
                positionsChanged = true;
            }
        }

        if (positionsChanged) {
            updates.push(`positions = $${paramCount++}`);
            params.push(JSON.stringify(nextPositions));
        }

        if (nextCaptainId !== existingLineup.captain_player_id) {
            updates.push(`captain_player_id = $${paramCount++}`);
            params.push(nextCaptainId);
        }

        if (nextLiberoId !== existingLineup.libero_player_id) {
            updates.push(`libero_player_id = $${paramCount++}`);
            params.push(nextLiberoId);
        }

        if (is_default !== undefined) {
            updates.push(`is_default = $${paramCount++}`);
            params.push(is_default);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'Aucune modification fournie' });
        }

        updates.push(`updated_at = CURRENT_TIMESTAMP`);
        params.push(id);

        const result = await query(
            `UPDATE lineups SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            params
        );

        // Log activity
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'update_lineup', 'lineup', id]
        );

        res.json({
            success: true,
            lineup: hydrateLineupMeta(result.rows[0]),
            message: 'Composition mise à jour avec succès'
        });
    } catch (error) {
        console.error('Erreur PUT /api/lineups/:id:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la composition' });
    }
});

/**
 * PUT /api/lineups/:id/default
 * Set a lineup as default for its team
 */
router.put('/:id/default', authorize('admin', 'coach'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check lineup exists
        const checkResult = await query(
            'SELECT team_id, is_default FROM lineups WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Composition non trouvée' });
        }

        const lineup = checkResult.rows[0];

        // Unset all defaults for this team
        await query(
            'UPDATE lineups SET is_default = false WHERE team_id = $1',
            [lineup.team_id]
        );

        // Set this one as default
        const result = await query(
            'UPDATE lineups SET is_default = true WHERE id = $1 RETURNING *',
            [id]
        );

        await updateProfile(lineup.team_id, { default_lineup_id: id });

        // Log activity
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'set_default_lineup', 'lineup', id]
        );

        res.json({
            success: true,
            lineup: hydrateLineupMeta(result.rows[0]),
            message: 'Composition définie par défaut'
        });
    } catch (error) {
        console.error('Erreur PUT /api/lineups/:id/default:', error);
        res.status(500).json({ error: 'Erreur lors de la définition de la composition par défaut' });
    }
});

/**
 * DELETE /api/lineups/:id
 * Soft delete a lineup
 */
router.delete('/:id', authorize('admin', 'coach'), async (req, res) => {
    try {
        const { id } = req.params;

        // Check lineup exists
        const checkResult = await query(
            'SELECT id, team_id FROM lineups WHERE id = $1',
            [id]
        );

        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: 'Composition non trouvée' });
        }

        // Soft delete
        await query('DELETE FROM lineups WHERE id = $1', [id]);

        const profile = await getProfile(checkResult.rows[0].team_id);
        if (profile?.default_lineup_id === parseInt(id, 10)) {
            await updateProfile(checkResult.rows[0].team_id, { default_lineup_id: null });
        }

        // Log activity
        await query(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id) VALUES ($1, $2, $3, $4)',
            [req.user.id, 'delete_lineup', 'lineup', id]
        );

        res.json({
            success: true,
            message: 'Composition supprimée avec succès'
        });
    } catch (error) {
        console.error('Erreur DELETE /api/lineups/:id:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la composition' });
    }
});

/**
 * GET /api/lineups/team/:teamId/default
 * Get the default lineup for a team
 */
router.get('/team/:teamId/default', async (req, res) => {
    try {
        const { teamId } = req.params;

        const result = await query(`
            SELECT l.*
            FROM lineups l
            WHERE l.team_id = $1 AND l.is_default = true
        `, [teamId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aucune composition par défaut définie pour cette équipe' });
        }

        const lineup = hydrateLineupMeta(result.rows[0]);

        // Get player details
        const positions = lineup.positions || {};
        const playerIds = Object.values(positions).filter(id => id);

        if (playerIds.length > 0) {
            const playersResult = await query(
                `SELECT id, number, first_name, last_name, position, is_libero
                 FROM players
                 WHERE id = ANY($1) AND active = true`,
                [playerIds]
            );

            lineup.players = playersResult.rows;
        } else {
            lineup.players = [];
        }

        // Get libero details
        if (lineup.libero_id) {
            const liberoResult = await query(
                `SELECT id, number, first_name, last_name, is_libero
                 FROM players
                 WHERE id = $1 AND active = true`,
                [lineup.libero_id]
            );

            if (liberoResult.rows.length > 0) {
                lineup.libero = liberoResult.rows[0];
            }
        }

        res.json({
            success: true,
            lineup
        });
    } catch (error) {
        console.error('Erreur GET /api/lineups/team/:teamId/default:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la composition par défaut' });
    }
});

module.exports = router;

const { query } = require('../config/database');

const ensureProfile = async (teamId) => {
    if (!teamId) return;
    await query(
        'INSERT INTO team_profiles (team_id) VALUES ($1) ON CONFLICT (team_id) DO NOTHING',
        [teamId]
    );
};

const updateProfile = async (teamId, fields = {}) => {
    const keys = Object.keys(fields).filter((key) => fields[key] !== undefined);
    if (!teamId || keys.length === 0) return null;

    await ensureProfile(teamId);

    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = keys.map((key) => fields[key]);

    const result = await query(
        `UPDATE team_profiles
         SET ${setClause}, updated_at = NOW()
         WHERE team_id = $1
         RETURNING *`,
        [teamId, ...values]
    );

    return result.rows[0] || null;
};

const getProfile = async (teamId) => {
    if (!teamId) return null;
    const result = await query('SELECT * FROM team_profiles WHERE team_id = $1', [teamId]);
    return result.rows[0] || null;
};

module.exports = {
    ensureProfile,
    updateProfile,
    getProfile,
};

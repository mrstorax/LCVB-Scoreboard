const { Pool } = require('pg');
require('dotenv').config();

// Configuration de la connexion PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'lcvb_scoreboard',
    user: process.env.DB_USER || 'lcvb_user',
    password: process.env.DB_PASSWORD || 'lcvb_password_2024',
    max: 20, // Nombre maximum de clients dans le pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test de connexion
pool.on('connect', () => {
    console.log('✅ Connexion PostgreSQL établie');
});

pool.on('error', (err) => {
    console.error('❌ Erreur PostgreSQL:', err);
    process.exit(-1);
});

// Fonction pour tester la connexion
const testConnection = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        console.log('🕐 Heure serveur BDD:', result.rows[0].now);
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Erreur de connexion à la BDD:', error.message);
        return false;
    }
};

// Fonction helper pour exécuter des requêtes
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('📊 Requête exécutée:', { text, duration, rows: res.rowCount });
        return res;
    } catch (error) {
        console.error('❌ Erreur requête SQL:', error.message);
        throw error;
    }
};

// Fonction helper pour les transactions
const transaction = async (callback) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    pool,
    query,
    transaction,
    testConnection
};

-- LCVB Scoreboard Pro - PostgreSQL Schema
-- Base de données pour la gestion complète du club

-- ==========================================
-- TABLES UTILISATEURS & AUTHENTIFICATION
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'coach', 'operator', 'statistician')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    active BOOLEAN DEFAULT true
);

-- ==========================================
-- TABLES ÉQUIPES & JOUEURS
-- ==========================================

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Senior M', 'Senior F', 'U18 M', 'U18 F', etc.
    logo_url VARCHAR(255),
    primary_color VARCHAR(7) DEFAULT '#E91E63', -- Format hex
    secondary_color VARCHAR(7) DEFAULT '#FF69B4',
    coach_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true,
    external_source VARCHAR(50),
    external_id VARCHAR(100)
);
CREATE INDEX IF NOT EXISTS idx_teams_external ON teams(external_source, external_id);

CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position VARCHAR(50), -- 'Passeur', 'Attaquant', 'Central', 'Réceptionneur-Attaquant', 'Libéro'
    is_libero BOOLEAN DEFAULT false,
    photo_url VARCHAR(255),
    birth_date DATE,
    height INTEGER, -- en cm
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true,
    UNIQUE(team_id, number)
);

-- ==========================================
-- TABLES COMPOSITIONS D'ÉQUIPE
-- ==========================================

CREATE TABLE IF NOT EXISTS lineups (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Formation offensive', 'Formation défensive', etc.
    is_default BOOLEAN DEFAULT false,
    positions JSONB NOT NULL, -- {P1: player_id, P2: player_id, ..., P6: player_id, libero: player_id}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLES MATCHS
-- ==========================================

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    match_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    competition VARCHAR(100), -- 'Championnat', 'Coupe', 'Amical', etc.
    referee VARCHAR(100),
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),

    -- Résultats
    home_sets_won INTEGER DEFAULT 0,
    away_sets_won INTEGER DEFAULT 0,
    set_scores JSONB, -- [{home: 25, away: 23}, {home: 25, away: 20}, ...]

    -- Live streaming
    live_url VARCHAR(255), -- URL YouTube/Twitch
    replay_url VARCHAR(255),
    has_live BOOLEAN DEFAULT false,

    -- Opérateurs
    operator_id INTEGER REFERENCES users(id),
    statistician_id INTEGER REFERENCES users(id),

    -- Données complètes du match (setup, équipes, joueurs, options)
    match_data JSONB,

    -- Métadonnées
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    finished_at TIMESTAMP,
    notes TEXT
);

-- Index pour les requêtes JSONB sur match_data
CREATE INDEX IF NOT EXISTS idx_matches_match_data ON matches USING gin (match_data);

-- ==========================================
-- TABLES STATISTIQUES
-- ==========================================

CREATE TABLE IF NOT EXISTS match_stats (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,

    -- Données complètes du match (export JSON depuis l'interface)
    full_data JSONB NOT NULL,

    -- Statistiques globales précalculées
    total_rallies INTEGER,
    total_points_home INTEGER,
    total_points_away INTEGER,
    total_aces INTEGER,
    total_blocks INTEGER,
    total_digs INTEGER,

    -- Stats par set
    set_stats JSONB, -- Tableau des stats détaillées par set

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS player_match_stats (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,

    -- Services
    services_total INTEGER DEFAULT 0,
    services_aces INTEGER DEFAULT 0,
    services_faults INTEGER DEFAULT 0,

    -- Attaques
    attacks_total INTEGER DEFAULT 0,
    attacks_points INTEGER DEFAULT 0,
    attacks_blocked INTEGER DEFAULT 0,
    attacks_out INTEGER DEFAULT 0,

    -- Blocs
    blocks_total INTEGER DEFAULT 0,
    blocks_points INTEGER DEFAULT 0,

    -- Défenses
    digs_total INTEGER DEFAULT 0,
    digs_recovered INTEGER DEFAULT 0,

    -- Passes
    assists INTEGER DEFAULT 0,

    -- Réceptions (si trackées)
    receptions_total INTEGER DEFAULT 0,
    receptions_perfect INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(match_id, player_id)
);

-- ==========================================
-- TABLES SPONSORS & MÉDIAS
-- ==========================================

CREATE TABLE IF NOT EXISTS sponsors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255) NOT NULL,
    website_url VARCHAR(255),
    display_duration INTEGER DEFAULT 15, -- Secondes d'affichage
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Plus élevé = affiché plus souvent
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url VARCHAR(255),
    publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT true,
    display_on_live BOOLEAN DEFAULT false, -- Afficher pendant les lives
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLES ÉVÉNEMENTS & CALENDRIER
-- ==========================================

CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    event_type VARCHAR(50) CHECK (event_type IN ('match', 'training', 'tournament', 'meeting', 'other')),
    location VARCHAR(255),
    team_id INTEGER REFERENCES teams(id), -- NULL si événement global du club
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLES CONFIGURATION
-- ==========================================

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLES IMPORTS FFVB
-- ==========================================

CREATE TABLE IF NOT EXISTS ffvb_imports (
    id SERIAL PRIMARY KEY,
    club_code VARCHAR(20) NOT NULL,
    season VARCHAR(20),
    payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- TABLES LOGS & AUDIT
-- ==========================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL, -- 'login', 'create_match', 'update_team', etc.
    entity_type VARCHAR(50), -- 'match', 'team', 'player', etc.
    entity_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEX POUR PERFORMANCES
-- ==========================================

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_teams ON matches(home_team_id, away_team_id);
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_match_stats_match ON match_stats(match_id);
CREATE INDEX idx_player_match_stats_match ON player_match_stats(match_id);
CREATE INDEX idx_player_match_stats_player ON player_match_stats(player_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_date ON activity_logs(created_at);

-- ==========================================
-- DONNÉES INITIALES
-- ==========================================

-- Utilisateur de test
INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES
('test@test.com', '$2b$10$rZ5qJ3qK9X8LmJ4nJ3qK9X8LmJ4nJ3qK9X8LmJ4nJ3qK9X8LmJ4n', 'admin', 'Test', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Configuration par défaut
INSERT INTO settings (key, value, description) VALUES
('club_name', '"Le Crès Volley-Ball"', 'Nom du club'),
('club_logo', '"/logos/logo-lcvb.png"', 'Logo du club'),
('default_theme', '"dark"', 'Thème par défaut (dark/light)'),
('obs_config', '{"auto_sponsors": true, "sponsor_duration": 15}', 'Configuration OBS')
ON CONFLICT (key) DO NOTHING;

-- Commentaires sur les tables
COMMENT ON TABLE users IS 'Utilisateurs de la plateforme (admins, coachs, opérateurs)';
COMMENT ON TABLE teams IS 'Équipes du club';
COMMENT ON TABLE players IS 'Joueurs affiliés aux équipes';
COMMENT ON TABLE lineups IS 'Compositions d''équipe sauvegardées (7 de base)';
COMMENT ON TABLE matches IS 'Matchs programmés, en cours ou terminés';
COMMENT ON TABLE match_stats IS 'Statistiques complètes des matchs';
COMMENT ON TABLE player_match_stats IS 'Statistiques individuelles par match';
COMMENT ON TABLE sponsors IS 'Sponsors affichés pendant les lives';
COMMENT ON TABLE news IS 'Actualités du club';
COMMENT ON TABLE events IS 'Événements et calendrier';
COMMENT ON TABLE settings IS 'Paramètres globaux de l''application';
COMMENT ON TABLE activity_logs IS 'Journal d''audit des actions utilisateurs';

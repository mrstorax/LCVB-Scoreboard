-- Migration: ajout synchronisation FFVB
ALTER TABLE teams ADD COLUMN IF NOT EXISTS external_source VARCHAR(50);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS external_id VARCHAR(100);
CREATE INDEX IF NOT EXISTS idx_teams_external ON teams(external_source, external_id);

CREATE TABLE IF NOT EXISTS ffvb_imports (
    id SERIAL PRIMARY KEY,
    club_code VARCHAR(20) NOT NULL,
    season VARCHAR(20),
    payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

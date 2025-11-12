-- Migration: Ajout des colonnes persistantes pour capitaines/lineups et création de team_profiles
-- Date: 2025-11-11
-- Objectif: stocker durablement le capitaine/libéro et préparer les profils d'équipe

-- Ajouter la colonne is_captain sur players si besoin
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'players' AND column_name = 'is_captain'
    ) THEN
        ALTER TABLE players ADD COLUMN is_captain BOOLEAN DEFAULT false;
        UPDATE players SET is_captain = false WHERE is_captain IS NULL;
    END IF;
END $$;

-- Ajouter les colonnes captain/libero sur lineups
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'lineups' AND column_name = 'captain_player_id'
    ) THEN
        ALTER TABLE lineups ADD COLUMN captain_player_id INTEGER;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'lineups' AND column_name = 'libero_player_id'
    ) THEN
        ALTER TABLE lineups ADD COLUMN libero_player_id INTEGER;
    END IF;
END $$;

-- Ajouter les contraintes de clé étrangère si elles n'existent pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'lineups_captain_player_id_fkey'
    ) THEN
        ALTER TABLE lineups
        ADD CONSTRAINT lineups_captain_player_id_fkey
        FOREIGN KEY (captain_player_id) REFERENCES players(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'lineups_libero_player_id_fkey'
    ) THEN
        ALTER TABLE lineups
        ADD CONSTRAINT lineups_libero_player_id_fkey
        FOREIGN KEY (libero_player_id) REFERENCES players(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Création de la table team_profiles si besoin
CREATE TABLE IF NOT EXISTS team_profiles (
    team_id INTEGER PRIMARY KEY REFERENCES teams(id) ON DELETE CASCADE,
    captain_player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    default_lineup_id INTEGER REFERENCES lineups(id) ON DELETE SET NULL,
    default_positions JSONB,
    default_libero_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
    primary_venue TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_team_profiles_captain ON team_profiles(captain_player_id);
CREATE INDEX IF NOT EXISTS idx_team_profiles_default_lineup ON team_profiles(default_lineup_id);

WITH parsed AS (
    SELECT
        id,
        CASE
            WHEN positions ? 'captain' AND (positions->>'captain') ~ '^[0-9]+$'
                THEN (positions->>'captain')::INTEGER
            ELSE NULL
        END AS captain_id,
        CASE
            WHEN positions ? 'libero' AND (positions->>'libero') ~ '^[0-9]+$'
                THEN (positions->>'libero')::INTEGER
            ELSE NULL
        END AS libero_id
    FROM lineups
)
UPDATE lineups l
SET captain_player_id = COALESCE(p.captain_id, l.captain_player_id),
    libero_player_id = COALESCE(p.libero_id, l.libero_player_id)
FROM parsed p
WHERE l.id = p.id
  AND (p.captain_id IS NOT NULL OR p.libero_id IS NOT NULL);

-- Forcer les NULL explicites sur players.is_captain
UPDATE players
SET is_captain = COALESCE(is_captain, false);

COMMENT ON TABLE team_profiles IS 'Profil enrichi par équipe (capitaine, lineup par défaut, salle, etc.)';

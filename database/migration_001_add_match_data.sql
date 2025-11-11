-- Migration: Ajouter le champ match_data à la table matches
-- Date: 2025-01-09
-- Description: Ajout d'un champ JSONB pour stocker toutes les données détaillées du match

-- Ajouter la colonne match_data si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'matches' AND column_name = 'match_data'
    ) THEN
        ALTER TABLE matches ADD COLUMN match_data JSONB;
        RAISE NOTICE 'Colonne match_data ajoutée à la table matches';
    ELSE
        RAISE NOTICE 'La colonne match_data existe déjà';
    END IF;
END $$;

-- Créer un index pour accélérer les requêtes JSONB
CREATE INDEX IF NOT EXISTS idx_matches_match_data ON matches USING gin (match_data);

COMMENT ON COLUMN matches.match_data IS 'Données complètes du match incluant les équipes, joueurs, options, etc.';

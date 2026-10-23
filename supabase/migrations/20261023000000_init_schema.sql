-- PINT FC MVP Schema Migration
-- Migration: 20261023000000_init_schema.sql

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SEASONS
CREATE TABLE IF NOT EXISTS seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. PLAYERS
CREATE TABLE IF NOT EXISTS players (
    id UUID PRIMARY KEY, -- References auth.users.id
    squad_number INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    position TEXT NOT NULL CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
    date_of_birth DATE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    is_under_18 BOOLEAN GENERATED ALWAYS AS (date_of_birth > (CURRENT_DATE - INTERVAL '18 years')) STORED,
    guardian_name TEXT,
    guardian_email TEXT,
    guardian_consent BOOLEAN NOT NULL DEFAULT false,
    opt_in BOOLEAN NOT NULL DEFAULT false,
    consent_photo BOOLEAN NOT NULL DEFAULT true,
    consent_nationality BOOLEAN NOT NULL DEFAULT true,
    consent_stats BOOLEAN NOT NULL DEFAULT true,
    nationality TEXT,
    photo_url TEXT,
    archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. MATCHES
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    competition_type TEXT NOT NULL CHECK (competition_type IN ('league', 'friendly')),
    opponent_name TEXT NOT NULL,
    opponent_crest_url TEXT,
    venue_name TEXT NOT NULL,
    venue_timezone TEXT NOT NULL DEFAULT 'Europe/London',
    kickoff_at TIMESTAMPTZ NOT NULL,
    rsvp_cutoff_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed')),
    home_or_away TEXT NOT NULL CHECK (home_or_away IN ('home', 'away')),
    score_pintfc INTEGER CHECK (score_pintfc >= 0),
    score_opponent INTEGER CHECK (score_opponent >= 0),
    published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (rsvp_cutoff_at <= kickoff_at)
);

-- 4. RSVPS
CREATE TABLE IF NOT EXISTS rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(match_id, player_id)
);

-- 5. STANDINGS SNAPSHOTS
CREATE TABLE IF NOT EXISTS standings_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    team_name TEXT NOT NULL,
    played INTEGER NOT NULL DEFAULT 0,
    won INTEGER NOT NULL DEFAULT 0,
    drawn INTEGER NOT NULL DEFAULT 0,
    lost INTEGER NOT NULL DEFAULT 0,
    goals_for INTEGER NOT NULL DEFAULT 0,
    goals_against INTEGER NOT NULL DEFAULT 0,
    goal_difference INTEGER NOT NULL DEFAULT 0,
    points INTEGER NOT NULL DEFAULT 0,
    is_pint_fc BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. PUBLIC ISOLATION VIEWS (INVARIANT 1 ENFORCEMENT)

-- 6.1 View: Public Players (Omit all private PII, hide archived & unconsented minors)
CREATE OR REPLACE VIEW view_public_players AS
SELECT 
    p.id,
    p.squad_number,
    p.display_name,
    p.position,
    CASE WHEN p.consent_photo = true THEN p.photo_url ELSE NULL END AS photo_url,
    CASE WHEN p.consent_nationality = true THEN p.nationality ELSE NULL END AS nationality
FROM players p
WHERE p.archived = false
  AND (
      p.is_under_18 = false 
      OR (p.guardian_consent = true AND p.opt_in = true)
  );

-- 6.2 View: Public Match Results (Only published & completed matches)
CREATE OR REPLACE VIEW view_public_results AS
SELECT 
    m.id,
    m.competition_type,
    m.opponent_name,
    m.opponent_crest_url,
    m.venue_name,
    m.kickoff_at,
    m.home_or_away,
    m.score_pintfc,
    m.score_opponent,
    CASE 
        WHEN m.score_pintfc > m.score_opponent THEN 'W'
        WHEN m.score_pintfc = m.score_opponent THEN 'D'
        ELSE 'L'
    END AS outcome
FROM matches m
WHERE m.published = true 
  AND m.status = 'completed'
ORDER BY m.kickoff_at DESC;

-- 6.3 View: Season Record (Only published league matches)
CREATE OR REPLACE VIEW view_season_record AS
SELECT 
    COUNT(*)::INTEGER AS played,
    COUNT(*) FILTER (WHERE score_pintfc > score_opponent)::INTEGER AS won,
    COUNT(*) FILTER (WHERE score_pintfc = score_opponent)::INTEGER AS drawn,
    COUNT(*) FILTER (WHERE score_pintfc < score_opponent)::INTEGER AS lost,
    COALESCE(SUM(score_pintfc), 0)::INTEGER AS goals_for,
    COALESCE(SUM(score_opponent), 0)::INTEGER AS goals_against,
    COALESCE(SUM(score_pintfc) - SUM(score_opponent), 0)::INTEGER AS goal_difference
FROM matches
WHERE published = true 
  AND status = 'completed' 
  AND competition_type = 'league';

-- 7. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings_snapshots ENABLE ROW LEVEL SECURITY;

-- Players Table: Anon role CANNOT read raw table (must use view)
CREATE POLICY "Players: authenticated read self" ON players
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Players: update own consents only" ON players
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Matches Table: Public can read published or scheduled fixtures
CREATE POLICY "Matches: public read published or scheduled" ON matches
    FOR SELECT TO public
    USING (published = true OR status IN ('scheduled', 'cancelled'));

-- RSVPs Table: Insert/Update before cutoff
CREATE POLICY "RSVPs: select for authenticated players" ON rsvps
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "RSVPs: insert own rsvp before cutoff" ON rsvps
    FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() = player_id 
        AND now() < (SELECT rsvp_cutoff_at FROM matches WHERE id = match_id)
    );

CREATE POLICY "RSVPs: update own rsvp before cutoff" ON rsvps
    FOR UPDATE TO authenticated
    USING (auth.uid() = player_id)
    WITH CHECK (
        auth.uid() = player_id 
        AND now() < (SELECT rsvp_cutoff_at FROM matches WHERE id = match_id)
    );

-- Standings: Public read-only
CREATE POLICY "Standings: public read" ON standings_snapshots
    FOR SELECT TO public
    USING (true);

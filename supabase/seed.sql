-- PINT FC MVP Database Seed SQL
-- Generates seasons, 40 active players, 1 archived player, matches, and standings

-- Season
INSERT INTO seasons (id, name, start_date, end_date, is_current)
VALUES ('00000000-0000-4000-8000-000000000001', '2026/27 Winter League', '2026-09-01', '2027-05-31', true)
ON CONFLICT (id) DO NOTHING;

-- Players (Subset of the 40 active + 1 archived)
INSERT INTO players (id, squad_number, full_name, display_name, position, date_of_birth, email, phone, guardian_name, guardian_email, guardian_consent, opt_in, consent_photo, consent_nationality, consent_stats, nationality, photo_url, archived)
VALUES 
('11111111-0000-4000-8000-000000000001', 1, 'Arthur Pendelton', 'A. Pendelton', 'goalkeeper', '1998-04-12', 'player1@pintfc.test', '+447700900001', null, null, false, false, true, true, true, 'ENG', '/assets/players/p1.webp', false),
('11111111-0000-4000-8000-000000000002', 13, 'Mateo Rossi', 'M. Rossi', 'goalkeeper', '2001-08-23', 'player2@pintfc.test', '+447700900002', null, null, false, false, false, true, true, 'ITA', '/assets/players/p2.webp', false),
('11111111-0000-4000-8000-000000000016', 24, 'Toby Young', 'T. Young', 'defender', '2009-02-10', 'player16@pintfc.test', '+447700900016', 'Sarah Young', 'sarah.young@example.test', true, true, true, true, true, 'ENG', '/assets/players/p16.webp', false),
('11111111-0000-4000-8000-000000000020', 26, 'Leo Evans', 'L. Evans', 'midfielder', '2009-06-15', 'player20@pintfc.test', '+447700900020', 'Mark Evans', 'mark.evans@example.test', false, false, false, false, false, 'ENG', '/assets/players/p20.webp', false),
('99999999-0000-4000-8000-000000000099', 99, 'Archie Veldt', 'A. Veldt', 'forward', '1995-01-01', 'archived_player@pintfc.test', '+447700999999', null, null, false, false, true, true, true, 'NED', '/assets/players/p99.webp', true)
ON CONFLICT (id) DO NOTHING;

-- Standings Snapshot
INSERT INTO standings_snapshots (id, season_id, rank, team_name, played, won, drawn, lost, goals_for, goals_against, goal_difference, points, is_pint_fc)
VALUES
('33333333-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', 1, 'Victoria Strollers', 4, 3, 1, 0, 8, 3, 5, 10, false),
('33333333-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 2, 'PINT FC', 4, 2, 1, 1, 10, 5, 5, 7, true),
('33333333-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000001', 3, 'Crown Rovers', 4, 2, 0, 2, 6, 7, -1, 6, false),
('33333333-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000001', 4, 'Anchor Athletic', 4, 1, 1, 2, 5, 7, -2, 4, false),
('33333333-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000001', 5, 'Red Lion FC', 4, 0, 1, 3, 3, 10, -7, 1, false)
ON CONFLICT (id) DO NOTHING;

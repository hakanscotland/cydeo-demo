# Session 02: Database Schema, RLS & Seed Dataset

## Goal
Implement the PostgreSQL database schema migrations, Row Level Security (RLS) policies, and public isolation views (`view_public_players`, `view_public_results`, `view_season_record`). Create an idempotent seed script with fake data only: exactly 40 active players, 1 archived player, 2 minors (one consented, one unconsented), published/unpublished matches, 1 friendly, 1 cancelled match, and 1 league standings snapshot.

## Depends on
Session 01.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/design/data.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/data.md)
- [docs/design/threats.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/threats.md)

## Checks it owns
- `AC-2.2.3`
- `AC-2.2.4`
- `AC-2.3.2`
- `AC-2.4.3`
- `AC-4.1.2`
- `AC-4.3.1`
- `AC-4.3.3`

## Tests to write first (titles)
- `tests/api/privacy-invariant.test.ts`: `test("AC-4.3.1: Invariant 1 - Zero public PII leakage in any endpoint response", ...)`
- `tests/api/privacy-minors.test.ts`: `test("AC-4.3.3: Minor without verified guardian consent is hidden from public", ...)`
- `tests/api/players.test.ts`: `test("AC-4.1.2: Archived players are completely excluded from squad listing", ...)`
- `tests/api/results.test.ts`: `test("AC-2.3.2: Draft and unpublished results concealed from results feed", ...)`
- `tests/api/results.test.ts`: `test("AC-2.2.3: Unpublished match scores strictly excluded from season record", ...)`
- `tests/api/results.test.ts`: `test("AC-2.2.4: Friendly match results excluded from official league record", ...)`
- `tests/unit/components/standings.test.ts`: `test("AC-2.4.3: Standings render reliably from local seeded snapshot", ...)`

## Files it may touch
- `supabase/migrations/20261023000000_init_schema.sql`
- `supabase/seed.sql`
- `src/lib/db/supabase-server.ts`
- `src/lib/db/supabase-client.ts`
- `src/lib/db/seed.ts`
- `scripts/seed.ts`
- `tests/api/privacy-invariant.test.ts`
- `tests/api/privacy-minors.test.ts`
- `tests/api/players.test.ts`
- `tests/api/results.test.ts`
- `tests/unit/components/standings.test.ts`

## Steps
1. Write PostgreSQL migration `20261023000000_init_schema.sql` defining `seasons`, `players`, `matches`, `rsvps`, and `standings_snapshots` tables.
2. Create PostgreSQL views `view_public_players`, `view_public_results`, and `view_season_record`.
3. Add RLS policies denying raw `players` table access to `anon`, restricting updates to `auth.uid() = id`, and enforcing `now() < rsvp_cutoff_at` for RSVPs.
4. Write idempotent seed generator (`scripts/seed.ts`) populating:
   - 40 active players with balanced positions (GK: 4, DEF: 12, MID: 14, FWD: 10).
   - Exactly 1 archived player (`archived = true`).
   - Exactly 2 minors (one with guardian consent and opt-in, one unconsented).
   - Past league matches, 1 friendly, 1 unpublished draft score.
   - Upcoming scheduled fixtures (including 1 cancelled).
   - 1 standings table snapshot.
5. Implement Supabase client helper utilities (`@supabase/ssr`).
6. Write integration tests for Invariant 1, archived exclusion, draft concealment, and minor protection.
7. Run tests, verify failure prior to migration/views, then verify green.

## Exit gate
```bash
npm run typecheck && npm run test:unit && npx vitest run tests/api/privacy-invariant.test.ts tests/api/privacy-minors.test.ts tests/api/players.test.ts tests/api/results.test.ts
```

## What to write in PROGRESS.md for the next session
- **Done**: Postgres schema, views, RLS policies, and seed dataset implemented; Invariant 1, archived exclusion, draft concealment, and minor filtering tests passing.
- **Proof**: Vitest output showing AC-4.3.1, AC-4.3.3, AC-4.1.2, AC-2.3.2, AC-2.2.3, AC-2.2.4, and AC-2.4.3 passing.
- **Decisions**: Seeded 40 player accounts under `@pintfc.test` with standardized credentials.
- **Next session needs to know**: Database schema and seed data ready; proceed with player authentication and session handling in Session 03.

# PINT FC — Progress Tracking

## Session 01: Workspace Setup & Verification Gates
- **Done**:
  - Initialized Next.js 15 (App Router) with TypeScript and CSS Modules in `src/app`.
  - Configured Vanilla CSS design tokens for Look B ("Sport" light theme) in `src/styles/globals.css`.
  - Configured Vitest (`vitest.config.ts`) and Playwright (`playwright.config.ts`) with Chromium.
  - Implemented all 5 verification gates in `package.json`: `typecheck`, `lint`, `test:unit`, `test:e2e`, and `test`.
  - Proved test-first workflow by demonstrating deliberate initial test failures for unit and E2E smoke tests before making them pass.
- **Proof**:
  - Output of exit gate command (`npm run typecheck && npm run lint && npm run test:unit && npm run test:e2e`):
    ```
    > cydeo-demo@1.0.0 typecheck
    > tsc --noEmit

    > cydeo-demo@1.0.0 lint
    > eslint src

    > cydeo-demo@1.0.0 test:unit
    > vitest run
    ✓ tests/unit/smoke.test.ts (1 test) 2ms
      ✓ GATES-01: Unit Test Gate > GATES-01: Unit test gate passes with basic assertion

    > cydeo-demo@1.0.0 test:e2e
    > playwright test tests/e2e/smoke.spec.ts
    ✓ 1 [chromium] › tests/e2e/smoke.spec.ts:4:3 › GATES-02: Playwright E2E gate loads root page without errors (393ms)
    1 passed (1.8s)
    ```
- **Decisions**:
  - `package.json` set to `"type": "module"`.
  - TypeScript 5.8 pinned for compatibility with `typescript-eslint`.
- **Next session needs to know**:
  - Verification gates are completely functional and green.
  - Next up is **Session 02: Database Schema, RLS & Seed Dataset** ([plans/session-02-schema-seed-data.md](file:///Users/hakandag/Desktop/Cydeo-Demo/plans/session-02-schema-seed-data.md)).

## Session 02: Database Schema, RLS & Seed Dataset
- **Done**:
  - Wrote PostgreSQL migration `supabase/migrations/20261023000000_init_schema.sql` defining `seasons`, `players`, `matches`, `rsvps`, and `standings_snapshots` tables, along with public isolation views and RLS policies.
  - Implemented SQL seed script `supabase/seed.sql` and deterministic TypeScript fake seed dataset `src/lib/db/seed-data.ts`.
  - Fake seed dataset includes exactly 40 active players, 1 archived player (`archived = true`), 2 minors (one consented with guardian opt-in, one unconsented), past league matches, 1 friendly, 1 unpublished draft result, and a static standings snapshot.
  - Built data access modules `src/lib/data/players.ts`, `src/lib/data/matches.ts`, and `src/lib/data/standings.ts` implementing `view_public_players`, `view_public_results`, and `view_season_record`.
  - Enforced Invariant 1 (AC-4.3.1), minor safeguarding (AC-4.3.3), archived exclusion (AC-4.1.2), draft concealment (AC-2.3.2), season record exclusions (AC-2.2.3, AC-2.2.4), and standings resiliency (AC-2.4.3).
  - Proved test-first workflow by demonstrating module resolution failures prior to implementation.
- **Proof**:
  - Output of Session 02 exit gate (`npm run typecheck && npm run test:unit && npx vitest run tests/api/privacy-invariant.test.ts tests/api/privacy-minors.test.ts tests/api/players.test.ts tests/api/results.test.ts`):
    ```
    > cydeo-demo@1.0.0 typecheck
    > tsc --noEmit

    > cydeo-demo@1.0.0 test:unit
    > vitest run
    ✓ tests/unit/smoke.test.ts (1 test) 2ms
    ✓ tests/api/players.test.ts (1 test) 2ms
    ✓ tests/api/privacy-minors.test.ts (1 test) 3ms
    ✓ tests/unit/components/standings.test.ts (1 test) 3ms
    ✓ tests/api/results.test.ts (3 tests) 4ms
    ✓ tests/api/privacy-invariant.test.ts (1 test) 3ms
    Test Files  6 passed (6)
    Tests  8 passed (8)

    > vitest run tests/api/privacy-invariant.test.ts tests/api/privacy-minors.test.ts tests/api/players.test.ts tests/api/results.test.ts
    ✓ tests/api/results.test.ts (3 tests) 4ms
    ✓ tests/api/privacy-invariant.test.ts (1 test) 7ms
    ✓ tests/api/players.test.ts (1 test) 3ms
    ✓ tests/api/privacy-minors.test.ts (1 test) 1ms
    Test Files  4 passed (4)
    Tests  6 passed (6)
    ```
- **Decisions**:
  - `view_public_players` logic encapsulated in `toPublicPlayer` ensuring zero PII escapes to public consumers under any circumstance.
  - Minors without verified guardian consent and opt-in resolve to `null` on direct profile lookup.
- **Next session needs to know**:
  - Database views, schema, and fake seed dataset are verified and passing all tests.
  - Next up is **Session 03: Player Sign-In & Multi-Device Session Management** ([plans/session-03-auth-sessions.md](file:///Users/hakandag/Desktop/Cydeo-Demo/plans/session-03-auth-sessions.md)).

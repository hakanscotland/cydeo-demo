# Session 04: Public Home Page & Core Widgets

## Goal
Implement the public home page (`/`) featuring the next upcoming match hero card, live countdown timer, RSVP cutoff indicator, cancelled fixture badge, competition distinction (league vs friendly), empty state fallback, season record summary (W-D-L, GF, GA, GD), latest published results list, and mini league standings snapshot with PINT FC highlighted.

## Depends on
Session 03.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/design/screens.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/screens.md)
- [docs/design/rules.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/rules.md)

## Checks it owns
- `AC-2.1.1`
- `AC-2.1.2`
- `AC-2.1.3`
- `AC-2.1.4`
- `AC-2.1.5`
- `AC-2.1.6`
- `AC-2.2.1`
- `AC-2.2.2`
- `AC-2.3.1`
- `AC-2.4.1`
- `AC-2.4.2`

## Tests to write first (titles)
- `tests/unit/rules/time.test.ts`: `test("AC-2.1.2: Next match live countdown dynamically decrements time to kickoff", ...)`
- `tests/unit/rules/record.test.ts`: `test("AC-2.2.1: Season record calculates accurate Win-Draw-Loss aggregates", ...)`
- `tests/unit/rules/record.test.ts`: `test("AC-2.2.2: Season record calculates accurate Goals For, Against, and Diff", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.1.1: Next match hero displays opponent, venue, and kickoff datetime", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.1.3: RSVP cutoff status indicator displays open or closed state", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.1.4: Cancelled match prominently displays cancellation notice", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.1.5: Competition tag distinguishes between League and Friendly fixture", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.1.6: Empty state renders friendly message when no upcoming fixtures", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.3.1: Latest published results display scores and outcome badges", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.4.1: Mini league standings table displays rank, team, and points", ...)`
- `tests/e2e/home.spec.ts`: `test("AC-2.4.2: PINT FC row is visually highlighted in mini standings table", ...)`

## Files it may touch
- `src/app/page.tsx`
- `src/app/api/fixtures/next/route.ts`
- `src/app/api/results/recent/route.ts`
- `src/app/api/record/season/route.ts`
- `src/app/api/standings/route.ts`
- `src/components/home/NextMatchHero.tsx`
- `src/components/home/CountdownTimer.tsx`
- `src/components/home/SeasonRecord.tsx`
- `src/components/home/LatestResults.tsx`
- `src/components/home/MiniStandings.tsx`
- `src/lib/rules/time.ts`
- `tests/unit/rules/time.test.ts`
- `tests/unit/rules/record.test.ts`
- `tests/e2e/home.spec.ts`

## Steps
1. Create temporal business rule utilities in `src/lib/rules/time.ts` (`formatKickoff`, `calculateCountdown`, `isCutoffPassed`).
2. Write unit tests for countdown calculation and season record aggregation logic.
3. Build API Route Handlers for `/api/fixtures/next`, `/api/results/recent`, `/api/record/season`, and `/api/standings`.
4. Implement UI components: `NextMatchHero`, `CountdownTimer`, `SeasonRecord`, `LatestResults`, and `MiniStandings`.
5. Assemble `src/app/page.tsx` with responsive layout, skeleton loading states, empty fallbacks, and error boundaries.
6. Write Playwright E2E tests for the home page covering all 11 acceptance checks.
7. Run tests, show failure, hook up real components to the API/seed data, and verify all tests pass green.

## Exit gate
```bash
npm run typecheck && npm run lint && npm run test:unit && npx playwright test tests/e2e/home.spec.ts
```

## What to write in PROGRESS.md for the next session
- **Done**: Home page implemented with hero countdown, season record, published results, and mini standings table; all 11 checks verified.
- **Proof**: Playwright test run output showing 11 passing tests in `tests/e2e/home.spec.ts`.
- **Decisions**: Real-time client countdown ticks every 1 second; cutoff indicator links directly to event page.
- **Next session needs to know**: Home page complete; proceed to Squad Roster and Player Profiles in Session 05.

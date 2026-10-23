# Session 06: Going / Not Going, RSVP Cutoff & Event Projector View

## Goal
Implement the Match Event page (`/fixtures/[id]`) with high-visibility attendance counters (Going, Maybe, Not Going) suitable for classroom projection, player RSVP submission and updates before cutoff, strict cutoff rejection ("RSVP closed"), teammate attendance listing, teammate reason confidentiality, and 10-second live polling (updating counts within 15 seconds).

## Depends on
Session 05.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/design/architecture.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/architecture.md)
- [docs/design/data.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/data.md)
- [docs/design/api.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/api.md)
- [docs/design/screens.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/screens.md)

## Checks it owns
- `AC-3.3.1`
- `AC-3.3.2`
- `AC-3.3.4`
- `AC-3.3.5`
- `AC-3.3.6`
- `AC-3.4.1`
- `AC-3.4.3`

## Tests to write first (titles)
- `tests/api/rsvp-cutoff.test.ts`: `test("AC-3.3.4: RSVP mutation after cutoff rejected with 403 and closed badge", ...)`
- `tests/api/rsvp-privacy.test.ts`: `test("AC-3.3.6: Teammate private RSVP reasons hidden from other players", ...)`
- `tests/e2e/rsvp.spec.ts`: `test("AC-3.3.1: Authenticated player submits Going/Maybe/Not Going attendance", ...)`
- `tests/e2e/rsvp.spec.ts`: `test("AC-3.3.2: Player updates RSVP choice prior to cutoff timestamp", ...)`
- `tests/e2e/rsvp.spec.ts`: `test("AC-3.3.5: Authenticated player views teammates attendance roster", ...)`
- `tests/e2e/event-projector.spec.ts`: `test("AC-3.4.1: Event page renders high-visibility attendance counts & roster", ...)`
- `tests/e2e/live-sync.spec.ts`: `test("AC-3.4.3: Open event page reflects count change within 15 seconds", ...)`

## Files it may touch
- `src/app/fixtures/[id]/page.tsx`
- `src/app/api/fixtures/[id]/route.ts`
- `src/app/api/fixtures/[id]/rsvp/route.ts`
- `src/app/api/fixtures/[id]/counts/route.ts`
- `src/components/fixtures/ScoreboardCounters.tsx`
- `src/components/fixtures/RsvpActionBox.tsx`
- `src/components/fixtures/AttendeeRoster.tsx`
- `src/hooks/useAttendancePolling.ts`
- `tests/api/rsvp-cutoff.test.ts`
- `tests/api/rsvp-privacy.test.ts`
- `tests/e2e/rsvp.spec.ts`
- `tests/e2e/event-projector.spec.ts`
- `tests/e2e/live-sync.spec.ts`

## Steps
1. Build API Route Handlers:
   - `GET /api/fixtures/[id]` returning match detail, attendee statuses (without teammate notes), and current user's RSVP.
   - `POST /api/fixtures/[id]/rsvp` with strict cutoff validation returning `403 CUTOFF_PASSED` if `now() >= cutoff`.
   - `GET /api/fixtures/[id]/counts` returning lightweight counts object.
2. Implement `useAttendancePolling` hook triggering every 10 seconds while tab is active and pausing when `document.visibilityState === 'hidden'`.
3. Construct the Event Page at `/fixtures/[id]` featuring high-contrast scoreboard counts, interactive RSVP action box, and attendee roster.
4. Implement client cutoff state transition ("RSVP Closed" badge).
5. Write integration and E2E tests for RSVP submission, cutoff rejection, reason confidentiality, and 15-second live count sync between two browser contexts.
6. Run tests to observe failure, implement components, and run tests to green.

## Exit gate
```bash
npm run typecheck && npm run lint && npm run test:unit && npx vitest run tests/api/rsvp-cutoff.test.ts tests/api/rsvp-privacy.test.ts && npx playwright test tests/e2e/rsvp.spec.ts tests/e2e/event-projector.spec.ts tests/e2e/live-sync.spec.ts
```

## What to write in PROGRESS.md for the next session
- **Done**: RSVP submission, cutoff locking, teammate reason confidentiality, projector view, and 15-second live polling complete.
- **Proof**: Vitest and Playwright output confirming passing tests for all 7 checks (AC-3.3.1, AC-3.3.2, AC-3.3.4, AC-3.3.5, AC-3.3.6, AC-3.4.1, AC-3.4.3).
- **Decisions**: Tab-visibility polling hook ensures zero resource waste on inactive tabs.
- **Next session needs to know**: Core MVP functional checks complete; proceed to Quality Gates (WCAG AA contrast & 320px viewport) in Session 07.

# Session 05: Squad Directory, Player Profiles & Privacy Toggles

## Goal
Implement the positional squad directory (`/squad`), individual player profile pages (`/squad/[id]`) showing only consented fields, clean 404 page for archived or non-existent players, and the authenticated self-service privacy preference settings page (`/profile/privacy`) with immediate public reflection.

## Depends on
Session 04.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/design/data.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/data.md)
- [docs/design/api.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/api.md)
- [docs/design/screens.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/screens.md)

## Checks it owns
- `AC-4.1.1`
- `AC-4.1.3`
- `AC-4.2.1`
- `AC-4.2.2`
- `AC-4.3.2`
- `AC-4.3.4`

## Tests to write first (titles)
- `tests/e2e/squad.spec.ts`: `test("AC-4.1.1: Squad roster groups players by GK, DEF, MID, and FWD", ...)`
- `tests/e2e/squad.spec.ts`: `test("AC-4.1.3: Squad cards display shirt number, name, and position", ...)`
- `tests/e2e/profile.spec.ts`: `test("AC-4.2.1: Player profile loads permitted biographical info and photo", ...)`
- `tests/e2e/profile.spec.ts`: `test("AC-4.2.2: Profile query for invalid or archived player returns 404", ...)`
- `tests/e2e/privacy.spec.ts`: `test("AC-4.3.2: Granular consent toggles suppress unconsented photo/nationality", ...)`
- `tests/e2e/privacy.spec.ts`: `test("AC-4.3.4: Player updates privacy preferences and updates reflect immediately", ...)`

## Files it may touch
- `src/app/squad/page.tsx`
- `src/app/squad/[id]/page.tsx`
- `src/app/profile/privacy/page.tsx`
- `src/app/api/players/route.ts`
- `src/app/api/players/[id]/route.ts`
- `src/app/api/me/privacy/route.ts`
- `src/components/squad/PlayerCard.tsx`
- `src/components/squad/PositionalGroup.tsx`
- `src/components/profile/PrivacySettingsForm.tsx`
- `src/lib/rules/privacy.ts`
- `tests/e2e/squad.spec.ts`
- `tests/e2e/profile.spec.ts`
- `tests/e2e/privacy.spec.ts`

## Steps
1. Implement privacy sanitization utilities in `src/lib/rules/privacy.ts`.
2. Create API Route Handlers `/api/players`, `/api/players/[id]`, and `/api/me/privacy`.
3. Build the `/squad` page grouping players into Goalkeepers, Defenders, Midfielders, and Forwards.
4. Build individual profile pages `/squad/[id]` rendering permitted bio data and returning 404 for invalid/archived IDs.
5. Build the `/profile/privacy` settings page with accessible toggle switches for photo, nationality, and stats consent.
6. Write Playwright E2E tests for squad grouping, profile rendering, 404 handling, and live consent toggling.
7. Run tests, show failure, connect frontend to API, and verify tests pass green.

## Exit gate
```bash
npm run typecheck && npm run lint && npm run test:unit && npx playwright test tests/e2e/squad.spec.ts tests/e2e/profile.spec.ts tests/e2e/privacy.spec.ts
```

## What to write in PROGRESS.md for the next session
- **Done**: Squad directory, player profiles, and privacy settings implemented and verified against all 6 checks.
- **Proof**: Playwright test output showing 6 passing tests across `squad.spec.ts`, `profile.spec.ts`, and `privacy.spec.ts`.
- **Decisions**: Profile photos fall back to neutral silhouette svg if consent_photo is false or unseeded.
- **Next session needs to know**: Squad and profiles complete; ready to build the RSVP workflow and Event projector page in Session 06.

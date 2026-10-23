# Session 08: Live Class Demo & Production Release

> **Notice**: This session is marked **"live in class"**.

## Goal
Verify the live class demo match countdown and RSVP cutoff transition in real-time during class, perform full end-to-end regression across all 38 acceptance checks and 2 quality gates, present screenshots of every page to the product owner for visual review, and execute the final production deployment to Vercel and Supabase upon the PO's explicit "yes".

## Depends on
Session 07.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/REQUIREMENTS.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/REQUIREMENTS.md)
- [docs/design/test-map.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/test-map.md)

## Checks it owns
None (Live verification and deployment session).

## Tests to write first (titles)
- `tests/e2e/full-regression.spec.ts`: `test("FULL-REGRESSION: All 38 acceptance checks and 2 quality gates pass end-to-end", ...)`

## Files it may touch
- `scripts/demo-match-setup.ts`
- `tests/e2e/full-regression.spec.ts`
- `PROGRESS.md`

## Steps
1. Configure the class demo fixture cutoff time to expire live during the demonstration (e.g. 15 minutes into class).
2. Project the Event Page (`/fixtures/[id]`) on the class screen; demonstrate active 10s polling as students submit Going / Maybe / Not Going from their devices.
3. Observe live transition from "RSVP Open" to "RSVP Closed" across all screens without page reload.
4. Execute the comprehensive regression test suite covering all 38 acceptance checks and 2 quality gates.
5. Capture and generate visual screenshots of all 6 MVP screens for the Product Owner's review.
6. **STOP & ASK**: Request the Product Owner's explicit "yes" before deploying anything to production.
7. Upon receiving "yes", trigger production deployment to Vercel (`vercel deploy --prod --token "$VERCEL_TOKEN"`) and sync production Supabase instance.

## Exit gate
```bash
npm run typecheck && npm run lint && npm run test:unit && npx playwright test
```

## What to write in PROGRESS.md for the next session
- **Done**: Live class demo successful; full regression suite passing (all 38 acceptance checks + 2 quality gates green); production deployment executed with PO approval.
- **Proof**: Terminal output showing 100% test pass rate and live production URL.
- **Decisions**: MVP scope delivered in full.
- **Next session needs to know**: Project successfully released.

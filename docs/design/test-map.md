# PINT FC — Test Verification Map

> **Document**: `docs/design/test-map.md`  
> **Status**: Design Proposal (Pending PO Approval)

---

## 1. Testing Pyramid & Strategy

The PINT FC test strategy maps every acceptance check to its primary and secondary testing layers:
1. **Database Tests (DB)**: PostgreSQL RLS policies, trigger constraints, and public views tested via direct SQL assertions or pgTAP.
2. **Unit Tests (Unit)**: Fast, deterministic tests for business rules (time, cutoff calculation, privacy sanitization, permissions).
3. **API Integration Tests (API)**: Next.js Route Handler tests verifying HTTP status codes, headers, cookies, and payload contracts.
4. **End-to-End Tests (E2E)**: Playwright browser tests verifying full user journeys on desktop and mobile viewports.

Every test title in the codebase **MUST begin with its check ID** (e.g. `test("AC-1.1.1: ...")`).

---

## 2. Complete Test Map (38 In-Scope Checks + 2 Quality Gates)

| Check ID | Area | Test Level | Test Suite File | Canonical Test Title |
| :--- | :--- | :--- | :--- | :--- |
| **`AC-1.1.1`** | Sign-In | API + E2E | `tests/e2e/auth.spec.ts` | `AC-1.1.1: Player signs in with valid credentials and establishes session` |
| **`AC-1.1.3`** | Sign-In | API + E2E | `tests/e2e/auth.spec.ts` | `AC-1.1.3: Sign in fails with invalid credentials displaying error` |
| **`AC-1.1.4`** | Sign-In | E2E | `tests/e2e/auth.spec.ts` | `AC-1.1.4: Player signs out of current device session` |
| **`AC-1.6.1`** | Sessions | E2E | `tests/e2e/auth.spec.ts` | `AC-1.6.1: Active player session persists across page reload and navigation` |
| **`AC-1.6.2`** | Sessions | API + E2E | `tests/e2e/auth.spec.ts` | `AC-1.6.2: Sign out of all devices invalidates other active sessions` |
| **`AC-1.6.3`** | Sessions | API + E2E | `tests/e2e/auth.spec.ts` | `AC-1.6.3: Unauthenticated user redirected when attempting protected action` |
| **`AC-1.6.4`** | Sessions | API + Unit | `tests/unit/rules/errors.test.ts` | `AC-1.6.4: Gracefully handles expired session with 401 redirect` |
| **`AC-2.1.1`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.1.1: Next match hero displays opponent, venue, and kickoff datetime` |
| **`AC-2.1.2`** | Home | Unit + E2E | `tests/unit/rules/time.test.ts` | `AC-2.1.2: Next match live countdown dynamically decrements time to kickoff` |
| **`AC-2.1.3`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.1.3: RSVP cutoff status indicator displays open or closed state` |
| **`AC-2.1.4`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.1.4: Cancelled match prominently displays cancellation notice` |
| **`AC-2.1.5`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.1.5: Competition tag distinguishes between League and Friendly fixture` |
| **`AC-2.1.6`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.1.6: Empty state renders friendly message when no upcoming fixtures` |
| **`AC-2.2.1`** | Home | DB + Unit | `tests/unit/rules/record.test.ts` | `AC-2.2.1: Season record calculates accurate Win-Draw-Loss aggregates` |
| **`AC-2.2.2`** | Home | DB + Unit | `tests/unit/rules/record.test.ts` | `AC-2.2.2: Season record calculates accurate Goals For, Against, and Diff` |
| **`AC-2.2.3`** | Home | DB + API | `tests/api/results.test.ts` | `AC-2.2.3: Unpublished match scores strictly excluded from season record` |
| **`AC-2.2.4`** | Home | DB + API | `tests/api/results.test.ts` | `AC-2.2.4: Friendly match results excluded from official league record` |
| **`AC-2.3.1`** | Home | API + E2E | `tests/e2e/home.spec.ts` | `AC-2.3.1: Latest published results display scores and outcome badges` |
| **`AC-2.3.2`** | Home | DB + API | `tests/api/results.test.ts` | `AC-2.3.2: Draft and unpublished results concealed from results feed` |
| **`AC-2.4.1`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.4.1: Mini league standings table displays rank, team, and points` |
| **`AC-2.4.2`** | Home | Unit + E2E | `tests/e2e/home.spec.ts` | `AC-2.4.2: PINT FC row is visually highlighted in mini standings table` |
| **`AC-2.4.3`** | Home | Unit + E2E | `tests/unit/components/standings.test.ts`| `AC-2.4.3: Standings render reliably from local seeded snapshot` |
| **`AC-4.1.1`** | Squad | API + E2E | `tests/e2e/squad.spec.ts` | `AC-4.1.1: Squad roster groups players by GK, DEF, MID, and FWD` |
| **`AC-4.1.2`** | Squad | DB + API + E2E | `tests/api/players.test.ts` | `AC-4.1.2: Archived players are completely excluded from squad listing` |
| **`AC-4.1.3`** | Squad | Unit + E2E | `tests/e2e/squad.spec.ts` | `AC-4.1.3: Squad cards display shirt number, name, and position` |
| **`AC-4.2.1`** | Profiles | API + E2E | `tests/e2e/profile.spec.ts` | `AC-4.2.1: Player profile loads permitted biographical info and photo` |
| **`AC-4.2.2`** | Profiles | API + E2E | `tests/e2e/profile.spec.ts` | `AC-4.2.2: Profile query for invalid or archived player returns 404` |
| **`AC-4.3.1`** | Privacy | DB + API + E2E | `tests/api/privacy-invariant.test.ts` | `AC-4.3.1: Invariant 1 - Zero public PII leakage in any endpoint response` |
| **`AC-4.3.2`** | Privacy | DB + API + E2E | `tests/e2e/privacy.spec.ts` | `AC-4.3.2: Granular consent toggles suppress unconsented photo/nationality` |
| **`AC-4.3.3`** | Privacy | DB + API + E2E | `tests/api/privacy-minors.test.ts` | `AC-4.3.3: Minor without verified guardian consent is hidden from public` |
| **`AC-4.3.4`** | Privacy | DB + API + E2E | `tests/e2e/privacy.spec.ts` | `AC-4.3.4: Player updates privacy preferences and updates reflect immediately` |
| **`AC-3.3.1`** | RSVP | DB + API + E2E | `tests/e2e/rsvp.spec.ts` | `AC-3.3.1: Authenticated player submits Going/Maybe/Not Going attendance` |
| **`AC-3.3.2`** | RSVP | DB + API + E2E | `tests/e2e/rsvp.spec.ts` | `AC-3.3.2: Player updates RSVP choice prior to cutoff timestamp` |
| **`AC-3.3.4`** | RSVP | DB + API + E2E | `tests/api/rsvp-cutoff.test.ts` | `AC-3.3.4: RSVP mutation after cutoff rejected with 403 and closed badge` |
| **`AC-3.3.5`** | RSVP | API + E2E | `tests/e2e/rsvp.spec.ts` | `AC-3.3.5: Authenticated player views teammates attendance roster` |
| **`AC-3.3.6`** | RSVP | DB + API + E2E | `tests/api/rsvp-privacy.test.ts` | `AC-3.3.6: Teammate private RSVP reasons hidden from other players` |
| **`AC-3.4.1`** | Event Page | E2E | `tests/e2e/event-projector.spec.ts`| `AC-3.4.1: Event page renders high-visibility attendance counts & roster` |
| **`AC-3.4.3`** | Event Page | E2E | `tests/e2e/live-sync.spec.ts` | `AC-3.4.3: Open event page reflects count change within 15 seconds` |
| **`AC-5.2`** | Quality Gate | E2E (Axe) | `tests/e2e/a11y-contrast.spec.ts` | `AC-5.2: All pages meet WCAG AA color contrast ratio thresholds` |
| **`AC-5.4`** | Quality Gate | E2E (Viewport) | `tests/e2e/viewport-320px.spec.ts` | `AC-5.4: All pages render at 320px viewport without horizontal scrolling` |

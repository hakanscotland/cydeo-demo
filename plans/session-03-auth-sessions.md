# Session 03: Player Sign-In & Multi-Device Session Management

## Goal
Implement player authentication using Supabase Auth (`@supabase/ssr`), session persistence across page loads/navigation, login UI with error messages, single-device sign-out, global multi-device sign-out ("Sign out of all devices"), protected route redirection, and graceful session expiration handling.

## Depends on
Session 02.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/design/architecture.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/architecture.md)
- [docs/design/api.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/api.md)
- [docs/design/screens.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/screens.md)

## Checks it owns
- `AC-1.1.1`
- `AC-1.1.3`
- `AC-1.1.4`
- `AC-1.6.1`
- `AC-1.6.2`
- `AC-1.6.3`
- `AC-1.6.4`

## Tests to write first (titles)
- `tests/e2e/auth.spec.ts`: `test("AC-1.1.1: Player signs in with valid credentials and establishes session", ...)`
- `tests/e2e/auth.spec.ts`: `test("AC-1.1.3: Sign in fails with invalid credentials displaying error", ...)`
- `tests/e2e/auth.spec.ts`: `test("AC-1.1.4: Player signs out of current device session", ...)`
- `tests/e2e/auth.spec.ts`: `test("AC-1.6.1: Active player session persists across page reload and navigation", ...)`
- `tests/e2e/auth.spec.ts`: `test("AC-1.6.2: Sign out of all devices invalidates other active sessions", ...)`
- `tests/e2e/auth.spec.ts`: `test("AC-1.6.3: Unauthenticated user redirected when attempting protected action", ...)`
- `tests/unit/rules/errors.test.ts`: `test("AC-1.6.4: Gracefully handles expired session with 401 redirect", ...)`

## Files it may touch
- `src/app/login/page.tsx`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/logout-all/route.ts`
- `src/app/api/me/route.ts`
- `src/middleware.ts`
- `src/components/auth/LoginForm.tsx`
- `src/components/layout/Header.tsx`
- `src/lib/auth/session.ts`
- `tests/e2e/auth.spec.ts`
- `tests/unit/rules/errors.test.ts`

## Steps
1. Write API routes `/api/auth/login`, `/api/auth/logout`, `/api/auth/logout-all`, and `/api/me`.
2. Configure Next.js `middleware.ts` for session refreshing and route protection (`/profile/*`).
3. Build the `/login` page with accessible email/password inputs, error banner, and dev player quick-select (for preview/dev environments).
4. Update the site header to reflect authenticated state (player name and sign out action).
5. Implement global session revocation via `supabase.auth.signOut({ scope: 'global' })`.
6. Write automated Playwright tests for sign-in success, invalid credential errors, sign-out, reload persistence, multi-device invalidation, and unauthorized redirection.
7. Run tests, observe failure, wire UI/logic, and run tests to green.

## Exit gate
```bash
npm run typecheck && npm run lint && npm run test:unit && npx playwright test tests/e2e/auth.spec.ts
```

## What to write in PROGRESS.md for the next session
- **Done**: Authentication system complete with cookie sessions, login UI, error states, and multi-device signout.
- **Proof**: Playwright output confirming passing tests for AC-1.1.1, AC-1.1.3, AC-1.1.4, AC-1.6.1, AC-1.6.2, AC-1.6.3, and AC-1.6.4.
- **Decisions**: Host-only cookies used without domain parameter to isolate Vercel preview URLs.
- **Next session needs to know**: Player session state established; ready to build the public Home page in Session 04.

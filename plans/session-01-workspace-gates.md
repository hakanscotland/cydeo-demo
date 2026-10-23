# Session 01: Workspace Setup & Verification Gates

## Goal
Scaffold the Next.js 15 (App Router) + TypeScript application, configure Vanilla CSS / CSS Modules, install Vitest and Playwright, and establish all 5 verification gates (typecheck, lint, unit test, database/schema check, E2E test) with at least one real passing test per gate.

## Depends on
None (First session).

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [DECISIONS.md](file:///Users/hakandag/Desktop/Cydeo-Demo/DECISIONS.md)
- [docs/design/architecture.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/architecture.md)

## Checks it owns
None (Foundational infrastructure setup).

## Tests to write first (titles)
- `tests/unit/smoke.test.ts`: `test("GATES-01: Unit test gate passes with basic assertion", ...)`
- `tests/e2e/smoke.spec.ts`: `test("GATES-02: Playwright E2E gate loads root page without errors", ...)`

## Files it may touch
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `vitest.config.ts`
- `playwright.config.ts`
- `eslint.config.mjs`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/styles/globals.css`
- `tests/unit/smoke.test.ts`
- `tests/e2e/smoke.spec.ts`

## Steps
1. Initialize Next.js 15 with App Router, TypeScript, and CSS Modules.
2. Install testing dependencies: Vitest, @testing-library/react, @testing-library/jest-dom, Playwright, @playwright/test, axe-core.
3. Configure `vitest.config.ts` and `playwright.config.ts` (with webServer starting Next.js dev on port 3000).
4. Add npm script gates to `package.json`:
   - `npm run typecheck`: `tsc --noEmit`
   - `npm run lint`: `next lint`
   - `npm run test:unit`: `vitest run`
   - `npm run test:e2e`: `playwright test tests/e2e/smoke.spec.ts`
5. Write the minimal root layout and landing page in Look B ("Sport" light) colors.
6. Write the unit and E2E smoke tests and run each to verify they fail when expected and pass when ready.
7. Execute the complete exit gate suite.

## Exit gate
```bash
npm run typecheck && npm run lint && npm run test:unit && npm run test:e2e
```

## What to write in PROGRESS.md for the next session
- **Done**: Next.js 15 App Router scaffolded; TypeScript, ESLint, Vitest, and Playwright configured; smoke tests passing across all gates.
- **Proof**: Terminal output showing `tsc --noEmit`, `next lint`, `vitest run`, and `playwright test` exiting 0.
- **Decisions**: Base styling tokens locked into `src/styles/globals.css`.
- **Next session needs to know**: Verification gates are fully functional; ready to write database schema migrations and seed scripts in Session 02.

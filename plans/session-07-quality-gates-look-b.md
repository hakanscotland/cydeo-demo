# Session 07: Visual Polish & Accessibility/Viewport Quality Gates

## Goal
Apply full visual polish adhering to Look B ("Sport" light theme), execute automated Axe-core accessibility color contrast audits across all pages to guarantee WCAG 2.1 AA compliance (AC-5.2), and verify mobile responsiveness at 320px viewport width guaranteeing zero horizontal scroll (AC-5.4).

## Depends on
Session 06.

## Read first
- [CLAUDE.md](file:///Users/hakandag/Desktop/Cydeo-Demo/CLAUDE.md)
- [docs/design/screens.md](file:///Users/hakandag/Desktop/Cydeo-Demo/docs/design/screens.md)

## Checks it owns
- `AC-5.2`
- `AC-5.4`

## Tests to write first (titles)
- `tests/e2e/a11y-contrast.spec.ts`: `test("AC-5.2: All pages meet WCAG AA color contrast ratio thresholds", ...)`
- `tests/e2e/viewport-320px.spec.ts`: `test("AC-5.4: All pages render at 320px viewport without horizontal scrolling", ...)`

## Files it may touch
- `src/styles/globals.css`
- `src/styles/components.module.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/squad/page.tsx`
- `src/app/squad/[id]/page.tsx`
- `src/app/fixtures/[id]/page.tsx`
- `src/app/login/page.tsx`
- `src/app/profile/privacy/page.tsx`
- `tests/e2e/a11y-contrast.spec.ts`
- `tests/e2e/viewport-320px.spec.ts`

## Steps
1. Refine global CSS design tokens: ensure primary text (`#0F172A`) against background (`#FFFFFF`/`#F8FAFC`) achieves >= 4.5:1 ratio, and large headers (`#0F2F24`) achieve >= 3:1 ratio.
2. Verify touch targets (`min-height: 44px`, `min-width: 44px`) on all buttons and inputs.
3. Audit all layout containers: eliminate fixed widths, enforce responsive wrapping, and ensure `overflow-x: hidden` / clean grid column reflow at 320px width.
4. Implement automated Axe-core Playwright test `tests/e2e/a11y-contrast.spec.ts` checking Home, Squad, Profile, Event, Login, and Privacy pages for zero WCAG AA contrast violations.
5. Implement Playwright test `tests/e2e/viewport-320px.spec.ts` configuring viewport `{ width: 320, height: 640 }` and asserting `document.documentElement.scrollWidth <= 320`.
6. Run tests, detect any contrast or overflow regressions, fix styles, and confirm clean green run.

## Exit gate
```bash
npm run typecheck && npm run lint && npx playwright test tests/e2e/a11y-contrast.spec.ts tests/e2e/viewport-320px.spec.ts
```

## What to write in PROGRESS.md for the next session
- **Done**: Look B visual styling finalized; WCAG AA contrast gate (AC-5.2) and 320px mobile viewport gate (AC-5.4) passed across all pages.
- **Proof**: Playwright test report showing clean passes on contrast audits and zero horizontal scroll assertions.
- **Decisions**: Mobile layout wraps cards cleanly without truncation or clipping.
- **Next session needs to know**: All functional and quality checks are green; ready for the live class demo verification and production release in Session 08.

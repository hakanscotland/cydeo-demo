# Architecture & Technical Decisions

- **D-01 (Framework)**: Next.js 15 (App Router) + TypeScript chosen for native Vercel deployment, React Server Components, and integrated Route Handlers.
- **D-02 (Database & Auth)**: Supabase Postgres + Supabase Auth (`@supabase/ssr`) chosen for relational integrity, built-in GoTrue authentication, and row-level security.
- **D-03 (Styling)**: Vanilla CSS / CSS Modules chosen over Tailwind to guarantee zero horizontal overflow at 320px and strict WCAG AA contrast control.
- **D-04 (Unit Testing)**: Vitest chosen for fast TypeScript-native unit and business rule testing.
- **D-05 (E2E Testing)**: Playwright chosen for multi-browser testing, mobile viewport emulation (320px), and automated accessibility contrast gates.
- **D-06 (Visual Look)**: Look B ("Sport" light theme) selected as the sole MVP look with club green (`#1B4D3E`) meeting WCAG AAA (9.3:1) contrast.
- **D-07 (Privacy Enforcement)**: Invariant 1 enforced via Postgres database views (`view_public_players`) and RLS to prevent PII leakage even on direct PostgREST queries.
- **D-08 (Live Sync Strategy)**: 10-second client-side polling with Page Visibility API pausing chosen over WebSockets to respect free-tier connection limits.
- **D-09 (Timezone Standard)**: All timestamps stored in UTC (`TIMESTAMPTZ`) and rendered in `Europe/London` to prevent daylight-saving time shifts.
- **D-10 (Seed Dataset)**: 40 fake player accounts, 1 archived player, and 2 minors seeded with fixed credentials to enable deterministic automated CI testing.

# PINT FC — Architecture Design

> **Document**: `docs/design/architecture.md`  
> **Status**: Design Proposal (Pending PO Approval)

---

## 1. System Overview

PINT FC MVP is a high-performance, mobile-first web application designed for grassroots club fans and players. It combines a public club presence (next fixture countdown, season record, recent results, standings, squad roster) with private team coordination (Going / Maybe / Not going attendance RSVP with strict cutoff rules and live sync).

```mermaid
graph TD
    UserClient[Web Browser / Phone (320px+)] -->|HTTPS / W3C HTML| VercelEdge[Vercel Serverless Platform]
    
    subgraph "Next.js 15 (App Router)"
        VercelEdge --> SSR[React Server Components (SSR/SSG)]
        VercelEdge --> ClientComp[React Client Components (Interactive Polling/Forms)]
        VercelEdge --> RouteHandlers[API Route Handlers (/api/*)]
    end

    subgraph "Supabase Backend-as-a-Service"
        RouteHandlers -->|PostgREST (Service / Authenticated Role)| Postgres[(PostgreSQL 15+)]
        ClientComp -->|Supabase Client (@supabase/ssr)| SupabaseAuth[Supabase Auth (GoTrue)]
        SupabaseAuth -->|JWT / Session Cookies| Postgres
        Postgres --> RLS[Row Level Security & Database Views]
    end
```

---

## 2. Component Architecture & Responsibilities

| Component | Technology | Runtime Location | Primary Responsibilities |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Next.js (App Router), TypeScript, Vanilla CSS / CSS Modules | Client Browser & Vercel SSR | Render accessible UI (Look B "Sport" light theme), enforce 320px responsiveness, manage countdowns, handle 10s polling when tab is visible. |
| **API Layer** | Next.js Route Handlers (`/api/*`) | Vercel Serverless Functions (Node.js/Edge) | Validate requests, sanitize input, enforce business rules (e.g. cutoff check, error normalization), communicate securely with Supabase. |
| **Authentication** | Supabase Auth (GoTrue) + `@supabase/ssr` | Supabase Cloud & Vercel Middleware | Provide secure password-based sessions for the 40 fake player accounts; manage JWT tokens and HTTP-only session cookies; support multi-device sign-out (`signOut({ scope: 'global' })`). |
| **Data & Storage** | Supabase Postgres with RLS | Supabase Cloud (AWS) | Relational persistence, strict Row Level Security (RLS) guaranteeing Invariant 1 (zero PII leakage), transactional cutoff validation, and views. |
| **Test Suite** | Vitest, Testing Library, Playwright | CI / Local Machine | Unit tests (rules/utils), database tests (pgTAP/RLS verification), API integration tests, and Playwright E2E browser tests. |

---

## 3. Authentication & Session Lifecycle

Authentication uses `@supabase/ssr` with PKCE cookie-based session management to ensure seamless operation across Vercel environments (including dynamic preview URLs).

```mermaid
sequenceDiagram
    autonumber
    actor Player as Player Browser
    participant App as Next.js Server / Middleware
    participant Auth as Supabase Auth (GoTrue)
    participant DB as Postgres (RLS)

    Player->>App: POST /api/auth/login { email, password }
    App->>Auth: signInWithPassword(email, password)
    Auth-->>App: { user, session (access_token, refresh_token) }
    App-->>Player: 200 OK + Set-Cookie (sb-access-token, sb-refresh-token; HttpOnly; Secure; SameSite=Lax)
    
    Note over Player,App: Session persists on page refreshes & route changes
    Player->>App: GET /profile/privacy (with cookies)
    App->>Auth: getUser()
    Auth-->>App: User context validated
    App->>DB: Query profile (RLS checks auth.uid())
    DB-->>App: Return own player profile
    App-->>Player: Render Privacy Page

    Note over Player,App: Sign out of all devices
    Player->>App: POST /api/auth/logout-all
    App->>Auth: admin.signOut(uid, 'global') or supabase.auth.signOut({ scope: 'global' })
    Auth-->>App: All active refresh tokens revoked
    App-->>Player: 200 OK + Clear Cookies
```

### Key Security & Cookie Configurations
- **Cookie Flags**: `HttpOnly = true`, `Secure = true` (in production/preview), `SameSite = Lax`, `Path = /`.
- **Domain Scope**: Cookie domain is left omitted (host-only) so that each Vercel preview deployment URL (`*.vercel.app`) isolates its own session without domain cross-contamination.
- **Session Verification**: Middleware validates the session on protected routes (`/profile/*`, `/fixtures/[id]/rsvp`), redirecting unauthenticated users to `/login`.

---

## 4. Environments & Database Topology

| Environment | Hosting Platform | Database Instance | Environment Configuration | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Local Development** | `localhost:3000` (Next.js dev server) | Supabase Local (Docker container `localhost:54321`) or remote dev project | `.env.local` (gitignored): local Supabase keys, mock seed runner. | Rapid feature development, unit testing, component visual check. |
| **Vercel Preview** | Vercel Preview Deployments (`*-cydeo-learners.vercel.app`) | Supabase Staging/Branch database (`pintfc-preview`) | Vercel Environment Variables (Preview scope): Preview Supabase URL & keys. | Automated PR verification, Playwright E2E regression runs, PO visual sign-off. |
| **Production** | Vercel Production (`pintfc.vercel.app`) | Supabase Production (`pintfc`) | Vercel Environment Variables (Production scope): Production Supabase URL & keys. | Final live app for students and club match demo. Deployed strictly after PO "approved". |

---

## 5. Live Count Polling Architecture (15-Second Sync)

To satisfy **AC-3.4.3** ("Everyone signed in sees the count change within 15 seconds") without the connection pool overhead of open WebSockets on serverless tiers:

1. **Client Polling**: The event page (`/fixtures/[id]`) initiates an HTTP GET polling loop to `/api/fixtures/[id]/counts` every **10 seconds**.
2. **Page Visibility Awareness**: Polling immediately halts when `document.visibilityState === 'hidden'` and resumes upon refocus.
3. **Optimistic UI**: When the local user updates their RSVP, the local UI count updates immediately and confirms on API response.
4. **Bandwidth Efficiency**: The `/counts` endpoint returns a compact JSON payload (`{ going: 14, maybe: 3, not_going: 2, rsvp_closed: false }`) with `Cache-Control: private, no-cache`.

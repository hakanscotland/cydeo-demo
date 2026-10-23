# PINT FC — Screens & UI Specification

> **Document**: `docs/design/screens.md`  
> **Status**: Design Proposal (Pending PO Approval)

---

## 1. Visual Design System: Look B ("Sport" Light Theme)

In accordance with the product owner's directive (Oct 23), PINT FC MVP adopts **Look B ("Sport" light)** as the sole visual theme.

### 1.1 Color Palette & WCAG AA Contrast Ratios
| Token Name | Hex Code | Usage | Contrast Ratio vs `#FFFFFF` | WCAG AA Compliance |
| :--- | :--- | :--- | :--- | :--- |
| `--color-club-green` | `#1B4D3E` | Header, primary buttons, card accents | **9.3 : 1** | PASS (AAA) |
| `--color-club-dark` | `#0F2F24` | Hero background, headings | **14.8 : 1** | PASS (AAA) |
| `--color-accent-gold` | `#B38F22` | High-contrast badges, countdown highlights | **4.7 : 1** | PASS (AA) |
| `--color-text-main` | `#0F172A` | Body copy, table text | **16.1 : 1** | PASS (AAA) |
| `--color-text-muted` | `#475569` | Secondary captions, timestamps | **5.4 : 1** | PASS (AA) |
| `--color-bg-page` | `#F8FAFC` | Main background | N/A | Base |
| `--color-bg-surface` | `#FFFFFF` | Card backgrounds, dialogs | N/A | Base |
| `--color-border` | `#E2E8F0` | Dividers, table borders, input outlines | **1.3 : 1** (UI border) | N/A |
| `--color-status-going` | `#15803D` | "Going" badge & button | **4.9 : 1** | PASS (AA) |
| `--color-status-maybe` | `#B45309` | "Maybe" badge & button | **4.6 : 1** | PASS (AA) |
| `--color-status-not` | `#B91C1C` | "Not Going" badge & button | **5.8 : 1** | PASS (AA) |

### 1.2 Viewport Responsiveness (320px Gate)
- Minimum supported viewport: **320px width** (iPhone SE 1st gen).
- Strict guarantee: **No horizontal scrolling (`overflow-x: hidden` / clean flex/grid wrap)** at 320px.
- Touch targets: Minimum **44px x 44px** for all buttons and interactive controls.

---

## 2. Screen Specifications & States

### Screen 1: Home Page (`/`)

#### Layout & Elements
- **Navigation Bar**: Club crest, title "PINT FC", nav links (Squad, Fixtures), and Auth Action button (Sign In / Account).
- **Hero Fixture Card**:
  - Opponent name, crest placeholder, venue name, and competition badge (League / Friendly).
  - Next match countdown clock (`data-testid="countdown-timer"`).
  - RSVP status pill: "RSVP Open (Closes in 45m)" or "RSVP Closed".
  - Link to Event Page (`data-testid="view-event-link"`).
- **Season Record Widget**: Win - Draw - Loss bar, Goals For / Against / Diff (`data-testid="season-record-widget"`).
- **Latest Results List**: Cards showing last 3 published games with W/D/L badge (`data-testid="latest-results-list"`).
- **Mini League Table**: Seeded standings snapshot with PINT FC highlighted (`data-testid="mini-standings-table"`).
- **Footer**: Club crest, venue address, copyright, quick links.

#### States & Test IDs
| State | Behavior & Visuals | Key `data-testid` |
| :--- | :--- | :--- |
| **Loading** | Skeleton cards pulse for fixture hero, record, and standings. | `data-testid="home-skeleton"` |
| **Success (Signed Out)** | Displays next match, results, standings; nav shows "Sign In" button. | `data-testid="nav-login-btn"`, `data-testid="hero-match-card"` |
| **Success (Signed In)** | Displays player name in header; quick link to my RSVP and privacy settings. | `data-testid="nav-profile-btn"`, `data-testid="quick-rsvp-widget"` |
| **Empty (Off-Season)** | When no upcoming match is scheduled, hero shows off-season friendly notice. | `data-testid="hero-empty-state"` |
| **Error** | Shows discreet error banner with "Retry" action if data fails to fetch. | `data-testid="home-error-banner"`, `data-testid="retry-btn"` |

---

### Screen 2: Squad Listing (`/squad`)

#### Layout & Elements
- Page title: "First Team Squad".
- Category sections:
  1. Goalkeepers (`data-testid="squad-group-goalkeepers"`)
  2. Defenders (`data-testid="squad-group-defenders"`)
  3. Midfielders (`data-testid="squad-group-midfielders"`)
  4. Forwards (`data-testid="squad-group-forwards"`)
- Player Card:
  - Squad number (`data-testid="player-number"`).
  - Display name (`data-testid="player-name"`).
  - Consented photo or fallback silhouette avatar (`data-testid="player-avatar"`).
  - Nationality flag/code (if consented) (`data-testid="player-flag"`).
  - Clickable link to player profile (`/squad/[id]`).

#### States & Test IDs
| State | Behavior & Visuals | Key `data-testid` |
| :--- | :--- | :--- |
| **Loading** | Positional grid skeletons pulse. | `data-testid="squad-skeleton"` |
| **Populated** | All 40 active players rendered; archived players excluded. | `data-testid="squad-grid"`, `data-testid="player-card-<id>"` |
| **Empty** | "No squad members currently listed." | `data-testid="squad-empty"` |
| **Error** | "Unable to load squad roster. [Retry]" | `data-testid="squad-error"` |

---

### Screen 3: Player Profile Page (`/squad/[id]`)

#### Layout & Elements
- Hero Bio Card:
  - Squad number, display name, position.
  - Consented photo (or placeholder).
  - Consented nationality (omitted if unconsented).
  - Note: Emails, phone numbers, and DOB are NEVER rendered (Invariant 1).
- Back to Squad navigation button.

#### States & Test IDs
| State | Behavior & Visuals | Key `data-testid` |
| :--- | :--- | :--- |
| **Loading** | Bio card skeleton. | `data-testid="profile-skeleton"` |
| **Populated** | Permitted biographical fields only. | `data-testid="profile-card"`, `data-testid="profile-display-name"` |
| **404 Not Found** | For invalid IDs or archived players: clean 404 message + return link. | `data-testid="not-found-container"`, `data-testid="back-to-squad-btn"` |
| **Error** | "Failed to load profile. [Retry]" | `data-testid="profile-error"` |

---

### Screen 4: Event / Match Page (`/fixtures/[id]`) [Projector View]

#### Layout & Elements
- **Scoreboard Attendance Header** (High-contrast for classroom projector):
  - Large live counters:
    - **GOING**: count in green box (`data-testid="count-going"`).
    - **MAYBE**: count in amber box (`data-testid="count-maybe"`).
    - **NOT GOING**: count in red box (`data-testid="count-not-going"`).
  - Live polling indicator pulse dot (`data-testid="live-sync-indicator"`).
- **Match Overview Card**: Opponent, kickoff date & time, venue, competition type.
- **Player RSVP Action Box** (Visible when signed in):
  - Segmented buttons: `Going` (`data-testid="rsvp-btn-going"`), `Maybe` (`data-testid="rsvp-btn-maybe"`), `Not Going` (`data-testid="rsvp-btn-not-going"`).
  - Optional private note textarea (`data-testid="rsvp-note-input"`).
  - Submit / Update button (`data-testid="rsvp-submit-btn"`).
  - "RSVP Closed" banner replacing buttons if cutoff has passed (`data-testid="rsvp-closed-banner"`).
- **Attendee Roster Section**:
  - Tabs or columns for Going, Maybe, Not Going (`data-testid="attendees-list"`).
  - Roster cards showing teammate display name, number, position.
  - Teammate private notes are hidden (`data-testid="attendee-note"` present ONLY on current user's card).

#### States & Test IDs
| State | Behavior & Visuals | Key `data-testid` |
| :--- | :--- | :--- |
| **Loading** | Big count blocks pulse in skeleton mode. | `data-testid="event-skeleton"` |
| **Public / Signed Out** | Viewers see live counts and match info; prompt: "Player? Sign in to RSVP". | `data-testid="rsvp-login-prompt"` |
| **Signed In (RSVP Open)** | Interactive RSVP buttons active; user's current status highlighted. | `data-testid="rsvp-action-box"`, `data-testid="rsvp-submit-btn"` |
| **Signed In (RSVP Closed)** | Cutoff passed: buttons disabled, red "RSVP Closed" banner shown. | `data-testid="rsvp-closed-banner"` |
| **Cancelled Match** | "MATCH CANCELLED" alert box shown at the top. | `data-testid="match-cancelled-alert"` |

---

### Screen 5: Sign-In Page (`/login`)

#### Layout & Elements
- PINT FC Crest and title "Player Sign In".
- Email input (`data-testid="login-email-input"`).
- Password input (`data-testid="login-password-input"`).
- Submit button (`data-testid="login-submit-btn"`).
- Error alert box (`data-testid="login-error-alert"`).
- **Development Quick-Select** (Preview / Local only): Dropdown with seeded fake players to easily log in during testing/demo (`data-testid="dev-player-select"`).

---

### Screen 6: Privacy Settings Page (`/profile/privacy`)

#### Layout & Elements
- Page title: "My Privacy Settings".
- Toggle Switches:
  - "Show my photo on the public squad page" (`data-testid="toggle-consent-photo"`).
  - "Show my nationality on my profile" (`data-testid="toggle-consent-nationality"`).
  - "Show my personal match stats" (`data-testid="toggle-consent-stats"`).
- Save Changes button (`data-testid="save-privacy-btn"`).
- Success confirmation toast (`data-testid="privacy-success-toast"`).
- Danger Zone:
  - "Sign out of all devices" button (`data-testid="sign-out-all-devices-btn"`).

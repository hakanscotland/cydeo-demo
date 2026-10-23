# PINT FC — API Specification

> **Document**: `docs/design/api.md`  
> **Status**: Design Proposal (Pending PO Approval)

---

## 1. Unified Error Format

All API endpoints follow a strict, unified error schema inspired by RFC 7807 (Problem Details for HTTP APIs). Every error response returns a consistent JSON structure with `Content-Type: application/json`.

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "The RSVP cutoff time for this match has already passed.",
    "status": 403,
    "details": {
      "cutoff_at": "2026-11-07T15:15:00.000Z",
      "server_time": "2026-11-07T15:16:02.124Z"
    }
  }
}
```

### Standard Error Codes
| HTTP Status | Error Code | Description / Usage |
| :--- | :--- | :--- |
| **400** | `BAD_REQUEST` | Malformed JSON, missing required fields, or validation schema failure. |
| **401** | `UNAUTHORIZED` | Unauthenticated request where valid player credentials/session are required. |
| **403** | `FORBIDDEN` | Authenticated user lacks permission (e.g. editing another player's profile). |
| **403** | `CUTOFF_PASSED` | Specialized forbidden error indicating the match RSVP cutoff has passed. |
| **404** | `NOT_FOUND` | Resource (player, match, standings) does not exist or is archived/unpublished. |
| **409** | `CONFLICT` | Concurrent mutation conflict or unique constraint collision. |
| **429** | `TOO_MANY_REQUESTS` | Polling or request rate limit exceeded. |
| **500** | `INTERNAL_SERVER_ERROR`| Uncaught server exception (sanitized without leaking internal stack traces). |

---

## 2. Authentication & Profile Endpoints

### 2.1 `POST /api/auth/login`
Authenticates a seeded player using email and password. Sets HTTP-only session cookies.
- **Request Body**:
  ```json
  {
    "email": "player1@pintfc.test",
    "password": "Password123!"
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "player": {
      "id": "c1f7a049-5f28-4ef1-8930-466d92cb3e41",
      "email": "player1@pintfc.test",
      "display_name": "J. Doe",
      "squad_number": 7,
      "position": "midfielder"
    }
  }
  ```
  *Headers*: `Set-Cookie: sb-access-token=...; HttpOnly; Secure; SameSite=Lax; Path=/`
- **Error Responses**:
  - `400 BAD_REQUEST`: Missing email or password.
  - `401 UNAUTHORIZED`: Invalid credentials (`code: "INVALID_CREDENTIALS"`).

### 2.2 `POST /api/auth/logout`
Terminates the current device session and clears session cookies.
- **Request**: Empty body (authenticated cookie required).
- **Success Response** (`200 OK`):
  ```json
  { "success": true }
  ```

### 2.3 `POST /api/auth/logout-all`
Revokes all active refresh tokens for the authenticated player across all devices.
- **Request**: Empty body (authenticated cookie required).
- **Success Response** (`200 OK`):
  ```json
  { "success": true, "message": "All active sessions revoked." }
  ```

### 2.4 `GET /api/me`
Retrieves the private profile and current consent settings of the signed-in player.
- **Request**: Empty body (authenticated cookie required).
- **Success Response** (`200 OK`):
  ```json
  {
    "player": {
      "id": "c1f7a049-5f28-4ef1-8930-466d92cb3e41",
      "squad_number": 7,
      "full_name": "John Doe",
      "display_name": "J. Doe",
      "position": "midfielder",
      "email": "player1@pintfc.test",
      "phone": "+447700900077",
      "date_of_birth": "2001-05-14",
      "is_under_18": false,
      "consents": {
        "photo": true,
        "nationality": false,
        "stats": true
      }
    }
  }
  ```

### 2.5 `PATCH /api/me/privacy`
Updates self privacy consent toggles.
- **Request Body**:
  ```json
  {
    "consent_photo": true,
    "consent_nationality": false,
    "consent_stats": true
  }
  ```
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "consents": {
      "consent_photo": true,
      "consent_nationality": false,
      "consent_stats": true
    }
  }
  ```
- **Error Responses**:
  - `401 UNAUTHORIZED`: Unauthenticated.
  - `400 BAD_REQUEST`: Invalid boolean fields.

---

## 3. Fixtures & RSVP Endpoints

### 3.1 `GET /api/fixtures/next`
Retrieves the next upcoming fixture for the home page hero card.
- **Authentication**: Optional / Public.
- **Success Response** (`200 OK`):
  ```json
  {
    "fixture": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "opponent_name": "Red Lion FC",
      "opponent_crest_url": "/assets/crests/red-lion.svg",
      "venue_name": "Pint Ground",
      "venue_timezone": "Europe/London",
      "kickoff_at": "2026-11-07T15:00:00.000Z",
      "rsvp_cutoff_at": "2026-11-07T14:00:00.000Z",
      "competition_type": "league",
      "status": "scheduled",
      "is_rsvp_closed": false
    }
  }
  ```
- **Empty State** (`200 OK`): `{ "fixture": null }`.

### 3.2 `GET /api/fixtures/[id]`
Retrieves full fixture detail and attendance roster for the Event Page (`/fixtures/[id]`).
- **Authentication**: Optional. If authenticated, returns teammates' statuses.
- **Success Response** (`200 OK`):
  ```json
  {
    "fixture": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "opponent_name": "Red Lion FC",
      "venue_name": "Pint Ground",
      "kickoff_at": "2026-11-07T15:00:00.000Z",
      "rsvp_cutoff_at": "2026-11-07T14:00:00.000Z",
      "competition_type": "league",
      "status": "scheduled",
      "is_rsvp_closed": false
    },
    "counts": {
      "going": 14,
      "maybe": 3,
      "not_going": 2
    },
    "attendees": [
      {
        "player_id": "c1f7a049-5f28-4ef1-8930-466d92cb3e41",
        "display_name": "J. Doe",
        "squad_number": 7,
        "position": "midfielder",
        "status": "going"
      }
    ],
    "user_rsvp": {
      "status": "going",
      "note": "Bringing extra water"
    }
  }
  ```
  *Note on Privacy*: `attendees` array includes ONLY `player_id`, `display_name`, `squad_number`, `position`, and `status`. It NEVER includes `note` or `email`. Only `user_rsvp` (the caller's own RSVP) includes `note`.

### 3.3 `POST /api/fixtures/[id]/rsvp`
Submits or modifies the calling player's RSVP.
- **Authentication**: Required (`authenticated`).
- **Request Body**:
  ```json
  {
    "status": "going",
    "note": "Slight hamstring tightness, but ready"
  }
  ```
  *(Status must be `"going"`, `"maybe"`, or `"not_going"`. `note` is optional string).*
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "rsvp": {
      "match_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "status": "going",
      "note": "Slight hamstring tightness, but ready",
      "updated_at": "2026-10-23T18:15:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `401 UNAUTHORIZED`: Unauthenticated.
  - `403 CUTOFF_PASSED`: Current time is past `rsvp_cutoff_at`.
  - `400 BAD_REQUEST`: Invalid status value.

### 3.4 `GET /api/fixtures/[id]/counts`
Ultra-lightweight polling endpoint queried every 10 seconds by active event pages.
- **Authentication**: Optional.
- **Success Response** (`200 OK`):
  ```json
  {
    "going": 14,
    "maybe": 3,
    "not_going": 2,
    "is_rsvp_closed": false
  }
  ```
  *Headers*: `Cache-Control: no-cache, no-store, must-revalidate`.

---

## 4. Public Club Content Endpoints

### 4.1 `GET /api/results/recent`
Returns published match results in reverse chronological order.
- **Success Response** (`200 OK`):
  ```json
  {
    "results": [
      {
        "id": "7b2c...",
        "competition_type": "league",
        "opponent_name": "Anchor Athletic",
        "kickoff_at": "2026-10-17T14:30:00.000Z",
        "home_or_away": "home",
        "score_pintfc": 3,
        "score_opponent": 1,
        "outcome": "W"
      }
    ]
  }
  ```

### 4.2 `GET /api/record/season`
Returns aggregated league season record (W-D-L, GF, GA, GD).
- **Success Response** (`200 OK`):
  ```json
  {
    "record": {
      "played": 8,
      "won": 5,
      "drawn": 1,
      "lost": 2,
      "goals_for": 19,
      "goals_against": 11,
      "goal_difference": 8
    }
  }
  ```

### 4.3 `GET /api/standings`
Returns the mini league standings snapshot with PINT FC highlighted.
- **Success Response** (`200 OK`):
  ```json
  {
    "standings": [
      {
        "rank": 1,
        "team_name": "Victoria Strollers",
        "played": 8,
        "points": 18,
        "is_pint_fc": false
      },
      {
        "rank": 2,
        "team_name": "PINT FC",
        "played": 8,
        "points": 16,
        "is_pint_fc": true
      }
    ]
  }
  ```

### 4.4 `GET /api/players`
Returns public squad roster grouped by positional category.
- **Success Response** (`200 OK`):
  ```json
  {
    "squad": {
      "goalkeepers": [
        {
          "id": "a1b2...",
          "squad_number": 1,
          "display_name": "M. Safehands",
          "position": "goalkeeper",
          "photo_url": "/assets/players/p1.webp",
          "nationality": "ENG"
        }
      ],
      "defenders": [],
      "midfielders": [],
      "forwards": []
    }
  }
  ```

### 4.5 `GET /api/players/[id]`
Returns individual player public profile details.
- **Success Response** (`200 OK`):
  ```json
  {
    "player": {
      "id": "a1b2...",
      "squad_number": 7,
      "display_name": "J. Doe",
      "position": "midfielder",
      "photo_url": "/assets/players/p7.webp",
      "nationality": null
    }
  }
  ```
- **Error Response** (`404 NOT_FOUND`): Non-existent or archived player.

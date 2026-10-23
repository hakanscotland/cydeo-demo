# PINT FC — Shared Business Rules

> **Document**: `docs/design/rules.md`  
> **Status**: Design Proposal (Pending PO Approval)

---

## 1. Overview

Every UI component, API Route Handler, and database utility in the codebase must invoke these centralized rule modules to prevent logic duplication, edge-case drift, and security discrepancies.

---

## 2. Time & Cutoff Rules (`src/lib/rules/time.ts`)

All temporal computations strictly adhere to UTC representation internally while presenting localized time formatted in the club's venue timezone (`Europe/London`).

### 2.1 Cutoff Evaluation (`isCutoffPassed`)
```typescript
/**
 * Evaluates whether an RSVP deadline has passed.
 * Returns true if current time >= cutoff timestamp.
 */
export function isCutoffPassed(
  cutoffTime: string | Date, 
  now: Date = new Date()
): boolean {
  const cutoffDate = typeof cutoffTime === 'string' ? new Date(cutoffTime) : cutoffTime;
  if (isNaN(cutoffDate.getTime())) {
    throw new Error('Invalid cutoff timestamp provided');
  }
  return now.getTime() >= cutoffDate.getTime();
}
```

### 2.2 Countdown Calculation (`calculateCountdown`)
```typescript
export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  formatted: string;
}

export function calculateCountdown(
  targetTime: string | Date, 
  now: Date = new Date()
): CountdownResult {
  const target = typeof targetTime === 'string' ? new Date(targetTime) : targetTime;
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, formatted: '00:00:00' };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const formatted = days > 0
    ? `${days}d ${hours}h ${minutes}m`
    : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { days, hours, minutes, seconds, isPast: false, formatted };
}
```

### 2.3 Timezone-Safe Formatting (`formatKickoff`)
```typescript
export function formatKickoff(
  utcTimestamp: string | Date, 
  timezone: string = 'Europe/London'
): { fullDate: string; timeString: string; dayOfWeek: string } {
  const date = typeof utcTimestamp === 'string' ? new Date(utcTimestamp) : utcTimestamp;

  const dayOfWeek = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: timezone }).format(date);
  const fullDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: timezone }).format(date);
  const timeString = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone }).format(date);

  return { fullDate, timeString, dayOfWeek };
}
```

---

## 3. Permissions & Authorization Rules (`src/lib/rules/permissions.ts`)

Centralizes authorization assertions before mutating data or reading restricted attributes.

```typescript
export interface AuthUserContext {
  userId: string;
  isPlayer: boolean;
}

export function canEditPrivacySettings(
  caller: AuthUserContext | null, 
  targetPlayerId: string
): boolean {
  if (!caller || !caller.isPlayer) return false;
  return caller.userId === targetPlayerId;
}

export function canSubmitRsvp(
  caller: AuthUserContext | null,
  targetPlayerId: string,
  cutoffTime: string | Date,
  now: Date = new Date()
): { allowed: boolean; reason?: 'UNAUTHENTICATED' | 'FORBIDDEN_PLAYER' | 'CUTOFF_PASSED' } {
  if (!caller) {
    return { allowed: false, reason: 'UNAUTHENTICATED' };
  }
  if (caller.userId !== targetPlayerId) {
    return { allowed: false, reason: 'FORBIDDEN_PLAYER' };
  }
  if (isCutoffPassed(cutoffTime, now)) {
    return { allowed: false, reason: 'CUTOFF_PASSED' };
  }
  return { allowed: true };
}
```

---

## 4. Privacy & Invariant 1 Sanitizer (`src/lib/rules/privacy.ts`)

Enforces the absolute privacy invariant: **No public response contains email, phone number, date of birth, guardian details, or teammate private notes.**

```typescript
export interface RawPlayerRecord {
  id: string;
  squad_number: number;
  full_name: string;
  display_name: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  date_of_birth: string;
  email: string;
  phone?: string | null;
  is_under_18: boolean;
  guardian_name?: string | null;
  guardian_email?: string | null;
  guardian_consent: boolean;
  opt_in: boolean;
  consent_photo: boolean;
  consent_nationality: boolean;
  consent_stats: boolean;
  nationality?: string | null;
  photo_url?: string | null;
  archived: boolean;
}

export interface SanitizedPublicPlayer {
  id: string;
  squad_number: number;
  display_name: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  photo_url: string | null;
  nationality: string | null;
}

export function sanitizePublicPlayer(player: RawPlayerRecord): SanitizedPublicPlayer | null {
  // Archived players must NEVER appear (AC-4.1.2)
  if (player.archived) return null;

  // Under-18 protection: If minor without verified guardian consent and opt-in, hide profile (AC-4.3.3)
  if (player.is_under_18 && (!player.guardian_consent || !player.opt_in)) {
    return null;
  }

  return {
    id: player.id,
    squad_number: player.squad_number,
    display_name: player.display_name,
    position: player.position,
    photo_url: player.consent_photo ? (player.photo_url || null) : null,
    nationality: player.consent_nationality ? (player.nationality || null) : null,
  };
}

export interface RawAttendee {
  player_id: string;
  display_name: string;
  squad_number: number;
  position: string;
  status: 'going' | 'maybe' | 'not_going';
  note?: string | null;
}

export interface SanitizedAttendee {
  player_id: string;
  display_name: string;
  squad_number: number;
  position: string;
  status: 'going' | 'maybe' | 'not_going';
  note?: string | null;
}

/**
 * Strips teammate private notes. Only the author sees their own note (AC-3.3.6).
 */
export function sanitizeAttendees(
  attendees: RawAttendee[], 
  currentUserId?: string
): SanitizedAttendee[] {
  return attendees.map(a => ({
    player_id: a.player_id,
    display_name: a.display_name,
    squad_number: a.squad_number,
    position: a.position,
    status: a.status,
    note: currentUserId && a.player_id === currentUserId ? a.note : null
  }));
}
```

---

## 5. Unified Error System (`src/lib/rules/errors.ts`)

Standardized exception classes and API response builders.

```typescript
export type ErrorCode = 
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CUTOFF_PASSED'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_SERVER_ERROR';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly status: number = 400,
    public readonly details: Record<string, unknown> = {}
  ) {
    super(message);
    this.name = 'AppError';
  }

  static badRequest(message: string, details?: Record<string, unknown>) {
    return new AppError('BAD_REQUEST', message, 400, details);
  }

  static unauthorized(message: string = 'Authentication required') {
    return new AppError('UNAUTHORIZED', message, 401);
  }

  static forbidden(message: string = 'Access denied') {
    return new AppError('FORBIDDEN', message, 403);
  }

  static cutoffPassed(cutoffTime: string) {
    return new AppError(
      'CUTOFF_PASSED', 
      'The RSVP deadline for this fixture has closed.', 
      403, 
      { cutoff_at: cutoffTime, server_time: new Date().toISOString() }
    );
  }

  static notFound(message: string = 'Resource not found') {
    return new AppError('NOT_FOUND', message, 404);
  }

  toResponse(): Response {
    return new Response(
      JSON.stringify({
        error: {
          code: this.code,
          message: this.message,
          status: this.status,
          details: this.details,
        }
      }),
      {
        status: this.status,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
```

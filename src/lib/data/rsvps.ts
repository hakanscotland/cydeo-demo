import { FAKE_SEED_PLAYERS } from '@/lib/db/seed-data';

export interface RsvpRecord {
  id: string;
  match_id: string;
  player_id: string;
  status: 'going' | 'maybe' | 'not_going';
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendeeRosterItem {
  player_id: string;
  display_name: string;
  squad_number: number;
  position: string;
  status: 'going' | 'maybe' | 'not_going';
}

const INITIAL_RSVPS: RsvpRecord[] = [
  // Initial seed RSVPs for Next Match: 22222222-0000-4000-8000-000000000007
  {
    id: '44444444-0000-4000-8000-000000000001',
    match_id: '22222222-0000-4000-8000-000000000007',
    player_id: '11111111-0000-4000-8000-000000000002', // M. Rossi
    status: 'not_going',
    note: 'confidential medical info - knee sprain',
    created_at: '2026-10-20T10:00:00.000Z',
    updated_at: '2026-10-20T10:00:00.000Z',
  },
  {
    id: '44444444-0000-4000-8000-000000000002',
    match_id: '22222222-0000-4000-8000-000000000007',
    player_id: '11111111-0000-4000-8000-000000000005', // DEF
    status: 'going',
    note: null,
    created_at: '2026-10-20T11:00:00.000Z',
    updated_at: '2026-10-20T11:00:00.000Z',
  },
  {
    id: '44444444-0000-4000-8000-000000000003',
    match_id: '22222222-0000-4000-8000-000000000007',
    player_id: '11111111-0000-4000-8000-000000000006', // DEF
    status: 'going',
    note: null,
    created_at: '2026-10-20T11:30:00.000Z',
    updated_at: '2026-10-20T11:30:00.000Z',
  },
  {
    id: '44444444-0000-4000-8000-000000000004',
    match_id: '22222222-0000-4000-8000-000000000007',
    player_id: '11111111-0000-4000-8000-000000000007', // DEF
    status: 'maybe',
    note: 'Might be delayed at work',
    created_at: '2026-10-20T12:00:00.000Z',
    updated_at: '2026-10-20T12:00:00.000Z',
  },
];

const globalForPintFc = globalThis as unknown as {
  __pintfc_rsvps?: RsvpRecord[];
};

export const FAKE_SEED_RSVPS: RsvpRecord[] =
  globalForPintFc.__pintfc_rsvps ??
  (globalForPintFc.__pintfc_rsvps = INITIAL_RSVPS);

/**
 * Returns aggregated attendance counts for a match fixture.
 */
export async function getMatchRsvpCounts(matchId: string): Promise<{
  going: number;
  maybe: number;
  not_going: number;
}> {
  const matchRsvps = FAKE_SEED_RSVPS.filter(r => r.match_id === matchId);
  return {
    going: matchRsvps.filter(r => r.status === 'going').length,
    maybe: matchRsvps.filter(r => r.status === 'maybe').length,
    not_going: matchRsvps.filter(r => r.status === 'not_going').length,
  };
}

/**
 * Returns attendee roster for a match, strictly omitting private notes (AC-3.3.6).
 */
export async function getMatchAttendeeRoster(matchId: string): Promise<AttendeeRosterItem[]> {
  const matchRsvps = FAKE_SEED_RSVPS.filter(r => r.match_id === matchId);
  const roster: AttendeeRosterItem[] = [];

  for (const rsvp of matchRsvps) {
    const player = FAKE_SEED_PLAYERS.find(p => p.id === rsvp.player_id && !p.archived);
    if (player) {
      roster.push({
        player_id: player.id,
        display_name: player.display_name,
        squad_number: player.squad_number,
        position: player.position,
        status: rsvp.status,
      });
    }
  }

  return roster;
}

/**
 * Retrieves the authenticated player's own RSVP for a given match.
 */
export async function getUserRsvp(matchId: string, playerId: string): Promise<RsvpRecord | null> {
  const record = FAKE_SEED_RSVPS.find(
    r => r.match_id === matchId && r.player_id === playerId
  );
  return record || null;
}

/**
 * Inserts or updates an RSVP record for a player.
 */
export async function upsertUserRsvp(
  matchId: string,
  playerId: string,
  status: 'going' | 'maybe' | 'not_going',
  note?: string | null
): Promise<RsvpRecord> {
  const now = new Date().toISOString();
  const existingIndex = FAKE_SEED_RSVPS.findIndex(
    r => r.match_id === matchId && r.player_id === playerId
  );

  if (existingIndex >= 0) {
    FAKE_SEED_RSVPS[existingIndex] = {
      ...FAKE_SEED_RSVPS[existingIndex],
      status,
      note: note !== undefined ? note : FAKE_SEED_RSVPS[existingIndex].note,
      updated_at: now,
    };
    return FAKE_SEED_RSVPS[existingIndex];
  }

  const newRsvp: RsvpRecord = {
    id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    match_id: matchId,
    player_id: playerId,
    status,
    note: note || null,
    created_at: now,
    updated_at: now,
  };

  FAKE_SEED_RSVPS.push(newRsvp);
  return newRsvp;
}

import { describe, it, expect } from 'vitest';

export interface PublicAttendee {
  player_id: string;
  display_name: string;
  squad_number: number;
  position: string;
  status: 'going' | 'maybe' | 'not_going';
}

export function sanitizeAttendees(
  attendees: Array<{
    player_id: string;
    display_name: string;
    squad_number: number;
    position: string;
    status: 'going' | 'maybe' | 'not_going';
    note?: string | null;
  }>
): PublicAttendee[] {
  return attendees.map(a => ({
    player_id: a.player_id,
    display_name: a.display_name,
    squad_number: a.squad_number,
    position: a.position,
    status: a.status,
  }));
}

describe('RSVP Teammate Privacy & Confidentiality Rules', () => {
  it('AC-3.3.6: Teammate private RSVP reasons hidden from other players', () => {
    const rawAttendees = [
      {
        player_id: 'player-1',
        display_name: 'A. Pendelton',
        squad_number: 1,
        position: 'goalkeeper',
        status: 'going' as const,
        note: 'Bringing extra gloves',
      },
      {
        player_id: 'player-2',
        display_name: 'M. Rossi',
        squad_number: 13,
        position: 'goalkeeper',
        status: 'not_going' as const,
        note: 'Severe knee sprain - confidential medical info',
      },
    ];

    const sanitized = sanitizeAttendees(rawAttendees);

    for (const attendee of sanitized) {
      expect(attendee).not.toHaveProperty('note');
      // @ts-expect-error Checking that note is undefined at runtime
      expect(attendee.note).toBeUndefined();
    }

    const jsonString = JSON.stringify(sanitized);
    expect(jsonString).not.toContain('knee sprain');
    expect(jsonString).not.toContain('extra gloves');
  });
});

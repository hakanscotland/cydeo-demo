import { describe, it, expect } from 'vitest';
import { getPublicPlayers, getPublicPlayerById } from '@/lib/data/players';

describe('AC-4.3.1: Invariant 1 - Privacy Protection', () => {
  it('AC-4.3.1: Invariant 1 - Zero public PII leakage in any endpoint response', async () => {
    const players = await getPublicPlayers();
    expect(players.length).toBeGreaterThan(0);

    for (const player of players) {
      const record = player as unknown as Record<string, unknown>;
      // Invariant 1: No public response contains email, phone, DOB, or guardian details
      expect(record.email).toBeUndefined();
      expect(record.phone).toBeUndefined();
      expect(record.date_of_birth).toBeUndefined();
      expect(record.guardian_name).toBeUndefined();
      expect(record.guardian_email).toBeUndefined();
      expect(record.rsvp_note).toBeUndefined();
    }

    // Check single player profile response
    const singlePlayer = await getPublicPlayerById(players[0].id);
    expect(singlePlayer).toBeDefined();
    const singleRecord = singlePlayer as unknown as Record<string, unknown>;
    expect(singleRecord.email).toBeUndefined();
    expect(singleRecord.phone).toBeUndefined();
    expect(singleRecord.date_of_birth).toBeUndefined();
  });
});

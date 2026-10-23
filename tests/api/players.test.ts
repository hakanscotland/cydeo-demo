import { describe, it, expect } from 'vitest';
import { getPublicPlayers, getPublicPlayerById } from '@/lib/data/players';
import { FAKE_SEED_PLAYERS } from '@/lib/db/seed-data';

describe('AC-4.1.2: Archived Players Exclusion', () => {
  it('AC-4.1.2: Archived players are completely excluded from squad listing', async () => {
    // Exactly 1 archived player in seed data
    const archivedPlayer = FAKE_SEED_PLAYERS.find(p => p.archived === true);
    expect(archivedPlayer).toBeDefined();

    // Archived player must never appear in public roster
    const publicPlayers = await getPublicPlayers();
    const foundArchived = publicPlayers.find(p => p.id === archivedPlayer!.id);
    expect(foundArchived).toBeUndefined();

    // Querying archived player profile returns null
    const profile = await getPublicPlayerById(archivedPlayer!.id);
    expect(profile).toBeNull();
  });
});

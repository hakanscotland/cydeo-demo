import { describe, it, expect } from 'vitest';
import { getPublicPlayers, getPublicPlayerById } from '@/lib/data/players';
import { FAKE_SEED_PLAYERS } from '@/lib/db/seed-data';

describe('AC-4.3.3: Minor Safeguarding', () => {
  it('AC-4.3.3: Minor without verified guardian consent is hidden from public', async () => {
    // Find unconsented minor in seed dataset
    const unconsentedMinor = FAKE_SEED_PLAYERS.find(p => p.is_under_18 && (!p.guardian_consent || !p.opt_in));
    expect(unconsentedMinor).toBeDefined();

    // Verify unconsented minor does not appear in public squad list
    const publicPlayers = await getPublicPlayers();
    const foundInList = publicPlayers.find(p => p.id === unconsentedMinor!.id);
    expect(foundInList).toBeUndefined();

    // Direct profile query for unconsented minor returns null (404)
    const directProfile = await getPublicPlayerById(unconsentedMinor!.id);
    expect(directProfile).toBeNull();

    // Consented minor with guardian consent and opt-in DOES appear
    const consentedMinor = FAKE_SEED_PLAYERS.find(p => p.is_under_18 && p.guardian_consent && p.opt_in);
    expect(consentedMinor).toBeDefined();
    const foundConsented = publicPlayers.find(p => p.id === consentedMinor!.id);
    expect(foundConsented).toBeDefined();
  });
});

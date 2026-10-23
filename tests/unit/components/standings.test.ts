import { describe, it, expect } from 'vitest';
import { getStandingsSnapshot } from '@/lib/data/standings';

describe('AC-2.4.3: Standings Snapshot Resiliency', () => {
  it('AC-2.4.3: Standings render reliably from local seeded snapshot', async () => {
    const standings = await getStandingsSnapshot();
    expect(standings.length).toBeGreaterThan(0);

    const pintFc = standings.find(s => s.is_pint_fc === true);
    expect(pintFc).toBeDefined();
    expect(pintFc?.team_name).toContain('PINT FC');
    expect(pintFc?.points).toBeGreaterThan(0);
  });
});

import { FAKE_SEED_STANDINGS, StandingsRecord } from '@/lib/db/seed-data';

/**
 * Returns the seeded league standings snapshot with PINT FC highlighted,
 * resilient to external network outages (AC-2.4.3).
 */
export async function getStandingsSnapshot(): Promise<StandingsRecord[]> {
  return [...FAKE_SEED_STANDINGS].sort((a, b) => a.rank - b.rank);
}

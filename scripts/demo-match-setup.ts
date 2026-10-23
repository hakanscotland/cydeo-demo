/**
 * PINT FC — Live Class Demo Matchday Configuration Script
 *
 * Usage:
 *   npx tsx scripts/demo-match-setup.ts [offset]
 *
 * Examples:
 *   npx tsx scripts/demo-match-setup.ts +15m   # Set RSVP cutoff to expire in 15 minutes
 *   npx tsx scripts/demo-match-setup.ts +30s   # Set RSVP cutoff to expire in 30 seconds
 *   npx tsx scripts/demo-match-setup.ts close  # Set RSVP cutoff to 1 hour in the past (closed)
 *   npx tsx scripts/demo-match-setup.ts reset  # Reset cutoff to default fixture kickoff minus 24h
 */

import { FAKE_SEED_MATCHES, MatchRecord } from '../src/lib/db/seed-data';

const DEMO_FIXTURE_ID = '22222222-0000-4000-8000-000000000007';

export function configureDemoMatchCutoff(offsetArg = '+15m'): { cutoffIso: string; isClosed: boolean } {
  const fixture = FAKE_SEED_MATCHES.find((f: MatchRecord) => f.id === DEMO_FIXTURE_ID);
  if (!fixture) {
    throw new Error(`Demo fixture ${DEMO_FIXTURE_ID} not found.`);
  }

  const now = new Date();
  let targetCutoff: Date;

  if (offsetArg === 'close') {
    targetCutoff = new Date(now.getTime() - 60 * 60 * 1000); // 1h ago
  } else if (offsetArg === 'reset') {
    targetCutoff = new Date(Date.parse(fixture.kickoff_at) - 24 * 60 * 60 * 1000);
  } else if (offsetArg.endsWith('s')) {
    const seconds = parseInt(offsetArg.replace('+', '').replace('s', ''), 10) || 30;
    targetCutoff = new Date(now.getTime() + seconds * 1000);
  } else if (offsetArg.endsWith('m')) {
    const minutes = parseInt(offsetArg.replace('+', '').replace('m', ''), 10) || 15;
    targetCutoff = new Date(now.getTime() + minutes * 60 * 1000);
  } else {
    targetCutoff = new Date(now.getTime() + 15 * 60 * 1000);
  }

  fixture.rsvp_cutoff_at = targetCutoff.toISOString();
  const isClosed = targetCutoff.getTime() <= now.getTime();

  console.log(`[PINT FC Demo Setup] Fixture: PINT FC vs ${fixture.opponent_name}`);
  console.log(`[PINT FC Demo Setup] Kickoff: ${fixture.kickoff_at}`);
  console.log(`[PINT FC Demo Setup] Cutoff set to: ${fixture.rsvp_cutoff_at}`);
  console.log(`[PINT FC Demo Setup] Cutoff Status: ${isClosed ? 'CLOSED' : 'OPEN'}`);

  return { cutoffIso: fixture.rsvp_cutoff_at, isClosed };
}

// If run directly from CLI
if (process.argv[1]?.includes('demo-match-setup')) {
  const arg = process.argv[2] || '+15m';
  configureDemoMatchCutoff(arg);
}

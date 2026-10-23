import React from 'react';
import NextMatchHero from '@/components/home/NextMatchHero';
import SeasonRecord from '@/components/home/SeasonRecord';
import LatestResults from '@/components/home/LatestResults';
import MiniStandings from '@/components/home/MiniStandings';
import { getNextFixture, getSeasonRecord, getPublicResults } from '@/lib/data/matches';
import { getStandingsSnapshot } from '@/lib/data/standings';
import { FAKE_SEED_MATCHES } from '@/lib/db/seed-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [fixture, record, results, standings] = await Promise.all([
    getNextFixture(),
    getSeasonRecord(),
    getPublicResults(),
    getStandingsSnapshot(),
  ]);

  const hasCancelledMatch = FAKE_SEED_MATCHES.some(m => m.status === 'cancelled' && m.published);

  return (
    <main
      style={{
        padding: '1.5rem 1rem',
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <header style={{ textAlign: 'center' }}>
        <h1
          style={{
            color: 'var(--color-club-green)',
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          PINT FC
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '0.25rem' }}>
          Official Club Home & Matchday Attendance Coordination
        </p>
      </header>

      <NextMatchHero fixture={fixture} hasCancelledMatch={hasCancelledMatch} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          width: '100%',
        }}
      >
        <SeasonRecord record={record} />
        <MiniStandings standings={standings} />
      </div>

      <LatestResults results={results} />
    </main>
  );
}

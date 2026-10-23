import React from 'react';
import NextMatchHero from '@/components/home/NextMatchHero';
import SeasonRecord from '@/components/home/SeasonRecord';
import LatestResults from '@/components/home/LatestResults';
import MiniStandings from '@/components/home/MiniStandings';
import SquadSpotlight from '@/components/home/SquadSpotlight';
import { getNextFixture, getSeasonRecord, getPublicResults } from '@/lib/data/matches';
import { getStandingsSnapshot } from '@/lib/data/standings';
import { getPublicPlayers } from '@/lib/data/players';
import { FAKE_SEED_MATCHES } from '@/lib/db/seed-data';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [fixture, record, results, standings, players] = await Promise.all([
    getNextFixture(),
    getSeasonRecord(),
    getPublicResults(),
    getStandingsSnapshot(),
    getPublicPlayers(),
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
        <header
          className="reveal"
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
        >
          <img
            src="/brand/pintfc-logo.svg"
            alt="PINT FC crest"
            width={128}
            height={128}
            style={{ display: 'block', filter: 'drop-shadow(0 8px 16px rgba(15,47,36,0.25))' }}
          />
          <div>
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
          </div>
        </header>

        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.1s' }}>
          <NextMatchHero fixture={fixture} hasCancelledMatch={hasCancelledMatch} />
        </div>

        <div
          className="reveal"
          style={{
            ['--reveal-delay' as string]: '0.2s',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            width: '100%',
          }}
        >
          <SeasonRecord record={record} />
          <MiniStandings standings={standings} />
        </div>

        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.28s' }}>
          <SquadSpotlight players={players} />
        </div>

        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.36s' }}>
          <LatestResults results={results} />
        </div>
      </main>
  );
}

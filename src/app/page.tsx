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
        <header className="home-hero reveal">
          <div className="home-hero-copy">
            <img src="/brand/pintfc-logo.svg" alt="PINT FC crest" width={150} height={150} className="home-hero-crest" />
            <h1 className="home-hero-title">PINT FC</h1>
            <p className="home-hero-tagline">Official Club Home &amp; Matchday Attendance Coordination</p>
          </div>
          <img
            src="/brand/football-3d.webp"
            alt=""
            aria-hidden="true"
            width={300}
            height={300}
            className="home-hero-football"
          />
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

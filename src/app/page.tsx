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
    <>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-12%',
            left: '50%',
            width: 'min(1100px, 150vw)',
            height: '620px',
            background:
              'radial-gradient(closest-side, rgba(27,77,62,0.16), rgba(27,77,62,0) 70%)',
            animation: 'drift-glow 14s ease-in-out infinite alternate',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '6%',
            left: '28%',
            width: '480px',
            height: '480px',
            background:
              'radial-gradient(closest-side, rgba(179,143,34,0.12), rgba(179,143,34,0) 70%)',
            animation: 'drift-glow 18s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

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
          <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
            <path
              d="M28 2 L52 11 V27 C52 41 42 51 28 54 C14 51 4 41 4 27 V11 Z"
              fill="var(--color-club-green)"
              stroke="var(--color-accent-gold)"
              strokeWidth="2"
            />
            <path
              d="M28 2 L52 11 V27 C52 41 42 51 28 54 Z"
              fill="var(--color-club-dark)"
              opacity="0.55"
            />
            <text
              x="28"
              y="35"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="700"
              fontSize="20"
              fill="#ffffff"
            >
              PFC
            </text>
          </svg>
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

        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.3s' }}>
          <LatestResults results={results} />
        </div>
      </main>
    </>
  );
}

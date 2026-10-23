import React from 'react';
import PositionalGroup from '@/components/squad/PositionalGroup';
import { getPublicPlayers } from '@/lib/data/players';

export const dynamic = 'force-dynamic';

export default async function SquadPage() {
  const players = await getPublicPlayers();

  const goalkeepers = players.filter(p => p.position === 'goalkeeper');
  const defenders = players.filter(p => p.position === 'defender');
  const midfielders = players.filter(p => p.position === 'midfielder');
  const forwards = players.filter(p => p.position === 'forward');

  return (
    <>
      <div
        aria-hidden="true"
        style={{
          backgroundColor: 'var(--color-club-dark)',
          backgroundImage:
            'repeating-linear-gradient(118deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 28px), radial-gradient(closest-side at 50% -20%, rgba(179,143,34,0.22), rgba(179,143,34,0) 70%)',
          padding: '2.5rem 1rem 3rem',
        }}
      >
        <header
          className="reveal"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 56 56" aria-hidden="true">
            <path
              d="M28 2 L52 11 V27 C52 41 42 51 28 54 C14 51 4 41 4 27 V11 Z"
              fill="var(--color-club-green)"
              stroke="var(--color-accent-gold)"
              strokeWidth="2"
            />
            <text
              x="28"
              y="35"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontWeight="700"
              fontSize="18"
              fill="#ffffff"
            >
              PFC
            </text>
          </svg>
          <h1
            style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.025em',
              margin: 0,
            }}
          >
            First Team Squad
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem' }}>
            Official 2026/27 PINT FC Player Directory
          </p>
        </header>
      </div>

      <main
        style={{
          padding: '2.5rem 1rem 2rem',
          maxWidth: '1000px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.05s' }}>
          <PositionalGroup
            title="Goalkeepers"
            testId="squad-group-goalkeepers"
            players={goalkeepers}
          />
        </div>
        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.12s' }}>
          <PositionalGroup
            title="Defenders"
            testId="squad-group-defenders"
            players={defenders}
          />
        </div>
        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.19s' }}>
          <PositionalGroup
            title="Midfielders"
            testId="squad-group-midfielders"
            players={midfielders}
          />
        </div>
        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.26s' }}>
          <PositionalGroup
            title="Forwards"
            testId="squad-group-forwards"
            players={forwards}
          />
        </div>
      </main>
    </>
  );
}

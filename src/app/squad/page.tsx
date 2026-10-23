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
          <img
            src="/brand/pintfc-logo.svg"
            alt="PINT FC crest"
            width={96}
            height={96}
            style={{ display: 'block', filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.3))' }}
          />
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

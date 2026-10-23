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
    <main
      style={{
        padding: '2rem 1rem',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'var(--color-club-green)',
            letterSpacing: '-0.025em',
            margin: 0,
          }}
        >
          First Team Squad
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: '0.25rem' }}>
          Official 2026/27 PINT FC Player Directory
        </p>
      </header>

      <PositionalGroup
        title="Goalkeepers"
        testId="squad-group-goalkeepers"
        players={goalkeepers}
      />
      <PositionalGroup
        title="Defenders"
        testId="squad-group-defenders"
        players={defenders}
      />
      <PositionalGroup
        title="Midfielders"
        testId="squad-group-midfielders"
        players={midfielders}
      />
      <PositionalGroup
        title="Forwards"
        testId="squad-group-forwards"
        players={forwards}
      />
    </main>
  );
}

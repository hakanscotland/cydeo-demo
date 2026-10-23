'use client';

import React from 'react';
import PlayerCard from './PlayerCard';
import { PublicPlayer } from '@/lib/data/players';

interface PositionalGroupProps {
  title: string;
  testId: string;
  players: PublicPlayer[];
}

export default function PositionalGroup({ title, testId, players }: PositionalGroupProps) {
  if (players.length === 0) return null;

  return (
    <section data-testid={testId} style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '2px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-club-dark)', margin: 0 }}>
          {title}
        </h2>
        <span
          style={{
            fontSize: '0.8rem',
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
          }}
        >
          {players.length}
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { PublicPlayer } from '@/lib/data/players';

interface PlayerCardProps {
  player: PublicPlayer;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Link
      href={`/squad/${player.id}`}
      data-testid="player-card"
      className="player-card-motion"
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: '10px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <div
        style={{
          height: '140px',
          backgroundColor: 'var(--color-bg-page)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
      >
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.display_name}
            data-testid="player-photo"
            className="player-photo-motion"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            data-testid="player-avatar-placeholder"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-club-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 800,
              letterSpacing: '0.02em',
            }}
          >
            {player.display_name
              .split(/\s+/)
              .map(w => w.replace('.', '')[0])
              .filter(Boolean)
              .slice(0, 2)
              .join('')
              .toUpperCase()}
          </div>
        )}

        <span
          data-testid="player-number"
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '6px',
          }}
        >
          #{player.squad_number}
        </span>
      </div>

      <div style={{ padding: '0.75rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <h3
          data-testid="player-name"
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {player.display_name}
        </h3>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            data-testid="player-position"
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              textTransform: 'capitalize',
            }}
          >
            {player.position}
          </span>

          {player.nationality && (
            <span
              data-testid="player-nationality"
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--color-bg-page)',
                color: 'var(--color-text-muted)',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid var(--color-border)',
                fontWeight: 600,
              }}
            >
              {player.nationality}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

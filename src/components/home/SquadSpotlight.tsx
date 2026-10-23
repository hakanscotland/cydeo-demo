import React from 'react';
import Link from 'next/link';
import { PublicPlayer } from '@/lib/data/players';

interface SquadSpotlightProps {
  players: PublicPlayer[];
}

const POSITION_ORDER: PublicPlayer['position'][] = ['forward', 'midfielder', 'defender', 'goalkeeper'];

function pickSpotlight(players: PublicPlayer[], count: number): PublicPlayer[] {
  const byPosition = POSITION_ORDER.map(pos => players.filter(p => p.position === pos));
  const picked: PublicPlayer[] = [];

  for (let i = 0; picked.length < count; i++) {
    let addedAny = false;
    for (const group of byPosition) {
      if (group[i]) {
        picked.push(group[i]);
        addedAny = true;
        if (picked.length >= count) break;
      }
    }
    if (!addedAny) break;
  }

  return picked;
}

export default function SquadSpotlight({ players }: SquadSpotlightProps) {
  const spotlight = pickSpotlight(players, 8);

  if (spotlight.length === 0) return null;

  return (
    <section
      data-testid="squad-spotlight"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem', gap: '1rem', flexWrap: 'wrap' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-club-dark)', fontWeight: 700 }}>
          Squad Spotlight
        </h3>
        <Link
          href="/squad"
          className="cta-button"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: 'var(--color-club-green)',
            border: '1px solid var(--color-club-green)',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
          }}
        >
          View Full Squad →
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'auto',
          padding: '0.5rem 0.5rem 0.75rem',
          margin: '0 -0.5rem',
        }}
      >
        {spotlight.map(player => (
          <Link
            key={player.id}
            href={`/squad/${player.id}`}
            data-testid="spotlight-player-card"
            className="player-card-motion"
            style={{
              flex: '0 0 132px',
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              color: 'inherit',
              borderRadius: '10px',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              backgroundColor: 'var(--color-bg-page)',
            }}
          >
            <div
              style={{
                width: '132px',
                height: '132px',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: 'var(--color-club-dark)',
              }}
            >
              {player.photo_url ? (
                <img
                  src={player.photo_url}
                  alt={player.display_name}
                  className="player-photo-motion"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: 800,
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
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  backgroundColor: 'rgba(15,47,36,0.75)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                }}
              >
                #{player.squad_number}
              </span>
            </div>
            <div style={{ padding: '0.5rem 0.6rem' }}>
              <div
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {player.display_name}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                {player.position}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

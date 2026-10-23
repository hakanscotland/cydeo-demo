import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicPlayerById } from '@/lib/data/players';

export const dynamic = 'force-dynamic';

interface PlayerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const { id } = await params;
  const player = await getPublicPlayerById(id);

  if (!player) {
    notFound();
  }

  return (
    <main
      style={{
        padding: '2rem 1rem',
        maxWidth: '650px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/squad"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-club-green)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          ← Back to Squad
        </Link>
      </div>

      <article
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          style={{
            height: '240px',
            backgroundColor: 'var(--color-club-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {player.photo_url ? (
            <img
              src={player.photo_url}
              alt={player.display_name}
              data-testid="profile-photo"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              data-testid="profile-photo-placeholder"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '3rem',
              }}
            >
              👤
            </div>
          )}

          <div
            data-testid="profile-number"
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              backgroundColor: 'var(--color-accent-gold)',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '1.25rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '8px',
            }}
          >
            #{player.squad_number}
          </div>
        </div>

        <div style={{ padding: '2rem 1.5rem' }}>
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <h1
              data-testid="profile-name"
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--color-club-dark)',
                margin: '0 0 0.5rem',
              }}
            >
              {player.display_name}
            </h1>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span
                data-testid="profile-position"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'var(--color-club-green)',
                  backgroundColor: 'rgba(27, 77, 62, 0.08)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  textTransform: 'capitalize',
                }}
              >
                {player.position}
              </span>

              {player.nationality && (
                <span
                  data-testid="profile-nationality"
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'var(--color-bg-page)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  Nationality: {player.nationality}
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.1rem', color: 'var(--color-club-dark)', marginBottom: '0.5rem' }}>
              Club Biography
            </h2>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              {player.display_name} is registered for the 2026/27 campaign with PINT FC. Wearing shirt number #{player.squad_number}, they feature regularly in our {player.position} line.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}

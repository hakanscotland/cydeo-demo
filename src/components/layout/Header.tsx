'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PlayerUser {
  id: string;
  display_name: string;
  squad_number: number;
}

export default function Header() {
  const [player, setPlayer] = useState<PlayerUser | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data?.player) {
          setPlayer(data.player);
        } else {
          setPlayer(null);
        }
      })
      .catch(() => setPlayer(null));
  }, [pathname]);

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setPlayer(null);
    window.location.href = '/';
  };

  return (
    <header
      style={{
        backgroundColor: 'var(--color-club-green)',
        color: '#ffffff',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
          ⚽ PINT FC
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
          <Link href="/" style={{ color: '#ffffff' }}>
            Home
          </Link>
          <Link href="/squad" style={{ color: '#ffffff' }}>
            Squad
          </Link>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {player ? (
          <>
            <Link
              href="/profile/privacy"
              data-testid="nav-profile-name"
              style={{
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                borderBottom: '1px dotted rgba(255,255,255,0.6)',
              }}
            >
              #{player.squad_number} {player.display_name}
            </Link>
            <button
              onClick={handleSignOut}
              data-testid="sign-out-btn"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                padding: '0.35rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            data-testid="nav-login-btn"
            style={{
              backgroundColor: 'var(--color-accent-gold)',
              color: '#0f172a',
              padding: '0.35rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Player Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

'use client';

import React, { useState } from 'react';
import { FAKE_SEED_PLAYERS } from '@/lib/db/seed-data';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePlayers = FAKE_SEED_PLAYERS.filter(p => !p.archived);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || 'Invalid credentials.');
        setIsSubmitting(false);
        return;
      }

      // Read redirect param or default to root
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get('redirect') || '/';
      window.location.href = redirectUrl;
    } catch {
      setError('A network error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleQuickSelect = (playerEmail: string) => {
    setEmail(playerEmail);
    setPassword('PintFC2026!');
    setError(null);
  };

  return (
    <main style={{ padding: '2rem 1rem', maxWidth: '420px', margin: '0 auto' }}>
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            color: 'var(--color-club-green)',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Player Sign In
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          Sign in to submit your matchday attendance (Going / Not Going) and manage your privacy.
        </p>

        {error && (
          <div
            data-testid="login-error-alert"
            style={{
              backgroundColor: '#fee2e2',
              color: 'var(--color-status-not)',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid #fecaca',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              htmlFor="login-email"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              data-testid="login-email-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
              placeholder="player1@pintfc.test"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              data-testid="login-password-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.6rem',
                border: '1px solid var(--color-border)',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            data-testid="login-submit-btn"
            disabled={isSubmitting}
            style={{
              backgroundColor: 'var(--color-club-green)',
              color: '#ffffff',
              padding: '0.75rem',
              borderRadius: '4px',
              fontWeight: 600,
              fontSize: '0.95rem',
              marginTop: '0.5rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
            🛠️ Demo Player Quick-Select (Local / Preview):
          </label>
          <select
            data-testid="dev-player-select"
            onChange={e => e.target.value && handleQuickSelect(e.target.value)}
            style={{
              width: '100%',
              padding: '0.4rem',
              fontSize: '0.8rem',
              borderRadius: '4px',
              border: '1px solid var(--color-border)',
            }}
          >
            <option value="">Select a seeded player to test...</option>
            {activePlayers.map(p => (
              <option key={p.id} value={p.email}>
                #{p.squad_number} {p.display_name} ({p.position})
              </option>
            ))}
          </select>
        </div>
      </div>
    </main>
  );
}

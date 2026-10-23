import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        padding: '4rem 1rem',
        maxWidth: '500px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '2.5rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚽</div>
        <h1
          data-testid="not-found-heading"
          style={{ fontSize: '1.75rem', color: 'var(--color-club-dark)', marginBottom: '0.5rem' }}
        >
          404 - Page or Player Not Found
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          The requested player profile does not exist, has been archived, or is private.
        </p>
        <Link
          href="/squad"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            fontWeight: 600,
            padding: '0.65rem 1.25rem',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Return to Squad Directory
        </Link>
      </div>
    </main>
  );
}

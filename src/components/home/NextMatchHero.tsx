'use client';

import React from 'react';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';
import { formatKickoff, isCutoffPassed } from '@/lib/rules/time';

export interface NextMatchFixture {
  id: string;
  opponent_name: string;
  opponent_crest_url?: string | null;
  venue_name: string;
  venue_timezone: string;
  kickoff_at: string;
  rsvp_cutoff_at: string;
  competition_type: 'league' | 'friendly';
  status: 'scheduled' | 'cancelled' | 'completed';
}

interface NextMatchHeroProps {
  fixture: NextMatchFixture | null;
  hasCancelledMatch?: boolean;
}

export default function NextMatchHero({ fixture, hasCancelledMatch }: NextMatchHeroProps) {
  if (!fixture) {
    return (
      <section
        data-testid="hero-match-card"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '2rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div data-testid="hero-empty-state">
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-club-dark)', marginBottom: '0.5rem' }}>
            No upcoming fixtures
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            We are currently in the off-season or awaiting new schedule announcements.
          </p>
        </div>
      </section>
    );
  }

  const isClosed = isCutoffPassed(fixture.rsvp_cutoff_at);
  const formattedTime = formatKickoff(fixture.kickoff_at, fixture.venue_timezone || 'Europe/London');
  const isCancelled = fixture.status === 'cancelled';

  return (
    <section
      data-testid="hero-match-card"
      style={{
        backgroundColor: 'var(--color-club-dark)',
        color: '#ffffff',
        padding: '2rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(15, 47, 36, 0.15)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {(isCancelled || hasCancelledMatch) && (
        <div
          data-testid="cancelled-match-alert"
          style={{
            backgroundColor: 'var(--color-status-not)',
            color: '#ffffff',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            display: 'inline-block',
          }}
        >
          MATCH CANCELLED {hasCancelledMatch && !isCancelled ? '(Borough Market FC fixture cancelled)' : ''}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <span
          data-testid="competition-tag"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {fixture.competition_type === 'league' ? 'League Match' : 'Friendly'}
        </span>

        <span
          data-testid="rsvp-cutoff-pill"
          style={{
            backgroundColor: isClosed ? 'var(--color-status-not)' : 'var(--color-status-going)',
            color: '#ffffff',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {isClosed ? 'RSVP Closed' : 'RSVP Open'}
        </span>
      </div>

      <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          Next Fixture
        </p>
        <h2
          data-testid="hero-opponent-name"
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0.25rem 0 0.5rem',
          }}
        >
          PINT FC vs {fixture.opponent_name}
        </h2>
        <p
          data-testid="hero-venue-name"
          style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '0.5rem' }}
        >
          Venue: {fixture.venue_name}
        </p>
        <p
          data-testid="hero-kickoff-time"
          style={{ color: '#e2e8f0', fontSize: '1.1rem', fontWeight: 500 }}
        >
          {formattedTime.dayOfWeek}, {formattedTime.fullDate} at {formattedTime.timeString} ({fixture.venue_timezone})
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem' }}>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Kickoff Countdown</p>
        <CountdownTimer targetUtc={fixture.kickoff_at} />
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <Link
          href={`/fixtures/${fixture.id}`}
          data-testid="view-event-link"
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-accent-gold)',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.75rem 1.75rem',
            borderRadius: '8px',
            transition: 'background-color 0.2s',
          }}
        >
          Matchday & Attendance Details
        </Link>
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import ScoreboardCounters from '@/components/fixtures/ScoreboardCounters';
import RsvpActionBox from '@/components/fixtures/RsvpActionBox';
import AttendeeRoster from '@/components/fixtures/AttendeeRoster';
import { useAttendancePolling, AttendanceCounts } from '@/hooks/useAttendancePolling';
import { formatKickoff } from '@/lib/rules/time';
import { AttendeeRosterItem } from '@/lib/data/rsvps';

interface FixtureDetail {
  id: string;
  opponent_name: string;
  venue_name: string;
  venue_timezone: string;
  kickoff_at: string;
  rsvp_cutoff_at: string;
  competition_type: string;
  status: string;
  is_rsvp_closed: boolean;
}

interface UserRsvp {
  status: 'going' | 'maybe' | 'not_going';
  note: string | null;
}

interface EventPageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_COUNTS: AttendanceCounts = {
  going: 0,
  maybe: 0,
  not_going: 0,
  is_rsvp_closed: false,
};

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);

  const [fixture, setFixture] = useState<FixtureDetail | null>(null);
  const [initialCounts, setInitialCounts] = useState<AttendanceCounts | null>(null);
  const [attendees, setAttendees] = useState<AttendeeRosterItem[]>([]);
  const [userRsvp, setUserRsvp] = useState<UserRsvp | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch(`/api/fixtures/${id}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setFixture(data.fixture);
      setInitialCounts({
        ...data.counts,
        is_rsvp_closed: data.fixture.is_rsvp_closed,
      });
      setAttendees(data.attendees || []);
      setUserRsvp(data.user_rsvp);

      // Check current auth status
      const meRes = await fetch('/api/me');
      setIsLoggedIn(meRes.ok);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const { counts } = useAttendancePolling(
    id,
    initialCounts || DEFAULT_COUNTS,
    5000
  );

  if (loading) {
    return (
      <main style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Loading matchday details...</p>
      </main>
    );
  }

  if (notFound || !fixture) {
    return (
      <main style={{ padding: '4rem 1rem', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.75rem', color: 'var(--color-club-dark)', marginBottom: '0.5rem' }}>
          Fixture Not Found
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          The requested fixture does not exist or has not been published yet.
        </p>
        <Link
          href="/"
          style={{
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Return to Home
        </Link>
      </main>
    );
  }

  const formattedTime = formatKickoff(fixture.kickoff_at, fixture.venue_timezone || 'Europe/London');
  const isClosed = counts.is_rsvp_closed;

  return (
    <main
      style={{
        padding: '2rem 1rem',
        maxWidth: '960px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-club-green)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          ← Back to Overview
        </Link>
      </div>

      {/* MATCH HEADER & PROJECTOR TITLE */}
      <header
        style={{
          backgroundColor: 'var(--color-club-dark)',
          color: '#ffffff',
          padding: '2rem 1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(15, 47, 36, 0.2)',
        }}
      >
        <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
          <span
            data-testid="fixture-cutoff-pill"
            style={{
              backgroundColor: isClosed ? 'var(--color-status-not)' : 'var(--color-status-going)',
              color: '#ffffff',
              padding: '0.25rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {isClosed ? 'RSVP Closed' : 'RSVP Open'}
          </span>
        </div>

        <h1
          data-testid="fixture-title"
          style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            letterSpacing: '-0.025em',
            margin: '0.5rem 0',
            color: '#ffffff',
          }}
        >
          PINT FC vs {fixture.opponent_name}
        </h1>

        <p
          data-testid="fixture-venue"
          style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '0.25rem' }}
        >
          Venue: {fixture.venue_name}
        </p>

        <p
          data-testid="fixture-kickoff"
          style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 500 }}
        >
          Kickoff: {formattedTime.dayOfWeek}, {formattedTime.fullDate} at {formattedTime.timeString} ({fixture.venue_timezone})
        </p>
      </header>

      {/* SCOREBOARD HIGH-VISIBILITY PROJECTOR COUNTERS */}
      <ScoreboardCounters counts={counts} />

      {/* PLAYER RSVP INTERACTIVE ACTION BOX */}
      <RsvpActionBox
        fixtureId={id}
        isClosed={isClosed}
        initialUserRsvp={userRsvp}
        isLoggedIn={isLoggedIn}
        onRsvpSuccess={loadData}
      />

      {/* ATTENDEE ROSTER */}
      <AttendeeRoster attendees={attendees} />
    </main>
  );
}

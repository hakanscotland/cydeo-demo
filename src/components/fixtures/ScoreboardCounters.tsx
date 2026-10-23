'use client';

import React from 'react';
import { AttendanceCounts } from '@/hooks/useAttendancePolling';

interface ScoreboardCountersProps {
  counts: AttendanceCounts;
}

export default function ScoreboardCounters({ counts }: ScoreboardCountersProps) {
  return (
    <section
      data-testid="scoreboard-counters"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {/* GOING */}
      <div
        style={{
          backgroundColor: '#ecfdf5',
          border: '2px solid var(--color-status-going)',
          borderRadius: '12px',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(21, 128, 61, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--color-status-going)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.25rem',
          }}
        >
          Going
        </div>
        <div
          data-testid="count-going"
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--color-status-going)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counts.going}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '0.25rem' }}>Confirmed</div>
      </div>

      {/* MAYBE */}
      <div
        style={{
          backgroundColor: '#fffbeb',
          border: '2px solid var(--color-status-maybe)',
          borderRadius: '12px',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(180, 83, 9, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--color-status-maybe)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.25rem',
          }}
        >
          Maybe
        </div>
        <div
          data-testid="count-maybe"
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--color-status-maybe)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counts.maybe}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.25rem' }}>Uncertain</div>
      </div>

      {/* NOT GOING */}
      <div
        style={{
          backgroundColor: '#fef2f2',
          border: '2px solid var(--color-status-not)',
          borderRadius: '12px',
          padding: '1.5rem 1rem',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(185, 28, 28, 0.1)',
        }}
      >
        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--color-status-not)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.25rem',
          }}
        >
          Not Going
        </div>
        <div
          data-testid="count-not_going"
          style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--color-status-not)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {counts.not_going}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#991b1b', marginTop: '0.25rem' }}>Unavailable</div>
      </div>
    </section>
  );
}

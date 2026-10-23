'use client';

import React from 'react';
import { AttendeeRosterItem } from '@/lib/data/rsvps';

interface AttendeeRosterProps {
  attendees: AttendeeRosterItem[];
}

export default function AttendeeRoster({ attendees }: AttendeeRosterProps) {
  const going = attendees.filter(a => a.status === 'going');
  const maybe = attendees.filter(a => a.status === 'maybe');
  const notGoing = attendees.filter(a => a.status === 'not_going');

  const renderPlayerList = (items: AttendeeRosterItem[], emptyText: string) => {
    if (items.length === 0) {
      return (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
          {emptyText}
        </p>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map(player => (
          <div
            key={player.player_id}
            data-testid={`attendee-${player.player_id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem',
              backgroundColor: 'var(--color-bg-page)',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  color: 'var(--color-club-green)',
                  backgroundColor: 'rgba(27, 77, 62, 0.08)',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                }}
              >
                #{player.squad_number}
              </span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                {player.display_name}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
              {player.position}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      data-testid="attendee-roster"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '1.25rem 1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        boxSizing: 'border-box',
        maxWidth: '100%',
      }}
    >
      <h2 style={{ fontSize: '1.25rem', color: 'var(--color-club-dark)', fontWeight: 800, marginBottom: '1.25rem' }}>
        Teammate Attendance Roster
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
        {/* GOING COLUMN */}
        <div data-testid="roster-section-going">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-status-going)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-status-going)', margin: 0 }}>
              Going ({going.length})
            </h3>
          </div>
          {renderPlayerList(going, 'No confirmed players yet.')}
        </div>

        {/* MAYBE COLUMN */}
        <div data-testid="roster-section-maybe">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-status-maybe)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-status-maybe)', margin: 0 }}>
              Maybe ({maybe.length})
            </h3>
          </div>
          {renderPlayerList(maybe, 'No players marked maybe.')}
        </div>

        {/* NOT GOING COLUMN */}
        <div data-testid="roster-section-not_going">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-status-not)' }} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-status-not)', margin: 0 }}>
              Not Going ({notGoing.length})
            </h3>
          </div>
          {renderPlayerList(notGoing, 'No players marked unavailable.')}
        </div>
      </div>
    </section>
  );
}

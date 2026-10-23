'use client';

import React from 'react';
import { StandingsRecord } from '@/lib/db/seed-data';

interface MiniStandingsProps {
  standings: StandingsRecord[];
}

export default function MiniStandings({ standings }: MiniStandingsProps) {
  if (!standings || standings.length === 0) {
    return (
      <section
        data-testid="mini-standings-table"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-club-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
          League Standings
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }}>Standings table currently unavailable.</p>
      </section>
    );
  }

  return (
    <section
      data-testid="mini-standings-table"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-club-dark)', fontWeight: 700 }}>
          League Table Snapshot
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Division 1
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <th style={{ padding: '0.5rem 0.5rem', fontWeight: 600 }}>Pos</th>
              <th style={{ padding: '0.5rem 0.5rem', fontWeight: 600 }}>Team</th>
              <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center', fontWeight: 600 }}>P</th>
              <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center', fontWeight: 600 }}>GD</th>
              <th style={{ padding: '0.5rem 0.5rem', textAlign: 'center', fontWeight: 700 }}>Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const isPintFc = row.is_pint_fc;

              return (
                <tr
                  key={row.id}
                  data-testid={isPintFc ? 'standings-row-pintfc' : undefined}
                  data-highlighted={isPintFc ? 'true' : undefined}
                  className={isPintFc ? 'standings-row-highlight' : undefined}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: isPintFc ? 'rgba(27, 77, 62, 0.08)' : 'transparent',
                    backgroundImage: isPintFc
                      ? 'linear-gradient(100deg, transparent 20%, rgba(179,143,34,0.22) 36%, transparent 52%)'
                      : undefined,
                    fontWeight: isPintFc ? 700 : 400,
                    color: isPintFc ? 'var(--color-club-green)' : 'var(--color-text-main)',
                  }}
                >
                  <td style={{ padding: '0.6rem 0.5rem' }}>{row.rank}</td>
                  <td style={{ padding: '0.6rem 0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>{row.team_name}</span>
                      {isPintFc && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            backgroundColor: 'var(--color-club-green)',
                            color: '#ffffff',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}
                        >
                          CLUB
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>{row.played}</td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                    {row.goal_difference > 0 ? `+${row.goal_difference}` : row.goal_difference}
                  </td>
                  <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center', fontWeight: 800 }}>{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { PublicResult } from '@/lib/data/matches';
import { formatKickoff } from '@/lib/rules/time';

interface LatestResultsProps {
  results: PublicResult[];
}

export default function LatestResults({ results }: LatestResultsProps) {
  if (!results || results.length === 0) {
    return (
      <section
        data-testid="latest-results-list"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-club-dark)', fontWeight: 700, marginBottom: '0.5rem' }}>
          Latest Results
        </h3>
        <p style={{ color: 'var(--color-text-muted)' }}>No completed match results yet this season.</p>
      </section>
    );
  }

  const getBadgeStyle = (outcome: 'W' | 'D' | 'L') => {
    switch (outcome) {
      case 'W':
        return { backgroundColor: 'var(--color-status-going)', color: '#ffffff' };
      case 'D':
        return { backgroundColor: 'var(--color-status-maybe)', color: '#ffffff' };
      case 'L':
        return { backgroundColor: 'var(--color-status-not)', color: '#ffffff' };
    }
  };

  return (
    <section
      data-testid="latest-results-list"
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
          Latest Results
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          Published Matches
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {results.map((result) => {
          const formatted = formatKickoff(result.kickoff_at, 'Europe/London');
          const isHome = result.home_or_away === 'home';

          return (
            <div
              key={result.id}
              data-testid="result-card"
              className="result-row-motion"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-bg-page)',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  data-testid="match-outcome-badge"
                  style={{
                    ...getBadgeStyle(result.outcome),
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                  }}
                >
                  {result.outcome}
                </span>

                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {isHome ? `PINT FC vs ${result.opponent_name}` : `${result.opponent_name} vs PINT FC`}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {formatted.fullDate} • {result.competition_type === 'league' ? 'League' : 'Friendly'}
                  </div>
                </div>
              </div>

              <div
                data-testid="match-score"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--color-club-dark)',
                  letterSpacing: '0.05em',
                  padding: '0.2rem 0.6rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border)',
                }}
              >
                {isHome
                  ? `${result.score_pintfc} - ${result.score_opponent}`
                  : `${result.score_opponent} - ${result.score_pintfc}`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

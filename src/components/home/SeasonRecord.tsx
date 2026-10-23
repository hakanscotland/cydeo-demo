'use client';

import React from 'react';
import { SeasonRecordStats } from '@/lib/data/matches';

interface SeasonRecordProps {
  record: SeasonRecordStats | null;
}

export default function SeasonRecord({ record }: SeasonRecordProps) {
  if (!record) {
    return (
      <div data-testid="season-record-widget" style={{ padding: '1rem', textAlign: 'center' }}>
        Loading record...
      </div>
    );
  }

  return (
    <section
      data-testid="season-record-widget"
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
          2026/27 League Record
        </h3>
        <span
          style={{
            fontSize: '0.8rem',
            backgroundColor: 'var(--color-bg-page)',
            color: 'var(--color-text-muted)',
            padding: '0.2rem 0.6rem',
            borderRadius: '4px',
            border: '1px solid var(--color-border)',
          }}
        >
          Official League Fixtures
        </span>
      </div>

      <div
        data-testid="record-wdl"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          textAlign: 'center',
          marginBottom: '1.25rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ padding: '0.5rem 0.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Played</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>{record.played}</div>
        </div>
        <div style={{ padding: '0.5rem 0.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-status-going)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Won</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-status-going)', marginTop: '0.2rem' }}>{record.won}</div>
        </div>
        <div style={{ padding: '0.5rem 0.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-status-maybe)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Drawn</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-status-maybe)', marginTop: '0.2rem' }}>{record.drawn}</div>
        </div>
        <div style={{ padding: '0.5rem 0.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-status-not)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Lost</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-status-not)', marginTop: '0.2rem' }}>{record.lost}</div>
        </div>
      </div>

      <div
        data-testid="record-goals"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0.5rem 0.5rem 0',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginRight: '0.4rem' }}>Goals For:</span>
          <strong style={{ color: 'var(--color-text-main)', fontSize: '1rem' }}>{record.goals_for}</strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginRight: '0.4rem' }}>Goals Against:</span>
          <strong style={{ color: 'var(--color-text-main)', fontSize: '1rem' }}>{record.goals_against}</strong>
        </div>
        <div style={{ color: 'var(--color-border)' }}>|</div>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginRight: '0.4rem' }}>Goal Difference:</span>
          <strong
            style={{
              color: record.goal_difference > 0 ? 'var(--color-status-going)' : record.goal_difference < 0 ? 'var(--color-status-not)' : 'var(--color-text-main)',
              fontSize: '1rem',
            }}
          >
            {record.goal_difference > 0 ? `+${record.goal_difference}` : record.goal_difference}
          </strong>
        </div>
      </div>
    </section>
  );
}

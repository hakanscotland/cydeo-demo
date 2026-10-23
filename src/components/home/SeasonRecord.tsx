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
          gap: '0.75rem',
          textAlign: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ backgroundColor: 'var(--color-bg-page)', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Played</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{record.played}</div>
        </div>
        <div style={{ backgroundColor: '#ecfdf5', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-status-going)', textTransform: 'uppercase' }}>Won</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-going)' }}>{record.won}</div>
        </div>
        <div style={{ backgroundColor: '#fffbeb', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-status-maybe)', textTransform: 'uppercase' }}>Drawn</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-maybe)' }}>{record.drawn}</div>
        </div>
        <div style={{ backgroundColor: '#fef2f2', padding: '0.75rem 0.5rem', borderRadius: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-status-not)', textTransform: 'uppercase' }}>Lost</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-status-not)' }}>{record.lost}</div>
        </div>
      </div>

      <div
        data-testid="record-goals"
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--color-bg-page)',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
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

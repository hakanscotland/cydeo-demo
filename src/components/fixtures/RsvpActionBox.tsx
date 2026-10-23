'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface RsvpActionBoxProps {
  fixtureId: string;
  isClosed: boolean;
  initialUserRsvp: { status: 'going' | 'maybe' | 'not_going'; note: string | null } | null;
  isLoggedIn: boolean;
  onRsvpSuccess: () => void;
}

export default function RsvpActionBox({
  fixtureId,
  isClosed,
  initialUserRsvp,
  isLoggedIn,
  onRsvpSuccess,
}: RsvpActionBoxProps) {
  const [selectedStatus, setSelectedStatus] = useState<'going' | 'maybe' | 'not_going'>(
    initialUserRsvp?.status || 'going'
  );
  const [note, setNote] = useState<string>(initialUserRsvp?.note || '');
  const [currentRsvp, setCurrentRsvp] = useState(initialUserRsvp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div
        data-testid="rsvp-action-box"
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-club-dark)', marginBottom: '0.5rem' }}>
          Matchday Attendance Coordination
        </h3>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
          Are you playing? Sign in with your player account to record your RSVP before the cutoff.
        </p>
        <Link
          href={`/login?redirect=/fixtures/${fixtureId}`}
          style={{
            display: 'inline-block',
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            fontWeight: 700,
            padding: '0.65rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
          }}
        >
          Sign In to Submit RSVP
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessNotice(null);

    try {
      const res = await fetch(`/api/fixtures/${fixtureId}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus, note }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error?.message || 'Failed to submit RSVP.');
        return;
      }

      setCurrentRsvp({ status: selectedStatus, note });
      setSuccessNotice(`Attendance successfully updated to ${selectedStatus.toUpperCase()}.`);
      onRsvpSuccess();
    } catch {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="rsvp-action-box"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-club-dark)', fontWeight: 800 }}>
          My Match Attendance
        </h3>

        {currentRsvp ? (
          <div
            data-testid="user-rsvp-status"
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              backgroundColor:
                currentRsvp.status === 'going'
                  ? 'var(--color-status-going)'
                  : currentRsvp.status === 'maybe'
                  ? 'var(--color-status-maybe)'
                  : 'var(--color-status-not)',
              color: '#ffffff',
            }}
          >
            Your RSVP: {currentRsvp.status.replace('_', ' ').toUpperCase()}
          </div>
        ) : (
          <div
            data-testid="user-rsvp-status"
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            No RSVP Recorded
          </div>
        )}
      </div>

      {isClosed && (
        <div
          data-testid="rsvp-closed-alert"
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: 'var(--color-status-not)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          🔒 RSVP is now closed. The cutoff deadline for this fixture has passed.
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            color: 'var(--color-status-not)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      {successNotice && (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            color: 'var(--color-status-going)',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          ✓ {successNotice}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            data-testid="rsvp-btn-going"
            disabled={isClosed}
            onClick={() => setSelectedStatus('going')}
            style={{
              padding: '0.85rem 0.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: selectedStatus === 'going' ? '2px solid var(--color-status-going)' : '1px solid var(--color-border)',
              backgroundColor: selectedStatus === 'going' ? '#ecfdf5' : 'var(--color-bg-page)',
              color: selectedStatus === 'going' ? 'var(--color-status-going)' : 'var(--color-text-main)',
              cursor: isClosed ? 'not-allowed' : 'pointer',
              opacity: isClosed ? 0.6 : 1,
            }}
          >
            ✓ Going
          </button>

          <button
            type="button"
            data-testid="rsvp-btn-maybe"
            disabled={isClosed}
            onClick={() => setSelectedStatus('maybe')}
            style={{
              padding: '0.85rem 0.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: selectedStatus === 'maybe' ? '2px solid var(--color-status-maybe)' : '1px solid var(--color-border)',
              backgroundColor: selectedStatus === 'maybe' ? '#fffbeb' : 'var(--color-bg-page)',
              color: selectedStatus === 'maybe' ? 'var(--color-status-maybe)' : 'var(--color-text-main)',
              cursor: isClosed ? 'not-allowed' : 'pointer',
              opacity: isClosed ? 0.6 : 1,
            }}
          >
            ? Maybe
          </button>

          <button
            type="button"
            data-testid="rsvp-btn-not_going"
            disabled={isClosed}
            onClick={() => setSelectedStatus('not_going')}
            style={{
              padding: '0.85rem 0.5rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: selectedStatus === 'not_going' ? '2px solid var(--color-status-not)' : '1px solid var(--color-border)',
              backgroundColor: selectedStatus === 'not_going' ? '#fef2f2' : 'var(--color-bg-page)',
              color: selectedStatus === 'not_going' ? 'var(--color-status-not)' : 'var(--color-text-main)',
              cursor: isClosed ? 'not-allowed' : 'pointer',
              opacity: isClosed ? 0.6 : 1,
            }}
          >
            ✕ Not Going
          </button>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="rsvp-note-input" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
            Private Note to Captain (Never shown to teammates):
          </label>
          <input
            id="rsvp-note-input"
            type="text"
            data-testid="rsvp-note-input"
            disabled={isClosed}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. Can drive 3 passengers, or late arrival"
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid var(--color-border)',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
              backgroundColor: isClosed ? 'var(--color-bg-page)' : 'var(--color-bg-surface)',
            }}
          />
        </div>

        <button
          type="submit"
          data-testid="rsvp-submit-btn"
          disabled={isClosed || isSubmitting}
          style={{
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            cursor: isClosed || isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isClosed || isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? 'Saving...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
}

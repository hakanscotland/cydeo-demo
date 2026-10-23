'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlayerProfile {
  id: string;
  squad_number: number;
  full_name: string;
  display_name: string;
  email: string;
  consents: {
    photo: boolean;
    nationality: boolean;
    stats: boolean;
  };
}

export default function PrivacySettingsPage() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [consentPhoto, setConsentPhoto] = useState(false);
  const [consentNationality, setConsentNationality] = useState(false);
  const [consentStats, setConsentStats] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then(res => {
        if (!res.ok) {
          router.push('/login?redirect=/profile/privacy');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data?.player) {
          setProfile(data.player);
          setConsentPhoto(data.player.consents.photo);
          setConsentNationality(data.player.consents.nationality);
          setConsentStats(data.player.consents.stats);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login?redirect=/profile/privacy');
      });
  }, [router]);

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/me/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent_photo: consentPhoto,
          consent_nationality: consentNationality,
          consent_stats: consentStats,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
      }
    } catch {
      // Error handling
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    await fetch('/api/auth/logout-all', { method: 'POST' });
    window.location.href = '/login';
  };

  if (loading) {
    return <main style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</main>;
  }

  if (!profile) {
    return null;
  }

  return (
    <main style={{ padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--color-club-green)', marginBottom: '1.5rem' }}>
        My Privacy Settings
      </h1>

      <form
        onSubmit={handleSavePrivacy}
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-club-dark)' }}>
          Public Profile Consents
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          Choose what information is visible to fans on the public website and squad directory. Changes take effect immediately.
        </p>

        {saveSuccess && (
          <div
            data-testid="privacy-success-msg"
            style={{
              backgroundColor: '#ecfdf5',
              color: 'var(--color-status-going)',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              border: '1px solid #a7f3d0',
              fontWeight: 600,
            }}
          >
            ✓ Privacy preferences updated successfully.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              data-testid="toggle-consent-photo"
              checked={consentPhoto}
              onChange={e => setConsentPhoto(e.target.checked)}
            />
            <span style={{ fontSize: '0.95rem' }}>Show my photo on the public squad page and match rosters</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              data-testid="toggle-consent-nationality"
              checked={consentNationality}
              onChange={e => setConsentNationality(e.target.checked)}
            />
            <span style={{ fontSize: '0.95rem' }}>Show my nationality flag on my public profile</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              data-testid="toggle-consent-stats"
              checked={consentStats}
              onChange={e => setConsentStats(e.target.checked)}
            />
            <span style={{ fontSize: '0.95rem' }}>Show my personal performance stats on match summaries</span>
          </label>
        </div>

        <button
          type="submit"
          data-testid="save-privacy-btn"
          disabled={isSaving}
          style={{
            backgroundColor: 'var(--color-club-green)',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: isSaving ? 'not-allowed' : 'pointer',
          }}
        >
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>

      <div
        style={{
          backgroundColor: '#fff1f2',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #fecdd3',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', color: 'var(--color-status-not)', marginBottom: '0.5rem' }}>
          Device Sessions
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#881337', marginBottom: '1rem' }}>
          If you signed in on a teammate or shared device, you can terminate all active sessions immediately.
        </p>
        <button
          onClick={handleSignOutAllDevices}
          data-testid="sign-out-all-devices-btn"
          style={{
            backgroundColor: 'var(--color-status-not)',
            color: '#ffffff',
            padding: '0.6rem 1rem',
            borderRadius: '4px',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Sign Out of All Devices
        </button>
      </div>
    </main>
  );
}

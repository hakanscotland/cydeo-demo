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
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/login?redirect=/profile/privacy');
      });
  }, [router]);

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

      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-club-dark)' }}>
          Public Profile Consents
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Choose what information is visible to fans on the public website and squad directory.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              data-testid="toggle-consent-photo"
              defaultChecked={profile.consents.photo}
            />
            <span>Show my photo on the public squad page</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              data-testid="toggle-consent-nationality"
              defaultChecked={profile.consents.nationality}
            />
            <span>Show my nationality flag on my profile</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              data-testid="toggle-consent-stats"
              defaultChecked={profile.consents.stats}
            />
            <span>Show my personal performance stats</span>
          </label>
        </div>
      </div>

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

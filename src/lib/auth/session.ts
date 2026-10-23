import { cookies } from 'next/headers';
import { FAKE_SEED_PLAYERS, PlayerRecord } from '@/lib/db/seed-data';

export const SESSION_COOKIE_NAME = 'pintfc_session';
export const STANDARD_TEST_PASSWORD = 'PintFC2026!';

// In-memory revocation timestamps for multi-device logout
const getRevocationMap = (): Map<string, number> => {
  if (!(globalThis as unknown as { __pintfc_revoked_at?: Map<string, number> }).__pintfc_revoked_at) {
    (globalThis as unknown as { __pintfc_revoked_at: Map<string, number> }).__pintfc_revoked_at = new Map<string, number>();
  }
  return (globalThis as unknown as { __pintfc_revoked_at: Map<string, number> }).__pintfc_revoked_at;
};

export interface SessionData {
  playerId: string;
  email: string;
  displayName: string;
  issuedAt: number;
}

export function validateCredentials(email: string, password: string): PlayerRecord | null {
  const normalizedEmail = email.trim().toLowerCase();
  const player = FAKE_SEED_PLAYERS.find(p => p.email.toLowerCase() === normalizedEmail && !p.archived);

  if (!player) return null;
  if (password !== STANDARD_TEST_PASSWORD) return null;

  return player;
}

export async function setSessionCookie(player: PlayerRecord) {
  const cookieStore = await cookies();
  const sessionData: SessionData = {
    playerId: player.id,
    email: player.email,
    displayName: player.display_name,
    issuedAt: Date.now() + 50,
  };

  const serialized = Buffer.from(JSON.stringify(sessionData)).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSessionUser(): Promise<PlayerRecord | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) return null;

  try {
    const raw = Buffer.from(sessionCookie.value, 'base64').toString('utf8');
    const data: SessionData = JSON.parse(raw);

    // Check if player's sessions were globally revoked before this session was issued
    const revokedAt = getRevocationMap().get(data.playerId);
    if (revokedAt && data.issuedAt <= revokedAt) {
      return null;
    }

    const player = FAKE_SEED_PLAYERS.find(p => p.id === data.playerId && !p.archived);
    return player || null;
  } catch {
    return null;
  }
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function revokeAllPlayerSessions(playerId: string) {
  getRevocationMap().set(playerId, Date.now());
}

import { FAKE_SEED_PLAYERS, PlayerRecord } from '@/lib/db/seed-data';

export interface PublicPlayer {
  id: string;
  squad_number: number;
  display_name: string;
  position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
  photo_url: string | null;
  nationality: string | null;
}

/**
 * Transforms a raw database player record into the public representation,
 * enforcing Invariant 1 (zero PII) and view_public_players rules.
 */
export function toPublicPlayer(p: PlayerRecord): PublicPlayer | null {
  // AC-4.1.2: Archived players are completely excluded
  if (p.archived) return null;

  // AC-4.3.3: Minor safeguarding - hide under-18 players without guardian consent and opt-in
  if (p.is_under_18 && (!p.guardian_consent || !p.opt_in)) {
    return null;
  }

  // AC-4.3.1: Invariant 1 - Zero public PII leakage (no email, phone, DOB, guardian info)
  // AC-4.3.2: Granular consent enforcement
  return {
    id: p.id,
    squad_number: p.squad_number,
    display_name: p.display_name,
    position: p.position,
    photo_url: p.consent_photo ? (p.photo_url || null) : null,
    nationality: p.consent_nationality ? (p.nationality || null) : null,
  };
}

/**
 * Retrieves all publicly visible squad players (grouped or flat),
 * mirroring Postgres view_public_players.
 */
export async function getPublicPlayers(): Promise<PublicPlayer[]> {
  return FAKE_SEED_PLAYERS
    .map(toPublicPlayer)
    .filter((p): p is PublicPlayer => p !== null);
}

/**
 * Retrieves a single player's public profile by ID,
 * returning null if the player does not exist, is archived, or is an unconsented minor.
 */
export async function getPublicPlayerById(id: string): Promise<PublicPlayer | null> {
  const raw = FAKE_SEED_PLAYERS.find(p => p.id === id);
  if (!raw) return null;
  return toPublicPlayer(raw);
}

import { FAKE_SEED_PLAYERS } from '@/lib/db/seed-data';
import { PublicPlayer, toPublicPlayer } from '@/lib/data/players';

export interface PrivacyConsentsUpdate {
  consent_photo?: boolean;
  consent_nationality?: boolean;
  consent_stats?: boolean;
}

/**
 * Updates privacy consent flags for a given player in memory/database.
 * Reflects immediately across public directory and profile views.
 */
export function updatePlayerConsents(
  playerId: string,
  updates: PrivacyConsentsUpdate
): PublicPlayer | null {
  const player = FAKE_SEED_PLAYERS.find(p => p.id === playerId);
  if (!player) return null;

  if (typeof updates.consent_photo === 'boolean') {
    player.consent_photo = updates.consent_photo;
  }
  if (typeof updates.consent_nationality === 'boolean') {
    player.consent_nationality = updates.consent_nationality;
  }
  if (typeof updates.consent_stats === 'boolean') {
    player.consent_stats = updates.consent_stats;
  }

  return toPublicPlayer(player);
}

/**
 * Validates that an object contains zero PII fields (Invariant 1 check).
 */
export function verifyZeroPii(record: Record<string, unknown>): boolean {
  const restrictedKeys = [
    'email',
    'phone',
    'date_of_birth',
    'guardian_name',
    'guardian_email',
    'rsvp_note',
  ];

  for (const key of restrictedKeys) {
    if (key in record && record[key] !== undefined && record[key] !== null) {
      return false;
    }
  }

  return true;
}

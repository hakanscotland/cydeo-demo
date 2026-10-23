import { FAKE_SEED_MATCHES, MatchRecord } from '@/lib/db/seed-data';

export interface PublicResult {
  id: string;
  competition_type: 'league' | 'friendly';
  opponent_name: string;
  opponent_crest_url: string | null;
  venue_name: string;
  kickoff_at: string;
  home_or_away: 'home' | 'away';
  score_pintfc: number;
  score_opponent: number;
  outcome: 'W' | 'D' | 'L';
}

export interface SeasonRecordStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

/**
 * Returns published and completed match results in reverse chronological order,
 * mirroring PostgreSQL view_public_results.
 * Excludes draft and unpublished results (AC-2.3.2).
 */
export async function getPublicResults(): Promise<PublicResult[]> {
  return FAKE_SEED_MATCHES
    .filter((m: MatchRecord) => m.published === true && m.status === 'completed' && m.score_pintfc !== null && m.score_opponent !== null)
    .sort((a, b) => new Date(b.kickoff_at).getTime() - new Date(a.kickoff_at).getTime())
    .map(m => {
      const pScore = m.score_pintfc!;
      const oScore = m.score_opponent!;
      const outcome: 'W' | 'D' | 'L' = pScore > oScore ? 'W' : pScore === oScore ? 'D' : 'L';

      return {
        id: m.id,
        competition_type: m.competition_type,
        opponent_name: m.opponent_name,
        opponent_crest_url: m.opponent_crest_url || null,
        venue_name: m.venue_name,
        kickoff_at: m.kickoff_at,
        home_or_away: m.home_or_away,
        score_pintfc: pScore,
        score_opponent: oScore,
        outcome,
      };
    });
}

/**
 * Returns aggregated season record for official league fixtures only,
 * mirroring PostgreSQL view_season_record.
 * Excludes unpublished matches (AC-2.2.3) and friendly matches (AC-2.2.4).
 */
export async function getSeasonRecord(): Promise<SeasonRecordStats> {
  const leagueMatches = FAKE_SEED_MATCHES.filter(
    (m: MatchRecord) =>
      m.published === true &&
      m.status === 'completed' &&
      m.competition_type === 'league' &&
      m.score_pintfc !== null &&
      m.score_opponent !== null
  );

  let won = 0;
  let drawn = 0;
  let lost = 0;
  let gf = 0;
  let ga = 0;

  for (const match of leagueMatches) {
    const pScore = match.score_pintfc!;
    const oScore = match.score_opponent!;

    gf += pScore;
    ga += oScore;

    if (pScore > oScore) {
      won++;
    } else if (pScore === oScore) {
      drawn++;
    } else {
      lost++;
    }
  }

  return {
    played: leagueMatches.length,
    won,
    drawn,
    lost,
    goals_for: gf,
    goals_against: ga,
    goal_difference: gf - ga,
  };
}

/**
 * Returns the next upcoming fixture for the club.
 */
export async function getNextFixture(): Promise<MatchRecord | null> {
  const upcoming = FAKE_SEED_MATCHES
    .filter(m => m.published === true && m.status === 'scheduled')
    .sort((a, b) => new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime());

  return upcoming[0] || null;
}

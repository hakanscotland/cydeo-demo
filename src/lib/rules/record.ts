import { MatchRecord } from '@/lib/db/seed-data';

export interface SeasonRecordResult {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

export function calculateRecordFromMatches(matches: MatchRecord[]): SeasonRecordResult {
  const publishedLeagueMatches = matches.filter(
    m => m.published === true && m.status === 'completed' && m.competition_type === 'league' && m.score_pintfc !== null && m.score_opponent !== null
  );

  let won = 0;
  let drawn = 0;
  let lost = 0;
  let gf = 0;
  let ga = 0;

  for (const match of publishedLeagueMatches) {
    const p = match.score_pintfc!;
    const o = match.score_opponent!;

    gf += p;
    ga += o;

    if (p > o) {
      won++;
    } else if (p === o) {
      drawn++;
    } else {
      lost++;
    }
  }

  return {
    played: publishedLeagueMatches.length,
    won,
    drawn,
    lost,
    goals_for: gf,
    goals_against: ga,
    goal_difference: gf - ga,
  };
}

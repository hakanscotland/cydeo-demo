import { describe, it, expect } from 'vitest';
import { calculateRecordFromMatches } from '@/lib/rules/record';
import { MatchRecord } from '@/lib/db/seed-data';

describe('Season Record Calculation Rules', () => {
  it('AC-2.2.1: Season record calculates accurate Win-Draw-Loss aggregates', () => {
    const mockMatches: MatchRecord[] = [
      {
        id: '1',
        season_id: 's1',
        competition_type: 'league',
        opponent_name: 'Opponent A',
        venue_name: 'Pitch 1',
        venue_timezone: 'Europe/London',
        kickoff_at: '2026-09-01T15:00:00.000Z',
        rsvp_cutoff_at: '2026-09-01T14:00:00.000Z',
        status: 'completed',
        home_or_away: 'home',
        score_pintfc: 3,
        score_opponent: 1,
        published: true,
      },
      {
        id: '2',
        season_id: 's1',
        competition_type: 'league',
        opponent_name: 'Opponent B',
        venue_name: 'Pitch 2',
        venue_timezone: 'Europe/London',
        kickoff_at: '2026-09-08T15:00:00.000Z',
        rsvp_cutoff_at: '2026-09-08T14:00:00.000Z',
        status: 'completed',
        home_or_away: 'away',
        score_pintfc: 2,
        score_opponent: 2,
        published: true,
      },
      {
        id: '3',
        season_id: 's1',
        competition_type: 'league',
        opponent_name: 'Opponent C',
        venue_name: 'Pitch 1',
        venue_timezone: 'Europe/London',
        kickoff_at: '2026-09-15T15:00:00.000Z',
        rsvp_cutoff_at: '2026-09-15T14:00:00.000Z',
        status: 'completed',
        home_or_away: 'home',
        score_pintfc: 0,
        score_opponent: 1,
        published: true,
      },
    ];

    const record = calculateRecordFromMatches(mockMatches);
    expect(record.played).toBe(3);
    expect(record.won).toBe(1);
    expect(record.drawn).toBe(1);
    expect(record.lost).toBe(1);
  });

  it('AC-2.2.2: Season record calculates accurate Goals For, Against, and Diff', () => {
    const mockMatches: MatchRecord[] = [
      {
        id: '1',
        season_id: 's1',
        competition_type: 'league',
        opponent_name: 'Opponent A',
        venue_name: 'Pitch 1',
        venue_timezone: 'Europe/London',
        kickoff_at: '2026-09-01T15:00:00.000Z',
        rsvp_cutoff_at: '2026-09-01T14:00:00.000Z',
        status: 'completed',
        home_or_away: 'home',
        score_pintfc: 4,
        score_opponent: 2,
        published: true,
      },
    ];

    const record = calculateRecordFromMatches(mockMatches);
    expect(record.goals_for).toBe(4);
    expect(record.goals_against).toBe(2);
    expect(record.goal_difference).toBe(2);
  });
});

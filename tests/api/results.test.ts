import { describe, it, expect } from 'vitest';
import { getPublicResults, getSeasonRecord } from '@/lib/data/matches';
import { FAKE_SEED_MATCHES } from '@/lib/db/seed-data';

describe('Results & Season Record Rules', () => {
  it('AC-2.3.2: Draft and unpublished results concealed from results feed', async () => {
    const unpublishedMatch = FAKE_SEED_MATCHES.find(m => m.published === false);
    expect(unpublishedMatch).toBeDefined();

    const publicResults = await getPublicResults();
    const foundDraft = publicResults.find(m => m.id === unpublishedMatch!.id);
    expect(foundDraft).toBeUndefined();
  });

  it('AC-2.2.3: Unpublished match scores strictly excluded from season record', async () => {
    const record = await getSeasonRecord();
    const unpublishedMatch = FAKE_SEED_MATCHES.find(m => m.published === false && m.score_pintfc !== null);
    expect(unpublishedMatch).toBeDefined();

    // Sum of published league matches
    const publishedLeagueMatches = FAKE_SEED_MATCHES.filter(
      m => m.published === true && m.status === 'completed' && m.competition_type === 'league'
    );
    const expectedGF = publishedLeagueMatches.reduce((acc, m) => acc + (m.score_pintfc ?? 0), 0);
    const expectedGA = publishedLeagueMatches.reduce((acc, m) => acc + (m.score_opponent ?? 0), 0);

    expect(record.played).toBe(publishedLeagueMatches.length);
    expect(record.goals_for).toBe(expectedGF);
    expect(record.goals_against).toBe(expectedGA);
    expect(record.goal_difference).toBe(expectedGF - expectedGA);
  });

  it('AC-2.2.4: Friendly match results excluded from official league record', async () => {
    const record = await getSeasonRecord();
    const friendlyMatch = FAKE_SEED_MATCHES.find(m => m.competition_type === 'friendly' && m.status === 'completed');
    expect(friendlyMatch).toBeDefined();

    // Verify friendly score is NOT included in the league record played count
    const totalCompleted = FAKE_SEED_MATCHES.filter(m => m.published === true && m.status === 'completed').length;
    expect(record.played).toBeLessThan(totalCompleted);
  });
});

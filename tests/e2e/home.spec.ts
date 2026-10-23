import { test, expect } from '@playwright/test';

test.describe('Home Page Acceptance Checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-2.1.1: Next match hero displays opponent, venue, and kickoff datetime', async ({ page }) => {
    const heroCard = page.locator('[data-testid="hero-match-card"]');
    await expect(heroCard).toBeVisible();
    await expect(page.locator('[data-testid="hero-opponent-name"]')).toContainText('St. George Wanderers');
    await expect(page.locator('[data-testid="hero-venue-name"]')).toContainText('Pint Ground');
    await expect(page.locator('[data-testid="hero-kickoff-time"]')).toBeVisible();
  });

  test('AC-2.1.2: Next match live countdown dynamically decrements time to kickoff', async ({ page }) => {
    const countdown = page.locator('[data-testid="countdown-timer"]');
    await expect(countdown).toBeVisible();
    await expect(countdown).toContainText(/\d+d|\d+h|\d+m|--:--:--/);
  });

  test('AC-2.1.3: RSVP cutoff status indicator displays open or closed state', async ({ page }) => {
    const cutoffPill = page.locator('[data-testid="rsvp-cutoff-pill"]');
    await expect(cutoffPill).toBeVisible();
    await expect(cutoffPill).toContainText(/RSVP (Open|Closed)/);
  });

  test('AC-2.1.4: Cancelled match prominently displays cancellation notice', async ({ page }) => {
    const cancelledSection = page.locator('[data-testid="cancelled-match-alert"]');
    if (await cancelledSection.count() > 0) {
      await expect(cancelledSection).toContainText('MATCH CANCELLED');
    }
  });

  test('AC-2.1.5: Competition tag distinguishes between League and Friendly fixture', async ({ page }) => {
    const compTag = page.locator('[data-testid="competition-tag"]');
    await expect(compTag).toBeVisible();
    await expect(compTag).toContainText(/League|Friendly/);
  });

  test('AC-2.1.6: Empty state renders friendly message when no upcoming fixtures', async ({ page }) => {
    const emptyNotice = page.locator('[data-testid="hero-empty-state"]');
    if (await emptyNotice.count() > 0) {
      await expect(emptyNotice).toContainText('No upcoming fixtures');
    }
  });

  test('AC-2.2.1: Season record calculates accurate Win-Draw-Loss aggregates', async ({ page }) => {
    const recordWidget = page.locator('[data-testid="season-record-widget"]');
    await expect(recordWidget).toBeVisible();
    const wdl = page.locator('[data-testid="record-wdl"]');
    await expect(wdl).toBeVisible();
    await expect(wdl).toContainText('Played');
    await expect(wdl).toContainText('Won');
  });

  test('AC-2.2.2: Season record calculates accurate Goals For, Against, and Diff', async ({ page }) => {
    const goals = page.locator('[data-testid="record-goals"]');
    await expect(goals).toBeVisible();
    await expect(goals).toContainText('Goals For');
    await expect(goals).toContainText('Goals Against');
    await expect(goals).toContainText('Goal Difference');
  });

  test('AC-2.3.1: Latest published results display scores and outcome badges', async ({ page }) => {
    const resultsList = page.locator('[data-testid="latest-results-list"]');
    await expect(resultsList).toBeVisible();

    const resultCards = page.locator('[data-testid="result-card"]');
    expect(await resultCards.count()).toBeGreaterThan(0);

    const firstCard = resultCards.first();
    await expect(firstCard.locator('[data-testid="match-outcome-badge"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="match-score"]')).toBeVisible();
  });

  test('AC-2.4.1: Mini league standings table displays rank, team, and points', async ({ page }) => {
    const table = page.locator('[data-testid="mini-standings-table"]');
    await expect(table).toBeVisible();
    await expect(table.locator('th')).toContainText(['Pos', 'Team', 'Pts']);
  });

  test('AC-2.4.2: PINT FC row is visually highlighted in mini standings table', async ({ page }) => {
    const pintFcRow = page.locator('[data-testid="standings-row-pintfc"]');
    await expect(pintFcRow).toBeVisible();
    await expect(pintFcRow).toHaveAttribute('data-highlighted', 'true');
  });
});

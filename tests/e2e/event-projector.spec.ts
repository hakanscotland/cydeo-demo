import { test, expect } from '@playwright/test';

test.describe('Event Page Projector View Acceptance Checks', () => {
  const matchId = '22222222-0000-4000-8000-000000000007';

  test('AC-3.4.1: Event page renders high-visibility attendance counts & roster', async ({ page }) => {
    await page.goto(`/fixtures/${matchId}`);

    // High-visibility scoreboard counters for classroom projection
    const counters = page.locator('[data-testid="scoreboard-counters"]');
    await expect(counters).toBeVisible();

    const goingCounter = page.locator('[data-testid="count-going"]');
    const maybeCounter = page.locator('[data-testid="count-maybe"]');
    const notGoingCounter = page.locator('[data-testid="count-not_going"]');

    await expect(goingCounter).toBeVisible();
    await expect(maybeCounter).toBeVisible();
    await expect(notGoingCounter).toBeVisible();

    // Match fixture details
    await expect(page.locator('[data-testid="fixture-title"]')).toContainText('St. George Wanderers');
    await expect(page.locator('[data-testid="fixture-venue"]')).toContainText('Pint Ground');
    await expect(page.locator('[data-testid="fixture-cutoff-pill"]')).toBeVisible();
  });
});

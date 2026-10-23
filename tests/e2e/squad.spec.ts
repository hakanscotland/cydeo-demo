import { test, expect } from '@playwright/test';

test.describe('Squad Directory Acceptance Checks', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/squad');
  });

  test('AC-4.1.1: Squad roster groups players by GK, DEF, MID, and FWD', async ({ page }) => {
    await expect(page.locator('[data-testid="squad-group-goalkeepers"]')).toBeVisible();
    await expect(page.locator('[data-testid="squad-group-defenders"]')).toBeVisible();
    await expect(page.locator('[data-testid="squad-group-midfielders"]')).toBeVisible();
    await expect(page.locator('[data-testid="squad-group-forwards"]')).toBeVisible();

    // Verify each positional category has cards
    const gkCards = page.locator('[data-testid="squad-group-goalkeepers"] [data-testid="player-card"]');
    const defCards = page.locator('[data-testid="squad-group-defenders"] [data-testid="player-card"]');
    const midCards = page.locator('[data-testid="squad-group-midfielders"] [data-testid="player-card"]');
    const fwdCards = page.locator('[data-testid="squad-group-forwards"] [data-testid="player-card"]');

    expect(await gkCards.count()).toBeGreaterThan(0);
    expect(await defCards.count()).toBeGreaterThan(0);
    expect(await midCards.count()).toBeGreaterThan(0);
    expect(await fwdCards.count()).toBeGreaterThan(0);

    // Archie Veldt (#99, archived) must NEVER appear anywhere in the squad directory (AC-4.1.2)
    const archivedNumber = page.locator('text="#99"');
    await expect(archivedNumber).toHaveCount(0);
  });

  test('AC-4.1.3: Squad cards display shirt number, name, and position', async ({ page }) => {
    const firstCard = page.locator('[data-testid="player-card"]').first();
    await expect(firstCard).toBeVisible();

    await expect(firstCard.locator('[data-testid="player-number"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="player-name"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="player-position"]')).toBeVisible();
  });
});

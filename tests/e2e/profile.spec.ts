import { test, expect } from '@playwright/test';

test.describe('Player Profile Acceptance Checks', () => {
  test('AC-4.2.1: Player profile loads permitted biographical info and photo', async ({ page }) => {
    // Player 1: Arthur Pendelton, #1, Goalkeeper, has photo & nationality consent
    await page.goto('/squad/11111111-0000-4000-8000-000000000001');

    await expect(page.locator('[data-testid="profile-name"]')).toContainText('A. Pendelton');
    await expect(page.locator('[data-testid="profile-number"]')).toContainText('1');
    await expect(page.locator('[data-testid="profile-position"]')).toContainText(/Goalkeeper|goalkeeper/);
    await expect(page.locator('[data-testid="profile-photo"]')).toBeVisible();

    // Verify Invariant 1: Zero public PII leakage
    const bodyContent = await page.content();
    expect(bodyContent).not.toContain('player1@pintfc.test');
    expect(bodyContent).not.toContain('+447700900001');
    expect(bodyContent).not.toContain('1998-04-12');
  });

  test('AC-4.2.2: Profile query for invalid or archived player returns 404', async ({ page }) => {
    // Archived player (Archie Veldt)
    const archivedRes = await page.goto('/squad/99999999-0000-4000-8000-000000000099');
    expect(archivedRes?.status()).toBe(404);
    await expect(page.locator('body')).toContainText(/404|not found/i);

    // Completely invalid ID
    const invalidRes = await page.goto('/squad/00000000-0000-0000-0000-000000000000');
    expect(invalidRes?.status()).toBe(404);
    await expect(page.locator('body')).toContainText(/404|not found/i);

    // Unconsented minor (Leo Evans)
    const unconsentedMinorRes = await page.goto('/squad/11111111-0000-4000-8000-000000000020');
    expect(unconsentedMinorRes?.status()).toBe(404);
  });
});

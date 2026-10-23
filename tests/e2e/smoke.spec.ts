import { test, expect } from '@playwright/test';

test.describe('GATES-02: E2E Smoke Gate', () => {
  test('GATES-02: Playwright E2E gate loads root page without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('PINT FC');
    await expect(page.locator('[data-testid="hero-match-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible();
  });
});

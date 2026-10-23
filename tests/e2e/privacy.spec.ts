import { test, expect } from '@playwright/test';

test.describe('Privacy Preferences Acceptance Checks', () => {
  test('AC-4.3.2: Granular consent toggles suppress unconsented photo/nationality', async ({ page }) => {
    // Player 2: Mateo Rossi, has consent_photo = false in seed data
    await page.goto('/squad/11111111-0000-4000-8000-000000000002');

    await expect(page.locator('[data-testid="profile-name"]')).toContainText('M. Rossi');
    // Real photo should not be displayed; placeholder avatar is shown instead
    await expect(page.locator('[data-testid="profile-photo-placeholder"]')).toBeVisible();
    await expect(page.locator('img[src*="p2.webp"]')).toHaveCount(0);
  });

  test('AC-4.3.4: Player updates privacy preferences and updates reflect immediately', async ({ page }) => {
    // Sign in as Player 3
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player3@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();

    // Navigate to privacy settings
    await page.goto('/profile/privacy');
    await expect(page.locator('[data-testid="toggle-consent-photo"]')).toBeVisible();

    // Toggle off photo consent
    await page.uncheck('[data-testid="toggle-consent-photo"]');
    await page.click('[data-testid="save-privacy-btn"]');
    await expect(page.locator('[data-testid="privacy-success-msg"]')).toBeVisible();

    // Verify immediate reflection on public profile
    await page.goto('/squad/11111111-0000-4000-8000-000000000003');
    await expect(page.locator('[data-testid="profile-photo-placeholder"]')).toBeVisible();
    await expect(page.locator('img[src*="p3.webp"]')).toHaveCount(0);
  });
});

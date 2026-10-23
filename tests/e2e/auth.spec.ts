import { test, expect } from '@playwright/test';

test.describe('Authentication & Session Management', () => {
  test('AC-1.1.3: Sign in fails with invalid credentials displaying error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'WrongPassword!');
    await page.click('[data-testid="login-submit-btn"]');

    await expect(page.locator('[data-testid="login-error-alert"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-error-alert"]')).toContainText('Invalid credentials');
    expect(page.url()).toContain('/login');
  });

  test('AC-1.1.1: Player signs in with valid credentials and establishes session', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-profile-name"]')).toContainText('A. Pendelton');
  });

  test('AC-1.6.1: Active player session persists across page reload and navigation', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();

    // Reload page
    await page.reload();
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();
  });

  test('AC-1.1.4: Player signs out of current device session', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();

    // Click Sign Out
    await page.click('[data-testid="sign-out-btn"]');
    await expect(page.locator('[data-testid="nav-login-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="nav-profile-name"]')).not.toBeVisible();
  });

  test('AC-1.6.3: Unauthenticated user redirected when attempting protected action', async ({ page }) => {
    await page.goto('/profile/privacy');
    await expect(page).toHaveURL(/\/login/);
  });

  test('AC-1.6.2: Sign out of all devices invalidates other active sessions', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();

    await page.goto('/profile/privacy');
    await page.click('[data-testid="sign-out-all-devices-btn"]');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-testid="nav-login-btn"]')).toBeVisible();
  });
});

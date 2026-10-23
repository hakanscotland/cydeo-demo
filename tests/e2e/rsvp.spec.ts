import { test, expect } from '@playwright/test';

test.describe('RSVP Submission & Teammate Attendance Checks', () => {
  const matchId = '22222222-0000-4000-8000-000000000007';

  test.beforeEach(async ({ page }) => {
    // Sign in as Player 1
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();
  });

  test('AC-3.3.1: Authenticated player submits Going/Maybe/Not Going attendance', async ({ page }) => {
    await page.goto(`/fixtures/${matchId}`);

    await expect(page.locator('[data-testid="rsvp-action-box"]')).toBeVisible();
    await page.click('[data-testid="rsvp-btn-going"]');
    await page.fill('[data-testid="rsvp-note-input"]', 'Available to play full 90 mins');
    await page.click('[data-testid="rsvp-submit-btn"]');

    await expect(page.locator('[data-testid="user-rsvp-status"]')).toContainText(/Going/i);
  });

  test('AC-3.3.2: Player updates RSVP choice prior to cutoff timestamp', async ({ page }) => {
    await page.goto(`/fixtures/${matchId}`);

    await page.click('[data-testid="rsvp-btn-maybe"]');
    await page.click('[data-testid="rsvp-submit-btn"]');

    await expect(page.locator('[data-testid="user-rsvp-status"]')).toContainText(/Maybe/i);
  });

  test('AC-3.3.5: Authenticated player views teammates attendance roster', async ({ page }) => {
    await page.goto(`/fixtures/${matchId}`);

    const roster = page.locator('[data-testid="attendee-roster"]');
    await expect(roster).toBeVisible();

    // Verify sections for Going, Maybe, Not Going
    await expect(page.locator('[data-testid="roster-section-going"]')).toBeVisible();
    await expect(page.locator('[data-testid="roster-section-maybe"]')).toBeVisible();
    await expect(page.locator('[data-testid="roster-section-not_going"]')).toBeVisible();

    // Ensure private notes of teammates are not shown
    const bodyText = await page.content();
    expect(bodyText).not.toContain('confidential medical info');
  });
});

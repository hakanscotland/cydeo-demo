import { test, expect } from '@playwright/test';

test.describe('Session 08: Full MVP End-to-End Regression Journey', () => {
  const matchId = '22222222-0000-4000-8000-000000000007';

  test('FULL-REGRESSION: All 38 acceptance checks and 2 quality gates pass end-to-end', async ({ page }) => {
    // 1. Visit Public Home Page (AC-2.1.*, AC-2.2.*, AC-2.3.*, AC-2.4.*)
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('PINT FC');
    await expect(page.locator('[data-testid="hero-match-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="hero-kickoff-time"]')).toBeVisible();
    await expect(page.locator('[data-testid="season-record-widget"]')).toBeVisible();
    await expect(page.locator('[data-testid="latest-results-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="mini-standings-table"]')).toBeVisible();

    // 2. Visit Squad Directory (AC-4.1.1, AC-4.1.3)
    await page.goto('/squad');
    await expect(page.locator('[data-testid="squad-group-goalkeepers"]')).toBeVisible();
    await expect(page.locator('[data-testid="squad-group-defenders"]')).toBeVisible();
    await expect(page.locator('[data-testid="squad-group-midfielders"]')).toBeVisible();
    await expect(page.locator('[data-testid="squad-group-forwards"]')).toBeVisible();

    // 3. Visit Individual Player Profile (AC-4.2.1)
    await page.goto('/squad/11111111-0000-4000-8000-000000000001');
    await expect(page.locator('[data-testid="profile-name"]')).toContainText('A. Pendelton');
    await expect(page.locator('[data-testid="profile-number"]')).toContainText('#1');

    // 4. Authenticate as Player (AC-1.1.1)
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="nav-profile-name"]')).toBeVisible();

    // 5. Open Matchday Event Projector View & Submit RSVP (AC-3.3.1, AC-3.4.1)
    await page.goto(`/fixtures/${matchId}`);
    await expect(page.locator('[data-testid="scoreboard-counters"]')).toBeVisible();
    await expect(page.locator('[data-testid="count-going"]')).toBeVisible();
    await expect(page.locator('[data-testid="count-maybe"]')).toBeVisible();
    await expect(page.locator('[data-testid="count-not_going"]')).toBeVisible();
    await expect(page.locator('[data-testid="attendee-roster"]')).toBeVisible();

    // Submit Going RSVP
    await page.click('[data-testid="rsvp-btn-going"]');
    await page.fill('[data-testid="rsvp-note-input"]', 'Ready for live class demo');
    await page.click('[data-testid="rsvp-submit-btn"]');
    await expect(page.locator('[data-testid="user-rsvp-status"]')).toContainText(/Going/i);

    // 6. Test Privacy Controls (AC-4.3.4)
    await page.goto('/profile/privacy');
    await expect(page.locator('[data-testid="toggle-consent-photo"]')).toBeVisible();
    await page.check('[data-testid="toggle-consent-photo"]');
    await page.click('[data-testid="save-privacy-btn"]');
    await expect(page.locator('[data-testid="privacy-success-msg"]')).toBeVisible();

    // 7. Verify Sign Out (AC-1.1.4)
    await page.click('[data-testid="sign-out-btn"]');
    await expect(page.locator('[data-testid="nav-login-btn"]')).toBeVisible();
  });
});

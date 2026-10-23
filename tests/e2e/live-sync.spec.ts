import { test, expect } from '@playwright/test';

test.describe('Live Polling Count Synchronization', () => {
  const matchId = '22222222-0000-4000-8000-000000000007';

  test('AC-3.4.3: Open event page reflects count change within 15 seconds', async ({ browser }) => {
    // Client A: Viewer on projector (open tab)
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto(`/fixtures/${matchId}`);
    await expect(pageA.locator('[data-testid="fixture-title"]')).toBeVisible();

    const goingCounterA = pageA.locator('[data-testid="count-going"]');
    await expect(goingCounterA).toBeVisible();
    await expect(goingCounterA).not.toHaveText('0');
    const initialCount = parseInt((await goingCounterA.innerText()).trim(), 10);

    // Client B: Player signs in and submits "Going"
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto('/login');
    await pageB.fill('[data-testid="login-email-input"]', 'player4@pintfc.test');
    await pageB.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await pageB.click('[data-testid="login-submit-btn"]');
    await expect(pageB).toHaveURL('/');

    await pageB.goto(`/fixtures/${matchId}`);
    await pageB.click('[data-testid="rsvp-btn-going"]');
    await pageB.click('[data-testid="rsvp-submit-btn"]');
    await expect(pageB.locator('[data-testid="user-rsvp-status"]')).toContainText(/Going/i);

    // Client A should reflect the count update via 10-second polling within 15 seconds
    await expect(goingCounterA).toHaveText(String(initialCount + 1), { timeout: 15000 });

    await contextA.close();
    await contextB.close();
  });
});

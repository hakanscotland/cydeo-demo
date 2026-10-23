import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Visual Screen Capture for PO Review', () => {
  const outputDir = path.resolve(process.cwd(), 'docs/screenshots');

  test.beforeAll(() => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  });

  test('Capture visual snapshots of all 6 MVP screens', async ({ page }) => {
    // Screen 1: Home Page
    await page.goto('/');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, '01-home-page.png'), fullPage: true });

    // Screen 2: Squad Directory
    await page.goto('/squad');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, '02-squad-directory.png'), fullPage: true });

    // Screen 3: Player Profile
    await page.goto('/squad/11111111-0000-4000-8000-000000000001');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, '03-player-profile.png'), fullPage: true });

    // Screen 4: Match Event Projector
    await page.goto('/fixtures/22222222-0000-4000-8000-000000000007');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, '04-match-event-projector.png'), fullPage: true });

    // Screen 5: Sign In Page
    await page.goto('/login');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, '05-login-page.png'), fullPage: true });

    // Log in for Screen 6
    await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
    await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
    await page.click('[data-testid="login-submit-btn"]');
    await page.waitForURL('/');

    // Screen 6: Privacy Preferences
    await page.goto('/profile/privacy');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outputDir, '06-privacy-preferences.png'), fullPage: true });
  });
});

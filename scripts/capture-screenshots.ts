import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function captureAllScreenshots() {
  const outputDir = path.resolve(process.cwd(), 'docs/screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  console.log('Capturing screen 1: Home Page...');
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '01-home-page.png'), fullPage: true });

  console.log('Capturing screen 2: Squad Directory...');
  await page.goto('http://localhost:3000/squad');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '02-squad-directory.png'), fullPage: true });

  console.log('Capturing screen 3: Player Profile...');
  await page.goto('http://localhost:3000/squad/11111111-0000-4000-8000-000000000001');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '03-player-profile.png'), fullPage: true });

  console.log('Capturing screen 4: Match Event Projector...');
  await page.goto('http://localhost:3000/fixtures/22222222-0000-4000-8000-000000000007');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '04-match-event-projector.png'), fullPage: true });

  console.log('Capturing screen 5: Sign In Page...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '05-login-page.png'), fullPage: true });

  // Log in to access screen 6: Privacy Preferences
  console.log('Logging in to capture screen 6: Privacy Preferences...');
  await page.fill('[data-testid="login-email-input"]', 'player1@pintfc.test');
  await page.fill('[data-testid="login-password-input"]', 'PintFC2026!');
  await page.click('[data-testid="login-submit-btn"]');
  await page.waitForURL('http://localhost:3000/');

  await page.goto('http://localhost:3000/profile/privacy');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outputDir, '06-privacy-preferences.png'), fullPage: true });

  await browser.close();
  console.log('All 6 screen snapshots successfully captured to docs/screenshots/!');
}

captureAllScreenshots().catch(err => {
  console.error(err);
  process.exit(1);
});

import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport (320px) Gate (AC-5.4)', () => {
  test.use({
    viewport: { width: 320, height: 640 },
  });

  const routes = [
    { name: 'Home Page', path: '/' },
    { name: 'Squad Directory', path: '/squad' },
    { name: 'Player Profile', path: '/squad/11111111-0000-4000-8000-000000000001' },
    { name: 'Match Event Page', path: '/fixtures/22222222-0000-4000-8000-000000000007' },
    { name: 'Login Page', path: '/login' },
  ];

  for (const route of routes) {
    test(`AC-5.4: ${route.name} renders at 320px without horizontal scroll`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');

      const dimensions = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          bodyScrollWidth: document.body.scrollWidth,
        };
      });

      // No horizontal overflow beyond 320px viewport
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(320);
      expect(dimensions.bodyScrollWidth).toBeLessThanOrEqual(320);
    });
  }
});

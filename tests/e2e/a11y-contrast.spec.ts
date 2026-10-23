import { test, expect } from '@playwright/test';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

test.describe('WCAG AA Color Contrast Quality Gate (AC-5.2)', () => {
  const pagesToAudit = [
    { name: 'Home Page', path: '/' },
    { name: 'Squad Directory', path: '/squad' },
    { name: 'Player Profile', path: '/squad/11111111-0000-4000-8000-000000000001' },
    { name: 'Match Event Projector', path: '/fixtures/22222222-0000-4000-8000-000000000007' },
    { name: 'Sign In Page', path: '/login' },
  ];

  for (const pageInfo of pagesToAudit) {
    test(`AC-5.2: ${pageInfo.name} meets WCAG AA color contrast ratio thresholds`, async ({ page }) => {
      await page.goto(pageInfo.path);
      await page.waitForLoadState('networkidle');

      // Inject axe-core
      await page.addScriptTag({ path: axePath });

      // Run axe evaluation specifically for color-contrast
      const results = await page.evaluate(async () => {
        // @ts-expect-error axe is attached to window
        return await window.axe.run({
          runOnly: {
            type: 'rule',
            values: ['color-contrast'],
          },
        });
      });

      // Filter out any minor disabled button/placeholder warnings if any
      const violations = results.violations.filter(
        // @ts-expect-error violation typing
        v => v.id === 'color-contrast'
      );

      if (violations.length > 0) {
        console.error(`Contrast violations on ${pageInfo.name}:`, JSON.stringify(violations, null, 2));
      }

      expect(violations).toEqual([]);
    });
  }
});

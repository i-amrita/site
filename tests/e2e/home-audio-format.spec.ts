/**
 * AAC-only audio sprite smoke check.
 *
 * Boots /, watches /sounds/* requests on the network, and asserts the only
 * path the page ever asks for is the .m4a. The head preload fires once at
 * parse time, then the App's fetchSoundBytes() fires after hydration; both
 * are for the same URL, so we de-duplicate before counting.
 */
import { expect, test } from '@playwright/test';

test('home /sounds/* resolves to the .m4a only (no .ogg)', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/sounds/')) requests.push(r.url());
  });
  await page.goto('http://localhost:4322/');
  await page.waitForLoadState('networkidle');
  const unique = [...new Set(requests)];
  expect(unique, 'unique /sounds/* URLs').toEqual([
    'http://localhost:4322/sounds/sprite-5fd10328.m4a',
  ]);
  // And never an .ogg anywhere we observed.
  expect(requests.some((u) => /\.ogg(\?|$)/.test(u))).toBe(false);
});

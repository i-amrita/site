import { expect, test } from '@playwright/test';

import { expectNoSeriousA11y } from '../fixtures/axe';

test('home loads with a title and one h1', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(/Amrita/);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('home has no critical or serious axe violations (light)', async ({ page }) => {
  await page.goto('/?theme=light');
  await expectNoSeriousA11y(page, 'home light');
});

test('home has no critical or serious axe violations (dark)', async ({ page }) => {
  await page.goto('/?theme=dark');
  await expectNoSeriousA11y(page, 'home dark');
});

test.describe('agent-facing endpoints', () => {
  test('/llms.txt is served as text', async ({ request }) => {
    const res = await request.get('/llms.txt');
    expect(res.status()).toBe(200);
    expect(await res.text()).toContain('Amrita');
  });

  test('/about.md is served', async ({ request }) => {
    const res = await request.get('/about.md');
    expect(res.status()).toBe(200);
  });
});

for (const path of ['/work', '/about', '/now', '/posts', '/qr', '/404']) {
  for (const theme of ['light', 'dark']) {
    test(`${path} has no critical or serious axe violations (${theme})`, async ({ page }) => {
      await page.goto(`${path}?theme=${theme}`);
      await expectNoSeriousA11y(page, `${path} ${theme}`);
    });
  }
}

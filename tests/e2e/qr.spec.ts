import { expect, test } from '@playwright/test';

import { expectNoSeriousA11y } from '../fixtures/axe';

test('/qr renders the name and a QR image', async ({ page }) => {
  const res = await page.goto('/qr');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Amrita Nambiar');
  const qr = page.locator('[data-qr][role="img"]');
  await expect(qr).toBeVisible();
  await expect(qr).toHaveAttribute('aria-label', /amrita\.nambiar\.my/);
  await expect(qr).toHaveAttribute('data-qr-target', 'https://amrita.nambiar.my/');
  await expect(qr.locator('svg')).toHaveCount(1);
  const box = await qr.boundingBox();
  expect(box?.width).toBeGreaterThan(200);
});

test('footer QR link navigates to /qr', async ({ page }) => {
  await page.goto('/about');
  await page.getByRole('contentinfo').getByRole('link', { name: 'QR', exact: true }).click();
  await expect(page).toHaveURL(/\/qr$/);
});

test('/qr.md is served as markdown', async ({ request }) => {
  const res = await request.get('/qr.md');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('text/markdown');
  expect(await res.text()).toContain('https://amrita.nambiar.my/');
});

for (const theme of ['light', 'dark']) {
  test(`/qr has no critical or serious axe violations (${theme})`, async ({ page }) => {
    await page.goto(`/qr?theme=${theme}`);
    await expectNoSeriousA11y(page, `/qr ${theme}`);
  });
}

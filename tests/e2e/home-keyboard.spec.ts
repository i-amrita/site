import { expect, test } from '@playwright/test';

// TODO(keyboard): overlays and the hotkey layer land with the keyboard and overlays branches.
for (const overlay of ['about', 'projects', 'log'] as const) {
  test.fixme(`/?overlay=${overlay} opens the ${overlay} overlay`, async ({ page }) => {
    await page.goto(`/?overlay=${overlay}`);
    await expect(page.getByRole('dialog')).toBeVisible();
  });
}

test.fixme('p pushes ?overlay=projects and back returns to /', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('p');
  await expect(page).toHaveURL(/overlay=projects/);
  await page.goBack();
  await expect(page).not.toHaveURL(/overlay=/);
});

test.fixme('Escape clears overlay state', async ({ page }) => {
  await page.goto('/?overlay=projects');
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/overlay=/);
});

test('unknown overlay values do not break the page', async ({ page }) => {
  const res = await page.goto('/?overlay=nope');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toBeVisible();
});

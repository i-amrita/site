import { expect, test } from '@playwright/test';

test('invalid locale falls back to english', async ({ page }) => {
  const res = await page.goto('/?locale=xx');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

// TODO(i18n): locale switching lands with the i18n branch.
test.fixme('/?locale=de sets html lang to de', async ({ page }) => {
  await page.goto('/?locale=de');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test.fixme('Alt+L cycles the locale in the URL', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Alt+l');
  await expect(page).toHaveURL(/locale=/);
});

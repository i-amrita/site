import { expect, test } from '@playwright/test';

test('invalid locale falls back to english', async ({ page }) => {
  const res = await page.goto('/?locale=xx');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('/?locale=de sets html lang and translates the static hero', async ({ page }) => {
  await page.goto('/?locale=de');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await expect(page.getByText('Ich bin', { exact: false }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Suche' }).first()).toBeVisible();
});

test('/?locale=ml translates the hero and sets lang', async ({ page }) => {
  await page.goto('/?locale=ml');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ml');
  await expect(page.getByRole('button', { name: 'തിരയുക' }).first()).toBeVisible();
  await expect(page.getByText('സാങ്കേതിക സങ്കീർണ്ണതയെയും')).toBeVisible();
});

test('/?locale=hi&overlay=projects translates the overlay', async ({ page }) => {
  await page.goto('/?locale=hi&overlay=projects');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('सारा काम देखें')).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'सभी' })).toBeVisible();
});

test('/?locale=ms&cmdk=open translates the palette', async ({ page }) => {
  await page.goto('/?locale=ms&cmdk=open');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ms');
  await expect(page.getByPlaceholder('Ketik perintah atau carian...')).toBeVisible();
  await expect(page.getByText('Pergi ke kerja')).toBeVisible();
});

test('the locale switch keeps the other URL params', async ({ page }) => {
  await page.goto('/?theme=dark&mute=1');
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
  await page.getByRole('button', { name: 'Choose language' }).click();
  await page.getByRole('option', { name: 'Deutsch' }).click();
  await expect(page).toHaveURL(/locale=de/);
  await expect(page).toHaveURL(/theme=dark/);
  await expect(page).toHaveURL(/mute=1/);
});

test.fixme('Alt+L cycles the locale in the URL', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Alt+l');
  await expect(page).toHaveURL(/locale=/);
});

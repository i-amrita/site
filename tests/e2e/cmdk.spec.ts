import { expect, test } from '@playwright/test';

test('/?cmdk=open opens the palette', async ({ page }) => {
  await page.goto('/?cmdk=open');
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('/?cmdk=open&q=gdg prefills the filter', async ({ page }) => {
  await page.goto('/?cmdk=open&q=gdg');
  await expect(page.getByRole('combobox')).toHaveValue('gdg');
});

test('Escape closes the palette and clears cmdk and q', async ({ page }) => {
  await page.goto('/?cmdk=open&q=gdg');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).not.toHaveURL(/cmdk=|q=/);
});

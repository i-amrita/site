import { expect, test } from '@playwright/test';

test('pagefind index is built', async ({ request }) => {
  const res = await request.get('/pagefind/pagefind.js');
  expect(res.status()).toBe(200);
});

test('/?cmdk=open&q=gdg lists search results under the actions', async ({ page }) => {
  await page.goto('/?cmdk=open&q=gdg&mode=keyword');
  await expect(page.getByRole('combobox')).toHaveValue('gdg');
  await expect(page.getByRole('option').first()).toBeVisible();
});

test('the palette toggles between AI and keyword mode via ?mode=', async ({ page }) => {
  await page.goto('/?cmdk=open&q=gdg');
  const ai = page.getByRole('button', { name: 'AI', exact: true });
  const keyword = page.getByRole('button', { name: 'Keyword', exact: true });
  await expect(ai).toHaveAttribute('aria-pressed', 'true');
  await keyword.click();
  await expect(page).toHaveURL(/mode=keyword/);
  await expect(keyword).toHaveAttribute('aria-pressed', 'true');
  await ai.click();
  await expect(page).toHaveURL(/mode=ai/);
});

test('old /?overlay=search&q=gdg links open the palette', async ({ page }) => {
  await page.goto('/?overlay=search&q=gdg');
  await expect(page).toHaveURL(/cmdk=open/);
  await expect(page).not.toHaveURL(/overlay=/);
  await expect(page.getByRole('combobox')).toHaveValue('gdg');
});

test('/search?q=gdg keeps working as a page', async ({ page }) => {
  await page.goto('/search?q=gdg');
  await expect(page.getByRole('textbox').first()).toHaveValue('gdg');
});

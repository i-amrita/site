import { expect, test } from '@playwright/test';

test('pagefind index is built', async ({ request }) => {
  const res = await request.get('/pagefind/pagefind.js');
  expect(res.status()).toBe(200);
});

// TODO(search): the search overlay lands with the search branch.
test.fixme('/?overlay=search&q=gdg fills the query and lists results', async ({ page }) => {
  await page.goto('/?overlay=search&q=gdg');
  await expect(page.getByRole('searchbox')).toHaveValue('gdg');
  await expect(page.getByRole('listitem').first()).toBeVisible();
});

test.fixme('/?overlay=search&q=gdg&mode=ai selects the semantic mode', async ({ page }) => {
  await page.goto('/?overlay=search&q=gdg&mode=ai');
  await expect(page.getByRole('searchbox')).toHaveValue('gdg');
  await expect(page).toHaveURL(/mode=ai/);
});

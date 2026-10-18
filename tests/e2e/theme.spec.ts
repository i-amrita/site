import { expect, test } from '@playwright/test';

test('?theme=dark sets data-theme', async ({ page }) => {
  await page.goto('/?theme=dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('?theme=light sets data-theme', async ({ page }) => {
  await page.goto('/?theme=light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('no param leaves data-theme unset', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

test('invalid theme value is ignored', async ({ page }) => {
  await page.goto('/?theme=blue');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

// TODO(keyboard): the `t` hotkey is wired by the keyboard island branch.
test.fixme('pressing t toggles theme and updates the URL', async ({ page }) => {
  await page.goto('/?theme=light');
  await page.keyboard.press('t');
  await expect(page).toHaveURL(/theme=dark/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

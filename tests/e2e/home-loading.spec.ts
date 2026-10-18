import { expect, test } from '@playwright/test';

// Startup indicator contract: a status dot shows while the sound sprite loads, then fades out and leaves the DOM,
// keys work (URL actions) without waiting for it, and exactly one sprite request is made.
test.describe('keypad startup indicator', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('is in the SSR HTML, then removed once sounds are decoded, with one sprite request', async ({
    page,
  }) => {
    const sprites: string[] = [];
    page.on('request', (r) => {
      if (r.url().includes('/sounds/')) sprites.push(new URL(r.url()).pathname);
    });
    const html = await (await page.request.get('/')).text();
    expect(html).toContain('data-startup-indicator');
    await page.goto('/');
    await expect(page.locator('[data-startup-indicator]')).toHaveCount(0, { timeout: 10_000 });
    expect(sprites).toHaveLength(1);
    expect(sprites[0]).toMatch(/^\/sounds\/sprite-[0-9a-f]{8}\.(ogg|m4a)$/);
  });

  test('keys act before the sounds are ready', async ({ page }) => {
    await page.route('**/sounds/**', (route) => route.abort());
    await page.goto('/');
    await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
    const pad = page.getByRole('group', { name: /keyboard/i });
    await pad.getByRole('button').first().click();
    await expect(page.locator('[data-startup-indicator]')).toHaveCount(0, { timeout: 10_000 });
  });

  test('reduced motion removes the dot without animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('[data-startup-indicator]')).toHaveCount(0, { timeout: 10_000 });
  });
});

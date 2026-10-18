import { expect, test, type Page } from '@playwright/test';

// The keypad must never depend on audio: keys, URL state and visuals work while the sprite is still loading, when it
// fails to decode, and when the AudioContext stays locked (iOS silent switch, interrupted session). Runs on the
// chromium project (mobile viewport) and on a small WebKit project (iOS engine).

async function openHome(page: Page) {
  await page.goto('/');
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
}

const pad = (page: Page) => page.getByRole('group', { name: /keyboard/i });

test.describe('keypad without working audio', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test('startup skeleton shows only while loading, keys work through it', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    await page.route('**/sounds/**', async (route) => {
      await gate;
      await route.continue();
    });
    await openHome(page);
    await expect(page.locator('[data-startup-indicator]')).toBeVisible();
    await expect(page.locator('[data-startup-skeleton]')).toBeAttached();
    // Interactive while loading.
    await pad(page)
      .getByRole('button', { name: /^Sound/ })
      .tap();
    await expect(page).toHaveURL(/mute=1/);
    release();
    await expect(page.locator('[data-startup-indicator]')).toHaveCount(0, { timeout: 10_000 });
    await expect(page.locator('[data-startup-skeleton]')).toHaveCount(0);
    // Loaded: the pad stays, nothing extra, and keys still work.
    await expect(pad(page)).toBeVisible();
    await pad(page)
      .getByRole('button', { name: /^Sound/ })
      .tap();
    await expect(page).not.toHaveURL(/mute=1/);
  });

  test('sprite 404 and decode failure: skeleton clears, keys and URL state still work', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      for (const proto of [OfflineAudioContext.prototype, AudioContext.prototype])
        proto.decodeAudioData = (() =>
          Promise.reject(new DOMException('stub decode failure', 'EncodingError'))) as never;
    });
    await page.route('**/sounds/**', (route) => route.fulfill({ status: 200, body: 'not audio' }));
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await openHome(page);
    await expect(page.locator('[data-startup-indicator]')).toHaveCount(0, { timeout: 10_000 });
    await pad(page)
      .getByRole('button', { name: /^Sound/ })
      .tap();
    await expect(page).toHaveURL(/mute=1/);
    await pad(page).getByRole('button', { name: /^Work/ }).tap();
    await expect(page).toHaveURL(/overlay=projects/);
    expect(errors).toEqual([]);
  });

  test('AudioContext stuck suspended: keys work and a one-time hint appears then fades', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      // resume() never settles and the state never changes, like a context the OS refuses to start.
      AudioContext.prototype.resume = () => new Promise<void>(() => {});
      Object.defineProperty(AudioContext.prototype, 'state', { get: () => 'suspended' });
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await openHome(page);
    await expect(page.locator('[data-startup-indicator]')).toHaveCount(0, { timeout: 10_000 });
    await pad(page)
      .getByRole('button', { name: /^Sound/ })
      .tap();
    await expect(page).toHaveURL(/mute=1/);
    await expect(page.locator('[data-sound-hint]')).toBeVisible({ timeout: 5000 });
    await pad(page)
      .getByRole('button', { name: /^Sound/ })
      .tap();
    await expect(page).not.toHaveURL(/mute=1/);
    await expect(page.locator('[data-sound-hint]')).toHaveCount(0, { timeout: 10_000 });
    expect(errors).toEqual([]);
  });

  test('no Web Audio at all: pad renders and works', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'AudioContext', { value: undefined });
      Object.defineProperty(window, 'webkitAudioContext', { value: undefined });
      Object.defineProperty(window, 'OfflineAudioContext', { value: undefined });
    });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await openHome(page);
    await pad(page)
      .getByRole('button', { name: /^Sound/ })
      .tap();
    await expect(page).toHaveURL(/mute=1/);
    expect(errors).toEqual([]);
  });
});

import { expect, test, type Page } from '@playwright/test';

/** Navigate and wait until every island has hydrated, so taps and hotkeys hit live handlers. */
async function openHome(page: Page, url = '/') {
  await page.goto(url);
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
}

// Locator assumptions (contract from the macropad redesign, not yet verified against the built UI):
// - The pad is a role=group whose aria-label is m.keyboard_label() (en: "Keyboard"); matched loosely.
// - 7 keys are real buttons, the dial is a role=slider, and 3 (Research, LinkedIn, Let's build) are real links; each accessible name starts with the visible legend.
// - The dial is a role=slider named "Highlight action keys" (0..100, `?highlight=`).
// - A pressed pad key exposes aria-pressed="true" while a physical key is held (see the F2 test).

const padOf = (page: Page) => page.getByRole('group', { name: /keyboard|macropad/i });
const key = (page: Page, name: RegExp) => padOf(page).getByRole('button', { name });
const link = (page: Page, name: RegExp) => padOf(page).getByRole('link', { name });

test.describe('macropad at 375x667', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('navbar, h1 and last pad row fit with no horizontal scroll', async ({ page }) => {
    await openHome(page);
    const nav = page.getByRole('navigation').first();
    const h1 = page.locator('h1');
    const lastRow = link(page, /^Let's build/);
    await expect(lastRow).toBeVisible();
    const boxes = await Promise.all([nav, h1, lastRow].map((t) => t.boundingBox()));
    for (const box of boxes) {
      expect(box).not.toBeNull();
      expect(box!.y).toBeGreaterThanOrEqual(0);
      expect(box!.y + box!.height).toBeLessThanOrEqual(667);
    }
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
    });
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
  });

  test('every pad key is at least 44px wide', async ({ page }) => {
    await openHome(page);
    const controls = padOf(page).locator('button, a, [role="slider"]');
    await expect(controls.first()).toBeVisible();
    expect(await padOf(page).getByRole('button').count()).toBe(7);
    expect(await padOf(page).getByRole('slider').count()).toBe(1);
    expect(await padOf(page).getByRole('link').count()).toBe(3);
    const count = await controls.count();
    expect(count).toBe(11);
    const boxes = await Promise.all(
      Array.from({ length: count }, (_, i) => controls.nth(i).boundingBox()),
    );
    for (const box of boxes) expect(box!.width).toBeGreaterThanOrEqual(44);
  });

  test('tapping Work sets ?overlay=projects', async ({ page }) => {
    await openHome(page);
    await key(page, /^Work/).click();
    await expect(page).toHaveURL(/overlay=projects/);
  });

  test('tapping Sound toggles ?mute=1', async ({ page }) => {
    await openHome(page);
    await key(page, /^Sound/).click();
    await expect(page).toHaveURL(/mute=1/);
    await key(page, /^Sound/).click();
    await expect(page).not.toHaveURL(/mute=1/);
  });

  test('tapping Find sets ?overlay=search', async ({ page }) => {
    await openHome(page);
    await key(page, /^Find/).click();
    await expect(page).toHaveURL(/overlay=search/);
  });

  test('link keys point at mail, LinkedIn and research', async ({ page }) => {
    await openHome(page);
    const build = link(page, /^Let's build Email/);
    await expect(build).toHaveAttribute('href', /^mailto:.+@.+/);
    await expect(build).not.toHaveAttribute('target', '_blank');
    const linkedin = link(page, /^LinkedIn/);
    const research = link(page, /^Research/);
    const external = [linkedin, research];
    await expect(linkedin).toHaveAttribute('href', /linkedin\.com/);
    await expect(research).toHaveAttribute('href', /^https?:\/\//);
    await Promise.all(
      external.flatMap((a) => [
        expect(a).toHaveAttribute('target', '_blank'),
        expect(a).toHaveAttribute('rel', /noopener/),
      ]),
    );
  });

  test('dial keyboard control writes ?highlight=', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await openHome(page);
    const dial = padOf(page).getByRole('slider', { name: /highlight action keys/i });
    await expect(dial).toHaveAttribute('aria-valuemin', '0');
    await expect(dial).toHaveAttribute('aria-valuemax', '100');
    await expect(dial).toHaveAttribute('aria-valuenow', '0');
    await dial.focus();
    await page.keyboard.press('ArrowRight');
    await expect(dial).toHaveAttribute('aria-valuenow', '5');
    await expect(dial).toHaveAttribute('aria-valuetext', '5%');
    await expect(page).toHaveURL(/highlight=5/);
    await page.keyboard.press('End');
    await expect(dial).toHaveAttribute('aria-valuenow', '100');
    await expect(page).toHaveURL(/highlight=100/);
    await page.keyboard.press('Home');
    await expect(page).not.toHaveURL(/highlight=/);
    expect(errors).toEqual([]);
  });

  test('clicking the dial cycles 0, 50, 100, 0 and never touches the theme', async ({ page }) => {
    await openHome(page);
    const dial = padOf(page).getByRole('slider');
    await dial.click();
    await expect(dial).toHaveAttribute('aria-valuenow', '50');
    await dial.click();
    await expect(dial).toHaveAttribute('aria-valuenow', '100');
    await dial.click();
    await expect(dial).toHaveAttribute('aria-valuenow', '0');
    await expect(page).not.toHaveURL(/theme=/);
  });

  test('physical F2 lights Work', async ({ page }) => {
    await openHome(page);
    // F2 opens the Projects overlay, which hides the pad from role queries, so locate by attribute.
    const work = page.locator('button[data-key="F2"]');
    // Pressed state is exposed as data-pressed="true" while the code is held.
    await page.keyboard.down('F2');
    await expect(work).toHaveAttribute('data-pressed', 'true');
    await page.keyboard.up('F2');
  });
});

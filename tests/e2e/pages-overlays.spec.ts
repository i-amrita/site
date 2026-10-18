import { expect, test, type Page } from '@playwright/test';

async function openHome(page: Page, url = '/') {
  await page.goto(url);
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
}

const SURFACES = [
  {
    overlay: 'projects',
    title: 'Work',
    page: '/work',
    seeAll: /see all work/i,
    md: '/work/index.md',
  },
  {
    overlay: 'log',
    title: 'Log',
    page: '/posts',
    seeAll: /see all log entries/i,
    md: '/posts/index.md',
  },
  { overlay: 'about', title: 'About', page: '/about', seeAll: /view full page/i, md: '/about.md' },
] as const;

for (const s of SURFACES) {
  test.describe(`${s.title} drawer`, () => {
    test(`/?overlay=${s.overlay} opens a titled non-modal panel`, async ({ page }) => {
      await openHome(page, `/?overlay=${s.overlay}`);
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: s.title })).toBeVisible();
      // Non-modal: the pad behind stays in the accessibility tree and clickable.
      await expect(page.getByRole('group', { name: /keyboard/i })).toBeVisible();
    });

    test('the See all link goes to the full page', async ({ page }) => {
      await openHome(page, `/?overlay=${s.overlay}`);
      await page.getByRole('dialog').getByRole('link', { name: s.seeAll }).click();
      await expect(page).toHaveURL(new RegExp(`${s.page}$`));
      await expect(page.locator('h1')).toHaveCount(1);
    });

    test(`${s.page} has a markdown companion`, async ({ request }) => {
      const res = await request.get(s.md);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('text/markdown');
    });
  });
}

test('clicking outside the panel closes it and removes the param', async ({ page }) => {
  await openHome(page, '/?overlay=projects');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).not.toHaveURL(/overlay=/);
});

test('Escape closes the panel and removes the param', async ({ page }) => {
  await openHome(page, '/?overlay=log');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page).not.toHaveURL(/overlay=/);
});

test('the Work page lists projects and filters by ?filter=', async ({ page }) => {
  await page.goto('/work');
  await expect(page.getByRole('heading', { level: 1, name: 'Work' })).toBeVisible();
  const all = await page.locator('[data-project-card]').count();
  expect(all).toBeGreaterThan(1);
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
  await page
    .getByRole('navigation', { name: /filter/i })
    .getByRole('button')
    .nth(1)
    .click();
  await expect(page).toHaveURL(/filter=/);
  await expect(page.locator('[data-project-card]:visible')).not.toHaveCount(all);
});

test('/projects redirects to /work', async ({ page }) => {
  await page.goto('/projects');
  await expect(page).toHaveURL(/\/work\/?$/);
});

test('/llms.txt links the renamed routes', async ({ request }) => {
  const body = await (await request.get('/llms.txt')).text();
  expect(body).toContain('## Work');
  expect(body).toContain('/work/');
  expect(body).not.toContain('/projects/');
});

import { expect, test, type Page } from '@playwright/test';

async function openHome(page: Page, url = '/') {
  await page.goto(url);
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
}

const SURFACES = [
  {
    overlay: 'projects',
    query: '&kind=work',
    title: 'Work',
    page: '/work',
    seeAll: /see all/i,
    md: '/work/index.md',
  },
  {
    overlay: 'log',
    query: '',
    title: 'Log',
    page: '/posts',
    seeAll: /see all log entries/i,
    md: '/posts/index.md',
  },
  {
    overlay: 'about',
    query: '',
    title: 'About',
    page: '/about',
    seeAll: /view full page/i,
    md: '/about.md',
  },
] as const;

for (const s of SURFACES) {
  test.describe(`${s.title} drawer`, () => {
    test(`/?overlay=${s.overlay} opens a titled non-modal panel`, async ({ page }) => {
      await openHome(page, `/?overlay=${s.overlay}${s.query}`);
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByRole('heading', { name: s.title })).toBeVisible();
      // Non-modal: the pad behind stays in the accessibility tree and clickable.
      await expect(page.getByRole('group', { name: /keyboard/i })).toBeVisible();
    });

    test('the See all link goes to the full page', async ({ page }) => {
      await openHome(page, `/?overlay=${s.overlay}${s.query}`);
      await page.getByRole('dialog').getByRole('link', { name: s.seeAll }).click();
      await expect(page).toHaveURL(new RegExp(`${s.page}(\\?.*)?$`));
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
    .getByRole('navigation', { name: /by tag/i })
    .getByRole('button')
    .nth(1)
    .click();
  await expect(page).toHaveURL(/filter=/);
  await expect(page.locator('[data-project-card]:visible')).not.toHaveCount(all);
});

test('the Work page shows research cards and filters by ?kind=', async ({ page }) => {
  await page.goto('/work?kind=research');
  await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'));
  const paper = page.getByRole('link', { name: /Ask Me Twice/ });
  await expect(paper).toBeVisible();
  await expect(paper).toHaveAttribute('href', 'https://dl.acm.org/doi/10.1145/3805696.3848492');
  await expect(paper).toHaveAttribute('target', '_blank');
  await expect(page.locator('[data-kind-section=work]')).toBeHidden();
  await page
    .getByRole('navigation', { name: /by type/i })
    .getByRole('button', { name: 'Work' })
    .click();
  await expect(page).toHaveURL(/kind=work/);
  await expect(paper).toBeHidden();
});

test('the drawer switches type in place and keeps the URL in sync', async ({ page }) => {
  await openHome(page, '/?overlay=projects');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Portfolio' })).toBeVisible();
  await dialog
    .getByRole('navigation', { name: /by type/i })
    .getByRole('button', { name: 'Research' })
    .click();
  await expect(page).toHaveURL(/kind=research/);
  await expect(dialog.getByRole('heading', { name: 'Research' })).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Ask Me Twice/ })).toBeVisible();
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

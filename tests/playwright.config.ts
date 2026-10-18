import { defineConfig, devices } from '@playwright/test';

/** `BASE_URL` points the suite at a deployed site (prod smoke). Without it, a local preview on :4322 is used. */
const remote = process.env.BASE_URL;
const baseURL = remote ?? 'http://localhost:4322';

export default defineConfig({
  testDir: './e2e',
  outputDir: '../test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Capped at 2 everywhere: the dev machine has 8 GB RAM, and the default (half the cores) pushed it into swap.
  workers: 2,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: '../playwright-report' }]]
    : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(remote
    ? {}
    : {
        webServer: {
          // Build once, then serve dist/. Reuses a running preview on :4322 (CI builds in an earlier step and sets SKIP_BUILD).
          command: process.env.SKIP_BUILD ? 'pnpm preview' : 'pnpm build && pnpm preview',
          url: baseURL,
          reuseExistingServer: true,
          timeout: 180_000,
        },
      }),
});

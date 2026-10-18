import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/** Fails on critical or serious axe violations. Lower impacts are returned for logging only. */
export async function expectNoSeriousA11y(page: Page, context?: string) {
  // Entrance animations (`.rise`) fade from opacity 0; axe measures contrast mid-fade and flakes under load.
  // Infinite animations never finish, so only wait for finite ones.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const blocking = violations.filter((v) => v.impact === 'critical' || v.impact === 'serious');
  const summary = blocking.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s)`);
  expect(blocking, `axe ${context ?? page.url()}\n${summary.join('\n')}`).toEqual([]);
  return violations;
}

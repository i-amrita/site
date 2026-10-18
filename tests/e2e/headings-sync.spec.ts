import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from '@playwright/test';

const dir = join(dirname(fileURLToPath(import.meta.url)));

test('every tests/e2e/*.md definition has a sibling .spec.ts', () => {
  const files = readdirSync(dir);
  const defs = files.filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
  expect(defs.length).toBeGreaterThan(0);
  const missing = defs.filter((d) => !files.includes(`${d}.spec.ts`));
  expect(missing, `markdown definitions without a spec: ${missing.join(', ')}`).toEqual([]);
});

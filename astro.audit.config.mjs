// Audit-only Astro config: the normal config plus @casoon/astro-post-audit.
// Used by CI (`pnpm audit:site`) so regular builds and deploys never run the audit.
import postAudit from '@casoon/astro-post-audit';
import { defineConfig } from 'astro/config';

import base from './astro.config.mjs';

export default defineConfig({
  ...base,
  integrations: [
    ...(base.integrations ?? []),
    postAudit({
      preset: 'standard',
      // Warnings (landmarks, OG tags) stay visible; only errors fail the build.
      failOn: 'errors',
      // External links are never fetched, so placeholder URLs cannot fail the audit.
      // @astrojs/sitemap emits sitemap-index.xml, which the sitemap rule does not look for.
      rules: { external_links: { enabled: false }, sitemap: { require: false } },
    }),
  ],
});

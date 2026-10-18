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
      // Warnings stay visible; only errors fail the build.
      failOn: 'errors',
      rules: {
        // 404.html is noindex and has no canonical by design.
        filters: { exclude: ['404.html'] },
        // URL is the state store (AGENTS.md hard rule), so ?filter= and ?overlay= links are intentional.
        links: { forbid_query_params_internal: false },
        // External links are never fetched, so placeholder URLs cannot fail the audit.
        external_links: { enabled: false },
        // @astrojs/sitemap emits sitemap-index.xml, which the sitemap rule does not look for.
        sitemap: { require: false },
      },
    }),
  ],
});

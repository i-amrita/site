import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://amrita.nambiar.my',
  output: 'static',
  integrations: [
    react({ include: ['**/react/**', '**/components/ui/**'] }),
    mdx(),
    sitemap({ filter: (page) => !page.includes('/dev/') }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      // Compiles src/i18n/messages/*.json into src/i18n/paraglide (gitignored) at dev start and build.
      // `custom-query` is defined in src/lib/i18n.ts and reads `?locale=`; falls back to `en`.
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: './src/i18n/paraglide',
        strategy: ['custom-query', 'baseLocale'],
      }),
    ],
  },
});

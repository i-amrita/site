import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

const MIME = { '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css' };

/** Dev only: serve the search index from `dist/` (written by `pnpm build`), since Pagefind has no dev index. */
const searchIndexInDev = {
  name: 'search-index-in-dev',
  configureServer(server) {
    const dist = join(server.config.root, 'dist');
    server.middlewares.use((req, res, next) => {
      const path = (req.url ?? '').split('?')[0] ?? '';
      if (!path.startsWith('/pagefind/') && path !== '/embeddings.json') return next();
      const file = normalize(join(dist, path));
      if (!file.startsWith(dist) || !existsSync(file) || !statSync(file).isFile()) return next();
      res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream');
      createReadStream(file).pipe(res);
    });
  },
};

export default defineConfig({
  site: 'https://amrita.nambiar.my',
  output: 'static',
  integrations: [react({ include: ['**/react/**', '**/components/ui/**'] }), mdx(), sitemap()],
  vite: { plugins: [tailwindcss(), searchIndexInDev] },
});

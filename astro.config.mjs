import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://amrita.nambiar.my',
  output: 'static',
  integrations: [react({ include: ['**/react/**', '**/components/ui/**'] }), mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});

import type { APIRoute } from 'astro';

import { abs, getSitePages } from '@/lib/content';

export const GET: APIRoute = async () => {
  const pages = await getSitePages();
  const body = pages
    .map((p) => `# ${p.title} (${abs(p.path)})\n\n${p.markdown.replace(/^# .*\n+/, '')}`)
    .join('\n\n---\n\n');
  return new Response(`${body}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

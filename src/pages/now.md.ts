import type { APIRoute } from 'astro';

import { getSingleton, markdownResponse, singletonMarkdown } from '@/lib/content';

export const GET: APIRoute = async () => {
  const now = await getSingleton('now');
  if (!now) return new Response('Not found', { status: 404 });
  return markdownResponse(singletonMarkdown(now));
};

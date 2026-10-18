import type { APIRoute } from 'astro';

import { getSingleton, markdownResponse, singletonMarkdown } from '@/lib/content';

export const GET: APIRoute = async () => {
  const about = await getSingleton('about');
  if (!about) return new Response('Not found', { status: 404 });
  return markdownResponse(singletonMarkdown(about));
};

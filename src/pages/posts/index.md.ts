import type { APIRoute } from 'astro';

import { markdownResponse, postsIndexMarkdown } from '@/lib/content';

export const GET: APIRoute = async () => markdownResponse(await postsIndexMarkdown());

import type { APIRoute } from 'astro';

import { logIndexMarkdown, markdownResponse } from '@/lib/content';

export const GET: APIRoute = async () => markdownResponse(await logIndexMarkdown());

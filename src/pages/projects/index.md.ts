import type { APIRoute } from 'astro';

import { markdownResponse, projectsIndexMarkdown } from '@/lib/content';

export const GET: APIRoute = async () => markdownResponse(await projectsIndexMarkdown());

import type { APIRoute, GetStaticPaths } from 'astro';

import { getProjects, markdownResponse, projectMarkdown } from '@/lib/content';

export const getStaticPaths = (async () =>
  (await getProjects()).map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => markdownResponse(projectMarkdown(props.entry));

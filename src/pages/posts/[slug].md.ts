import type { APIRoute, GetStaticPaths } from 'astro';

import { getPosts, markdownResponse, postMarkdown } from '@/lib/content';

export const getStaticPaths = (async () =>
  (await getPosts()).map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => markdownResponse(postMarkdown(props.entry));

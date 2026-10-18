import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from 'astro';

import { formatPeriod, getProjects } from '@/lib/content';
import { pngResponse, renderOg } from '@/lib/og';

export const getStaticPaths = (async () =>
  (await getProjects()).map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute<InferGetStaticPropsType<typeof getStaticPaths>> = async ({ props }) => {
  const d = props.entry.data;
  return pngResponse(
    await renderOg({
      eyebrow: `${d.role} · ${formatPeriod(d.period)}`,
      title: d.title,
      ...(d.org !== d.title && { subtitle: d.org }),
    }),
  );
};

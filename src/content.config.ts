import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const project = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** `work` is a job or engagement (role and org shown); `project` is a self-initiated build. */
      kind: z.enum(['work', 'project']).default('work'),
      role: z.string().optional(),
      org: z.string().optional(),
      period: z.object({ start: z.string(), end: z.string().optional() }),
      location: z.string().optional(),
      summary: z.string().max(280),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      links: z.array(z.object({ label: z.string(), href: z.url() })).default([]),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false),
      order: z.number().int().default(0),
    }),
});

/** Publications. Each is a card that links out to the paper; there is no detail page. */
const research = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    /** Journal or conference, e.g. `JCDL '26`. */
    venue: z.string(),
    date: z.coerce.date(),
    description: z.string().max(280),
    href: z.url(),
    draft: z.boolean().default(false),
  }),
});

const post = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(280),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** about.mdx and now.mdx. Top-level only, so `projects/` and `posts/` never match. */
const singletons = defineCollection({
  loader: glob({ pattern: '*.mdx', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = { project, research, post, singletons };

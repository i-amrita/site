/**
 * Single content source for HTML pages, `.md` companions, `llms.txt` and `llms-full.txt`.
 * Everything agent-facing is derived from these helpers; never hand-write markdown copies.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

import type { PostItem, ProjectItem, ResearchItem } from '@/components/react/overlay-types';

export const SITE_URL = 'https://amrita.nambiar.my';
export const SITE_NAME = 'Amrita Nambiar';
export const SITE_SUMMARY =
  'Personal portfolio of Amrita Nambiar: AI, community and human-centered design. MIMS 2027 at UC Berkeley.';

export type ProjectEntry = CollectionEntry<'project'>;
export type ResearchEntry = CollectionEntry<'research'>;
export type PostEntry = CollectionEntry<'post'>;
export type SingletonEntry = CollectionEntry<'singletons'>;

export const abs = (path: string) => new URL(path, SITE_URL).href;

/** Non-draft projects ordered by `order`, then newest start first. */
export async function getProjects(): Promise<ProjectEntry[]> {
  const all = await getCollection('project', (p) => !p.data.draft);
  return all.toSorted(
    (a, b) => a.data.order - b.data.order || b.data.period.start.localeCompare(a.data.period.start),
  );
}

/** Non-draft publications, newest first. */
export async function getResearch(): Promise<ResearchEntry[]> {
  const all = await getCollection('research', (r) => !r.data.draft);
  return all.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Non-draft posts, newest first. */
export async function getPosts(): Promise<PostEntry[]> {
  const all = await getCollection('post', (p) => !p.data.draft);
  return all.toSorted((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export const getSingleton = (id: 'about' | 'now') => getEntry('singletons', id);

export async function getAllTags(): Promise<string[]> {
  const projects = await getProjects();
  return [...new Set(projects.flatMap((p) => p.data.tags))].toSorted((a, b) => a.localeCompare(b));
}

export const formatPeriod = (p: { start: string; end?: string | undefined }) =>
  `${p.start} to ${p.end ?? 'present'}`;

export const formatDate = (d: Date) => d.toISOString().slice(0, 10);

/** Strip MDX-only syntax so the body reads as plain markdown. */
export function mdxToMarkdown(body: string | undefined): string {
  if (!body) return '';
  let inFence = false;
  const lines: string[] = [];
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence || /^\s*(```|~~~)/.test(line)) {
      lines.push(line);
      continue;
    }
    if (/^\s*(import|export)\s.+$/.test(line)) continue;
    if (/^\s*\{\/\*.*\*\/\}\s*$/.test(line)) continue;
    // Self-closing or standalone JSX component lines: <Foo ... />, <Foo>, </Foo>
    if (/^\s*<\/?[A-Z][\w.]*(\s[^>]*)?\/?>\s*$/.test(line)) continue;
    lines.push(line.replace(/<\/?[A-Z][\w.]*(\s[^>]*)?\/?>/g, ''));
  }
  return lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const bullets = (items: string[]) => items.map((i) => `- ${i}`).join('\n');

export function projectMarkdown(p: ProjectEntry): string {
  const d = p.data;
  const meta = [
    ...(d.role ? [`Role: ${d.role}`] : []),
    ...(d.org ? [`Organization: ${d.org}`] : []),
    `Period: ${formatPeriod(d.period)}`,
    ...(d.location ? [`Location: ${d.location}`] : []),
    ...(d.tags.length ? [`Tags: ${d.tags.join(', ')}`] : []),
    ...d.links.map((l) => `[${l.label}](${l.href})`),
  ];
  return [`# ${d.title}`, d.summary, bullets(meta), mdxToMarkdown(p.body)]
    .filter(Boolean)
    .join('\n\n');
}

export function postMarkdown(p: PostEntry): string {
  const d = p.data;
  const meta = [
    `Published: ${formatDate(d.pubDate)}`,
    ...(d.updatedDate ? [`Updated: ${formatDate(d.updatedDate)}`] : []),
    ...(d.tags.length ? [`Tags: ${d.tags.join(', ')}`] : []),
  ];
  return [`# ${d.title}`, d.description, bullets(meta), mdxToMarkdown(p.body)]
    .filter(Boolean)
    .join('\n\n');
}

export function singletonMarkdown(s: SingletonEntry): string {
  return [`# ${s.data.title}`, mdxToMarkdown(s.body)].filter(Boolean).join('\n\n');
}

const projectLine = (p: ProjectEntry) => {
  const who = [p.data.role, p.data.org].filter(Boolean).join(', ');
  return `- [${p.data.title}](${abs(`/work/${p.id}.md`)}): ${who ? `${who} ` : ''}(${formatPeriod(p.data.period)}). ${p.data.summary}`;
};

const section = (heading: string, items: string[], empty: string) =>
  [`## ${heading}`, items.length ? items.join('\n') : empty].join('\n\n');

export async function workIndexMarkdown(): Promise<string> {
  const [projects, research] = await Promise.all([getProjects(), getResearch()]);
  return [
    '# Work',
    section(
      'Work',
      projects.filter((p) => p.data.kind === 'work').map(projectLine),
      'No work yet.',
    ),
    section(
      'Projects',
      projects.filter((p) => p.data.kind === 'project').map(projectLine),
      'No projects yet.',
    ),
    section(
      'Research',
      research.map(
        (r) =>
          `- [${r.data.title}](${r.data.href}): ${r.data.venue} (${formatDate(r.data.date)}). ${r.data.description}`,
      ),
      'No research yet.',
    ),
  ].join('\n\n');
}

export async function logIndexMarkdown(): Promise<string> {
  const posts = await getPosts();
  const items = posts.map(
    (p) =>
      `- [${p.data.title}](${abs(`/posts/${p.id}.md`)}) (${formatDate(p.data.pubDate)}): ${p.data.description}`,
  );
  return ['# Log', items.length ? items.join('\n') : 'Nothing here yet.'].join('\n\n');
}

export interface SitePage {
  title: string;
  description: string;
  /** Canonical HTML path, e.g. `/work/foo`. */
  path: string;
  /** Markdown companion path, e.g. `/work/foo.md`. */
  mdPath: string;
  section: 'Pages' | 'Work' | 'Log';
  markdown: string;
}

/** Every page on the site in llms order. Feeds `llms.txt` and `llms-full.txt`. */
export async function getSitePages(): Promise<SitePage[]> {
  const [about, now, projects, posts] = await Promise.all([
    getSingleton('about'),
    getSingleton('now'),
    getProjects(),
    getPosts(),
  ]);
  const pages: SitePage[] = [];
  if (about)
    pages.push({
      title: about.data.title,
      description: about.data.description ?? `About ${SITE_NAME}`,
      path: '/about',
      mdPath: '/about.md',
      section: 'Pages',
      markdown: singletonMarkdown(about),
    });
  if (now)
    pages.push({
      title: now.data.title,
      description: now.data.description ?? 'What I am focused on right now',
      path: '/now',
      mdPath: '/now.md',
      section: 'Pages',
      markdown: singletonMarkdown(now),
    });
  for (const p of projects)
    pages.push({
      title: p.data.title,
      description: p.data.summary,
      path: `/work/${p.id}`,
      mdPath: `/work/${p.id}.md`,
      section: 'Work',
      markdown: projectMarkdown(p),
    });
  for (const p of posts)
    pages.push({
      title: p.data.title,
      description: p.data.description,
      path: `/posts/${p.id}`,
      mdPath: `/posts/${p.id}.md`,
      section: 'Log',
      markdown: postMarkdown(p),
    });
  return pages;
}

const truncate = (s: string, max = 200) =>
  s.length <= max ? s : `${s.slice(0, max).replace(/\s+\S*$/, '')}…`;

/** JSON-serializable list item shared by the full pages and the drawer overlays. */
export function toProjectItem(p: ProjectEntry): ProjectItem {
  return {
    id: p.id,
    kind: p.data.kind,
    title: p.data.title,
    ...(p.data.role && { role: p.data.role }),
    ...(p.data.org && { org: p.data.org }),
    period: formatPeriod(p.data.period),
    summary: truncate(p.data.summary),
    tags: p.data.tags,
  };
}

export function toResearchItem(r: ResearchEntry): ResearchItem {
  return {
    id: r.id,
    title: r.data.title,
    venue: r.data.venue,
    date: formatDate(r.data.date),
    description: truncate(r.data.description),
    href: r.data.href,
  };
}

export function toPostItem(p: PostEntry): PostItem {
  return {
    id: p.id,
    title: p.data.title,
    description: truncate(p.data.description),
    date: formatDate(p.data.pubDate),
    tags: p.data.tags,
  };
}

export const markdownResponse = (body: string) =>
  new Response(`${body}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

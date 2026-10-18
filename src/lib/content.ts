/**
 * Single content source for HTML pages, `.md` companions, `llms.txt` and `llms-full.txt`.
 * Everything agent-facing is derived from these helpers; never hand-write markdown copies.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export const SITE_URL = 'https://amrita.nambiar.my';
export const SITE_NAME = 'Amrita Nambiar';
export const SITE_SUMMARY =
  'Personal portfolio of Amrita Nambiar: AI, community and human-centered design. MIMS 2027 at UC Berkeley.';

export type ProjectEntry = CollectionEntry<'project'>;
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
    `Role: ${d.role}`,
    `Organization: ${d.org}`,
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

export async function projectsIndexMarkdown(): Promise<string> {
  const projects = await getProjects();
  const items = projects.map(
    (p) =>
      `- [${p.data.title}](${abs(`/projects/${p.id}.md`)}): ${p.data.role}, ${p.data.org} (${formatPeriod(p.data.period)}). ${p.data.summary}`,
  );
  return ['# Projects', items.length ? items.join('\n') : 'No projects yet.'].join('\n\n');
}

export async function postsIndexMarkdown(): Promise<string> {
  const posts = await getPosts();
  const items = posts.map(
    (p) =>
      `- [${p.data.title}](${abs(`/posts/${p.id}.md`)}) (${formatDate(p.data.pubDate)}): ${p.data.description}`,
  );
  return ['# Posts', items.length ? items.join('\n') : 'No posts yet.'].join('\n\n');
}

export interface SitePage {
  title: string;
  description: string;
  /** Canonical HTML path, e.g. `/projects/foo`. */
  path: string;
  /** Markdown companion path, e.g. `/projects/foo.md`. */
  mdPath: string;
  section: 'Pages' | 'Projects' | 'Posts';
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
      path: `/projects/${p.id}`,
      mdPath: `/projects/${p.id}.md`,
      section: 'Projects',
      markdown: projectMarkdown(p),
    });
  for (const p of posts)
    pages.push({
      title: p.data.title,
      description: p.data.description,
      path: `/posts/${p.id}`,
      mdPath: `/posts/${p.id}.md`,
      section: 'Posts',
      markdown: postMarkdown(p),
    });
  return pages;
}

export const markdownResponse = (body: string) =>
  new Response(`${body}\n`, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });

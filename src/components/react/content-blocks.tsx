/**
 * Presentational blocks shared by the drawer overlays and the full pages (`/work`, `/posts`, `/about`).
 * Pure: no hooks, no i18n, no URL state. Callers pass already-translated strings, so the same markup renders
 * inside React islands and as static HTML in `.astro` pages.
 * Layout adapted from the hairline list style of the sibling illo.fyi log and work pages.
 */
import { ArrowRight, ArrowUpRight, FileText, FlaskConical, Link as LinkIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

import type { PostItem, ProjectItem, ResearchItem } from '@/components/react/overlay-types';
import { SOCIALS } from '@/lib/site';
import { tagSlug } from '@/lib/tags';
import { href, type Kind } from '@/lib/url-state';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export const chipClass = `shrink-0 rounded-key border px-3 py-1 font-key text-sm transition-colors ${focusRing}`;

/** Stagger index for `.rise` rows, capped so long lists never wait. */
const rowStyle = (i: number) => ({ '--i': Math.min(i, 8) }) as CSSProperties;

export function WorkList({
  projects,
  readMore,
  linkBase = '/work',
}: {
  projects: ProjectItem[];
  readMore: string;
  linkBase?: string;
}) {
  return (
    <ul role="list" className="divide-y divide-border border-y border-border">
      {projects.map((p, i) => (
        <li
          key={p.id}
          style={rowStyle(i)}
          data-project-card
          data-tags={p.tags.map(tagSlug).join(' ')}
          className="rise group relative grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-4"
        >
          <h3 className="font-display text-lg leading-snug">
            <a
              href={href(`${linkBase}/${p.id}`)}
              className="transition-colors duration-300 ease-(--ease-spring) after:absolute after:inset-0 group-hover:text-brand"
            >
              {p.title}
            </a>
          </h3>
          <p className="pt-1 text-right font-key text-xs tracking-wide text-muted-foreground uppercase">
            {p.period}
          </p>
          {(p.role || p.org) && (
            <p className="col-span-2 text-sm text-muted-foreground">
              {[p.role, p.org].filter(Boolean).join(', ')}
            </p>
          )}
          <p className="col-span-2 text-sm leading-relaxed">{p.summary}</p>
          <div className="col-span-2 mt-1 flex items-end justify-between gap-3">
            <ul className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-key bg-surface-muted px-2 py-0.5 font-key text-xs text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand group-hover:text-brand-hover">
              {readMore}
              <ArrowRight
                className="size-4 transition-transform duration-300 ease-(--ease-spring) group-hover:translate-x-0.5 group-active:scale-90 motion-reduce:transition-none motion-reduce:transform-none"
                aria-hidden="true"
              />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Project card: a bordered tile, lighter than a work row (no role or org). */
export function ProjectList({
  projects,
  readMore,
  linkBase = '/work',
}: {
  projects: ProjectItem[];
  readMore: string;
  linkBase?: string;
}) {
  return (
    <ul role="list" className="flex flex-col gap-3">
      {projects.map((p, i) => (
        <li
          key={p.id}
          style={rowStyle(i)}
          data-project-card
          data-tags={p.tags.map(tagSlug).join(' ')}
          className="rise group relative flex flex-col gap-2 rounded-card border border-border bg-surface p-4 transition-colors duration-300 ease-(--ease-spring) hover:border-brand"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg leading-snug">
              <a
                href={href(`${linkBase}/${p.id}`)}
                className="after:absolute after:inset-0 after:rounded-card"
              >
                {p.title}
              </a>
            </h3>
            <p className="shrink-0 font-key text-xs tracking-wide text-muted-foreground uppercase">
              {p.period}
            </p>
          </div>
          <p className="text-sm leading-relaxed">{p.summary}</p>
          <div className="flex items-end justify-between gap-3">
            <ul className="flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-key bg-surface-muted px-2 py-0.5 font-key text-xs text-muted-foreground"
                >
                  {t}
                </li>
              ))}
            </ul>
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand group-hover:text-brand-hover">
              {readMore}
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** `Oct 13, 2026`, in UTC so the label never shifts with the viewer's time zone. */
const paperDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

/** Research card: a citation. Venue and date, title, short description, link out to the paper. */
export function ResearchList({
  research,
  readPaper,
}: {
  research: ResearchItem[];
  readPaper: string;
}) {
  return (
    <ul role="list" className="divide-y divide-border border-y border-border">
      {research.map((r, i) => (
        <li
          key={r.id}
          style={rowStyle(i)}
          data-project-card
          data-tags=""
          className="rise group relative flex flex-col gap-1 py-4"
        >
          <p className="font-key text-xs tracking-wide text-muted-foreground uppercase">
            {r.venue}
            <span aria-hidden="true"> · </span>
            <time dateTime={r.date}>{paperDate(r.date)}</time>
          </p>
          <h3 className="font-display text-lg leading-snug italic">
            <a
              href={r.href}
              rel="noopener"
              target="_blank"
              className="transition-colors duration-300 ease-(--ease-spring) after:absolute after:inset-0 group-hover:text-brand"
            >
              {r.title}
            </a>
          </h3>
          <p className="text-sm text-muted-foreground">{r.description}</p>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand group-hover:text-brand-hover">
            {readPaper}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </li>
      ))}
    </ul>
  );
}

interface GroupLabels {
  work: string;
  projects: string;
  research: string;
  empty: string;
  readMore: string;
  readPaper: string;
}

/**
 * The three item types as labelled sections. `show` limits the output to one type (the drawer filters in memory);
 * `/work` passes `null` and hides sections with CSS keyed on `data-kind-section`, so every type is server-rendered.
 */
export function ContentGroups({
  work,
  projects,
  research,
  show,
  headings,
  labels,
}: {
  work: ProjectItem[];
  projects: ProjectItem[];
  research: ResearchItem[];
  show: Kind | null;
  headings: boolean;
  labels: GroupLabels;
}) {
  const groups = [
    {
      kind: 'work',
      label: labels.work,
      count: work.length,
      body: <WorkList projects={work} readMore={labels.readMore} />,
    },
    {
      kind: 'projects',
      label: labels.projects,
      count: projects.length,
      body: <ProjectList projects={projects} readMore={labels.readMore} />,
    },
    {
      kind: 'research',
      label: labels.research,
      count: research.length,
      body: <ResearchList research={research} readPaper={labels.readPaper} />,
    },
  ] as const;
  return (
    <div className="flex flex-col gap-8">
      {groups
        .filter((g) => !show || g.kind === show)
        .map((g) => (
          <section key={g.kind} data-kind-section={g.kind} aria-label={g.label}>
            {headings && (
              <h2 className="mb-2 font-key text-xs tracking-wide text-muted-foreground uppercase">
                {g.label}
              </h2>
            )}
            {g.count === 0 ? <p className="text-muted-foreground">{labels.empty}</p> : g.body}
          </section>
        ))}
    </div>
  );
}

/** Item-type filter (All, Work, Projects, Research). `active` null means all. */
export function KindChips({
  active,
  onSelect,
  ariaLabel,
  allLabel,
  labels,
  className = 'flex flex-wrap gap-2',
}: {
  active: Kind | null;
  onSelect: (kind: Kind | null) => void;
  ariaLabel: string;
  allLabel: string;
  labels: Record<Kind, string>;
  className?: string;
}) {
  const on = 'border-brand bg-brand text-brand-fg';
  const off = 'border-border bg-surface text-fg hover:bg-surface-muted';
  const options: [Kind | null, string][] = [
    [null, allLabel],
    ['work', labels.work],
    ['projects', labels.projects],
    ['research', labels.research],
  ];
  return (
    <nav aria-label={ariaLabel} className={className}>
      {options.map(([value, label]) => (
        <button
          key={value ?? 'all'}
          type="button"
          data-kind={value ?? 'all'}
          aria-pressed={active === value}
          onClick={() => onSelect(value)}
          className={`${chipClass} ${active === value ? on : off}`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

/** `2026-10-18` to `Oct 18`, in UTC so the label never shifts with the viewer's time zone. */
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  });

export function LogList({ posts, linkBase = '/posts' }: { posts: PostItem[]; linkBase?: string }) {
  const byYear = new Map<string, PostItem[]>();
  for (const p of posts) {
    const year = p.date.slice(0, 4);
    byYear.set(year, [...(byYear.get(year) ?? []), p]);
  }
  const order = new Map(posts.map((p, i) => [p.id, i]));
  const years = [...byYear.keys()].toSorted((a, b) => Number(b) - Number(a));
  return (
    <div className="flex flex-col gap-8">
      {years.map((year) => (
        <section key={year} aria-labelledby={`log-year-${year}`}>
          <h2
            id={`log-year-${year}`}
            className="mb-2 font-key text-xs tracking-wide text-muted-foreground uppercase"
          >
            {year}
          </h2>
          <ul role="list" className="divide-y divide-border border-y border-border">
            {(byYear.get(year) ?? []).map((p) => (
              <li
                key={p.id}
                style={rowStyle(order.get(p.id) ?? 0)}
                className="rise group relative grid grid-cols-[4.5rem_1fr] gap-x-3 py-3.5"
              >
                <time
                  dateTime={p.date}
                  className="pt-0.5 font-key text-xs tracking-wide text-muted-foreground uppercase"
                >
                  {shortDate(p.date)}
                </time>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-display text-lg leading-snug">
                    <a
                      href={`${linkBase}/${p.id}`}
                      className="transition-colors duration-300 ease-(--ease-spring) after:absolute after:inset-0 group-hover:text-brand"
                    >
                      {p.title}
                    </a>
                  </h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const socialLink = `inline-flex items-center gap-2 rounded-key border border-border bg-surface px-3 py-1.5 text-sm text-fg transition-colors hover:border-brand hover:text-brand ${focusRing}`;

export function SocialLinks({
  ariaLabel,
  labels,
}: {
  ariaLabel: string;
  labels: { linkedin: string; research: string; cv: string };
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={ariaLabel}>
      <li>
        <a className={socialLink} href={SOCIALS.linkedin} rel="noopener" target="_blank">
          <LinkIcon className="size-4" aria-hidden="true" /> {labels.linkedin}
        </a>
      </li>
      <li>
        <a className={socialLink} href={SOCIALS.research} rel="noopener" target="_blank">
          <FlaskConical className="size-4" aria-hidden="true" /> {labels.research}
        </a>
      </li>
      {SOCIALS.cv && (
        <li>
          <a className={socialLink} href={SOCIALS.cv} rel="noopener" target="_blank">
            <FileText className="size-4" aria-hidden="true" /> {labels.cv}
          </a>
        </li>
      )}
    </ul>
  );
}

/** Tag filter chips. `active` is a tag slug; selecting the active chip (or "All") reports `null`. */
export function TagChips({
  tags,
  active,
  onSelect,
  ariaLabel,
  allLabel,
  className = 'flex flex-wrap gap-2',
}: {
  tags: string[];
  active: string | null;
  onSelect: (tag: string | null) => void;
  ariaLabel: string;
  allLabel: string;
  className?: string;
}) {
  const on = 'border-brand bg-brand text-brand-fg';
  const off = 'border-border bg-surface text-fg hover:bg-surface-muted';
  return (
    <nav aria-label={ariaLabel} className={className}>
      <button
        type="button"
        aria-pressed={!active}
        onClick={() => onSelect(null)}
        className={`${chipClass} ${active ? off : on}`}
      >
        {allLabel}
      </button>
      {tags.map((tag) => {
        const pressed = active === tagSlug(tag);
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={pressed}
            onClick={() => onSelect(pressed ? null : tag)}
            className={`${chipClass} ${pressed ? on : off}`}
          >
            {tag}
          </button>
        );
      })}
    </nav>
  );
}

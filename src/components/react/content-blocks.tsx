/**
 * Presentational blocks shared by the drawer overlays and the full pages (`/work`, `/posts`, `/about`).
 * Pure: no hooks, no i18n, no URL state. Callers pass already-translated strings, so the same markup renders
 * inside React islands and as static HTML in `.astro` pages.
 * Layout adapted from the hairline list style of the sibling illo.fyi log and work pages.
 */
import { ArrowRight, FileText, FlaskConical, Link as LinkIcon } from 'lucide-react';
import type { CSSProperties } from 'react';

import type { PostItem, ProjectItem } from '@/components/react/overlay-types';
import { SOCIALS } from '@/lib/site';
import { tagSlug } from '@/lib/tags';
import { href } from '@/lib/url-state';

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
          <p className="col-span-2 text-sm text-muted-foreground">
            {p.role}, {p.org}
          </p>
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

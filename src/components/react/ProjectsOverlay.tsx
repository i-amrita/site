import { ArrowRight } from 'lucide-react';

import { ActionOverlay } from '@/components/react/ActionOverlay';
import type { ProjectItem } from '@/components/react/overlay-types';
import { tagSlug } from '@/lib/tags';
import { href } from '@/lib/url-state';

const COPY = {
  title: 'Projects',
  description: 'Selected projects. Filter by tag, or open one for the full story.',
  all: 'all',
  readMore: 'Read more',
  seeAll: 'See all projects',
  empty: 'No projects match this filter.',
} as const;

const chip =
  'shrink-0 rounded-key border px-3 py-1 font-key text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

interface Props {
  open: boolean;
  projects: ProjectItem[];
  tags: string[];
  filter: string | null;
  scroll: number | null;
  onClose: () => void;
  onFilter: (tag: string | null) => void;
  onScroll: (top: number) => void;
}

export function ProjectsOverlay({
  open,
  projects,
  tags,
  filter,
  scroll,
  onClose,
  onFilter,
  onScroll,
}: Props) {
  const active = filter ? tagSlug(filter) : null;
  const visible = active
    ? projects.filter((p) => p.tags.some((t) => tagSlug(t) === active))
    : projects;

  return (
    <ActionOverlay
      open={open}
      title={COPY.title}
      description={COPY.description}
      onClose={onClose}
      readMore={{ href: '/projects', label: COPY.seeAll }}
      scrollTop={scroll ?? 0}
      onScrollTop={onScroll}
    >
      <nav
        aria-label="Filter projects by tag"
        className="mb-5 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible"
      >
        <button
          type="button"
          aria-pressed={!active}
          onClick={() => onFilter(null)}
          className={`${chip} ${active ? 'border-border bg-surface text-fg hover:bg-surface-muted' : 'border-brand bg-brand text-brand-fg'}`}
        >
          {COPY.all}
        </button>
        {tags.map((tag) => {
          const on = active === tagSlug(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => onFilter(on ? null : tag)}
              className={`${chip} ${on ? 'border-brand bg-brand text-brand-fg' : 'border-border bg-surface text-fg hover:bg-surface-muted'}`}
            >
              {tag}
            </button>
          );
        })}
      </nav>
      {visible.length === 0 ? (
        <p className="text-muted-foreground">{COPY.empty}</p>
      ) : (
        <ul role="list" className="flex flex-col gap-4">
          {visible.map((p) => (
            <li key={p.id}>
              <article className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4">
                <h3 className="font-display text-lg">{p.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {p.role}, {p.org} · {p.period}
                </p>
                <p>{p.summary}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
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
                  <a
                    href={href(`/projects/${p.id}`)}
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {COPY.readMore}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </ActionOverlay>
  );
}

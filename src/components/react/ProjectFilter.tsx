import { useQueryState } from 'nuqs';

import { Providers } from '@/components/react/Providers';
import { tagSlug } from '@/lib/tags';
import { urlStateParsers } from '@/lib/url-state';

interface Props {
  tags: string[];
}

const chip =
  'rounded-key border px-3 py-1 font-key text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

function Chips({ tags }: Props) {
  const [filter, setFilter] = useQueryState(
    'filter',
    urlStateParsers.filter.withOptions({ history: 'replace' }),
  );
  const active = filter ? tagSlug(filter) : null;
  return (
    <>
      {/* All cards are server-rendered; this rule hides the ones that do not match. */}
      {active && (
        <style>{`[data-project-card]:not([data-tags~=${JSON.stringify(active)}]){display:none}`}</style>
      )}
      <nav aria-label="Filter projects by tag" className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={!active}
          onClick={() => void setFilter(null)}
          className={`${chip} ${active ? 'border-border bg-surface text-fg hover:bg-surface-muted' : 'border-brand bg-brand text-brand-fg'}`}
        >
          all
        </button>
        {tags.map((tag) => {
          const on = active === tagSlug(tag);
          return (
            <button
              key={tag}
              type="button"
              aria-pressed={on}
              onClick={() => void setFilter(on ? null : tag)}
              className={`${chip} ${on ? 'border-brand bg-brand text-brand-fg' : 'border-border bg-surface text-fg hover:bg-surface-muted'}`}
            >
              {tag}
            </button>
          );
        })}
      </nav>
    </>
  );
}

export function ProjectFilter(props: Props) {
  return (
    <Providers>
      <Chips {...props} />
    </Providers>
  );
}

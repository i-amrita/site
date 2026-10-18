import { Search } from 'lucide-react';
import { useQueryStates } from 'nuqs';

import { Button } from '@/components/ui/button';
import { urlStateParsers } from '@/lib/url-state';

import { COPY, ResultBody, ResultIcon, SearchEmpty, SearchPill } from './SearchParts';
import { useSearch } from './use-search';

/** Input, mode toggle, status pill and result links. Shared by the overlay and the `/search` page. */
export function SearchPanel({ autoFocus = false }: { autoFocus?: boolean }) {
  const [{ q, mode }, setState] = useQueryStates(urlStateParsers);
  const keywordOnly = mode === 'keyword';
  const query = q ?? '';
  const { status, results, indexAvailable, ms } = useSearch(query, !keywordOnly);

  return (
    <div className="flex flex-col gap-3" data-search-panel data-status={status}>
      <form
        action="/search"
        method="get"
        role="search"
        className="flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2 rounded-card border border-border bg-surface px-3 focus-within:border-brand">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            name="q"
            type="search"
            value={query}
            autoFocus={autoFocus}
            autoComplete="off"
            placeholder="Search projects, posts, pages"
            aria-label="Search"
            onChange={(e) => void setState({ q: e.target.value || null })}
            className="h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SearchPill status={status} keywordOnly={keywordOnly} />
          <div className="flex items-center gap-1">
            {ms !== null && status !== 'idle' && (
              <span className="mr-2 font-key text-xs text-muted-foreground">{ms} ms</span>
            )}
            <Button
              type="button"
              size="sm"
              variant={keywordOnly ? 'ghost' : 'secondary'}
              aria-pressed={!keywordOnly}
              onClick={() => void setState({ mode: 'ai' })}
            >
              AI
            </Button>
            <Button
              type="button"
              size="sm"
              variant={keywordOnly ? 'secondary' : 'ghost'}
              aria-pressed={keywordOnly}
              onClick={() => void setState({ mode: 'keyword' })}
            >
              Keyword
            </Button>
          </div>
        </div>
      </form>
      {status === 'idle' ? (
        <p className="px-1 text-sm text-muted-foreground">{COPY.hint}</p>
      ) : results.length === 0 ? (
        <SearchEmpty query={query} indexAvailable={indexAvailable} />
      ) : (
        <ul className="flex flex-col gap-1" data-search-results>
          {results.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                className="flex items-start gap-3 rounded-card px-3 py-2 hover:bg-brand-soft focus-visible:bg-brand-soft focus-visible:outline-none"
              >
                <ResultIcon
                  type={r.type}
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                />
                <ResultBody result={r} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

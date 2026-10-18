import { useEffect, useState, useSyncExternalStore } from 'react';

import {
  getModelState,
  keywordSearch,
  loadPagefind,
  rrf,
  semanticSearch,
  subscribeModel,
  warmModel,
  type SearchResult,
  type SearchStatus,
} from '@/lib/search';

export interface UseSearch {
  status: SearchStatus;
  results: SearchResult[];
  /** False when no Pagefind index is present (dev server before `pnpm build`). */
  indexAvailable: boolean;
  /** Wall time of the last completed search. */
  ms: number | null;
}

const MIN_CHARS = 2;

/**
 * `idle` no query; `keyword` Pagefind only; `warming` model downloading (keyword results still shown);
 * `hybrid` RRF over keyword + semantic. `semantic: false` pins keyword mode and never loads the model.
 */
export function useSearch(query: string, semantic = true): UseSearch {
  const modelState = useSyncExternalStore(subscribeModel, getModelState, () => 'cold' as const);
  const [state, setState] = useState<Omit<UseSearch, 'status'>>({
    results: [],
    indexAvailable: true,
    ms: null,
  });
  const q = query.trim();
  const active = q.length >= MIN_CHARS;
  const wantsModel = semantic && active;

  useEffect(() => {
    if (wantsModel) void warmModel();
  }, [wantsModel]);

  const hybrid = semantic && modelState === 'warm';
  useEffect(() => {
    if (!active) return;
    let stale = false;
    const t0 = performance.now();
    void (async () => {
      const hasIndex = !!(await loadPagefind());
      const kw = hasIndex ? await keywordSearch(q) : [];
      // `null` means a newer query superseded this one.
      if (stale || kw === null) return;
      const sem = hybrid ? await semanticSearch(q) : [];
      if (stale) return;
      setState({
        results: rrf([kw, sem]),
        indexAvailable: hasIndex,
        ms: Math.round(performance.now() - t0),
      });
    })();
    return () => {
      stale = true;
    };
  }, [q, active, hybrid]);

  const status: SearchStatus = !active
    ? 'idle'
    : !semantic || modelState === 'failed' || modelState === 'cold'
      ? 'keyword'
      : modelState === 'warming'
        ? 'warming'
        : 'hybrid';
  return {
    status,
    results: active ? state.results : [],
    indexAvailable: state.indexAvailable,
    ms: state.ms,
  };
}

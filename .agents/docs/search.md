# Search

Status: design, implementation pending. Nothing in this doc is wired yet except the `q` and `mode` parameters in `src/lib/url-state.ts`.

Hard rule from `AGENTS.md`: no real LLM for search. All search runs in the browser. Pagefind handles keyword search. A small sentence-embedding model (transformers.js with `Xenova/all-MiniLM-L6-v2`) adds semantic matches. Reciprocal rank fusion merges the two lists.

## Layers

1. Keyword layer, Pagefind. `pnpm build` runs `astro build && pagefind --site dist`. Pagefind indexes the static output and ships its index with the site. Queries run client-side and need no server.
2. Semantic layer, transformers.js. `@huggingface/transformers` loads `Xenova/all-MiniLM-L6-v2` (about 22 MB, cached by the browser after the first load). It is lazy-loaded on the first search keystroke, never on page load.
3. Fusion. Reciprocal rank fusion with k = 60 merges the Pagefind ranking and the embedding ranking. Each result scores as the sum over lists of 1 / (60 + rank).

## Cold and warm behavior

- First query, model not loaded: keyword results only. The UI shows "AI search (loading model...)" with a small progress indicator.
- After the model is warm: hybrid results (RRF over both layers). The header pill changes to "Here's what I found".
- Model load failures or slow networks fall back to keyword results. Keyword search must never depend on the model.

## Surfaces

- CmdK palette: results appear under Results when the query is longer than two characters. See `cmdK.md`.
- Search overlay: opened by the Search action (F4 or S), state `?overlay=search`. Pagefind's Component UI is the base.
- Query and mode: `?q=<text>` holds the query and `?mode=ai|keyword` picks the layer set. `mode` defaults to keyword. Both are replace-history (see `url-state.md`).

## Budgets

These are the Phase 4 and Phase 6 gates from the plan. Measure them with the `playwright-cli` skill on a throttled profile.

- Pagefind results within 200 ms on a cold page load.
- Model loads in under 8 s on slow 4G.
- RRF-merged results within 25 ms once the model is warm.

## Corpus

The corpus is the content collections: projects, posts, and singletons (about, now). Each entry needs a title, a short summary, and a canonical URL. Entries with `draft: true` must be excluded from both layers.

## Open questions

- Whether embeddings are computed at build time and shipped as a file, or computed in the browser after the model loads. The plan says the browser computes them after the model loads. Revisit if the 25 ms budget fails.
- How the model cache is versioned when the model id changes.

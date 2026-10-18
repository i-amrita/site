# Search

Status: implemented. Hard rule from `AGENTS.md`: no real LLM. Everything runs in the browser on static hosting.

## Layers

1. Keyword: Pagefind. Pages opt in with `data-pagefind-body` (set in `ProseLayout.astro`, so about, now, project and post pages). `data-pagefind-meta="type:<kind>"` carries the result type. Navbar, footer, overlays, listing pages and `/search` have no body marker and are not indexed.
2. Semantic: `Xenova/all-MiniLM-L6-v2` (q8 ONNX, about 23 MB) through `@huggingface/transformers`, WASM backend. Chunk vectors are computed at build time by `scripts/build-embeddings.ts` with the same model, so the browser only encodes the query.
3. Fusion: Reciprocal Rank Fusion, `score = sum 1 / (60 + rank)`, keyed by normalised page URL. A page's semantic rank uses its best chunk. Semantic hits below cosine 0.28 are dropped as noise.

## Build steps

`pnpm build` runs `astro build && pagefind --site dist && node scripts/build-embeddings.ts`.

- `astro build` also emits `dist/search-corpus.json` (`src/pages/search-corpus.json.ts`): one head chunk (title and description) plus one chunk per `##` section per page, capped at 900 characters.
- `pagefind --site dist` writes `dist/pagefind/` (about 700 KB for the seed content, loaded on demand).
- `build-embeddings.ts` embeds the corpus, writes `dist/embeddings.json` (int8 vectors scaled by 127, plus a 160 character snippet per chunk, about 17 KB for 16 chunks) and deletes the corpus file. Model files are cached in `node_modules/.cache/transformers` (gitignored), so only the first build downloads them. Node 24 runs the TypeScript script directly.
- `astro.config.mjs` has a build plugin that drops onnxruntime-web's 27 MB wasm from `_astro/` (Cloudflare Pages caps files at 25 MiB). transformers.js loads the runtime from jsDelivr instead.

Dev: Pagefind has no dev index. A dev-only Vite middleware serves `/pagefind/*` and `/embeddings.json` from `dist/`, so run `pnpm build` once and then `pnpm dev` works. Without `dist/`, the UI shows an explanatory empty state.

## Model hosting decision

Model weights come from the Hugging Face CDN on first use and are cached by the browser (Cache API). The WASM runtime comes from jsDelivr. Self-hosting under `public/models` was rejected: the q8 weights sit right at the 25 MiB Cloudflare file limit and would bloat the repo. Search stays usable offline after the first warm load. If the CDN is unreachable, the model state becomes `failed` and keyword search continues unaffected.

## Runtime behaviour (`src/lib/search.ts`, `src/components/react/use-search.ts`)

- `useSearch(query, semantic)` returns `{ status, results, indexAvailable, ms }`. Status is `idle` (no query), `keyword`, `warming` (model downloading, keyword results shown) or `hybrid`.
- The first query with 2 or more characters triggers `warmModel()` (lazy import, never at page load). It never blocks the UI.
- `mode` in the URL: `?mode=keyword` pins keyword only and never loads the model. Absent or `ai` means hybrid when warm. This replaces the earlier design note that said keyword was the default.
- The header pill reads "AI search", then "AI search (loading model...)" with a pulsing dot, then "Here's what I found" once warm.

## Surfaces

- CmdK palette (the only dialog): `/?cmdk=open&q=...&mode=ai|keyword`. Typing 3 or more characters shows results under the actions. The mode bar has AI and Keyword buttons (`aria-pressed`) that write `mode`. `SearchModal` and `?overlay=search` are gone; old `?overlay=search` links are rewritten to `?cmdk=open` by `SearchOverlays.tsx`. See `cmdK.md`.
- Standalone page: `/search?q=...&mode=...` (`search.astro`, `SearchPanel.tsx` inline). Needs JavaScript; the noscript block links to browse pages.

## Measured (localhost preview, headless Chromium, 6 project seed content)

- Keyword results: 70 to 180 ms (first query includes loading the Pagefind wasm).
- Cold model: hybrid ready about 2.5 s after load on localhost (model and runtime from CDN).
- Warm hybrid query: 70 to 95 ms end to end including Pagefind. Encoding plus cosine over 16 chunks is a few ms.

## Corpus

Projects, posts and singletons (about, now). Drafts are excluded because the corpus comes from `getSitePages()`.

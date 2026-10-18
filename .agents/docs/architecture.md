# Architecture

This is the agent-facing map of the repo. The public version lives at `docs/architecture.md` and omits personal content and `.agents/` paths. Keep the two in sync on structure. Status below is per file, not per phase, so check it before assuming a module exists.

## Stack

| Layer | Choice | Status |
|---|---|---|
| Framework | Astro 6, `output: 'static'`, deployed to Cloudflare Workers Static Assets | Configured |
| Islands | React 19 through `@astrojs/react` | Configured |
| Styling | Tailwind v4 through `@tailwindcss/vite`, tokens in `src/styles/tokens.css` | Landed |
| UI primitives | shadcn/ui, vendored in `src/components/ui/` | Landed (button, command, dialog, drawer, popover, tooltip) |
| URL state | `nuqs` for islands, `Astro.url.searchParams` for routes | Parsers landed in `src/lib/url-state.ts` |
| Action registry | `src/lib/actions.ts` | Landed (data only, no consumer yet) |
| Theme | `light-dark()` plus `?theme=` pre-paint script in `Base.astro` | Landed |
| Content | `astro:content` with Zod 4 collections (`project`, `post`, `singletons`) | Schema landed, content is placeholder |
| Markdown companions | `.md` endpoints, `llms.txt`, `llms-full.txt` | Planned |
| Keyboard hero | Islands for keycaps, audio, and action keys | Planned |
| Audio | Web Audio, one shared `AudioContext`, decoded-once buffers | Planned |
| Search | Pagefind, plus in-browser MiniLM-L6-v2 and RRF | Pagefind installed, semantic layer planned |
| i18n | Astro i18n routing, Paraglide, `intl-ai` fill | Planned (EN only at launch) |
| Lint and format | `oxlint`, `oxfmt` | Configured |
| Hooks | `lefthook`: pre-commit (format, lint, astro check), commit-msg (commitlint), pre-push (build) | Configured |
| Deploy | `wrangler deploy` of `dist/` | Configured |

## Repository layout

```
src/
  components/
    react/        islands (Providers.tsx so far)
    ui/           vendored shadcn/ui, never edited
  content/        about.mdx, posts/ (empty), projects/ (served at /work)
  content.config.ts  collections: project, post, singletons
  layouts/        Base.astro (head, canonical, theme pre-paint)
  lib/
    actions.ts    action registry (keys, icons, URL patches)
    theme.ts      applyTheme, currentTheme
    url-state.ts  parsers, history map, href helper
    utils.ts      cn()
  pages/          index.astro so far
  styles/         tokens.css, global.css
public/           static assets (sounds and fonts planned)
.agents/          agent docs, skills, screens (see .agents/README.md)
docs/             public docs
```

## Data flow

1. A user action (key press, click, or palette item) resolves to an entry in `ACTIONS`.
2. The consumer applies the entry's `patch` through the `nuqs` setter for that key. Toggle and cycle actions compute their value first.
3. The URL changes. `historyFor` decides whether that is a push or a replace.
4. Islands read the same keys through `urlStateParsers` and render from them. Astro routes read `Astro.url.searchParams`.
5. A reload or a shared link reproduces the same state, because nothing lives only in component memory.

`theme` also has a server-free path: `Base.astro` reads `?theme=` before paint and sets `data-theme`, and CSS does the rest through `light-dark()`.

## Content

The content collections define the schema. `project` requires title, role, org, period, and a summary of at most 280 characters, with optional cover, links, and flags. `post` has title, description, pubDate, and tags. `singletons` covers top-level MDX files such as `about.mdx` and `now.mdx`. Each collection's `draft` flag (where present) is the switch for unpublished content.

Content is the source of truth. There is no CMS. Every page should have a `.md` companion generated from the same source. Planned.

## Build and deploy

`pnpm build` runs `astro build` and then `pagefind --site dist`, which indexes the output for search. `pnpm deploy` runs the build and then `wrangler deploy`. Output is static, so there are no Pages Functions and no SSR routes.

## Constraints

- Static output only. No SSR, no Pages Functions.
- Self-host fonts through `@fontsource`. No Google Fonts CDN.
- No analytics until the launch decision is explicit.
- No LLM at runtime for search. Search runs in the browser (Pagefind plus MiniLM embeddings).
- pnpm only. Use `pnpm dlx` for one-off binaries. Never `npm` or `npx`.
- Commit messages follow Conventional Commits with the scopes listed in `commitlint.config.cjs`.

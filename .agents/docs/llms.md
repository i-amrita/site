# Agent-facing surface

Every content page has an HTML route and a markdown companion built from the same collection entry via `src/lib/content.ts`.

- `/about.md`, `/now.md`, `/projects/index.md`, `/projects/[slug].md`, `/posts/index.md`, `/posts/[slug].md`: `text/markdown; charset=utf-8`. MDX is reduced to plain markdown by `mdxToMarkdown` (imports, exports, JSX components stripped).
- `/llms.txt`: llmstxt.org index (H1, blockquote, H2 sections of `- [Title](absolute .md url): description`). Generated from `getSitePages()`. Never hand-edit.
- `/llms-full.txt`: every page markdown, each prefixed `# Title (canonical-url)`, separated by `---`.
- `public/_headers`: global `Link: </llms.txt>; rel="describedby"`, per-page `Link` rel=alternate to the `.md` companion (`::slug` placeholders for collections), and the `.md` content type. Cloudflare Pages ignores underscore-prefixed Astro routes, so this file is static.
- `public/robots.txt`: allows GPTBot, ClaudeBot, anthropic-ai, CCBot, PerplexityBot, Bytespider and points to `sitemap-index.xml`.
- JSON-LD `Person` comes from `src/lib/jsonld.ts` and is passed to `Base.astro` via the optional `jsonLd` prop on `/about`.
- Every page passes `mdHref` to `Base.astro`, which emits `<link rel="alternate" type="text/markdown">`.

Adding a page type: add its entries to `getSitePages()` and an `.md.ts` endpoint using `markdownResponse`.

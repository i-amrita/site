# Architecture

This document describes how the site is built. It is written for contributors and for anyone reading the source.

## Stack

The site is a static build made with Astro 6. React 19 runs in small interactive islands. Styling uses Tailwind v4 with semantic design tokens. Vendored primitives come from shadcn/ui. The output is deployed to Cloudflare Workers Static Assets with `wrangler deploy`.

Key libraries: `nuqs` for URL state in islands, `cmdk` and Radix for the command palette and dialogs, Pagefind for keyword search, and Zod through Astro content collections for typed content.

## Repository layout

```
src/
  components/
    react/     interactive islands
    ui/        vendored shadcn/ui primitives
  content/     site content as MDX and content collections
  layouts/     page shell (head, metadata, theme handling)
  lib/         shared logic: URL state, action registry, theme helpers
  pages/       one file per route
  styles/      design tokens and global styles
public/        static assets
docs/          public documentation
```

## URL state

Every visible UI state is reachable through a URL. Overlays, theme, locale, mute, and palette query all live in query parameters. A reload or a shared link reproduces the same view. Islands read and write these parameters through `nuqs`. Routes read them from the request URL.

Changes to overlays and the palette are pushed to browser history, so the back button closes them. Cosmetic changes such as scroll position and filters replace the current entry, so history stays usable.

## Keyboard

The home page shows a keyboard. Action keys (Escape, function keys, and letter aliases) open overlays, toggle the theme, or open the command palette. All actions come from one registry, so the keyboard, the palette, and the navbar stay consistent. Key clicks are optional and can be muted.

## Theme

Colors are defined once as semantic tokens with `light-dark()`, so the page follows the operating system setting without a script. A `theme` parameter can force light or dark, and it is applied before first paint to avoid a flash of the wrong theme.

## Search

Keyword search runs in the browser with Pagefind, indexed at build time. A planned semantic layer loads a small sentence-embedding model on the first keystroke and merges its results with keyword results using reciprocal rank fusion. There is no server-side search and no call to a language model at runtime.

## Content and agent access

Content lives in typed collections. Each content page is planned to have a Markdown companion generated from the same source, and the site will expose `llms.txt` and `llms-full.txt` at build time, so language-model tools can read the content directly.

## Build and deploy

`pnpm build` compiles the static site and then builds the Pagefind search index. `pnpm deploy` runs the build and publishes `dist/` to Cloudflare. There is no server runtime.

## Quality gates

Pre-commit hooks format and lint staged files and run type checks. Pre-push hooks run the full build. Commit messages follow Conventional Commits. Dependencies are managed with pnpm.

# i-amrita

Personal portfolio. Astro 6 and React 19 islands, static output to Cloudflare. Source available under PolyForm Noncommercial 1.0.0. Agent index: `AGENTS.md`.

## Setup

```sh
mise install
pnpm install
cp .env.example .env
pnpm dev
```

## Configuration

Personal links come from `PUBLIC_*` variables in `.env` (`PUBLIC_EMAIL`, `PUBLIC_LINKEDIN_URL`, `PUBLIC_RESEARCH_URL`, `PUBLIC_CV_URL`). `.env.example` documents each one and every value falls back to a placeholder in `src/lib/site.ts`, so the site builds without a `.env`. The values are public and inlined at build time, so never put secrets in them. Details: `.agents/docs/build.md`.

## Commands

`pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm check`, `pnpm lint`, `pnpm format:check`, `pnpm test:e2e`. Full list in `AGENTS.md`.

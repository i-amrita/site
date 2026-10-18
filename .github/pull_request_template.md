## What and why

<!-- One paragraph. Link the ticket. -->

## Checks

- [ ] `pnpm check && pnpm lint && pnpm format:check && pnpm build` pass locally
- [ ] Any new UI state is reachable by URL (see `src/lib/url-state.ts`)
- [ ] New content pages have a `.md` companion
- [ ] E2E spec added or updated in `tests/e2e/` if behavior changed
- [ ] No `npm`/`npx`, no ESLint/Prettier, no edits to `src/components/ui/**`

## Notes for reviewers

<!-- Screenshots for UI changes. Preview URL is commented by Cloudflare. -->

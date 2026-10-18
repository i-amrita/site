# CmdK palette

Status: implemented in `src/components/react/CmdK.tsx`, mounted by one island (`SearchOverlays.tsx`, via `src/components/astro/SearchOverlays.astro` in `Base.astro`), so it exists on every page. Screen layout: `.agents/screens/cmdk-palette.md`.

Built on vendored `ui/dialog` and `ui/command` (cmdk) with `shouldFilter={false}`: filtering is done in the component so hybrid search results are not re-filtered by label.

## Entry points

- Meta (lone tap), Space, Enter and the other keys in the registry entry for `cmdk` on the home keyboard hero. Cmd/Ctrl+K is bound by the hero on home, and by `SearchOverlays.tsx` on every other route (skipped on home to avoid pushing history twice).
- The navbar command button, and direct links `/?cmdk=open` and `/?cmdk=open&q=<text>`.

## Sections

Navigation (projects, about, log; on non-home routes these link to `/?overlay=<name>`), Actions (toggle theme, cycle language, toggle key clicks, copy email, all through `useActions().run(id)`), Projects (links to `/work/<slug>`, props from `getProjects()`).

When the query is longer than 2 characters the palette splits into Commands (matching commands plus "Open full search for ...") and Results (hybrid search, Pagefind plus MiniLM via RRF). The Projects section is replaced by Results. A mode bar under the input holds the status pill, last latency and the AI / Keyword toggle (two `aria-pressed` buttons, 44px targets, writing `?mode=ai|keyword`; absent means AI, keyword never loads the model). The mode bar is always visible so the mode can be chosen before typing. An sr-only `role=status` line announces the result count. "Open full search for ..." links to `/search?q=...&mode=...`.

The Find key, the navbar search button, Cmd/Ctrl+K and `?cmdk=open` all open this palette; the `search` action patches `cmdk: open`. `?overlay=search` is no longer valid: `SearchOverlays.tsx` rewrites it to `?cmdk=open` (replace), keeping `q` and `mode`.

## URL state

`cmdk=open`, `q=<text>` (replace history). Opening pushes history. Escape, click outside or Backspace on an empty input clears `cmdk` and `q`. Selecting a result navigates with `location.assign`.

## Accessibility

cmdk provides combobox and listbox semantics. Radix Dialog gives the focus trap, scroll lock and focus return. The dialog has a visually hidden title and description.

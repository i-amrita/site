# CmdK palette

Status: implemented in `src/components/react/CmdK.tsx`, mounted with the search overlay by one island (`SearchOverlays.tsx`, via `src/components/astro/SearchOverlays.astro` in `Base.astro`), so it exists on every page. Screen layout: `.agents/screens/cmdk-palette.md`.

Built on vendored `ui/dialog` and `ui/command` (cmdk) with `shouldFilter={false}`: filtering is done in the component so hybrid search results are not re-filtered by label.

## Entry points

- Meta (lone tap), Space, Enter and the other keys in the registry entry for `cmdk` on the home keyboard hero. Cmd/Ctrl+K is bound by the hero on home, and by `SearchOverlays.tsx` on every other route (skipped on home to avoid pushing history twice).
- The navbar command button, and direct links `/?cmdk=open` and `/?cmdk=open&q=<text>`.

## Sections

Navigation (projects, about, log; on non-home routes these link to `/?overlay=<name>`), Actions (open search, toggle theme, cycle language, toggle key clicks, copy email, all through `useActions().run(id)`), Projects (links to `/projects/<slug>`, props from `getProjects()`).

When the query is longer than 2 characters the palette splits into Commands (matching commands plus "Open full search for ...") and Results (hybrid search, Pagefind plus MiniLM via RRF). The Projects section is replaced by Results. A pill under the input shows the model state and last latency.

## URL state

`cmdk=open`, `q=<text>` (replace history). Opening pushes history. Escape, click outside or Backspace on an empty input clears `cmdk` and `q`. Selecting a result navigates with `location.assign`.

## Accessibility

cmdk provides combobox and listbox semantics. Radix Dialog gives the focus trap, scroll lock and focus return. The dialog has a visually hidden title and description.

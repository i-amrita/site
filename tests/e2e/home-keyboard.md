# Home keyboard

Every overlay is reachable by URL (`/?overlay=about|projects|log|search`) and by hotkey (see `src/lib/actions.ts`).

## Flows

- `/?overlay=projects` opens the projects overlay on load.
- `/?overlay=about`, `/?overlay=log` do the same for their overlays.
- Pressing `p` from `/` pushes `?overlay=projects` (history entry, back returns to `/`).
- `Escape` clears `overlay`, `cmdk`, `q`, `scroll` and `filter`.
- `F1` to `F4` map to about, projects, log, search.

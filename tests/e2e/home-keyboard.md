# Home keyboard

Every overlay is reachable by URL (`/?overlay=about|projects|log`, plus `/?cmdk=open` for the palette) and by hotkey (see `src/lib/actions.ts`).

## Flows

- `/?overlay=projects` opens the projects overlay on load.
- `/?overlay=about`, `/?overlay=log` do the same for their overlays.
- Pressing `p` from `/` pushes `?overlay=projects` (history entry, back returns to `/`).
- `Escape` clears `overlay`, `cmdk`, `q`, `scroll` and `filter`.
- `F1` to `F4` map to about, projects, log, the palette.
- The 75-key keyboard is now an 11-key macropad: 7 buttons, 1 slider (the dial) and 3 links (Research, LinkedIn, Let's build as `mailto:`), see `home-macropad.spec.ts`. At 375x667 the navbar, h1, the whole pad and the hint are inside the viewport, there is no horizontal scroll, and every pad control is at least 44px wide.
- Tapping Work sets `?overlay=projects`, Sound toggles `?mute=1`, Find sets `?cmdk=open`. Cmd/Ctrl+K still opens the palette via the window listener.
- The dial is a slider: ArrowRight/End on it write `?highlight=`, a click cycles 0/50/100; it no longer toggles the theme.
- A physical `F2` held down lights the Work key (`aria-pressed="true"`).

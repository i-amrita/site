# CmdK palette

Status: design, implementation pending. The `cmdk` parameter and the `cmdk` action exist in `src/lib/url-state.ts` and `src/lib/actions.ts`. The palette component does not exist yet.

The palette is built on `cmdk` inside a Radix Dialog. Opening it pushes `?cmdk=open` to history, so Back closes it. Closing it removes the parameter. Screen layout is in `.agents/screens/cmdk-palette.md`.

## Entry points

- Meta+k (Cmd+K on macOS, Ctrl+K elsewhere, depending on the keyboard island's binding). The `actions.ts` entry lists `Meta` and `k`.
- The `K` alias key, from the action registry.
- Space and Enter, listed as aliases in `actions.ts` for the palette action.
- A direct link: `/?cmdk=open`, or `/?cmdk=open&q=<text>` to open with a query.

## Sections

The palette has three sections, in this order.

1. Navigation: links to pages and overlays. Examples are projects, about, log, and now.
2. Actions: the registry entries from `actions.ts` that make sense in a palette, such as Toggle theme, Cycle language, Open search, and Copy email. Each runs the same patch as its key.
3. Projects: one item per project in the content collection, with its title and organization.

When the query is longer than two characters, the palette adds a Results area below the commands. Results come from the search layers in `search.md`: Pagefind keyword results, merged with the semantic layer when the model is warm.

## URL state

- `cmdk`: `open`, or absent when closed. History: push.
- `q`: query text. History: replace, as set in `historyFor`. Only present while the palette has text.
- `mode`: `ai` or `keyword`. Defaults to keyword.

Close (Escape) clears `cmdk`, `q`, `scroll`, and `filter`. See `url-state.md` for the full contract and for the known drift between the screen spec and the code.

## Behavior

- Type to filter. Items are matched by label and keywords.
- Arrow keys move the selection. Enter runs it.
- Escape or a click outside closes the palette.
- Backspace on an empty input closes the palette.
- Hover selects. Click runs.

## Accessibility

- `cmdk` provides the combobox and listbox roles, with `aria-expanded`, `aria-controls`, and `aria-activedescendant`.
- Radix Dialog provides the focus trap, focus return to the element that opened it, and scroll lock.
- Each section has a heading for screen readers. Items are buttons, so Tab reaches them.

## Verification

- The QA flows in `url-state.md` cover open and close through the URL.
- Check the palette at 375, 768, and 1280 widths and in both themes through the UI loop (see `ui-loop.md`).

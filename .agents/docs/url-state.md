# URL state contract

Every visible UI state must be reachable as a static URL. Source of truth: `src/lib/url-state.ts` (parsers and history rules) and `src/lib/actions.ts` (which action writes which param). If this doc and the code disagree, the code wins and this doc gets fixed in the same commit.

Islands bind the parsers with `nuqs` through `useQueryStates(urlStateParsers)`. `Providers.tsx` wraps every island root in `NuqsAdapter`, so all islands share one URL emitter. Astro routes read the same keys from `Astro.url.searchParams`. The only inline script that reads state before paint is `Base.astro`, which applies `?theme=`.

## Parameter table

| Param | Parser | Allowed values | History | Written by | Notes |
|---|---|---|---|---|---|
| `overlay` | `parseAsStringLiteral(OVERLAYS)` | `about`, `projects`, `log`, `search` | push | About (F1, A), Projects (F2, P), Log (F3, B), Search (F4, S). Close removes it. | One overlay at a time. Opening another overlay replaces the value. |
| `scroll` | `parseAsInteger` | integer | replace | Not written by any action yet. Projects overlay plan: card index in view. | Close clears it. |
| `filter` | `parseAsString` | any string | replace | Not written by any action yet. Projects overlay plan: text filter for overlay items. | Close clears it. |
| `mute` | `parseAsStringLiteral(FLAGS)` | `1`, `0` | replace | Mute (F5). Kind `toggle`, so the value is computed at call time by the consumer. | Mute silences key clicks only. Action keys still fire and still update the URL. |
| `highlight` | `parseAsStringLiteral(FLAGS)` | `1`, `0` | replace | No action in `actions.ts`. Keyboard screen spec: "Highlight action keys" checkbox. | When `1`, action keys pulse for 1.2 s on mount. |
| `theme` | `parseAsStringLiteral(THEMES)` | `light`, `dark` | replace | Theme (F6, T). Kind `toggle`. | Applied before paint by the inline script in `Base.astro`, which sets `<html data-theme>`. Absent means OS preference. |
| `locale` | `parseAsStringLiteral(LOCALES)` | `en`, `ms`, `hi`, `de`, `ml` | replace | Locale (Alt+l, L). Kind `cycle`. | Launch ships `en` only. The other values are reserved for Phase 5 (i18n). |
| `cmdk` | `parseAsStringLiteral(['open'])` | `open` | push | Command palette (Meta+k, K, Space, Enter). Close removes it. | Only value is `open`. |
| `q` | `parseAsString` | any string | replace | Not written by any action yet. CmdK input and search. | Close clears it. |
| `mode` | `parseAsStringLiteral(['ai', 'keyword'])` | `ai`, `keyword` | replace | Not written by any action yet. Phase 4 plan: toggles Pagefind-only vs hybrid search. | Default behavior is keyword. |

Values outside the allow-list are not valid state. Expected behavior is that the param reads as absent. QA must confirm this on a real page once a consumer exists.

## History rules

`historyFor` in `url-state.ts` is the single map. `push` creates a history entry, so the back button restores the previous state. `replace` updates the URL in place.

- `push`: `overlay`, `cmdk`. Back closes the overlay or the palette.
- `replace`: everything else. Scroll, filter, mute, highlight, theme, locale, q, mode.

Rule: high-frequency or cosmetic state uses `replace`. Anything a user would expect Back to undo uses `push`.

## Close patch

The `close` action (Escape) sets `overlay`, `cmdk`, `q`, `scroll`, and `filter` to `null`. It leaves `theme`, `locale`, `mute`, `highlight`, and `mode` alone, so preferences survive closing an overlay.

## Action patches

| Action id | Keys (from `actions.ts`) | Kind | Patch |
|---|---|---|---|
| `close` | `Escape` | navigate | `overlay: null, cmdk: null, q: null, scroll: null, filter: null` |
| `about` | `F1`, `a` | navigate | `overlay: about` |
| `projects` | `F2`, `p` | navigate | `overlay: projects` |
| `log` | `F3`, `b` | navigate | `overlay: log` |
| `search` | `F4`, `s` | navigate | `overlay: search` |
| `mute` | `F5` | toggle | computed at call time, writes `mute` |
| `theme` | `F6`, `t` | toggle | computed at call time, writes `theme` |
| `locale` | `Alt`, `l` | cycle | computed at call time, writes `locale` |
| `cmdk` | `Meta`, `k`, `' '` (Space), `Enter` | navigate | `cmdk: open` |
| `copy-email` | `c` | effect | no URL change. Shows a toast. |

Matching logic (chords such as `Alt` plus `l`, and `Meta` plus `k`) lives with the keyboard island, which is not written yet. The `keys` array is data only.

## Helper

`href(path, state)` builds a shareable URL. Null, undefined, and empty values are dropped. Numbers are stringified.

```ts
href('/', { overlay: 'projects' }); // "/?overlay=projects"
href('/', { cmdk: 'open', q: 'gdg' }); // "/?cmdk=open&q=gdg"
href('/', {}); // "/"
```

## Example URLs

- `/?overlay=projects`: Projects overlay open.
- `/?overlay=projects&scroll=2`: Projects overlay open, card index 2 in view (planned).
- `/?overlay=projects&filter=gcp`: Projects overlay with a text filter (planned).
- `/?theme=dark`: dark theme forced, regardless of OS setting.
- `/?theme=light&mute=1`: light theme, key clicks muted.
- `/?highlight=1`: action keys pulse on mount.
- `/?cmdk=open&q=gdg`: palette open with query.
- `/?cmdk=open&q=gdg&mode=ai`: palette open, hybrid search (planned).
- `/?locale=ms`: Malay. Reserved, not active at EN-only launch.

## Known drift between docs and code

These come from the planning screens in `.agents/screens/`. The code is the contract until a change is made deliberately.

- The keyboard screen lists `?caps=1` for Caps Lock. There is no `caps` parser in `url-state.ts`, so it is not part of the contract. Do not implement it without adding a parser and an entry in this table.
- The CmdK screen says the query persists with `history: 'push'`. `historyFor.q` is `replace`. Code wins for now.
- The CmdK screen says Escape then Cmd+K restores the query. `close` clears `q`, so the query is gone after Escape. Code wins for now.
- The CmdK screen names the param `cmdk.q`. The code uses a flat `q`.
- The keyboard screen says "Option L" for locale. The code binds `Alt` plus `l`, which is how macOS Option is reported on `KeyboardEvent`.

## QA flows (for the playwright-cli skill)

These are the reproducible checks. Each step is an action and an assertion. Use `playwright-cli`, not raw `@playwright/test`.

Runnable now (scaffold page, Base layout):

1. Pre-paint theme. Open `/?theme=dark`. Assert `<html data-theme="dark">` and `color-scheme` computes to `dark` before the first paint. Repeat with `/?theme=blue`. Assert no `data-theme` attribute is set.
2. Reject unknown values. Open `/?overlay=nope`. Assert no overlay is open (when the overlay shell lands).

Runnable after Phase 2 and 3:

3. Open by key. Load `/`. Press `F2`. Assert URL contains `overlay=projects`. Assert the Projects dialog is visible.
4. Back restores. From step 3, press `Browser Back`. Assert URL has no `overlay` param and the dialog is closed. This works because `overlay` uses `push`.
5. Escape closes. Load `/?overlay=projects`. Press `Escape`. Assert `overlay` is absent from the URL.
6. Replace does not grow history. Load `/?overlay=projects`, scroll the list so `scroll` changes, then count history length. Assert it did not increase because `scroll` uses `replace`.
7. Shareable state. Set `theme=dark`, `mute=1`, and `overlay=about`. Copy the URL, open it in a fresh context, and assert the same visible state.
8. Palette. Press `Meta+k` (or `k`). Assert `cmdk=open`. Press `Escape`. Assert `cmdk` is absent.
9. Locale. Press `Alt+l`. Assert `locale` changes in the URL. Expected at EN-only launch: the value is set but the page stays English.

Each flow writes a single line verdict (pass or fail) plus the failing assertion. Keep Playwright output terse.

# Screen: keyboard action-keys map

> Each non-typing key on the keyboard maps to either a URL-state change or an in-page action.
> "Action keys" — keys that don't represent a character — are visually marked with the brand accent.

## Action key bindings

| Key | Glyph | Action | URL state change | Modal? |
|---|---|---|---|---|
| `Escape` | esc | Close overlay / clear focus | `?overlay=` removed | — |
| `F1` | F1 | About overlay | `?overlay=about` | Dialog |
| `F2` | F2 | Projects overlay | `?overlay=projects` | Dialog |
| `F3` | F3 | Log overlay | `?overlay=log` | Dialog |
| `F4` | F4 / ⌕ | Search overlay | `?overlay=search` | Dialog (Pagefind) |
| `F5` | F5 / 🎙 | Mute toggle | `?mute=1\|0` | — |
| `F6` | F6 / ☾ | Theme toggle | `?theme=dark\|light` | — |
| `F7` | F7 / ⏮ | (skip) | — | — |
| `F8` | F8 / ⏯ | (skip) | — | — |
| `F9` | F9 / ⏭ | (skip) | — | — |
| `F10` | F10 / 🔉 | (skip) | — | — |
| `F11` | F11 / 🔊 | (skip) | — | — |
| `F12` | F12 / 🔊+ | (skip) | — | — |
| `Tab` | ⇥ | (default tab behavior) | — | — |
| `Caps Lock` | ⇪ | (toggle caps indicator) | `?caps=1` | — |
| `Shift L/R` | ⇧ | (modifier) | — | — |
| `Ctrl L/R` | ⌃ | (modifier) | — | — |
| `Option L` | ⌥ | Locale cycle | `?locale=ms\|hi\|de\|ml\|en` | — |
| `Cmd L/R` | ⌘ | Open CmdK palette | `?cmdk=open` | Dialog (cmdk) |
| `fn` | fn | (modifier) | — | — |
| `Space` | ─────────── | Open CmdK palette (alias) | `?cmdk=open` | — |
| `Return` | ⏎ | Open CmdK palette (alias) | `?cmdk=open` | — |
| `Delete` | del | (default delete behavior) | — | — |
| `←` `→` `↑` `↓` | arrows | Navigate overlay items / scroll | depends | — |
| `pgup` `pgdn` | ⇞ ⇟ | Scroll overlay | — | — |
| `home` `end` | ⇱ ⇲ | Scroll to top/bottom | — | — |
| `T` (alpha) | T | Theme toggle (alias of F6) | `?theme=dark\|light` | — |
| `L` (alpha) | L | Locale cycle (alias of ⌥) | `?locale=...` | — |
| `A` (alpha) | A | About overlay (alias of F1) | `?overlay=about` | — |
| `P` (alpha) | P | Projects overlay (alias of F2) | `?overlay=projects` | — |
| `B` (alpha) | B | Log overlay (alias of F3) | `?overlay=log` | — |
| `S` (alpha) | S | Search overlay (alias of F4) | `?overlay=search` | — |
| `C` (alpha) | C | Copy email to clipboard | — | toast |
| `K` (alpha) | K | CmdK palette (alias of ⌘) | `?cmdk=open` | — |

## Visual treatment

Action keys render with:

- bg = `--color-key-accent` (off-white `#E1E1E1` light / `#2D2A3F` dark)
- fg = `--color-key-accent-fg` (`#8F4246` light / `#F5C8CA` dark)
- 2px border-bottom in `--color-brand` for visual "this is different"

Typing keys keep the standard keythm scarlet theme (light = letter keys, dark = modifiers).

## Keyboard-driven overlays

When the user presses an action key, the corresponding URL query param updates via `nuqs`. The page hydrates the overlay island which reads the param and opens. URL becomes the source of truth — back button closes overlay, shareable, agent-replayable.

If a user prefers to **not** type-to-act, the muted checkbox at the bottom of the keyboard section toggles `?mute=1`. With mute on:

- Action keys still trigger (URL updates)
- But no audio click plays
- A subtle toast confirms each action ("Opened About")

When `?highlight=1` is set (the "Highlight action keys" checkbox), action keys additionally animate a 1.2s glow pulse on every mount to make discoverability obvious on first visit. URL persists so agents can replay the discoverability demo.

## Layout detail

```
Row 0: [esc]  F1  F2  F3  [⌕ F4]  [🎙 F5]  [☾ F6]  ⏮  ⏯  ⏭  🔉  🔊  🔊+  [#]  [del]
                              ^^^^^                                  ^^^^
                              action                                  icon
Row 1: ` 1 2 3 4 5 6 7 8 9 0 - =  [⌫ backspace]                          [pgup]
Row 2: [⇥ tab]  Q W E R T Y U I O P { [ } ] \                              [pgdn]
Row 3: [⇪ caps]  A S D F G H J K L : ; " '  [⏎ return]                     [home]
Row 4: [⇧ shift]  Z X C V B N M < , > . ? /  [⇧ shift] [↑] [end]
Row 5: [⌃ ctrl] [⌥ option] [⌘ cmd] [────── space ──────] [⌘ cmd] [fn] [⌃ ctrl] [← ↓ →]
```

Brackets `[X]` indicate action keys visually styled with `--color-key-accent`. The function row has F1–F4 highlighted (action keys), F5–F12 muted (legacy), with F6 (theme toggle) shown as the universally familiar moon icon.
# Screen: home hero (desktop 1280×800)

> Captures the desktop landing surface.
> Keyboard scales to fit viewport height minus header (max 320px tall).
> Action keys highlighted in `--color-brand`.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⌘K                       i-amrita                       🔍  T  ☾          │ ← navbar pill
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                                                                              │
│    I am <span style="color:var(--color-brand)">Amrita</span>                 │
│    I bridge the gap between technical complexity                            │
│    and real-world impact.                                                    │
│                                                                              │
│    AI × community × human-centered design.                                   │
│    Currently MIMS '27 @ UC Berkeley · ex-TPM @ Google (Singapore)             │
│                                                                              │
│    ─────────────────────────────────────────────────────────────────         │
│                                                                              │
│    [LinkedIn]  [Research]  [Email]  [CV / Resume]                           │ ← socials
│                                                                              │
│    ┌────────────────────────────────────────────────────────────────────┐   │
│    │ [esc] F1 F2 F3 [⌕] [🎙] [☾] [⏮] [⏯] [⏭] [🔉] [🔊] [🔊+] [#] [del] │   │ F1..F4 action
│    │ ` 1 2 3 4 5 6 7 8 9 0 - = ⌫                                            │   │
│    │ ⇥ Q W E R T Y U I O P [ ] \                                            │   │
│    │ ⇪ A S D F G H J K L ; ' ⏎                                              │   │
│    │ ⇧ Z X C V B N M , . / ⇧ ↑                                              │   │
│    │ ⌃ ⌥ ⌘  ───────────────────────  ⌘ fn ⌃  ← ↓ →                          │   │
│    └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│    [accent box]                                                              │
│    ┌────────────────────────────────────────────────────────────────────┐   │
│    │ ☐  Mute key clicks                                                   │   │
│    │ ☐  Highlight action keys                                              │   │
│    │                                                                     │   │
│    │ Action keys: Esc, F1 (About), F2 (Projects), F3 (Log),               │   │
│    │ F4 (Search), F5 (Theme), F6 (Locale), Cmd (CmdK)                     │   │
│    └────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Palette map (matches tokens.css)

| Element | Token | Hex |
|---|---|---|
| page bg | `--color-page-bg` | `#FFF8F3` light / `#1B1A26` dark |
| brand text "Amrita" | `--color-brand` | `#8F4246` |
| keycap (letter/number) | `--color-key-light` | `#E4D7D7` |
| keycap (modifiers) | `--color-key-dark` | `#D5868A` |
| keycap (Esc, Enter, action-key highlights) | `--color-key-accent` | `#E1E1E1` |
| action-key glyph | `--color-key-accent-fg` | `#8F4246` |
| navbar pill | `--color-surface-muted` | `#F4E9E2` |

## Spacing

- navbar pill: 12px h-padding, 8px v-padding, `--radius-card: 14px`
- hero title: 64px / Fraunces 600 / line-height 1.05
- hero tagline: 24px / Inter 400 / line-height 1.4
- keyboard: max-width 950px, centered, gap 2px between keys
- muted checkbox block: 16px radius, surface-muted bg, 24px padding

## Mobile rule

At ≤480px viewport, keyboard shrinks to ~285px wide × 95px tall (3.3× scale-down from desktop). Hero title drops to 36px. Socials wrap to 2 rows. Checkbox block hides — tap the keyboard to discover actions.
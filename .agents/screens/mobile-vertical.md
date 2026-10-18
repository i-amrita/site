# Screen: mobile vertical (375 × 812, iPhone SE)

> Tightest viewport. Keyboard scales down to 285 × 95. Hero title fits 2 lines.
> Action keys remain reachable via tap. No hover states.

```
┌─────────────────────────────────────┐
│ ⌘K                    [⌘][⌘]  🔍  T │  ← 64px tall pill, 12px h-padding
├─────────────────────────────────────┤
│                                     │
│ I am Amrita                         │  ← 36px Fraunces 600, line-h 1.05
│ I bridge the gap                    │  ← 16px Inter 400, line-h 1.4
│ between technical                   │
│ complexity and                      │
│ real-world impact.                  │
│                                     │
│ AI × community ×                    │
│ human-centered design.              │
│ Currently MIMS '27 @                │
│ UC Berkeley.                        │
│                                     │
│ ───────────                         │
│                                     │
│ LinkedIn · Research                 │  ← socials, 2 rows max
│ Email · CV                          │
│                                     │
│ ┌─────────────────────────────────┐ │  ← 285 × 95 keyboard, 2px gap
│ │ esc F1 F2 F3 ⌕ 🎙 ☾ ⏮ ⏯ ⏭ 🔉🔊🔊+ del │ │
│ │ ` 1 2 3 4 5 6 7 8 9 0 - = ⌫      │ │  ← 16px font for letter keys
│ │ ⇥ Q W E R T Y U I O P [ ] \      │ │     11px font for number row
│ │ ⇪ A S D F G H J K L ; ' ⏎       │ │     9px font for F-row labels
│ │ ⇧ Z X C V B N M , . / ⇧ ↑       │ │
│ │ ⌃ ⌥ ⌘ ──── ⌘ fn ⌃ ←↓→            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [☐ Mute key clicks]                 │
│ [☐ Highlight action keys]          │
│                                     │
│ Tap action keys (Esc, F1, Cmd)      │  ← hint line, 12px Inter 400
│ to navigate. Tap 🔍 to search.      │
│                                     │
└─────────────────────────────────────┘
```

## Vertical budget

| Element | Height | Cumulative |
|---|---|---|
| status bar (system) | ~44px | 44 |
| navbar pill | 64px | 108 |
| gap | 24px | 132 |
| hero title (2 lines × 38px) | 76px | 208 |
| hero subtitle (4 lines × 22px) | 88px | 296 |
| tagline (2 lines × 22px) | 44px | 340 |
| divider | 24px | 364 |
| socials (2 rows × 24px) | 48px | 412 |
| gap | 16px | 428 |
| keyboard | 95px | 523 |
| gap | 16px | 539 |
| muted checkboxes (2 rows × 24px) | 48px | 587 |
| hint | 36px | 623 |
| bottom safe area | 34px | 657 |

Total: ~657px. iPhone SE viewport is 812px tall. Comfortable margin (~155px).

## Critical rules

- **No keyboard horizontal scroll**: each key at this scale is 16px wide. Full QWERTY row (15 keys) = 240px + 2px gaps = ~270px. Fits in 285.
- **No font below 9px**: F-row labels become unreadable. Acceptable: F1–F4 are large enough because of action-key padding.
- **No hover**: tap-only. Action keys respond on `pointerdown`, not hover.
- **Click latency budget**: AudioContext unlock must succeed on the user's first tap on any key. Sprite is preloaded via `<link rel="preload">` + module-level fetch on `client:load`.
- **No landscape rework**: keyboard fits comfortably in 812px height. Landscape (812 × 375) becomes a single-line keyboard on top with hero to the right — `@media (orientation: landscape) and (max-height: 500px)` rotation rule.

## Touch targets

Apple HIG: 44pt minimum. Material: 48dp. Our action keys at this scale are 16px wide which is **below** the minimum. Mitigation:

- The full "highlighted action key" has an 8px halo on tap (`::after` pseudo with `inset: -8px`) extending the touch surface to ~32px wide.
- For users who need larger targets: a "Big keys" toggle that 1.5× scales the keyboard, costs vertical budget but reaches 24px wide keys.

## Reduced motion

`@media (prefers-reduced-motion: reduce)` disables:

- Key press depth animation (cap stays at full height)
- Modal scale-in (instant show)
- CmdK backdrop fade-in (instant)
- Audio click (auto-muted on load if `prefers-reduced-motion: reduce` matches `prefers-reduced-transparency` heuristic; explicit checkbox still wins)
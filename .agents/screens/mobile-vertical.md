# Screen: mobile vertical (375 x 667 and 375 x 812)

> TARGET state for the macropad redesign. Supersedes the 75-key keyboard layout.
> Goal: at 375x667 the navbar, the hero (h1 + subtitle) and the whole macropad are visible with no scroll and no horizontal scroll.
> Every pad key is at least 44px wide. Related specs: `navbar-pill.md`, `home-keyboard-actions.md`, `home-hero.md`.

## Layout at 375 x 667 (iPhone SE, viewport excludes system UI)

```
375px
┌───────────────────────────────────────┐ y=0
│     ┌───────────────────────────┐     │ y=12   pill, h-9 = 36, w-max, centered
│     │ (home) About | Cmd-K | EN o│    │
│     └───────────────────────────┘     │ y=48
│            I am  Amrita               │ y=72   h1 Fraunces 48/52, name italic brand
│     I bridge the gap between          │ y=136  subtitle 14/20, 2 lines, mt-3
│   technical complexity and impact.    │ y=176
│                                       │
│                                       │ mt-32 = 128 of negative space
│                                       │
│ ┌───────────────────────────────────┐ │ y=304  frame 216 reserved (chassis only)
│ │ [keys ...]                        │ │
│ └───────────────────────────────────┘ │ y=520
│  Tap a key or press Cmd-K to open ... │ y=532  hint, mt-3, one line, ends 548
│                                       │ main pb-4 -> y=564
│              llms.txt                 │ footer py-2 + 16 -> y=596
│            (spare 71)                 │
└───────────────────────────────────────┘ y=667
```

The y markers are illustrative; the budget table is authoritative. The hero is the h1 and subtitle only. The link chips moved into the keypad.

## Layout at 375 x 812

Same single column, same sizes, top-aligned. The extra 145px is spare whitespace below the footer link. The pad stays 342px wide and is never stretched.

## Vertical budget at 375 x 667

| # | Element | Spacing + height | Height | Cumulative |
|---|---|---|---|---|
| 1 | navbar top margin (`mt-3`) | 12 | 12 | 12 |
| 2 | pill (`h-9`) | 36 | 36 | 48 |
| 3 | gap to hero (`pt-6`) | 24 | 24 | 72 |
| 4 | h1, Fraunces 48px, line-height 52px | 52 | 52 | 124 |
| 5 | subtitle, 14px / 20px, 2 lines, `mt-3` | 12 + 40 | 52 | 176 |
| 6 | negative space above the pad (`mt-32` on the frame) | 128 | 128 | 304 |
| 7 | pad frame, reserved: chassis only | 216 | 216 | 520 |
| 8 | hint, `mt-3`, 12px / 16px, 1 line | 12 + 16 | 28 | 548 |
| 9 | main bottom padding (`pb-4`) | 16 | 16 | 564 |
| 10 | footer: `llms.txt` link, `py-2` + 16px line | 32 | 32 | 596 |

Total: 596px. Viewport: 667px. Spare: 71px. No vertical scroll (`scrollHeight <= 667`). Pad bottom edge y=520, hint ends y=548. If the keypad frame grows, shrink `mt-32` first.

Chassis height is 216px: 14px padding, 3 rows of 56px keys, 2 gaps of 10px, 14px padding.

Rules that keep this true:

- The `h1` is one line at 375 (`I am Amrita` at 48px is about 250px wide). A locale that wraps it overruns the 71px spare, so shorten copy rather than shrinking type.
- The subtitle is allowed 2 lines. A third line breaks the budget and is a FAIL.
- The pad height is reserved from first paint (`KeyboardFrame.astro` reserves 216px). CLS is 0.
- Entry animation uses only `transform`, `opacity`, `filter`, so it never changes the box.

## Chassis and key math

The chassis is `max-w-[342px] w-full`, centered, at 375px viewport with `px-5` (20px) side padding, so the available width is 335px and the chassis is capped by the viewport at 335px on a 375 screen. At exactly 342px the math is:

| Item | Value |
|---|---|
| chassis width | 342px |
| chassis padding | 14px each side, so inner width 342 - 28 = 314px |
| columns | 4 |
| gap | 10px (`gap-2.5`), 3 gaps = 30px |
| key width | (314 - 30) / 4 = 71px, "about 70px" |
| 2u key (Let's build) | 2 x 71 + 10 = 152px |
| key height | `h-14` = 56px |
| minimum key width | 44px (WCAG 2.5.5 and Apple HIG), asserted by e2e |

At a 335px chassis (375 minus `px-5`): (335 - 28 - 30) / 4 = 69.25px, still above 44px. The pad has 25px of headroom per key before the 44px minimum is hit, which is reached at a viewport of about 300px (320px devices still pass: (280 - 28 - 30) / 4 = 55.5px with `px-5`).

Double-Bezel: outer radius 28px, padding 14px, inner plate radius `calc(28px - 14px)` = 14px. The plate has an inset top highlight. Shadows are diffused and tinted via a token, never `shadow-md`.

## Interaction rules

- Tap only. No hover dependence. Keys react on `pointerdown` (see `home-keyboard-actions.md`).
- Press depth: cap moves down 4px and the side sliver collapses, 60ms on `--ease-key`. `navigator.vibrate?.(12)` on pointer press where supported.
- Each key is a real tabbable `button`, and its accessible name starts with its visible legend (for example "Work Projects").
- `?highlight=1` is a steady brand glow on navigation keys, not a pulse.
- URL state contract is unchanged: `?overlay=`, `?cmdk=`, `?theme=`, `?locale=`, `?mute=`, `?highlight=`.

## Reduced motion

Under `prefers-reduced-motion: reduce`: no entry fade-up, no key press travel (the cap keeps full height, the pressed state is a color change), no radar ping on the theme dot, no dial rotation animation (the dial snaps).

## Landscape

No landscape rework. 667 x 375 landscape scrolls vertically, which is acceptable. The single column and the pad are unchanged.

## Overrides of high-end-visual-design

Recorded so the evaluator does not flag them:

- No `py-24` macro-whitespace on `/`. Vertical rhythm is set by the viewport budget above. Content pages keep their current spacing (out of scope).
- Icons are `@lucide/astro` / `lucide-react` at `strokeWidth={1.5}` everywhere in the redesign. No Phosphor, no raw inline SVG.
- Body font is Plus Jakarta Sans Variable (not Inter). Display is Fraunces. Mono is `"Berkeley Mono", ui-monospace, "SF Mono", monospace` (Berkeley is never shipped, legends render in the visitor's system mono).
- Palette is the user's chosen direction (rose hue about 15 degrees OKLCH, shared across themes), not a scale taken from a reference.

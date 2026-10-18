# Design tokens

Source of truth: `src/styles/tokens.css`. Components use semantic class names only, for example `bg-page`, `text-fg`, `text-brand`, `bg-key-cream`. Never write arbitrary-value utilities that wrap a CSS variable, or raw `var(--c-...)`, in component markup. If a token is missing, add it to `tokens.css` first, then use the class.

## How the pieces connect

Raw values live in `:root` as `--c-*` custom properties. Each value uses CSS `light-dark(light, dark)`, so there is no JS class toggle and no flash of the wrong theme. The `@theme inline` block maps each `--color-*` name to its `--c-*` variable, which makes Tailwind v4 generate utilities such as `bg-page` and `text-brand`.

Theme resolution:

- No `data-theme` on `<html>`: `color-scheme: light dark` lets `light-dark()` follow the OS setting.
- `<html data-theme="light">` or `"dark"`: `color-scheme` is pinned, so `light-dark()` resolves to that side. This is how `?theme=` overrides the OS.
- `Base.astro` sets `data-theme` from `?theme=` before paint.

## Hue rationale

The palette is anchored on one rose hue, about 15 in OKLCH. Light and dark mirror lightness on that same hue, so the light-theme burgundy (`#8b3a42`, L 0.43) and the dark-theme dusty rose (`#c4767e`, L 0.64) read as one brand. Neutrals carry a faint tint toward the same hue: cream in light, warm charcoal in dark (never cool grey). The secondary is a split-complementary sage at about 160, used only for the esc key and small accents. Keycaps are physical objects and keep identical colors in both themes. The pad chassis and plate are dark in both themes so the pad reads as an object on cream.

## Surface and text

| Token | Utility | Light | Dark | Use |
|---|---|---|---|---|
| `--color-page` | `bg-page` | `#fcf9f4` | `oklch(0.16 0.008 15)` | Page background |
| `--color-fg` | `text-fg` | `#1c1c19` | `#f1ede8` | Body text |
| `--color-muted-foreground` | `text-muted-foreground` | `#544243` | `#b4a6a3` | Secondary text |
| `--color-surface` | `bg-surface` | `#ffffff` | `#1a1718` | Cards, dialogs |
| `--color-surface-muted` | `bg-surface-muted` | `#f0ede9` | `#232021` | Secondary panels |
| `--color-border` | `border-border` | `#dac1c1` | `#3a3335` | Dividers, outlines |
| `--color-dot-grid` | `--c-dot-grid` | `rgb(0 0 0 / 0.05)` | `rgb(255 255 255 / 0.05)` | Body dot-grid texture |

## Brand

| Token | Utility | Light | Dark | Use |
|---|---|---|---|---|
| `--color-brand` | `text-brand`, `bg-brand` | `#8b3a42` | `#c4767e` | Accents, links, glow |
| `--color-brand-strong` | `text-brand-strong` | `#6d232c` | `#e3a3a9` | Hover, underline |
| `--color-brand-soft` | `bg-brand-soft` | `#ffdada` | `#4a2a2e` | Selection, glow ring |
| `--color-brand-fg` | `text-brand-fg` | `#ffffff` | `#1c1012` | Text on brand fills |
| `--color-brand-hover` | `bg-brand-hover` | alias of `brand-strong` | alias | Kept for existing markup |

`::selection` uses `bg-brand-soft` with `text-fg` (see `global.css`).

## Macropad keycaps and hardware

Identical in both themes. `-lo` is the bottom stop of the cap gradient, `-side` is the key wall.

| Token family | Cap (top to `-lo`) | Side | Legend |
|---|---|---|---|
| `key-cream` | `#f7f3ed` to `#eae4dc` | `#beaba0` | `#3c262a` |
| `key-rose` | `#b9646d` to `#a85a63` | `#7e434a` | `#fffaf6` |
| `key-sage` | `#e3ece6` to `#d4ded7` | `#9fae9d` | `#36443c` |

Rose is darkened from the mockup's `#b36870` so the legend passes 4.5:1.

| Token | Light theme | Dark theme | Use |
|---|---|---|---|
| `chassis` / `chassis-lo` | `#2a2627` / `#1d1a1b` | `#2a2c31` / `#151619` | Pad shell gradient |
| `plate` | `#141213` | `#121316` | Recessed inner plate |

Legacy `key-light`, `key-dark`, `key-accent` tokens still exist for the old keyboard. Retire after macropad lands.

## Motion and depth

| Token | Value | Use |
|---|---|---|
| `--ease-spring` | `cubic-bezier(0.32, 0.72, 0, 1)` | All motion of 300 to 700ms |
| `--ease-key` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | Key press, 60ms |
| `--shadow-lift` | `0 24px 60px -12px rgb(28 16 18 / 0.35)` | Tinted diffused shadow (`shadow-lift`) |

Hover and press micro-interactions use `transition-[color,transform] duration-300 ease-(--ease-spring)` with a small translate or `active:scale-90..95`, plus `motion-reduce:` fallbacks. Never animate layout properties.

Never use `linear`, `ease-in-out`, `shadow-md` or pure black shadows.

Utilities in `global.css`:

- `.rise`: fade up 1rem with a 4px blur resolving over 700ms on `--ease-spring`. Stagger with `style="--i: n"` (60ms each). Uses transform, opacity and filter only, so the layout box never changes. Disabled under `prefers-reduced-motion`.
- `.item-in`: 6px fade up over 360ms for items that arrive asynchronously (search results). Stagger with `style="--i: n"` at 40ms each, cap at 6. Opacity and transform only. Disabled under `prefers-reduced-motion`.
- `.progress-sweep`: 2px indeterminate sliver, absolutely positioned on a `relative` parent, moved with `transform`. Used while the CmdK and `/search` embedding model warms. Reduced motion shows a static half-opacity bar.
- Page transitions: `@view-transition { navigation: auto }` (cross-document, no router, no JS) inside `prefers-reduced-motion: no-preference`. The root crossfades (180ms out, 320ms in) and the navbar `header` has `view-transition-name: site-nav` so the pill stays put. Movement comes from `.rise` on the new page, so the transition itself is opacity only. Unsupported browsers navigate normally.
- Overlay motion is set by slot selector in `global.css`, overriding the vendored tw-animate classes without editing `ui/`: scrim fade (`dialog-overlay`, `drawer-overlay`), `pop-in`/`pop-out` (4px lift plus 0.97 scale) for `dialog-content`, `popover-content`, `tooltip-content`, and `dock-in`/`dock-out` (slide from the right) for `[data-overlay-panel]`. Exit animations must always exist so Radix waits before unmounting. The vaul drawer keeps its own transform transition, which already uses the spring curve. Under reduced motion every overlay becomes a 100 to 120ms opacity fade.
- `.key-glow` (alias `.animate-key-glow`): steady brand box-shadow for `?highlight=1`.
- `body::after`: one fixed grain layer at 0.03 opacity above the body dot grid.

## Radii, shadows, fonts

| Token | Utility | Value |
|---|---|---|
| `--radius-key` | `rounded-key` | `6px` |
| `--radius-card` | `rounded-card` | `14px` |
| `--shadow-key` | `shadow-key` | `0 1px 0 rgb(0 0 0 / 0.06), 0 0 0 1px var(--c-border)` |
| `--font-display` | `font-display` | `'Fraunces', Georgia, serif` (400, 400 italic, 600) |
| `--font-body` | `font-body` | `'Plus Jakarta Sans Variable', system-ui, sans-serif` |
| `--font-mono` / `--font-key` | `font-mono` / `font-key` | `"Berkeley Mono", ui-monospace, "SF Mono", monospace` |

Fonts are self-hosted through `@fontsource` imports in `global.css`. Berkeley Mono is paid and never shipped, so legends render in the visitor's system mono. Do not add a Google Fonts CDN link.

## shadcn/ui compatibility

Vendored primitives in `src/components/ui/` use shadcn class names. `tokens.css` maps those names onto our values, so the vendored files work without edits.

| shadcn name | Maps to | Light | Dark |
|---|---|---|---|
| `background` | `--c-page` | `#fcf9f4` | `oklch(0.16 0.008 15)` |
| `foreground` | `--c-fg` | `#1c1c19` | `#f1ede8` |
| `popover` | `--c-surface` | `#ffffff` | `#1a1718` |
| `popover-foreground` | `--c-fg` | `#1c1c19` | `#f1ede8` |
| `primary` | `--c-brand` | `#8b3a42` | `#c4767e` |
| `primary-foreground` | `--c-brand-fg` | `#ffffff` | `#1c1012` |
| `secondary` | `--c-surface-muted` | `#f0ede9` | `#232021` |
| `secondary-foreground` | `--c-fg` | `#1c1c19` | `#f1ede8` |
| `muted` | `--c-surface-muted` | `#f0ede9` | `#232021` |
| `muted-foreground` | literal | `#544243` | `#b4a6a3` |
| `accent` | `--c-surface-muted` | `#f0ede9` | `#232021` |
| `accent-foreground` | `--c-fg` | `#1c1c19` | `#f1ede8` |
| `destructive` | literal | `#b3261e` | `#b3261e` |
| `input` | `--c-border` | `#dac1c1` | `#3a3335` |
| `ring` | `--c-brand` | `#8b3a42` | `#c4767e` |

Use shadcn names only inside `ui/`. In our own components in `astro/` and `react/`, use our semantic names. Do not add new shadcn-only names to our markup.

## Rules

- Semantic classes only in markup. No raw hex, no `var(--c-*)`, no arbitrary `bg-[...]`.
- New colors go in `tokens.css` under both `:root` (with `light-dark()`) and `@theme inline`, then get a semantic name.
- Keycap CSS recipe is lifted from keythm. Attribution is in `NOTICE`.
- Verify both themes. The UI loop checks light and dark through `?theme=` (see `ui-loop.md`).

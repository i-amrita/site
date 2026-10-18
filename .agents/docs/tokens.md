# Design tokens

Source of truth: `src/styles/tokens.css`. Components use semantic class names only, for example `bg-page`, `text-fg`, `text-brand`, `bg-key-light`. Never write arbitrary-value utilities that wrap a CSS variable, or raw `var(--c-...)`, in component markup. If a token is missing, add it to `tokens.css` first, then use the class.

## How the pieces connect

Raw values live in `:root` as `--c-*` custom properties. Each value uses CSS `light-dark(light, dark)`, so there is no JS class toggle and no flash of the wrong theme. The `@theme inline` block maps each `--color-*` name to its `--c-*` variable, which makes Tailwind v4 generate utilities such as `bg-page` and `text-brand`.

Theme resolution:

- No `data-theme` on `<html>`: `color-scheme: light dark` lets `light-dark()` follow the OS setting.
- `<html data-theme="light">` or `"dark"`: `color-scheme` is pinned, so `light-dark()` resolves to that side. This is how `?theme=` overrides the OS.
- `Base.astro` sets `data-theme` from `?theme=` before paint.

## Surface and text

| Token | Utility | Light | Dark | Use |
|---|---|---|---|---|
| `--color-page` | `bg-page` | `#fff8f3` | `#1b1a26` | Page background |
| `--color-fg` | `text-fg` | `#2a1f2f` | `#f5e8e1` | Body text |
| `--color-surface` | `bg-surface` | `#ffffff` | `#232132` | Cards, dialogs |
| `--color-surface-muted` | `bg-surface-muted` | `#f4e9e2` | `#2b2a3d` | Secondary panels |
| `--color-border` | `border-border` | `#e8d7cf` | `#3a394b` | Dividers, outlines |

## Keycaps

| Token | Utility | Light | Dark | Use |
|---|---|---|---|---|
| `--color-key-light` | `bg-key-light` | `#e4d7d7` | `#4a4456` | Letter keys |
| `--color-key-light-fg` | `text-key-light-fg` | `#8f4246` | `#f5e8e1` | Letter key labels |
| `--color-key-dark` | `bg-key-dark` | `#d5868a` | `#5c4b5c` | Modifier keys |
| `--color-key-dark-fg` | `text-key-dark-fg` | `#fff8f3` | `#fff8f3` | Modifier key labels (same in both themes) |
| `--color-key-accent` | `bg-key-accent` | `#e1e1e1` | `#2d2a3f` | Action keys |
| `--color-key-accent-fg` | `text-key-accent-fg` | `#8f4246` | `#f5c8ca` | Action key labels |

Action keys also get a 2px bottom border in `brand`. That border marks an action key as different from a typing key.

## Brand

Brand values are fixed and do not change between themes.

| Token | Utility | Value | Use |
|---|---|---|---|
| `--color-brand` | `text-brand`, `bg-brand` | `#8f4246` | Accents, links, action borders |
| `--color-brand-fg` | `text-brand-fg` | `#fff8f3` | Text on brand fills |
| `--color-brand-soft` | `bg-brand-soft` | `#f5c8ca` | Selection, highlight background |
| `--color-brand-hover` | `bg-brand-hover` | `#a05558` | Hover state for brand fills |

`::selection` uses `bg-brand-soft` with `text-fg` (see `global.css`).

## Radii, shadows, fonts

| Token | Utility | Value |
|---|---|---|
| `--radius-key` | `rounded-key` | `6px` |
| `--radius-card` | `rounded-card` | `14px` |
| `--shadow-key` | `shadow-key` | `0 1px 0 rgb(0 0 0 / 0.06), 0 0 0 1px var(--c-border)` |
| `--font-display` | `font-display` | `'Fraunces', Georgia, serif` |
| `--font-body` | `font-body` | `'Inter Variable', system-ui, sans-serif` |
| `--font-key` | `font-key` | `'JetBrains Mono', ui-monospace, monospace` |

Fonts are self-hosted through `@fontsource` imports in `global.css`. Do not add a Google Fonts CDN link.

## shadcn/ui compatibility

Vendored primitives in `src/components/ui/` use shadcn class names. `tokens.css` maps those names onto our values, so the vendored files work without edits.

| shadcn name | Maps to | Light | Dark |
|---|---|---|---|
| `background` | `--c-page` | `#fff8f3` | `#1b1a26` |
| `foreground` | `--c-fg` | `#2a1f2f` | `#f5e8e1` |
| `popover` | `--c-surface` | `#ffffff` | `#232132` |
| `popover-foreground` | `--c-fg` | `#2a1f2f` | `#f5e8e1` |
| `primary` | `--c-brand` | `#8f4246` | `#8f4246` |
| `primary-foreground` | `--c-brand-fg` | `#fff8f3` | `#fff8f3` |
| `secondary` | `--c-surface-muted` | `#f4e9e2` | `#2b2a3d` |
| `secondary-foreground` | `--c-fg` | `#2a1f2f` | `#f5e8e1` |
| `muted` | `--c-surface-muted` | `#f4e9e2` | `#2b2a3d` |
| `muted-foreground` | literal | `#6b5a62` | `#b9a9b0` |
| `accent` | `--c-surface-muted` | `#f4e9e2` | `#2b2a3d` |
| `accent-foreground` | `--c-fg` | `#2a1f2f` | `#f5e8e1` |
| `destructive` | literal | `#b3261e` | `#b3261e` |
| `input` | `--c-border` | `#e8d7cf` | `#3a394b` |
| `ring` | `--c-brand` | `#8f4246` | `#8f4246` |

Use shadcn names only inside `ui/`. In our own components in `astro/` and `react/`, use our semantic names. Do not add new shadcn-only names to our markup.

## Rules

- Semantic classes only in markup. No raw hex, no `var(--c-*)`, no arbitrary `bg-[...]`.
- New colors go in `tokens.css` under both `:root` (with `light-dark()`) and `@theme inline`, then get a semantic name.
- Keep the brand palette aligned with keythm's scarlet recipe. Attribution is in `NOTICE`.
- Verify both themes. The UI loop checks light and dark through `?theme=` (see `ui-loop.md`).

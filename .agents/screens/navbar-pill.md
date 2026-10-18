# Screen: navbar pill

> TARGET state. Replaces the full-width bar. A small floating island detached from the top edge, shared by `/` and the content pages (`ProseLayout`).
> One React island (`NavbarActions.tsx`, `client:idle`) inside `Navbar.astro`. The `SITE_NAME` wordmark is dropped from the bar.

## Layout

```
 375px viewport                              1280px viewport

 mt-3 (12px)                                 mt-3 (12px)
   ┌───────────────────────────┐               ┌───────────────────────────┐
   │ (H) About | Cmd-K | EN  o │ 36px          │ (H) About | Cmd-K | EN  o │ 36px
   └───────────────────────────┘               └───────────────────────────┘
      group 1     g2     group 3                  centered, w-max, never edge to edge
```

Three groups, separated by 1px hairline dividers (`bg-border`, h-4, vertical):

| Group | Contents | Behavior | URL state |
|---|---|---|---|
| 1 | Home link (`/`, lucide `House`) and About (`run('about')`, lucide `User`) | Home carries `aria-current="page"` and a small brand dot below the icon when on `/`. About opens the overlay | `/` and `?overlay=about` |
| 2 | Command palette button (lucide `Search`, `title="Cmd-K"`) | `run('cmdk')`. Keeps `aria-label={m.action_search()}` so `locales.spec.ts` assertions `Suche` and `തിരയുക` still pass | `?cmdk=open` |
| 3 | Locale button then theme dot | Locale: `LocaleSwitchButton` restyled to show the current code (`EN`, `DE`, `MS`, `HI`, `ML`), mono 12px, keeps `aria-label={m.locale_switch_label()}`, cycles on press. Theme: `ThemeToggle` rendered as a small brand-colored dot with a radar ping | `?locale=`, `?theme=dark\|light` |

## Dimensions and tokens

| Property | Value |
|---|---|
| element | `<header class="sticky top-0 z-40 flex justify-center">` containing the pill |
| top margin | `mt-3` (12px) on the pill |
| width | `w-max`, never full width. At 375 the pill is about 220 to 260px wide, at least 20px from either edge |
| height | `h-9` (36px), `rounded-full` |
| surface | `bg-surface/80 backdrop-blur`, `ring-1 ring-fg/5`, diffused tinted shadow token (never `shadow-md`) |
| padding | `px-1.5` outer, `gap-1` between items inside a group, dividers have `mx-1` |
| items | visible 28px circles/pills (`size-7`, locale `h-7 px-2`), each with an extended hit area of at least 44 x 44 via a `::after` pseudo-element, so the pill height stays 36px |
| icons | lucide, `size-4` (16px), `strokeWidth={1.5}` |
| locale code | mono 12px, `text-muted-foreground`, brand when open |
| theme dot | `size-2.5 rounded-full bg-brand`, radar ping ring 1.6s on `--ease-spring`, ping disabled under `prefers-reduced-motion` |
| hover | item background `bg-fg/5`, 300ms on `--ease-spring` |
| focus | visible 2px `ring-brand` on every item |

Sticky, not fixed: the pill occupies flow height (12 + 36 = 48px) so content pages need no padding hacks. `backdrop-blur` is used on this pill and the overlays only.

## Budget on `/`

12px (`mt-3`) + 36px (pill) = 48px. This is rows 1 and 2 of the 632px budget in `mobile-vertical.md`.

## States

| URL | Pill state |
|---|---|
| `/` | Home item active (dot), others idle |
| `/about`, `/projects/<slug>` | Home idle, pill still sticky and visible while scrolling |
| `/?overlay=about` | About item active |
| `/?cmdk=open` | Cmd-K item active |
| `/?locale=de` | locale code reads `DE`, search label reads `Suche` |
| `/?theme=dark` | theme dot uses dark `brand` (`#c4767e`), pill surface uses dark `surface` |

## Acceptance (testable)

- Pill is at least 12px below the viewport top at scroll 0 and stays at `top: 0` plus `mt-3` while scrolled on a content page.
- Pill height is 36px (plus or minus 1px) and width is less than 100% at 375, 768 and 1280.
- Exactly two vertical dividers are present, and they are decorative (`aria-hidden`).
- Every item has a hit area of at least 44 x 44px.
- `Suche` and `തിരയുക` assertions in `locales.spec.ts` stay green.
- Theme dot ping has `animation: none` under `prefers-reduced-motion: reduce`.
- No horizontal scroll introduced at 320px.

## Decorative

Dividers and the ping ring are `aria-hidden="true"`.

## Overrides of high-end-visual-design

- No `py-24` on `/`. The pill's 48px footprint is part of the viewport budget in `mobile-vertical.md`.
- Lucide icons at `strokeWidth={1.5}`. No Phosphor, no inline SVG.
- Body font Plus Jakarta Sans Variable. Locale code uses the mono stack.
- The skill's floating island nav is applied as written (`mt-3`, `w-max`, detached). The only deviation is sticky positioning, chosen so content pages need no padding hacks.

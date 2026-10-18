# Floating pill nav reference

Pattern: the navbar is a small bar detached from the top and side edges of the viewport, rounded, holding only a logo or a few icons plus one action. Captured 2026-10-18 with the `playwright-cli` skill. Numbers are CSS pixels measured with `getBoundingClientRect` at 375px wide unless marked as read off the screenshot.

## Distilled pattern

Converges across Stitch, Work Louder, mymind, Raycast, Wispr Flow and Clerk.

| Product | At 375 (x, y, width, height) | Radius | Notes |
| --- | --- | --- | --- |
| Stitch | centered, compact, about 190px wide (from the PNG), `px-2.5 py-1`, 14px icons | full | `fixed top-0`, `pt-3`, `backdrop-blur-xl`, 1px border, big dark shadow |
| Work Louder | about 14, 18, 347, 55 (read off screenshot) | near full | dark translucent bar, logo left, menu and one yellow cart pill right. At 1280 it becomes a centered link pill |
| mymind | 18.75, 25, 337.5, 50 | 30px (pill) | white, `position: absolute` so it scrolls away. At 1280 it is a flat bar, not a pill |
| Raycast | 16, 16, 343, 58 | 16px | `backdrop-filter: blur(5px)`, logo left, hamburger right. At 1280 it spans about 1200px with 38px side inset |
| Wispr Flow | 20.6, 49.6, 333.75, 54 | 10px | sits under a 37px announcement banner, 1px border, logo plus CTA plus menu |
| Clerk | about 8, 50, 359, 42 (read off screenshot) | about 14px | sits under a black banner, logo, Sign in, Sign up, menu |

Shared traits:

- Side inset 8 to 21px and top inset 16 to 25px (50px when an announcement banner sits above). The bar floats on the page background.
- Height 42 to 58px. Content is one logo or icon group, at most one action, and a menu control. Nothing else.
- The surface is either translucent with blur (Stitch, Raycast, Work Louder) or a solid light fill with a 1px border (mymind, Wispr, Clerk). Both separate it from the page without a heavy shadow.
- Only Stitch, Work Louder and mymind use a fully rounded pill. Raycast, Wispr and Clerk use 10 to 16px rounded rectangles. Radius is a free choice inside that range, the detachment is the constant.
- Scroll behavior varies (Stitch fixed, mymind absolute). Do not assume sticky from this set.

What makes it work at 375px wide:

- A narrow set of controls fits one row with no wrapping. Raycast and Work Louder use a hamburger instead of inline links.
- Stitch's centered cluster is the only one that does not span the column. Its 14px icons with 6px padding give about 26px targets, below the 44px comfort size. Treat that as a risk to check, not a model.
- The inset keeps the page's side margin visually continuous with the hero content below.

Checked and not cited: Linear, Cal.com, Resend, Vercel, Framer and Polar use full-bleed flat bars at the top (no detachment), so they are not sources for this pattern. Their screenshots were not kept.

## Decisions, not references

Palette (rose hue 15 OKLCH) and fonts (Fraunces, Plus Jakarta Sans) are the user's chosen direction. The user also chose a minimal navbar. Stitch's dark charcoal fill and rose dot are its own theme.

## Applies to

- `Navbar.astro` and `NavbarActions.tsx`: detachment, inset, height, radius, content limit.
- `.agents/screens/navbar-pill.md`: target spec for the redesign.
- Home hero vertical budget in `.agents/screens/mobile-vertical.md`: the navbar's top inset plus height counts against the 375 by 667 budget.
- Overlays that open from the nav (CmdK, locale, theme): control size must be checked against the 44px comfort target.

## Sources

- Stitch mockup (one source). `img/stitch-375.png`, markup in `/tmp/stitch-extract/code.html` (read-only).
- Work Louder, https://worklouder.cc/. `img/worklouder-375.png`, `img/worklouder-1280.png`.
- mymind, https://mymind.com/. `img/mymind-375.png`, `img/mymind-1280.png`.
- Raycast, https://www.raycast.com/. `img/raycast-375.png`, `img/raycast-1280.png`.
- Wispr Flow, https://www.wisprflow.ai/. `img/wispr-375.png`, `img/wispr-1280.png`.
- Clerk, https://clerk.com/. `img/clerk-375.png`, `img/clerk-1280.png`.

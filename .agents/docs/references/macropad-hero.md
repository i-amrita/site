# Macropad hero reference

Pattern: a small physical-style key grid (a macropad) replaces the full keyboard as the hero's interactive object, so the keys stay large enough to tap at 375px wide. Captured 2026-10-18 with the `playwright-cli` skill. Every claim below was read from the screenshots listed under Sources, or from the Stitch `code.html` where marked.

## Distilled pattern

Converges across Stitch, Work Louder, Elgato, Novation and keythm.

- A dark or contrasting case (bezel) holds the keys. The case radius is clearly larger than the key radius. Stitch: case radius 28px around an inner well of 16px around keys of 12px (from `code.html`). Elgato and Novation show the same nested case, well, key structure in the product photo.
- Keys are near-square rounded rectangles on a tight uniform grid. Gap is about one fifth of the key edge. Stitch: 4 columns, `gap-2.5` (10px), key height 56px, key width about 65px at a 342px case.
- Accent color is sparse. Keythm lights only the `esc` key orange against grey caps (`img/keythm-1280.png`). Novation lights pads per function. Work Louder lights a subset of the top row (`img/worklouder-375.png`). Stitch tints the action keys rose and leaves the rest cream. Rule: most keys neutral, action keys carry the accent.
- A knob or dial may take one grid cell. Seen in Stitch (knurled dial, top row) and Work Louder (top-left knob). Optional, decorative.
- Keycap depth is a hard offset, not a blur. Stitch (`code.html`): `box-shadow: 0 4px 0 <darker tone>` plus a 1px inset highlight, and `:active` does `translateY(4px)` while the offset shadow goes to 0. Keythm's keycaps read the same way: lighter top face, darker lip below.
- A keyboard-hint chip teaches the shortcut. Stitch shows a `⌘K` keycap chip in the caption. Keythm shows `tab` + `enter` chips under the typing area.

What makes it work at 375px wide:

- The full 75 percent keyboard does not survive the viewport. Keythm renders its full keyboard at 1280 (`img/keythm-1280.png`) and does not render it at all at 375 (`img/keythm-375.png`). A 4 by 3 grid at about 342px wide keeps keys near 65 by 56px, which is above the 44px tap target.
- Hero copy, chips and keypad stack in one column. In the Stitch capture the headline, subhead, three chips, the pad and one caption all sit inside one 812px-tall frame, centered.
- Work Louder and Elgato both fill the viewport width minus 14 to 16px side margins with the product image, then put the headline above it. The object is the visual anchor and spans nearly the full column.

## Decisions, not references

The i-amrita palette (rose hue 15 in OKLCH) and fonts (Fraunces for display, Plus Jakarta Sans for body) are the user's chosen direction. They are not derived from any source here. Stitch uses Newsreader and Inter with its own burgundy palette. Do not copy those values.

Stitch's dimensions above are one product's implementation. Treat them as a starting point to verify against the other four sources, not as a scale.

## Applies to

- Home hero keypad (the `Keyboard` component group under `src/components/` that replaces the full keyboard). Governs key size, gap, case radius, press depth and the sparse accent rule.
- Home hero layout at 375 (`.agents/screens/mobile-vertical.md`, `.agents/screens/home-hero.md`): keypad must fit the viewport with the headline and chips.
- `.agents/screens/home-keyboard-actions.md`: which keys carry the accent (action keys) and which stay neutral.
- `KeyboardHint.astro`: the shortcut chip pattern.

## Sources

- Stitch mockup (one source). `img/stitch-375.png`. Design system notes in `/tmp/stitch-extract/DESIGN.md`, markup in `/tmp/stitch-extract/code.html` (read-only, not executed). The PNG is 780px wide (2x).
- keythm, repo https://github.com/AayushBharti/keythm, live at https://keythm.aayushbharti.in/ (the bare keythm.com domain did not resolve). `img/keythm-375.png`, `img/keythm-1280.png`.
- Work Louder, https://worklouder.cc/. `img/worklouder-375.png`, `img/worklouder-1280.png`. Product render of a 12-key pad with a knob.
- Elgato Stream Deck, https://www.elgato.com/us/en/p/stream-deck-mk2-black. `img/elgato-375.png`. Product photo of a 15-key LCD pad.
- Novation Launchpad Mini, https://novationmusic.com/products/launchpad-mini-mk3. `img/novation-375.png`. Product image of an 8 by 8 pad grid.

Note: Work Louder, Elgato and Novation are marketing pages showing hardware, not interactive on-screen keypads. They ground the physical form (case, grid, sparse accent). Only Stitch and keythm ground the on-screen interaction (press depth, hint chips). Interaction conclusions therefore rest on two sources.

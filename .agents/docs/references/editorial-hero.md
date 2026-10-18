# Editorial hero reference

Pattern: a centered serif display headline with an italic accent, a short sans subhead, and pill-shaped chips or buttons below. Captured 2026-10-18 with the `playwright-cli` skill. Headline metrics are computed styles read from the live pages at 375px wide.

## Distilled pattern

Converges across Stitch, Wispr Flow, mymind and The Browser Company. Resend is a supporting example for the serif, centered, pill badge structure but has no italic.

| Product | Headline at 375 | Line height | Tracking | Italic accent |
| --- | --- | --- | --- | --- |
| Stitch | 48px serif (`text-5xl`, from `code.html`) | 1.08 | tight | one word ("Amrita"), tinted, 1px underline at 40 percent opacity, offset 8px |
| Wispr Flow | 48px EB Garamond, weight 400 | 45.6px (0.95) | -1.44px (-0.03em) | the whole second line ("just speak.") |
| The Browser Company | 28px EB Garamond | 33.6px (1.2) | normal | the whole statement, with dotted underlines on linked words |
| mymind | 58px, serif per screenshot | 49.88px (0.86) | -2.4px | none |
| Resend | 64px, serif per screenshot | 64px (1.0) | -0.64px | none |

Shared traits:

- Everything is center aligned, one column, at 375. Display sizes sit at 48 to 64px for two or three lines, with line height at or below 1.2 and negative tracking. Smaller statement-style heroes go to 28px (The Browser Company).
- The accent is italic of the same serif, not a different face. It is applied to a word or a closing line, and in Stitch also recolored.
- Subhead is a sans at 16 to 18px (Wispr, mymind, Resend), 13.5px in Stitch. Width is held to about 300 to 340px so lines break into two or three balanced rows.
- Pills carry the secondary information. Stitch uses three outlined action chips (`px-3 py-1.5`, `text-xs`, `gap-2`, `rounded-full`). mymind puts colored outline pills inline inside the subhead sentence. Resend has a pill badge above the headline. Wispr and Resend use a full-width or near-full-width bordered CTA button.
- A small mono or caps label sits near the headline for texture: Stitch's mono tagline line, Wispr's "WISPR FLOW DICTATION" eyebrow, The Browser Company's caps mono links.

What makes it work at 375px wide:

- The headline is short (two to four words per line), so 48px type fits in 343px without breaking words.
- Vertical budget is small. Headline, subhead and one row of chips or one CTA fit in the first 560 to 620px in Wispr, mymind and Stitch.
- Chips wrap to two rows with equal gaps instead of scrolling.

Not found: personal portfolio heroes. I checked Maggie Appleton, Josh Comeau, Cassidy Williams, Lynn Fisher and Rauno Freiberg at 375. None combine centered serif display, italic accent and pill chips (left-aligned serif, sans, mono, ornamental caps, and an interaction demo respectively), so none are cited. The sources here are product and company heroes. They ground the type treatment, not the portfolio content.

## Decisions, not references

Palette (rose hue 15 OKLCH) and fonts (Fraunces display, Plus Jakarta Sans body) are the user's chosen direction. Stitch uses Newsreader and Inter, Wispr and The Browser Company use EB Garamond. None of those families or sizes are adopted. Fraunces has optical axes, so verify the italic and the tracking in the real font before reusing any number above.

## Applies to

- Home hero (`Hero.astro` and `.agents/screens/home-hero.md`): the "I am Amrita" headline with an italic accent on the name, the subhead, and the chip row (`Socials.astro`).
- `.agents/screens/mobile-vertical.md`: the headline plus subhead plus chips budget before the keypad.
- Tablet 768 (`.agents/screens/tablet-768.md`): headline stays centered, width capped.

## Sources

- Stitch mockup (one source). `img/stitch-375.png`, `/tmp/stitch-extract/DESIGN.md`, `/tmp/stitch-extract/code.html` (read-only).
- Wispr Flow, https://www.wisprflow.ai/. `img/wispr-375.png`, `img/wispr-1280.png`.
- The Browser Company, https://www.thebrowser.company/. `img/tbc-375.png`.
- mymind, https://mymind.com/. `img/mymind-375.png`, `img/mymind-1280.png`.
- Resend (supporting, no italic), https://resend.com/. `img/resend-375.png`.

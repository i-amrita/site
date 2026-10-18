# Screen: tablet (768 x 1024)

> TARGET state. Same single centered editorial column and macropad as mobile and desktop. At 768 it does not become a two-column layout and the pad does not grow.
> Column is `max-w-md` (448px), centered. Pad chassis is `max-w-[342px]`.

```
768px
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│                ┌──────────────────────────────┐              │ mt-3, h-9
│                │ (home) About | Cmd-K | EN  o │              │
│                └──────────────────────────────┘              │
│                                                              │
│                        I am  Amrita                          │ 60px Fraunces
│              I bridge the gap between technical              │ 14px
│              complexity and real-world impact.               │
│                                                              │
│                                                              │ mt-32 negative space
│                   ┌────────────────────────┐                 │
│                   │ [esc][dial][Sound][Find]│                │
│                   │ [Work][About][CmdK][Log]│                │
│                   │ [Connect][BUILD][EN]    │                │
│                   └────────────────────────┘                 │
│                 Tap a key or press Cmd-K ...                 │
│                           llms.txt                           │ footer
│                       (spare ~ 380px)                        │
└──────────────────────────────────────────────────────────────┘
```

## Layout diff vs mobile

| Aspect | 375 | 768 |
|---|---|---|
| column | `max-w-md`, `px-5` gutters | `max-w-md`, centered, wide side margins |
| h1 | 48px | 60px (from `sm`) |
| chassis | up to 342px (335px available) | exactly 342px |
| key | about 69 to 71px wide, `h-14` | 71px wide, `h-14` (no scaling) |
| pill | `mt-3`, `h-9`, `w-max` | same |

The pad never scales with the viewport. There is no `Scaler`.

## Breakpoint rules

- `<640px`: h1 48px.
- `>=640px` (`sm`): h1 60px. Everything else is unchanged through 1920px.
- There is no multi-column breakpoint. The content area stays `max-w-md`.
- Portrait 768 x 1024 and landscape 1024 x 768 both fit without scroll (the column is about 644px tall).

## Fit and checks

- No horizontal scroll at 768.
- Pad keys are 71px wide and at least 44px tall and wide.
- Pill is centered horizontally and sticky at `top-0` with `mt-3`.
- `/?highlight=1`, `/?mute=1`, `/?theme=dark`, `/?locale=ml` all render without cap overflow.

## Overrides of high-end-visual-design

- No `py-24` on `/`. Vertical rhythm comes from the viewport budget (`mobile-vertical.md`), even on a tall tablet where the spare space stays empty.
- Lucide icons at `strokeWidth={1.5}`. No Phosphor.
- Body font Plus Jakarta Sans Variable. Display Fraunces. Mono is the dits stack.
- Editorial Split is deliberately not used at 768. The user chose the macropad at every width, so the layout stays one column.

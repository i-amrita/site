# Screen: tablet landscape (768 × 1024)

> Mid-size breakpoint. Keyboard reaches full 950 × 320 width.
> Hero fits 3 lines. Socials single row.

```
┌──────────────────────────────────────────────────────────────┐
│ ⌘K                            i-amrita            🔍  T  ☾   │ ← navbar pill, 80px tall
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  I am Amrita                                                 │
│  I bridge the gap between technical complexity               │
│  and real-world impact.                                      │
│                                                              │
│  AI × community × human-centered design.                     │
│  Currently MIMS '27 @ UC Berkeley · ex-TPM @ Google           │
│                                                              │
│  ─────────────────────────────────────────────               │
│                                                              │
│  [LinkedIn]  [Research]  [Email]  [CV / Resume]              │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ [esc] F1 F2 F3 [⌕] [🎙] [☾] [⏮] [⏯] [⏭] [🔉] [🔊] [🔊+] # del │  │ F1..F4 highlighted
│  │ ` 1 2 3 4 5 6 7 8 9 0 - = ⌫                                  │  │
│  │ ⇥ Q W E R T Y U I O P [ ] \                                  │  │
│  │ ⇪ A S D F G H J K L : ; " ' ⏎                                │  │
│  │ ⇧ Z X C V B N M < , > . ? / ⇧ ↑                              │  │
│  │ ⌃ ⌥ ⌘  ────────────  ⌘ fn ⌃  ← ↓ →                          │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ☐ Mute key clicks                                           │
│  ☐ Highlight action keys                                     │
│                                                              │
│  Action keys: Esc, F1 (About), F2 (Projects), F3 (Log),      │
│  F4 (Search), F5 (Mute), F6 (Theme), ⌥ (Locale), ⌘ (CmdK)    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Layout diff vs desktop

- Navbar: same 80px pill, full width with 24px margins.
- Hero title: 56px Fraunces 600 (down from 64 desktop).
- Hero subtitle: 22px Inter 400.
- Keyboard: 720 × 220 px (down from 950 × 320 desktop, but still proportional).
- Socials: single row, 4 buttons.
- Hint block: shown below keyboard at this breakpoint.

## Breakpoint rules

- `<480px`: mobile-vertical layout
- `481–767px`: small-tablet (keyboard ~480 × 150)
- `768–1023px`: tablet (this layout)
- `1024–1439px`: desktop, keyboard 950 × 320
- `≥1440px`: wide desktop, keyboard 1100 × 360, content max-width 1280
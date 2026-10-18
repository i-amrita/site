# Screen: about overlay

> Triggered by F1 / A key. URL: `?overlay=about`.
> Compact bio + socials + CV download. "Read full bio" links to `/about`.

```
                                                              ┌──────────────────────────────┐
                                                              │ About                    [×] │
                                                              ├──────────────────────────────┤
                                                              │                              │
                                                              │  ┌────┐                      │
                                                              │  │ 👤 │  Amrita Nambiar       │
                                                              │  └────┘  MIMS '27 @ Berkeley │
                                                              │          ex-TPM @ Google     │
                                                              │                              │
                                                              │  I bridge the gap between    │
                                                              │  technical complexity and    │
                                                              │  real-world impact.          │
                                                              │                              │
                                                              │  Currently exploring applied │
                                                              │  AI and community-driven     │
                                                              │  design at UC Berkeley       │
                                                              │  School of Information.      │
                                                              │                              │
                                                              │  PREVIOUSLY                  │
                                                              │  • Technical PM @ Google     │
                                                              │    Singapore (2023-25)       │
                                                              │  • Tech Consultant @ EY      │
                                                              │    Malaysia (2021-23)        │
                                                              │  • GDG Cloud KL Lead         │
                                                              │    3,243 devs                │
                                                              │                              │
                                                              │  CONTACT                     │
                                                              │  [LinkedIn] [Research]       │
                                                              │  [Email] [CV / Resume ↓]    │
                                                              │                              │
                                                              │  Read full bio →             │
                                                              └──────────────────────────────┘
```

## URL state

- `overlay=about` opens
- No sub-state (scroll handled by browser)

## Source content

Lives in `src/content/about.mdx` (single doc). Loaded by `src/pages/about.astro` (full bio route) and `src/components/react/AboutOverlay.tsx` (overlay). Both pull from the same content collection entry — single source of truth.
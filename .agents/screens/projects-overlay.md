# Screen: projects overlay (Radix Dialog)

> Triggered by F2 / P key. URL: `?overlay=projects`.
> Scrollable list with card previews. "Read more" link at bottom opens `/projects/[slug]`.

```
                                                              ┌──────────────────────────────┐
                                                              │ Projects                  [×] │ ← close (Esc)
                                                              ├──────────────────────────────┤
                                                              │                              │
                                                              │ ┌──────────────────────────┐ │
                                                              │ │ GDG Cloud Kuala Lumpur   │ │ ← scroll container
                                                              │ │ 2020 – 2023              │ │   max-height: 60vh
                                                              │ │ Lead & WTM Ambassador    │ │   overflow-y: auto
                                                              │ │                          │ │
                                                              │ │ Scaled community to 3,243│ │
                                                              │ │ developers. Women's      │ │
                                                              │ │ engagement +40% / 6 mo.  │ │
                                                              │ │                          │ │
                                                              │ │ Tags: community · GCP    │ │
                                                              │ │ Read more →              │ │ ← link to /projects/gdg-cloud-kl
                                                              │ └──────────────────────────┘ │
                                                              │                              │
                                                              │ ┌──────────────────────────┐ │
                                                              │ │ DSC Kita Hack 2020       │ │
                                                              │ │ ...                      │ │
                                                              │ └──────────────────────────┘ │
                                                              │                              │
                                                              │ [See all projects →]         │ ← footer link
                                                              └──────────────────────────────┘
```

## Behavior

- `?overlay=projects` opens it. Any other overlay (`about`, `log`, `search`) closes it via state substitution.
- ESC, click outside, click `[×]`, click `[See all →]` all close the dialog.
- Back button removes the param.
- Scroll position persists via `?overlay=projects&scroll=2` (card index 2 in view).
- Each card uses real content from `src/content/projects/<slug>.mdx` (project schema).
- Lazy-load: each card body truncated to first 200 chars; full content on the dedicated page.

## URL state contract

- `overlay` — `projects | log | about | search | null` (none closes)
- `scroll` — `int` (card index in view)
- `filter` — string (search within overlay items)

These live in `nuqs` with `parseAsString`, `parseAsInteger`, `parseAsString.withDefault("")` and `history: 'replace'` to avoid bloating history with every scroll tick.

## A11y

- Radix Dialog handles focus trap, ARIA `role="dialog"`, `aria-modal="true"`, focus return to the action key that opened it.
- Each card is a heading + paragraph block, real `<a>` for "Read more" (not a click handler).
- Card list is a `<ul role="list">` with cards as `<li>`.
- "Open Projects" button (alternative entry from navbar) is also focusable and reachable via Tab.

## i18n

When Paraglide is wired, card title + description + tags are all message keys. Default `en.json` ships full content; `ms.json`/`hi.json`/`de.json`/`ml.json` are stubs that `intl-ai fill` populates later.
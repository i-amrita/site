# Screen: CmdK palette (cmdk + Radix Dialog)

> Triggered by ⌘ key or `Cmd+K` shortcut. URL: `?cmdk=open`.
> Navigation, theme, locale, search, copy email — keyboard-only path.

```
                                              ┌─────────────────────────────────────────┐
                                              │ 🔍  Type a command or search...        │
                                              ├─────────────────────────────────────────┤
                                              │                                         │
                                              │  NAVIGATION                             │ ← section
                                              │  → Go to projects                       │ ← cmdk item
                                              │  → Go to about                          │
                                              │  → Go to log                            │
                                              │  → Go to now                            │
                                              │                                         │
                                              │  ACTIONS                                │
                                              │  ☾  Toggle theme                        │
                                              │  🌐 Switch language (next: MS)          │
                                              │  ⌘  Open search                         │
                                              │  ✉  Copy email to clipboard             │
                                              │                                         │
                                              │  PROJECTS                               │
                                              │  → GDG Cloud Kuala Lumpur               │
                                              │  → DSC Kita Hack                        │
                                              │  → GCPBoleh                             │
                                              │  → Fire Safe (Lean LaunchPad)           │
                                              │  → APAC Solution Challenge 2025         │
                                              │  → EY Data Platforms                    │
                                              │                                         │
                                              │  ↩  Close                               │
                                              └─────────────────────────────────────────┘
```

## Behavior

- Cmd+K (mac), Ctrl+K (others): opens via `nuqs` push `?cmdk=open`.
- ESC or click outside: closes via `?cmdk=` removal.
- Type-to-filter: `cmdk` filters items, "I/O" prefix routes to sections (e.g. `theme dark`).
- Arrow keys navigate, Enter activates.
- Backspace on empty input: closes.
- Mouse hover selects; click activates.

## Search rail

When user types more than 2 chars, the palette splits:

```
                                              ┌─────────────────────────────────────────┐
                                              │ ai search                               │
                                              ├─────────────────────────────────────────┤
                                              │  COMMANDS                               │
                                              │  → AI search (8 results)                │
                                              │                                         │
                                              │  RESULTS                                │ ← Pagefind + MiniLM hybrid
                                              │  → About — AI × community × human...    │ ← semantic top match
                                              │  → Project: APAC Solution Challenge     │
                                              │  → Project: GDG Cloud KL                │
                                              │  ...                                    │
                                              └─────────────────────────────────────────┘
```

The "AI search" header pill animates from "AI search" → "Here's what I found" once the model is warm. Cold first-load shows "AI search (loading model…)" with a subtle progress dot.

## URL state contract

- `cmdk` — `open | null`
- `cmdk.q` — string (search query, only present when palette is open AND has text)

Persisted via `nuqs` with `history: 'push'` so Cmd+K → type → Esc → Cmd+K → up-arrow restores the query (browser back-button equivalent).

## A11y

- `cmdk` implements ARIA combobox + listbox with `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`.
- Radix Dialog provides focus trap, focus return, scroll lock.
- Each section has `<h2>` for screen readers; items are `<button>`s (Tab-reachable).

## Tailwind styles

```css
[data-cmdk-root] {
  width: 100%;
  max-width: 640px;
  background: var(--color-surface);
  border-radius: var(--radius-card);
  box-shadow: 0 8px 32px rgba(0,0,0,.12);
}
[data-cmdk-input] {
  width: 100%;
  padding: 16px 20px;
  font-family: var(--font-body);
  font-size: 16px;
  border: none;
  border-bottom: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-page-fg);
}
[data-cmdk-item][data-selected="true"] {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}
```
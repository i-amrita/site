# Search

Hybrid search (Pagefind + MiniLM + RRF) in the browser. State: `overlay=search`, `q`, `mode=ai|keyword`.

## Flows

- `/?overlay=search&q=gdg` opens search with the query filled and results listed.
- `/?overlay=search&q=gdg&mode=ai` runs the semantic mode.
- Typing in the input updates `q` (replace, no history spam).
- `/pagefind/pagefind.js` is present in the build output.

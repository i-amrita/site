# Search

Hybrid search (Pagefind + MiniLM + RRF) in the browser, inside the one CmdK palette. State: `cmdk=open`, `q`, `mode=ai|keyword`.

## Flows

- `/?cmdk=open&q=gdg` opens the palette with the query filled and results listed under the actions.
- The AI and Keyword buttons in the palette mode bar write `mode` (replace). Absent `mode` means AI.
- `/?overlay=search&q=gdg` (old links) is rewritten to `/?cmdk=open&q=gdg`.
- `/search?q=gdg` still renders the same search as a page.
- `/pagefind/pagefind.js` is present in the build output.

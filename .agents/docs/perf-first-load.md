# First-load performance of the keypad and its sounds

Measured 2026-10-18 on a production build (`pnpm build`), headless Chromium via `playwright-cli`, 375x667. Slow = CDP Slow 4G (1.6 Mbps, 150ms RTT) plus 4x CPU throttle. `pnpm preview` ignores `public/_headers`, so numbers come from a small static server that applies `_headers`, brotli and ETag/304 like Cloudflare Pages does (script kept out of the repo). Cold = cleared HTTP cache, warm = second load.

## Before / after

| Metric | Before | After |
| --- | --- | --- |
| Sound requests | 2 (keys 15.2 KB, dial 1.4 KB fetched on first tap) | 1 (sprite 12.3 KB, requested from the head at ~20ms) |
| Sound bytes (ogg / m4a on disk) | 14.6 + 1.0 / 17.3 + 2.6 KB | 11.8 / 12.1 KB |
| Pad hydrated, fast cold | ~380 ms | ~370 ms |
| Pad hydrated, slow cold | ~2.35 s (bound by react-dom `client.js`, 110 KB br) | ~2.45 s (same, within noise) |
| Sound decoded | on first tap only (+45 ms fast, +160 ms slow after the tap) | ~100 ms (fast) / ~270 ms (slow) after hydration, no gesture |
| First tap | silent or late: decode finished after the press, so down and up clicks played as a burst | audible at once when decoded (resume queued in the same gesture), silent and instant otherwise, nothing queued |
| Second load, requests that hit the server | 22 conditional requests (300 B 304s) for `/_astro/*` | 2 (favicons); `/_astro/*`, fonts and sounds are immutable cache hits |
| Console errors or warnings | none | none |
| CLS | 0 (0.012 once, font swap) | 0 (0.012 once, font swap); the indicator is absolutely positioned |

Eager-loading audit: transformers.js, onnx, pagefind and the search code are not requested on the home page (the embeddings model loads only when the palette is used). CmdK, overlays and `SearchOverlays` are `client:idle` islands (about 55 KB br with deps) and are fetched about 0.25s after the pad chunks on a fast link. Three levels of chunks (`Keyboard` -> `Providers`/`index`/`utils` -> `button`/`index`) form the critical path; on Slow 4G each level costs roughly an RTT.

## What changed

- `public/_headers`: `/_astro/*` and `/fonts/*` are `public, max-age=31536000, immutable` (Cloudflare Pages default is `max-age=0, must-revalidate`, which cost a 304 per file on every reload). `/sounds/*` already was.
- One sound file: keys and dial ticks are packed into `public/sounds/sprite-<hash>.{ogg,m4a}` (mono, Opus 32k, AAC 32k; keys 0-2.0s, dial ticks from 2.12s). One request, 4 KB smaller, content-hashed.
- Decode without a gesture: `decodeSprite` decodes through an `OfflineAudioContext` right after the pad hydrates. The realtime `AudioContext` is still created on the first gesture (no autoplay warning, no constructor cost at hydration), then only needs `resume()`.
- Silent-but-instant: `playClick`/`playTick` are synchronous. No decoded buffer means no sound and no queued promise. A press during the resuming gesture (120ms window) is allowed to queue on the suspended context so the very first tap is audible.
- Startup indicator in `Keyboard.tsx`: a 6px pulsing dot under the pad (in the SSR HTML, so it shows before hydration) plus sr-only `role=status` text (`keyboard_loading`). When the sprite is decoded or failed it fades out (300ms) and is removed from the DOM; with `prefers-reduced-motion` it is static and removed at once. Keys never wait for it.

## Tried and dropped

A custom `client:after-pad` directive that held the overlay islands until the pad hydrated: pad hydration changed by under 200 ms (noise) while the overlays became available about 0.6s later on Slow 4G. Reverted.

## Not done, recommended

- The critical path is `client.js` (react-dom, 393 KB raw, ~110 KB br) plus `Providers` (nuqs, sonner, radix tooltip, 43 KB br). Dropping sonner/tooltip from the home pad or lazy-loading the toaster would cut the second level.
- Emit `<link rel=modulepreload>` for the pad chunk graph at build time (hashed names; needs a small Astro integration) to remove the two chunk-discovery round trips on slow links.
- Cloudflare Early Hints: it picks up `<link rel=preload>` from the HTML, so the fonts qualify. The sound preload is injected by script because the format depends on the browser; a `type=` hint on preload is not honoured for `as=fetch`, so it stays script-injected.
- `AudioContext` creation cost could not be measured on a real phone (headless autoplay is permissive, ctor 2.4 ms). If it shows up in field TBT, create it at idle and keep `resume()` on gesture.
- No-JS: the startup dot stays visible forever without JavaScript. Hide it with `<noscript><style>` if that matters.

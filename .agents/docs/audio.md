# Audio

Key clicks are two original sounds, `public/sounds/click-down.{ogg,m4a}` and `click-up.{ogg,m4a}`, generated with ffmpeg (filtered noise burst plus a decaying sine) and released CC0. See `public/sounds/readme.txt`. We do not use keythm's sound sprite.

## Pipeline

- `src/components/react/Keyboard/audio-preloader.ts` fetches the raw bytes once (`fetchSoundBytes`, no context needed) and decodes them once per `AudioContext` (`loadSounds`), caching the `AudioBuffer`s.
- `src/lib/audio.ts` owns the single shared `AudioContext`. `initAudio()` only starts the byte fetch and arms a one-shot unlock on `pointerdown`, `touchend`, `mousedown`, `keydown` (capture, passive). The context itself is created lazily on the first of those gestures, because constructing it at hydration cost about 190ms of main thread on the home page (Lighthouse TBT). The very first click can therefore be silent. Never `touchstart`: iOS does not treat it as user activation.
- `playClick('down'|'up')` creates an `AudioBufferSourceNode` and calls `start(0, 0, buffer.duration)` with a small playbackRate jitter. No-op while muted, undecoded or suspended.
- `?mute=1` is read by `KeyboardProvider` and pushed into `setMuted`. F5 toggles it via `useActions().run('mute')`.
- `soundExtension()` in `audio-preloader.ts` picks `ogg` when `canPlayType('audio/ogg; codecs="vorbis"')` is truthy, else `m4a` (AAC). The home page injects matching `<link rel="preload" as="fetch">` tags from an inline script (`preloadSounds` prop on `Base.astro`) using the same check.

## Regenerate

Use ffmpeg `anoisesrc` (white) with `highpass`/`lowpass` and `volume='exp(-t*N)':eval=frame`, mixed with a `sine` body, encoded with `-c:a vorbis -strict -2`. Down: 90ms, noise 1.8-7.5kHz decay 110, sine 190Hz. Up: 60ms, noise 3-9kHz decay 180, sine 320Hz.

## Safari fallback

Safari before 18.4 cannot decode Ogg Vorbis, so each sound also ships as AAC in `.m4a`, encoded from the `.ogg` masters (both CC0):

```sh
for f in click-down click-up; do ffmpeg -y -i public/sounds/$f.ogg -c:a aac -b:a 64k public/sounds/$f.m4a; done
```

# Audio

Key clicks are two original sounds, `public/sounds/click-down.ogg` and `click-up.ogg`, generated with ffmpeg (filtered noise burst plus a decaying sine) and released CC0. See `public/sounds/readme.txt`. We do not use keythm's sound sprite.

## Pipeline

- `src/components/react/Keyboard/audio-preloader.ts` fetches and decodes both files once per `AudioContext` and caches the `AudioBuffer`s.
- `src/lib/audio.ts` owns the single shared `AudioContext`. `initAudio()` creates it, starts decoding and arms a one-shot unlock on `pointerdown`, `touchend`, `mousedown`, `keydown` (capture, passive). Never `touchstart`: iOS does not treat it as user activation.
- `playClick('down'|'up')` creates an `AudioBufferSourceNode` and calls `start(0, 0, buffer.duration)` with a small playbackRate jitter. No-op while muted, undecoded or suspended.
- `?mute=1` is read by `KeyboardProvider` and pushed into `setMuted`. F5 toggles it via `useActions().run('mute')`.
- The home page preloads both files with `<link rel="preload" as="fetch">` (`preloadSounds` prop on `Base.astro`).

## Regenerate

Use ffmpeg `anoisesrc` (white) with `highpass`/`lowpass` and `volume='exp(-t*N)':eval=frame`, mixed with a `sine` body, encoded with `-c:a vorbis -strict -2`. Down: 90ms, noise 1.8-7.5kHz decay 110, sine 190Hz. Up: 60ms, noise 3-9kHz decay 180, sine 320Hz.

## Known gap

Ogg Vorbis decoding needs Safari 18.4 or newer. Older Safari stays silent (decode failure is swallowed). Add an m4a/mp3 fallback in `SOUND_URLS` if that matters.

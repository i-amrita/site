# Audio

Key clicks and dial ticks come from one small sprite, `public/sounds/sprite-<hash>.{ogg,m4a}` (about 12KB each, mono, Opus 32k / AAC 32k): 12 down-clicks and 4 up-clicks cut from keythm's `sound.ogg` (Apache-2.0, see NOTICE and `public/sounds/readme.txt`), then 4 dial ticks from Kenney's CC0 UI Audio at 2.12s onward. The full recording is never shipped. Offsets and durations live in `src/components/react/Keyboard/key-sprite.ts` (`SPRITE`, `DIAL_SPRITE`). Measurements and rationale: `.agents/docs/perf-first-load.md`.

## Pipeline

- `src/components/react/Keyboard/audio-preloader.ts` fetches the sprite bytes once (`fetchSoundBytes`, reusing the head preload) and decodes them once (`decodeSprite`) through an `OfflineAudioContext`, which needs no user gesture. The resulting `AudioBuffer` plays on the realtime context (resampled if needed). Browsers without `OfflineAudioContext` decode on the realtime context instead.
- `src/lib/audio.ts` owns the single shared `AudioContext`. `initAudio()` (from the keyboard provider effect, after the pad is painted) starts the decode and arms a one-shot unlock on `pointerdown`, `touchend`, `mousedown`, `keydown` (capture, passive). The realtime context is created lazily on the first of those gestures, because constructing it at hydration cost about 190ms of main thread on the home page (Lighthouse TBT), and is resumed there. Never `touchstart`: iOS does not treat it as user activation.
- `getAudioStatus()` / `subscribeAudioStatus()` expose `loading | ready` (ready also when fetch or decode failed) for the startup indicator in `Keyboard.tsx`.
- `playClick('down'|'up', id)` is synchronous: it picks sample `SPRITE[name][hashId(id) % count]` (FNV-1a of the key code or id, so each key keeps its own voice) and plays it with `start(0, offset, duration)`, playbackRate jitter 0.95..1.05 and gain jitter 0.85..1.1. No-op while muted or not yet decoded (never queued, so there is no burst of late clicks). It plays when the context is running, or suspended within 120ms of the unlocking gesture (the first tap is audible). If fetch or decode failed, `playSynthClick` plays a short filtered-noise tick instead.
- `?mute=1` is read by `KeyboardProvider` and pushed into `setMuted`. F5 toggles it via `useActions().run('mute')`.
- `soundExtension()` in `key-sprite.ts` picks `ogg` when `canPlayType('audio/ogg; codecs="opus"')` is truthy, else `m4a` (AAC). The home page injects a matching `<link rel="preload" as="fetch">` from an inline script (`preloadSounds` prop on `Base.astro`) using the same check and `SPRITE_HASH`.
- Caching: the file name carries a content hash and `public/_headers` serves `/sounds/*` (and `/_astro/*`, `/fonts/*`) as `public, max-age=31536000, immutable`. When the sprite changes, rename the files and bump `SPRITE_HASH` together.

## Dial

The highlight dial is linear and clamped 0..100. Dragging accumulates the unwrapped angle delta from the grab point (270 degrees of travel = 0..100) and clamps at the stops, so crossing the dead zone at the bottom never teleports the value, and dragging back from a stop starts moving immediately. A tap with no movement cycles 0 -> 50 -> 100 -> 0 and plays the normal key click. Wheel and arrow keys also clamp.

## Dial tick

`playTick(value, strong)` in `src/lib/audio.ts` plays a slice of the shared sprite (after the key clicks): three detent variants picked at random for each notch and a heavier one for the 0 and 100 stops (`DIAL_SPRITE` in `key-sprite.ts`), with playbackRate rising slightly with the value. The slices come from Kenney's CC0 "UI Audio" pack (click2, click4, click5, switch5): about 22ms, pitched down 3 semitones (`asetrate=44100*0.841`), high-passed at 180Hz, +4dB near 3.5kHz, loudnorm. Before the sprite is decoded it is silent; if it failed it falls back to a synthesized tick. It fires on every 5-step notch crossed by drag, wheel or arrow keys, at most once per 30ms, and never when the value does not change. Same shared context, respects `?mute=1`.

Swap the dial sample: re-pack it after the key clicks in the sprite, update `DIAL_SPRITE` offsets in `key-sprite.ts`, and record the source and license in NOTICE. Only use files with a verified license (CC0, Apache, etc.).

## Regenerate the sprite

1. Decode the source to mono 44.1kHz PCM (`ffmpeg -i sound.ogg -ac 1 -ar 44100 -f s16le raw.pcm`) and find keypress onsets with a 5ms peak envelope (an onset is a rise above a threshold after at least 40ms of quiet). Down and up events alternate roughly 130-160ms apart.
2. Pick isolated, clean onsets. Cut 90ms (down) or 60ms (up) starting 4ms before each onset, remove DC, apply a 15ms fade-out and a 0.7ms fade-in, and normalize each to RMS about 2600 with a peak cap of 26000 (16-bit).
3. Concatenate with 40ms of silence before each segment, pad the key part to 2.1s, append the dial slices (so `DIAL_SPRITE` starts at 2.12s), and encode:

```sh
ffmpeg -y -i sprite.wav -c:a libopus -b:a 32k -application audio sprite.ogg
ffmpeg -y -i sprite.wav -c:a aac -b:a 32k -movflags +faststart sprite.m4a
```

4. Name both `sprite-<first 8 hex of sha256 of ogg+m4a>`, update `SPRITE` and `SPRITE_HASH` in `key-sprite.ts`.

Safari before 18.4 cannot decode Ogg Opus, hence the AAC fallback.

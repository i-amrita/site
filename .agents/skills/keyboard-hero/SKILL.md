---
name: keyboard-hero
description: Work on the home-page keyboard hero (keycaps, key bindings, action dispatch, audio). Use when changing keys, adding an action key, or touching click sounds.
---

# keyboard-hero

Code lives in `src/components/react/Keyboard/`. Island root is `Keyboard.tsx` (`<Keyboard client:load />` in `KeyboardFrame.astro`); it owns `Providers` and the only `<Toaster>` on the page.

- Layout rows and the code-to-action map: `keyboard-layout.ts`. Bindings derive from `ACTIONS[].keys` in `src/lib/actions.ts`; add actions there, not here.
- Keycap classes: `keyboard-themes.ts` (semantic Tailwind only, keythm Apache-2.0 header must stay).
- Dispatch: `src/components/react/use-actions.ts`, `useActions().run(id)`. Shared with navbar and CmdK.
- Press handling: `keyboard-context.tsx`. Pointer taps fire on pointerdown. Physical Alt/Meta fire on keyup if tapped alone. Cmd/Ctrl+K opens CmdK.
- Audio: `src/lib/audio.ts`, see `.agents/docs/audio.md`.
- The keyboard is drawn at a fixed 750px design width and scaled with a transform in `Scaler`.
- State flags: `?mute=1`, `?highlight=1`, `?theme=`, `?locale=`, `?overlay=`, `?cmdk=open`.

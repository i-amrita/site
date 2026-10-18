---
name: keyboard-hero
description: Work on the home-page keyboard hero (keycaps, key bindings, action dispatch, audio). Use when changing keys, adding an action key, or touching click sounds.
---

# keyboard-hero

Code lives in `src/components/react/Keyboard/`. Island root is `Keyboard.tsx` (`<Keyboard client:load />` in `KeyboardFrame.astro`); it owns `Providers` and the only `<Toaster>` on the page.

- Pad keys (`PAD_KEYS`, 11 keys in a 4-column grid) and the code-to-action map: `keyboard-layout.ts`. Bindings derive from `ACTIONS[].keys` in `src/lib/actions.ts`; add actions there, not here.
- Keycap variants (cream, rose, sage) and chassis/plate classes: `keyboard-themes.ts` (semantic Tailwind only, keythm Apache-2.0 header must stay). Keys are fluid (`w-full h-14`), never scaled.
- Dispatch: `src/components/react/use-actions.ts`, `useActions().run(id)`. Shared with navbar and CmdK.
- Press handling: `keyboard-context.tsx`. Pointer taps fire on pointerdown. Physical Alt/Meta fire on keyup if tapped alone. Cmd/Ctrl+K opens CmdK. Link keys (`kind: 'link'`: Research, LinkedIn, Let's build) are anchors with an `href`, no action id, and press codes `Link:*` that `BINDINGS` ignores.
- Audio: `src/lib/audio.ts`, see `.agents/docs/audio.md`.
- The pad frame (`KeyboardFrame.astro`, `mt-32`) reserves 216px (chassis only). There is no options row. The chassis has no engraving row or tag.
- The pad is a `max-w-[342px]` chassis (Double-Bezel, 28px radius, 14px padding) around a recessed plate. A key is pressed when any pressed code maps to its `actionId`. Sound and Locale keys mirror `?mute` and `?locale`; the dial is a `role=slider` that sets `?highlight=0..100` and the `--glow` custom property on the pad.
- `?highlight=1` is a steady glow (`key-glow`) on navigation keys, not a pulse. Every key is a tabbable button whose accessible name starts with its legend (WCAG 2.5.3).
- State flags: `?mute=1`, `?highlight=1`, `?theme=`, `?locale=`, `?overlay=`, `?cmdk=open`.

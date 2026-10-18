import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Delete,
  FolderKanban,
  Languages,
  NotebookPen,
  Play,
  Search,
  SkipBack,
  SkipForward,
  SunMoon,
  User,
  Volume1,
  Volume2,
  VolumeX,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { PointerEvent } from 'react';

import { ACTIONS } from '@/lib/actions';
import { cn } from '@/lib/utils';

import { useKeyboard } from './keyboard-context';
import { ACTION_ICONS, BINDINGS } from './keyboard-layout';
import { KEY_THEMES } from './keyboard-themes';
import type { KeyDef } from './keyboard.types';

const ICONS: Record<string, LucideIcon> = {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Command,
  Delete,
  FolderKanban,
  Languages,
  NotebookPen,
  Play,
  Search,
  SkipBack,
  SkipForward,
  SunMoon,
  User,
  Volume1,
  Volume2,
  VolumeX,
  X,
};

const LABELS = new Map(ACTIONS.map((a) => [a.id, a.label]));

export function Key({ def }: { def: KeyDef }) {
  const { pressed, highlight, press, release, runAction } = useKeyboard();
  const binding = BINDINGS.get(def.code);
  const isDown = pressed.has(def.code);
  // F-keys take their icon from the action registry; decorative keys keep their own.
  const iconName =
    (binding?.primary && def.code.startsWith('F')
      ? ACTION_ICONS.get(binding.actionId)
      : undefined) ?? def.icon;
  const Icon = iconName ? ICONS[iconName] : undefined;
  const variant = binding?.primary ? 'accent' : def.variant;
  const theme = KEY_THEMES[variant];
  const w = def.width;
  const name = binding ? (LABELS.get(binding.actionId) ?? def.code) : def.code;
  // WCAG 2.5.3: the accessible name starts with the visible legend ("F1 About").
  const ariaLabel = def.label && binding ? `${def.label} ${name}` : name;

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // setPointerCapture is best-effort.
    }
    press(def.code, 'pointer');
  };
  const onPointerUp = () => {
    if (pressed.has(def.code)) release(def.code, 'pointer');
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-hidden={binding?.primary ? undefined : true}
      tabIndex={binding?.primary ? 0 : -1}
      data-key={def.code}
      data-action={binding?.actionId}
      className="relative flex h-[50px] cursor-pointer touch-none items-end border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      style={{ width: w }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      // Keyboard activation (Enter/Space on a focused key) arrives as a click with detail 0.
      onClick={(e) => {
        if (e.detail === 0 && binding) runAction(binding.actionId);
      }}
    >
      <span
        className={cn(
          'relative flex h-[50px] items-start justify-center overflow-hidden rounded-[4px] rounded-t-[12px] border border-black/25 transition-all duration-100',
          theme.base,
          isDown && 'h-[45px]',
          binding && highlight && 'animate-key-glow',
        )}
        style={{ width: w }}
      >
        <span
          className={cn(
            'relative z-10 flex h-[37px] select-none flex-col items-center justify-center gap-0.5 rounded-[6px] border border-t-0 border-black/25 font-key text-[11px] font-medium leading-none',
            theme.cap,
          )}
          style={{ width: w - 13 }}
        >
          {def.shift && <span className="text-[9px]">{def.shift}</span>}
          {Icon && <Icon className="size-[11px]" aria-hidden />}
          {def.label && <span className={cn(Icon && 'text-[9px]')}>{def.label}</span>}
        </span>
        <span
          className={cn(
            'absolute right-0 bottom-0 z-0 h-px w-8 translate-x-3.5 rotate-70 bg-black/30 transition-all duration-100',
            isDown && 'rotate-60',
          )}
        />
        <span
          className={cn(
            'absolute bottom-0 left-0 z-0 h-px w-8 -translate-x-3.5 -rotate-70 bg-black/30 transition-all duration-100',
            isDown && '-rotate-60',
          )}
        />
      </span>
    </button>
  );
}

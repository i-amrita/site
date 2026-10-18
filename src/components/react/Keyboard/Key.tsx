import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type SVGProps,
} from 'react';
import BookOpen from '~icons/ph/book-open-light';
import Books from '~icons/ph/books-light';
import Mail from '~icons/ph/envelope-simple-light';
import Linkedin from '~icons/ph/linkedin-logo-light';
import Smile from '~icons/ph/smiley-light';
import Sparkles from '~icons/ph/sparkle-light';
import Volume2 from '~icons/ph/speaker-high-light';
import VolumeX from '~icons/ph/speaker-x-light';
import LayoutGrid from '~icons/ph/squares-four-light';

import { ACTIONS } from '@/lib/actions';
import { playClick, playTick } from '@/lib/audio';
import { t, useLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { useKeyboard } from './keyboard-context';
import { BINDINGS } from './keyboard-layout';
import { KEY_THEMES } from './keyboard-themes';
import type { MacroKeyDef } from './keyboard.types';

const ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  BookOpen,
  Books,
  LayoutGrid,
  Linkedin,
  Mail,
  Smile,
  Sparkles,
  Volume2,
  VolumeX,
};

const LABEL_KEYS = new Map(ACTIONS.map((a) => [a.id, a.labelKey]));

const DIAL_MIN_DEG = -135;
const DIAL_MAX_DEG = 135;
const DRAG_SLOP_PX = 4;
const DIAL_RANGE_DEG = DIAL_MAX_DEG - DIAL_MIN_DEG;

/** Pointer angle around the dial centre in degrees, 0 = up, clockwise positive, -180..180. */
function pointerAngle(e: PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  return (
    (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) /
    Math.PI
  );
}

/** Rotary highlight control: `?highlight=0..100`, mapped to -135deg..+135deg. */
function Dial() {
  useLocale();
  const { highlight, setHighlight } = useKeyboard();
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    moved: boolean;
    start: number;
    last: number;
    acc: number;
  } | null>(null);
  const [active, setActive] = useState(false);
  const valueRef = useRef(highlight);
  valueRef.current = highlight;

  const change = (next: number, tick = true) => {
    const v = Math.min(100, Math.max(0, Math.round(next)));
    const prev = valueRef.current;
    if (v === prev) return;
    valueRef.current = v;
    setHighlight(v);
    if (!tick) return;
    const stop = v === 0 || v === 100;
    if (stop || Math.floor(v / 5) !== Math.floor(prev / 5)) playTick(v, stop);
  };

  // React registers wheel listeners as passive, so preventDefault needs a native one.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.deltaY === 0) return;
      e.preventDefault();
      change(valueRef.current + Math.max(-10, Math.min(10, -e.deltaY / 8)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  });

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // best-effort
    }
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      moved: false,
      start: valueRef.current,
      last: pointerAngle(e),
      acc: 0,
    };
    setActive(true);
    ref.current?.focus({ preventScroll: true });
  };
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) < DRAG_SLOP_PX) return;
    d.moved = true;
    // Linear: accumulate the (unwrapped) angle delta from the grab point and clamp at the stops.
    // The dead zone at the bottom is crossed continuously, so the value can never jump 90 -> 10.
    const angle = pointerAngle(e);
    let delta = angle - d.last;
    if (delta > 180) delta -= 360;
    else if (delta < -180) delta += 360;
    d.last = angle;
    const lo = (-d.start / 100) * DIAL_RANGE_DEG;
    const hi = ((100 - d.start) / 100) * DIAL_RANGE_DEG;
    d.acc = Math.min(hi, Math.max(lo, d.acc + delta));
    change(d.start + (d.acc / DIAL_RANGE_DEG) * 100);
  };
  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    drag.current = null;
    setActive(false);
    if (!d || e.type === 'pointercancel') return;
    if (!d.moved) {
      // A plain tap cycles 0 -> 50 -> 100 -> 0.
      const v = valueRef.current;
      change(v < 50 ? 50 : v < 100 ? 100 : 0, false);
      navigator.vibrate?.(12);
      playClick('down', 'Dial');
    }
  };
  const onKeyDown = (e: KeyboardEvent) => {
    const v = valueRef.current;
    const next: Record<string, number> = {
      ArrowUp: v + 5,
      ArrowRight: v + 5,
      ArrowDown: v - 5,
      ArrowLeft: v - 5,
      PageUp: v + 20,
      PageDown: v - 20,
      Home: 0,
      End: 100,
    };
    if (!(e.key in next) || e.metaKey || e.ctrlKey || e.altKey) return;
    e.preventDefault();
    change(next[e.key]!);
  };

  const deg = DIAL_MIN_DEG + (highlight / 100) * (DIAL_MAX_DEG - DIAL_MIN_DEG);
  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={t('settings_highlight')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={highlight}
      aria-valuetext={`${highlight}%`}
      data-key="Dial"
      data-action="highlight"
      data-pressed={active ? 'true' : undefined}
      className={cn(
        'relative flex h-14 w-full cursor-grab touch-none items-center justify-center',
        active && 'cursor-grabbing',
        FOCUS,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <span className="absolute size-[54px] rounded-full bg-black/45 ring-1 ring-white/5 inset-shadow-[0_2px_4px_rgb(0_0_0/0.6)]" />
      <span
        data-dial
        className={cn(
          'relative flex size-12 items-start justify-center rounded-full bg-linear-to-b from-chassis to-chassis-lo ring-1 ring-white/15 shadow-key transition-transform duration-150 ease-out motion-reduce:transition-none',
          active && 'transition-none',
        )}
        style={{
          transform: `rotate(${deg}deg)${active ? ' scale(0.97)' : ''}`,
          backgroundImage:
            'repeating-conic-gradient(rgb(255 255 255 / 0.07) 0deg 6deg, transparent 6deg 12deg)',
        }}
      >
        <span className="mt-1.5 size-1.5 rounded-full bg-brand shadow-[0_0_6px_1px] shadow-brand" />
      </span>
    </div>
  );
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export function Key({ def }: { def: MacroKeyDef }) {
  useLocale();
  const { pressed, urlState, press, release, runAction } = useKeyboard();
  const isDown =
    pressed.has(def.code) ||
    (!!def.actionId && [...pressed].some((c) => BINDINGS.get(c)?.actionId === def.actionId));
  const muted = urlState.mute === '1';

  const iconName = def.kind === 'sound' ? (muted ? 'VolumeX' : 'Volume2') : def.icon;
  const Icon = iconName ? ICONS[iconName] : undefined;
  const legend =
    def.kind === 'locale'
      ? (urlState.locale ?? 'en').toUpperCase()
      : (def.legend ?? (def.legendKey ? t(def.legendKey) : undefined));
  const labelKey = def.actionId ? LABEL_KEYS.get(def.actionId) : undefined;
  const actionName = def.nameKey ? t(def.nameKey) : labelKey ? t(labelKey) : def.id;
  // WCAG 2.5.3: the accessible name starts with the visible legend ("Work Projects").
  const ariaLabel =
    def.kind === 'link' && !def.nameKey ? legend : legend ? `${legend} ${actionName}` : actionName;

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
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
  const handlers = {
    onPointerDown,
    onPointerUp,
    onPointerCancel: onPointerUp,
    // Keyboard activation (Enter/Space on a focused key) arrives as a click with detail 0.
    onClick: (e: MouseEvent) => {
      if (e.detail === 0 && def.actionId) runAction(def.actionId);
    },
  };
  // Native anchors activate on Enter; give them the same keydown feedback as buttons.
  const linkKeys = {
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.repeat) press(def.code, 'keyboard');
    },
    onKeyUp: (e: KeyboardEvent) => {
      if (e.key === 'Enter') release(def.code, 'keyboard');
    },
    onBlur: () => release(def.code, 'keyboard'),
  };
  const isLink = def.kind === 'link';
  const Root = (isLink ? 'a' : 'button') as 'button';
  const rootProps = isLink
    ? {
        href: def.href,
        ...(def.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
        ...linkKeys,
      }
    : { type: 'button' as const };

  if (def.kind === 'dial') return <Dial />;

  const keyTheme = KEY_THEMES[def.variant];
  const wide = def.span === 2;

  return (
    <Root
      {...rootProps}
      aria-label={ariaLabel}
      aria-pressed={def.kind === 'sound' ? muted : undefined}
      data-key={def.code}
      data-action={def.actionId ?? def.id}
      data-pressed={isDown ? 'true' : undefined}
      className={cn(
        'group relative block h-14 w-full cursor-pointer touch-none rounded-t-[12px] rounded-b-[6px] border-0 bg-transparent p-0',
        wide && 'col-span-2',
        def.glow ? 'key-glow' : 'key-dim',
        FOCUS,
      )}
      {...handlers}
    >
      <span
        className={cn(
          'absolute inset-0 rounded-t-[12px] rounded-b-[6px] shadow-key',
          keyTheme.side,
        )}
      />
      <span
        className={cn(
          'absolute inset-x-[3px] top-0 flex h-[52px] flex-col items-center justify-center gap-1 rounded-[9px] rounded-b-[7px] font-key text-[10px] font-medium leading-none select-none ring-1 ring-black/15 inset-shadow-[0_1px_0_rgb(255_255_255/0.35)] transition-transform duration-[60ms] ease-key motion-reduce:transition-none',
          keyTheme.cap,
          isDown && 'translate-y-1 motion-reduce:translate-y-0 motion-reduce:brightness-90',
        )}
      >
        {wide ? (
          <span className="flex items-center gap-2 text-[11px]">
            {Icon && <Icon className="size-3.5" aria-hidden />}
            {legend}
            {Icon && <Icon className="size-3.5" aria-hidden />}
          </span>
        ) : (
          <>
            {Icon && <Icon className="size-4" aria-hidden />}
            {legend && (
              <span
                className={cn(def.kind === 'locale' && 'text-[13px] font-semibold tracking-wider')}
              >
                {legend}
              </span>
            )}
          </>
        )}
      </span>
      {/* keythm recipe: two bottom slivers flanking the cap. They collapse as the cap travels down. */}
      <span
        aria-hidden
        className={cn(
          'absolute bottom-0 left-0 h-px w-[6px] -rotate-45 bg-black/30 transition-opacity duration-[60ms] ease-key',
          isDown && 'opacity-0',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'absolute right-0 bottom-0 h-px w-[6px] rotate-45 bg-black/30 transition-opacity duration-[60ms] ease-key',
          isDown && 'opacity-0',
        )}
      />
    </Root>
  );
}

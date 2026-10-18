import { ArrowRight, X } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { Dialog, DialogPortal } from '@/components/ui/dialog';
import { Drawer, DrawerPortal } from '@/components/ui/drawer';
import { m, useLocale } from '@/lib/i18n';

const SCROLL_THROTTLE_MS = 200;

interface Props {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  /** Link to the dedicated static page (the non-JS equivalent). */
  readMore: { href: string; label: string };
  children: ReactNode;
  /** Initial `scrollTop` restored when the overlay opens. */
  scrollTop?: number;
  /** Throttled scroll reports (px). */
  onScrollTop?: (top: number) => void;
}

const MOBILE_QUERY = '(max-width: 639.98px)';

function subscribeMobile(cb: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

/**
 * Shared shell. Both variants are NON-MODAL so the keypad behind stays visible, clickable and hotkey-driven:
 * a bottom vaul Drawer below 640px (grabber, drag-down, no scrim) and a docked Radix Dialog panel from 640px.
 * Outside clicks never dismiss; Escape, the close button, the `close` action and Back do.
 */
export function ActionOverlay({
  open,
  title,
  description,
  onClose,
  readMore,
  children,
  scrollTop = 0,
  onScrollTop,
}: Props) {
  useLocale();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initial = useRef(scrollTop);
  initial.current = scrollTop;

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  // Restore once on mount of the scroll container (mount happens when the dialog opens).
  const setScroller = useCallback((el: HTMLDivElement | null) => {
    if (!el || initial.current <= 0) return;
    requestAnimationFrame(() => {
      el.scrollTop = initial.current;
    });
  }, []);

  const isMobile = useIsMobile();

  // From `lg`, `global.css` makes room for the docked panel so the pad is not covered.
  useEffect(() => {
    if (!open || isMobile) return;
    document.documentElement.dataset.overlayOpen = '';
    return () => {
      delete document.documentElement.dataset.overlayOpen;
    };
  }, [open, isMobile]);
  const onOpenChange = (next: boolean) => !next && onClose();

  const content = (
    <>
      <div
        ref={setScroller}
        data-overlay-scroll
        onScroll={(e) => {
          if (!onScrollTop || timer.current) return;
          const el = e.currentTarget;
          timer.current = setTimeout(() => {
            timer.current = null;
            onScrollTop(Math.round(el.scrollTop));
          }, SCROLL_THROTTLE_MS);
        }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
      >
        {children}
      </div>
      <footer className="border-t border-border px-5 py-3">
        <a
          href={readMore.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {readMore.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </footer>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} modal={false}>
        <DrawerPortal>
          <DrawerPrimitive.Content
            data-slot="drawer-content"
            data-overlay-panel
            className="fixed inset-x-0 bottom-0 z-50 flex h-[58dvh] max-h-[92dvh] flex-col rounded-t-card border-t border-border bg-page text-fg shadow-[0_-12px_32px_-12px_rgb(28_16_18/0.25)] outline-none"
          >
            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-1.5 w-[88px] shrink-0 rounded-full bg-surface-muted"
            />
            <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 text-left">
              <DrawerPrimitive.Title className="font-display text-xl">
                {title}
              </DrawerPrimitive.Title>
              <DrawerPrimitive.Description className="sr-only">
                {description}
              </DrawerPrimitive.Description>
            </header>
            {content}
          </DrawerPrimitive.Content>
        </DrawerPortal>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogPortal>
        <DialogPrimitive.Content
          data-slot="dialog-content"
          data-overlay-panel
          onOpenAutoFocus={(e) => {
            // Focus the panel itself so no control shows a focus ring on open.
            e.preventDefault();
            (e.target as HTMLElement | null)?.closest<HTMLElement>('[role="dialog"]')?.focus();
          }}
          // Non-modal: clicking the pad, the navbar or the page must not dismiss the panel.
          onInteractOutside={(e) => e.preventDefault()}
          className="fixed top-16 right-4 bottom-4 z-50 flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col rounded-card border border-border bg-page text-fg shadow-[0_12px_32px_-12px_rgb(28_16_18/0.25)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-4 motion-reduce:animate-none lg:w-[26rem]"
        >
          <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <DialogPrimitive.Title className="font-display text-xl">{title}</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {description}
            </DialogPrimitive.Description>
            <button
              type="button"
              onClick={onClose}
              className="rounded-key p-1.5 text-muted-foreground transition-colors hover:bg-surface-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">{m.overlay_close()}</span>
            </button>
          </header>
          {content}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}

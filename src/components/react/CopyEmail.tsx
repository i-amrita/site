import { Mail } from 'lucide-react';

import { Providers } from './Providers';
import { useActions } from './use-actions';

function Inner() {
  const { run } = useActions();
  return (
    <button
      type="button"
      onClick={() => run('copy-email')}
      className="inline-flex items-center gap-2 rounded-key border border-border bg-surface px-3 py-1.5 text-sm text-fg transition-colors hover:border-brand hover:text-brand"
    >
      <Mail className="size-4" aria-hidden /> Email
    </button>
  );
}

/** Social-row email button. Copies the address and toasts (Toaster lives in the keyboard island). */
export function CopyEmail() {
  return (
    <Providers toaster={false}>
      <Inner />
    </Providers>
  );
}

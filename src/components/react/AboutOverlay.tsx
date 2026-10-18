import { FileText, FlaskConical, Link as LinkIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { ActionOverlay } from '@/components/react/ActionOverlay';
import { SOCIALS } from '@/lib/site';

const COPY = {
  title: 'About',
  description: 'A short bio and contact links.',
  readMore: 'Read full bio',
  linkedin: 'LinkedIn',
  research: 'Research',
  cv: 'CV / Resume',
} as const;

const link =
  'inline-flex items-center gap-2 rounded-key border border-border bg-surface px-3 py-1.5 text-sm text-fg transition-colors hover:border-brand hover:text-brand';

interface Props {
  open: boolean;
  onClose: () => void;
  /** About MDX rendered to static HTML at build time (Astro slot), the same source as `/about`. */
  children: ReactNode;
}

export function AboutOverlay({ open, onClose, children }: Props) {
  return (
    <ActionOverlay
      open={open}
      title={COPY.title}
      description={COPY.description}
      onClose={onClose}
      readMore={{ href: '/about', label: COPY.readMore }}
    >
      <div className="flex flex-col gap-4 [&_p]:leading-relaxed">{children}</div>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Links">
        <li>
          <a className={link} href={SOCIALS.linkedin} rel="noopener" target="_blank">
            <LinkIcon className="size-4" aria-hidden="true" /> {COPY.linkedin}
          </a>
        </li>
        <li>
          <a className={link} href={SOCIALS.research} rel="noopener" target="_blank">
            <FlaskConical className="size-4" aria-hidden="true" /> {COPY.research}
          </a>
        </li>
        <li>
          <a className={link} href={SOCIALS.cv}>
            <FileText className="size-4" aria-hidden="true" /> {COPY.cv}
          </a>
        </li>
      </ul>
    </ActionOverlay>
  );
}

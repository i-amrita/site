import { FileText, FlaskConical, Link as LinkIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { ActionOverlay } from '@/components/react/ActionOverlay';
import { m, useLocale } from '@/lib/i18n';
import { SOCIALS } from '@/lib/site';

const link =
  'inline-flex items-center gap-2 rounded-key border border-border bg-surface px-3 py-1.5 text-sm text-fg transition-colors hover:border-brand hover:text-brand';

interface Props {
  open: boolean;
  onClose: () => void;
  /** About MDX rendered to static HTML at build time (Astro slot), the same source as `/about`. */
  children: ReactNode;
}

export function AboutOverlay({ open, onClose, children }: Props) {
  useLocale();
  return (
    <ActionOverlay
      open={open}
      title={m.overlay_about_title()}
      description={m.overlay_about_description()}
      onClose={onClose}
      readMore={{ href: '/about', label: m.overlay_about_read_more() }}
    >
      <div className="[&_p]:leading-relaxed [&_p+p]:mt-4">{children}</div>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label={m.socials_aria()}>
        <li>
          <a className={link} href={SOCIALS.linkedin} rel="noopener" target="_blank">
            <LinkIcon className="size-4" aria-hidden="true" /> {m.socials_linkedin()}
          </a>
        </li>
        <li>
          <a className={link} href={SOCIALS.research} rel="noopener" target="_blank">
            <FlaskConical className="size-4" aria-hidden="true" /> {m.socials_research()}
          </a>
        </li>
        <li>
          <a className={link} href={SOCIALS.cv}>
            <FileText className="size-4" aria-hidden="true" /> {m.socials_cv()}
          </a>
        </li>
      </ul>
    </ActionOverlay>
  );
}

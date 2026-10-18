import { ActionOverlay } from '@/components/react/ActionOverlay';
import type { PostItem } from '@/components/react/overlay-types';
import { m, useLocale } from '@/lib/i18n';

interface Props {
  open: boolean;
  posts: PostItem[];
  onClose: () => void;
}

export function LogOverlay({ open, posts, onClose }: Props) {
  useLocale();
  return (
    <ActionOverlay
      open={open}
      title={m.overlay_log_title()}
      description={m.overlay_log_description()}
      onClose={onClose}
      readMore={{ href: '/posts', label: m.overlay_log_see_all() }}
    >
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{m.log_empty()}</p>
      ) : (
        <ul role="list" className="flex flex-col gap-4">
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-1 rounded-card border border-border bg-surface p-4"
            >
              <time dateTime={p.date} className="font-key text-xs text-muted-foreground">
                {p.date}
              </time>
              <h3 className="font-display text-lg">
                <a href={`/posts/${p.id}`} className="hover:text-brand">
                  {p.title}
                </a>
              </h3>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      )}
    </ActionOverlay>
  );
}

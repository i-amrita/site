import { ActionOverlay } from '@/components/react/ActionOverlay';
import type { PostItem } from '@/components/react/overlay-types';

const COPY = {
  title: 'Log',
  description: 'Recent notes and posts.',
  seeAll: 'See all posts',
  empty: 'Nothing here yet. Check back soon.',
} as const;

interface Props {
  open: boolean;
  posts: PostItem[];
  onClose: () => void;
}

export function LogOverlay({ open, posts, onClose }: Props) {
  return (
    <ActionOverlay
      open={open}
      title={COPY.title}
      description={COPY.description}
      onClose={onClose}
      readMore={{ href: '/posts', label: COPY.seeAll }}
    >
      {posts.length === 0 ? (
        <p className="text-muted-foreground">{COPY.empty}</p>
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

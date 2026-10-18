import { useQueryStates } from 'nuqs';
import type { ReactNode } from 'react';

import { AboutOverlay } from '@/components/react/AboutOverlay';
import { LogOverlay } from '@/components/react/LogOverlay';
import type { PostItem, ProjectItem, ResearchItem } from '@/components/react/overlay-types';
import { ProjectsOverlay } from '@/components/react/ProjectsOverlay';
import { Providers } from '@/components/react/Providers';
import { useActions } from '@/components/react/use-actions';
import { urlStateParsers } from '@/lib/url-state';

interface Props {
  projects: ProjectItem[];
  research: ResearchItem[];
  tags: string[];
  posts: PostItem[];
  /** Named Astro slot: About MDX rendered at build time. */
  about?: ReactNode;
}

function Overlays({ projects, research, tags, posts, about }: Props) {
  const [state, setState] = useQueryStates(urlStateParsers);
  const { run } = useActions();
  const close = () => run('close');

  return (
    <>
      <AboutOverlay open={state.overlay === 'about'} onClose={close}>
        {about}
      </AboutOverlay>
      <ProjectsOverlay
        open={state.overlay === 'projects'}
        projects={projects}
        research={research}
        tags={tags}
        kind={state.kind}
        filter={state.filter}
        scroll={state.scroll}
        onClose={close}
        onKind={(kind) =>
          void setState({ kind, filter: null, scroll: null }, { history: 'replace' })
        }
        onFilter={(tag) => void setState({ filter: tag }, { history: 'replace' })}
        onScroll={(top) => void setState({ scroll: top > 0 ? top : null }, { history: 'replace' })}
      />
      <LogOverlay open={state.overlay === 'log'} posts={posts} onClose={close} />
    </>
  );
}

export function OverlaysRoot(props: Props) {
  return (
    <Providers toaster={false}>
      <Overlays {...props} />
    </Providers>
  );
}

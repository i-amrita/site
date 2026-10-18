import { useQueryState } from 'nuqs';

import { TagChips } from '@/components/react/content-blocks';
import { Providers } from '@/components/react/Providers';
import { m, useLocale } from '@/lib/i18n';
import { tagSlug } from '@/lib/tags';
import { urlStateParsers } from '@/lib/url-state';

interface Props {
  tags: string[];
}

function Chips({ tags }: Props) {
  useLocale();
  const [filter, setFilter] = useQueryState(
    'filter',
    urlStateParsers.filter.withOptions({ history: 'replace' }),
  );
  const active = filter ? tagSlug(filter) : null;
  return (
    <>
      {/* All rows are server-rendered; this rule hides the ones that do not match. */}
      {active && (
        <style>{`[data-project-card]:not([data-tags~=${JSON.stringify(active)}]){display:none}`}</style>
      )}
      <TagChips
        tags={tags}
        active={active}
        onSelect={(tag) => void setFilter(tag)}
        ariaLabel={m.projects_filter_aria()}
        allLabel={m.projects_filter_all()}
      />
    </>
  );
}

export function ProjectFilter(props: Props) {
  return (
    <Providers>
      <Chips {...props} />
    </Providers>
  );
}

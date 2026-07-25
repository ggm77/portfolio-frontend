import type { HistoryResponse } from '../api/types';
import type { ResourceState } from '../hooks/useResource';
import { byStartDesc, formatPeriod } from '../lib/format';
import { Section, StatusText } from './Section';

/** The API uses "-" as a placeholder when an entry has no linked project. */
function hasProject(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed !== '-';
}

export function Timeline({ history }: { history: ResourceState<HistoryResponse[]> }) {
  const sorted = history.data ? [...history.data].sort(byStartDesc) : null;

  return (
    <Section id="timeline" label="timeline" title="경력 & 이력">
      {history.loading && <StatusText>불러오는 중…</StatusText>}
      {history.error && <StatusText>이력 정보를 불러오지 못했습니다.</StatusText>}
      {sorted?.length === 0 && <StatusText>등록된 이력이 없습니다.</StatusText>}

      {sorted && sorted.length > 0 && (
        <div className="tl">
          {sorted.map((entry) => (
            <div key={entry.id} className="tl__item">
              <span className="tl__node" aria-hidden="true" />
              <div className="tl__period">{formatPeriod(entry.startAt, entry.endAt)}</div>
              <h3 className="tl__title">{entry.club_name}</h3>
              {hasProject(entry.project_name) && (
                <div className="tl__sub">{entry.project_name}</div>
              )}
              {entry.content && <div className="tl__desc">{entry.content}</div>}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

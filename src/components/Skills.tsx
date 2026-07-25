import type { StackResponse } from '../api/types';
import type { ResourceState } from '../hooks/useResource';
import { padIndex } from '../lib/ui';
import { Section, StatusText } from './Section';

export function Skills({ stacks }: { stacks: ResourceState<StackResponse[]> }) {
  return (
    <Section id="skills" label="skills" title="Skills & Stack">
      {stacks.loading && <StatusText>불러오는 중…</StatusText>}
      {stacks.error && <StatusText>스택 정보를 불러오지 못했습니다.</StatusText>}
      {stacks.data?.length === 0 && <StatusText>등록된 스택이 없습니다.</StatusText>}

      {stacks.data && stacks.data.length > 0 && (
        <div className="stackgrid">
          {stacks.data.map((group, i) => (
            <article key={group.id} className="stackcard">
              <div className="stackcard__head">
                <span className="stackcard__idx">{padIndex(i + 1)}</span>
                <h3 className="stackcard__name">{group.name}</h3>
              </div>
              <div className="chips">
                {group.content.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

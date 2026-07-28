import type { MeResponse } from '../api/types';
import type { ResourceState } from '../hooks/useResource';
import { EMAIL, GITHUB_URL, GITHUB_USER } from '../lib/profile';
import { Section, StatusText } from './Section';

export function About({ me }: { me: ResourceState<MeResponse> }) {
  return (
    <Section id="about" label="about" title="About">
      <div className="about">
        <div>
          {me.loading && <StatusText>불러오는 중…</StatusText>}
          {me.error && <StatusText>소개 정보를 불러오지 못했습니다.</StatusText>}
          {me.data && <p className="about__prose">{me.data.content}</p>}
        </div>

        <aside className="spec">
          <div className="spec__title">// profile</div>
          <div className="spec__row">
            <span className="spec__k">github</span>
            <a className="spec__v" href={GITHUB_URL} target="_blank" rel="noreferrer">
              @{GITHUB_USER}
            </a>
          </div>
          <div className="spec__row">
            <span className="spec__k">email</span>
            <a className="spec__v" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </div>
          <div className="spec__row">
            <span className="spec__k">education</span>
            <span className="spec__v">한동대학교 23학번</span>
          </div>
          <div className="spec__row">
            <span className="spec__k">status</span>
            <span className="spec__v">협업 · 채용 문의 환영</span>
          </div>

          {me.data && me.data.tags.length > 0 && (
            <div className="spec__tags">
              <div className="chips">
                {me.data.tags.map((tag) => (
                  <span key={tag} className="chip chip--sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </Section>
  );
}

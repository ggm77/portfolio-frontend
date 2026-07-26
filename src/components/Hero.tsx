import type { MeResponse } from '../api/types';
import type { ResourceState } from '../hooks/useResource';
import { EMAIL, GITHUB_URL } from '../lib/profile';

const TRAFFIC_LIGHTS = ['#ff5f56', '#ffbd2e', '#27c93f'];

function Prompt({ cmd, caret }: { cmd?: string; caret?: boolean }) {
  return (
    <div className="prompt">
      <span className="prompt__path">~/portfolio</span>
      <span className="prompt__sign">$</span>
      {cmd && <span className="prompt__cmd">{cmd}</span>}
      {caret && <span className="caret" aria-hidden="true" />}
    </div>
  );
}

export function Hero({ me }: { me: ResourceState<MeResponse> }) {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="terminal">
          <div className="terminal__bar">
            {TRAFFIC_LIGHTS.map((color) => (
              <span key={color} className="terminal__dot" style={{ background: color }} />
            ))}
            <span className="terminal__title">seohamin@homeserver: ~/portfolio</span>
          </div>

          <div className="terminal__body">
            <Prompt cmd="whoami" />

            {me.loading && (
              <div className="hero__out">
                <p className="status-text">불러오는 중…</p>
              </div>
            )}
            {me.error && (
              <div className="hero__out">
                <p className="status-text">소개 정보를 불러오지 못했습니다.</p>
              </div>
            )}

            {me.data && (
              <>
                <div className="hero__out">
                  <h1 className="hero__title">{me.data.headline}</h1>
                  <p className="hero__sub">{me.data.subheadline}</p>
                </div>

                <div className="hero__out hero__out--tight">
                  <div className="chips">
                    {me.data.tags.map((tag) => (
                      <span key={tag} className="chip chip--accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Prompt caret />
          </div>
        </div>

        <div className="hero__actions">
          <a className="btn btn--primary" href="#projects">
            프로젝트 보기
            <span className="btn__arrow" aria-hidden="true">
              ↓
            </span>
          </a>
          <a className="btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
            <span className="btn__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a className="btn" href={`mailto:${EMAIL}`}>
            Email
          </a>
        </div>
      </div>
    </section>
  );
}

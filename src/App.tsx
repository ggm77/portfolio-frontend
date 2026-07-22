import { useState, type CSSProperties, type ReactNode } from 'react';
import { getHistory, getMe, getProjects, getStacks } from './api/client';
import type { HistoryResponse, ProjectResponse } from './api/types';
import { useResource } from './hooks/useResource';
import { formatPeriod } from './lib/format';
import './App.css';

interface ContactLink {
  label: string;
  url: string;
}

const ACCENT_COLOR = '#3B6EA8';

const links: ContactLink[] = [
  { label: 'GitHub', url: 'https://github.com/ggm77' },
  { label: 'Email', url: 'mailto:shm040806@gmail.com' },
];

function StatusText({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 14, color: 'oklch(0.55 0.015 245)' }}>{children}</div>
  );
}

function App() {
  const me = useResource(getMe);
  const stacks = useResource(getStacks);
  const projects = useResource(getProjects);
  const history = useResource(getHistory);

  const [selectedProject, setSelectedProject] = useState<ProjectResponse | null>(null);

  const rootStyle = { '--accent': ACCENT_COLOR } as CSSProperties;

  return (
    <div
      style={{
        ...rootStyle,
        width: '100%',
        color: 'oklch(0.24 0.02 245)',
        lineHeight: 1.6,
        overflowX: 'hidden',
      }}
    >
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          background: 'oklch(0.2 0.025 240)',
          color: 'oklch(0.96 0.005 240)',
          padding: '120px 24px 100px',
          backgroundImage:
            'repeating-linear-gradient(0deg, oklch(1 0 0 / 0.035) 0px, oklch(1 0 0 / 0.035) 1px, transparent 1px, transparent 28px)',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 14,
              color: 'oklch(0.7 0.03 235)',
              marginBottom: 28,
            }}
          >
            <span>~/portfolio</span>
            <span style={{ opacity: 0.5 }}>$</span>
            <span>whoami</span>
            <span className="cursor-blink" />
          </div>
          {me.loading && (
            <div style={{ fontSize: 15, color: 'oklch(0.75 0.02 235)' }}>불러오는 중…</div>
          )}
          {me.error && (
            <div style={{ fontSize: 15, color: 'oklch(0.75 0.02 235)' }}>
              소개 정보를 불러오지 못했습니다.
            </div>
          )}
          {me.data && (
            <>
              <h1
                style={{
                  fontSize: 44,
                  fontWeight: 700,
                  lineHeight: 1.35,
                  margin: '0 0 22px',
                  letterSpacing: '-0.01em',
                  textWrap: 'pretty',
                }}
              >
                {me.data.headline}
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: 'oklch(0.82 0.02 235)',
                  maxWidth: 620,
                  margin: '0 0 36px',
                  textWrap: 'pretty',
                }}
              >
                {me.data.subheadline}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {me.data.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 13,
                      padding: '6px 12px',
                      border: '1px solid oklch(1 0 0 / 0.18)',
                      borderRadius: 3,
                      color: 'oklch(0.88 0.02 235)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section
        style={{
          padding: '88px 24px',
          borderBottom: '1px solid oklch(0.88 0.008 240)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'oklch(0.5 0.09 235)', marginBottom: 10 }}>
            // about
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 24px' }}>About</h2>
          {me.loading && <StatusText>불러오는 중…</StatusText>}
          {me.error && <StatusText>소개 정보를 불러오지 못했습니다.</StatusText>}
          {me.data && (
            <p
              style={{
                fontSize: 15,
                color: 'oklch(0.38 0.02 245)',
                maxWidth: 680,
                margin: 0,
                textWrap: 'pretty',
                whiteSpace: 'pre-wrap',
              }}
            >
              {me.data.content}
            </p>
          )}
        </div>
      </section>

      {/* SKILLS */}
      <section
        style={{
          padding: '88px 24px',
          background: 'oklch(0.96 0.006 240)',
          borderBottom: '1px solid oklch(0.88 0.008 240)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'oklch(0.5 0.09 235)', marginBottom: 10 }}>
            // skills
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 32px' }}>
            Skills &amp; Stack
          </h2>
          {stacks.loading && <StatusText>불러오는 중…</StatusText>}
          {stacks.error && <StatusText>스택 정보를 불러오지 못했습니다.</StatusText>}
          {stacks.data && stacks.data.length === 0 && (
            <StatusText>등록된 스택이 없습니다.</StatusText>
          )}
          {stacks.data && stacks.data.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 28,
              }}
            >
              {stacks.data.map((group) => (
                <div key={group.id}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'oklch(0.3 0.02 245)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: 12,
                    }}
                  >
                    {group.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {group.content.map((item) => (
                      <span
                        key={item}
                        style={{
                          fontSize: 13,
                          padding: '5px 10px',
                          background: 'oklch(1 0 0)',
                          border: '1px solid oklch(0.85 0.01 240)',
                          borderRadius: 3,
                          color: 'oklch(0.35 0.02 245)',
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PROJECTS */}
      <section
        style={{
          padding: '88px 24px',
          borderBottom: '1px solid oklch(0.88 0.008 240)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'oklch(0.5 0.09 235)', marginBottom: 10 }}>
            // projects
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 32px' }}>Projects</h2>
          {projects.loading && <StatusText>불러오는 중…</StatusText>}
          {projects.error && <StatusText>프로젝트 정보를 불러오지 못했습니다.</StatusText>}
          {projects.data && projects.data.length === 0 && (
            <StatusText>등록된 프로젝트가 없습니다.</StatusText>
          )}
          {projects.data && projects.data.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 20,
              }}
            >
              {projects.data.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="project-card"
                  onClick={() => setSelectedProject(p)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>{p.name}</h3>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'oklch(0.55 0.015 245)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {p.endAt ? '완료' : '진행중'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 12 }}>
                    {formatPeriod(p.startAt, p.endAt)}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      color: 'oklch(0.42 0.02 245)',
                      margin: '0 0 16px',
                      textWrap: 'pretty',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {p.tagline}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 6,
                      marginBottom: 14,
                    }}
                  >
                    {p.tags.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: 11,
                          padding: '3px 8px',
                          background: 'oklch(0.96 0.006 240)',
                          borderRadius: 3,
                          color: 'oklch(0.45 0.02 245)',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--accent)' }}>자세히 보기 →</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TIMELINE */}
      <section
        style={{
          padding: '88px 24px',
          background: 'oklch(0.96 0.006 240)',
          borderBottom: '1px solid oklch(0.88 0.008 240)',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'oklch(0.5 0.09 235)', marginBottom: 10 }}>
            // timeline
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 32px' }}>
            경력 &amp; 이력
          </h2>
          {history.loading && <StatusText>불러오는 중…</StatusText>}
          {history.error && <StatusText>이력 정보를 불러오지 못했습니다.</StatusText>}
          {history.data && history.data.length === 0 && (
            <StatusText>등록된 이력이 없습니다.</StatusText>
          )}
          {history.data && history.data.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {history.data.map((t: HistoryResponse) => (
                <div
                  key={t.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '150px 20px 1fr',
                    gap: 4,
                    padding: '18px 0',
                    borderTop: '1px solid oklch(0.85 0.01 240)',
                  }}
                >
                  <div style={{ fontSize: 13, color: 'oklch(0.5 0.015 245)' }}>
                    {formatPeriod(t.startAt, t.endAt)}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                        marginTop: 5,
                      }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>
                      {t.club_name}
                    </div>
                    <div style={{ fontSize: 14, color: 'oklch(0.42 0.02 245)' }}>
                      {t.project_name}
                    </div>
                    {t.content && (
                      <div
                        style={{
                          fontSize: 13,
                          color: 'oklch(0.5 0.02 245)',
                          marginTop: 4,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {t.content}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section style={{ padding: '96px 24px 110px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'oklch(0.5 0.09 235)', marginBottom: 10 }}>
            // contact
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 16px' }}>
            Let&apos;s talk
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'oklch(0.42 0.02 245)',
              maxWidth: 520,
              margin: '0 auto 32px',
            }}
          >
            협업, 채용, 질문 모두 환영합니다.
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            {links.map((l) => (
              <a key={l.label} href={l.url} className="contact-link">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT DETAIL MODAL */}
      {selectedProject && (
        <div
          onClick={() => setSelectedProject(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'oklch(0.15 0.02 240 / 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 640,
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              background: 'oklch(1 0 0)',
              borderRadius: 6,
              padding: 36,
              position: 'relative',
            }}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setSelectedProject(null)}
              aria-label="닫기"
            >
              ✕
            </button>
            <div style={{ fontSize: 13, color: 'var(--accent)', marginBottom: 8 }}>
              {formatPeriod(selectedProject.startAt, selectedProject.endAt)}
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>
              {selectedProject.name}
            </h3>
            <p
              style={{
                fontSize: 14,
                color: 'oklch(0.5 0.015 245)',
                margin: '0 0 20px',
                textWrap: 'pretty',
              }}
            >
              {selectedProject.tagline}
            </p>
            <p
              style={{
                fontSize: 14,
                color: 'oklch(0.38 0.02 245)',
                margin: '0 0 20px',
                textWrap: 'pretty',
                whiteSpace: 'pre-wrap',
              }}
            >
              {selectedProject.content}
            </p>
            {selectedProject.highlights.length > 0 && (
              <ul
                style={{
                  margin: '0 0 24px',
                  paddingLeft: 20,
                  fontSize: 14,
                  color: 'oklch(0.38 0.02 245)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {selectedProject.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                marginBottom: selectedProject.links.length > 0 ? 20 : 0,
              }}
            >
              {selectedProject.tags.map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 11,
                    padding: '3px 8px',
                    background: 'oklch(0.96 0.006 240)',
                    borderRadius: 3,
                    color: 'oklch(0.45 0.02 245)',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            {selectedProject.links.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {selectedProject.links.map((l) => (
                  <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="modal-link">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

import type { ProjectResponse } from '../api/types';
import type { ResourceState } from '../hooks/useResource';
import { byStartDesc, formatPeriod } from '../lib/format';
import { Section, StatusText } from './Section';

export function Projects({ projects }: { projects: ResourceState<ProjectResponse[]> }) {
  const sorted = projects.data ? [...projects.data].sort(byStartDesc) : null;

  return (
    <Section id="projects" label="projects" title="Projects">
      {projects.loading && <StatusText>불러오는 중…</StatusText>}
      {projects.error && <StatusText>프로젝트 정보를 불러오지 못했습니다.</StatusText>}
      {sorted?.length === 0 && <StatusText>등록된 프로젝트가 없습니다.</StatusText>}

      {sorted && sorted.length > 0 && (
        <div className="projects">
          {sorted.map((project) => (
            <article key={project.id} className="project">
              <div className="project__head">
                <h3 className="project__name">{project.name}</h3>
              </div>
              <div className="project__period">
                {formatPeriod(project.startAt, project.endAt)}
              </div>
              <p className="project__tagline">{project.tagline}</p>

              <div className="project__body">
                <p className="project__content">{project.content}</p>

                {project.highlights.length > 0 && (
                  <ul className="hl">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}

                <div className="project__foot">
                  <div className="chips">
                    {project.tags.map((tag) => (
                      <span key={tag} className="chip chip--sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {project.links.length > 0 && (
                    <div className="project__links">
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          className="btn btn--sm"
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.label}
                          <span className="btn__arrow" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
}

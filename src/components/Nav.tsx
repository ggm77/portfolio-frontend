import { GITHUB_URL, navItems } from '../lib/profile';

interface NavProps {
  progress: number;
  activeId: string | null;
}

export function Nav({ progress, activeId }: NavProps) {
  return (
    <>
      <div
        className="progress"
        style={{ transform: `scaleX(${progress})` }}
        role="presentation"
      />
      <nav className="nav" aria-label="주요 섹션">
        <div className="container nav__inner">
          <a className="nav__brand" href="#top">
            <span className="nav__dot" aria-hidden="true" />
            ~/seohamin
          </a>
          <div className="nav__links">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav__link${activeId === item.id ? ' is-active' : ''}`}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="btn btn--sm nav__cta"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
            <span className="btn__arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </nav>
    </>
  );
}

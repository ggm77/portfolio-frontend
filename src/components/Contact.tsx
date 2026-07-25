import { contactLinks } from '../lib/profile';

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="contact">
          <div className="prompt contact__cmd">
            <span className="prompt__path">~/portfolio</span>
            <span className="prompt__sign">$</span>
            <span className="prompt__cmd">./contact.sh</span>
            <span className="caret" aria-hidden="true" />
          </div>
          <h2 className="contact__title">Let&apos;s talk</h2>
          <p className="contact__desc">협업, 채용, 질문 모두 환영합니다.</p>
          <div className="contact__actions">
            {contactLinks.map((link, i) => (
              <a
                key={link.label}
                className={`btn${i === 0 ? ' btn--primary' : ''}`}
                href={link.url}
                {...(link.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                {link.label}
                {link.external && (
                  <span className="btn__arrow" aria-hidden="true">
                    ↗
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  label: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, label, title, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="container">
        <header className="section__head">
          <span className="label">// {label}</span>
          <h2 className="h2">{title}</h2>
        </header>
        {children}
      </div>
    </section>
  );
}

export function StatusText({ children }: { children: ReactNode }) {
  return <p className="status-text">{children}</p>;
}

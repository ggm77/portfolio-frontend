import { useEffect, useState } from 'react';

interface ScrollNavState {
  /** 0–1 reading progress of the whole document. */
  progress: number;
  /** Id of the section currently occupying the viewport, or null near the top. */
  activeId: string | null;
}

/** Drives the top progress bar and the active-link highlight in the nav. */
export function useScrollNav(sectionIds: string[]): ScrollNavState {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? Math.min(doc.scrollTop / scrollable, 1) : 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Highlight the topmost section that is currently on screen.
        const current = sectionIds.find((id) => visible.has(id)) ?? null;
        setActiveId(current);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds]);

  return { progress, activeId };
}

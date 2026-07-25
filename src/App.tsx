import { getHistory, getMe, getProjects, getStacks } from './api/client';
import type { PreloadedState } from './api/types';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Timeline } from './components/Timeline';
import { useResource } from './hooks/useResource';
import { useScrollNav } from './hooks/useScrollNav';
import { navSectionIds } from './lib/profile';
import './App.css';

function App({ preloadedState }: { preloadedState?: PreloadedState } = {}) {
  const me = useResource(getMe, preloadedState?.me);
  const stacks = useResource(getStacks, preloadedState?.stacks);
  const projects = useResource(getProjects, preloadedState?.projects);
  const history = useResource(getHistory, preloadedState?.history);

  const { progress, activeId } = useScrollNav(navSectionIds);

  return (
    <div className="site">
      <Nav progress={progress} activeId={activeId} />
      <main>
        <Hero me={me} />
        <About me={me} />
        <Skills stacks={stacks} />
        <Projects projects={projects} />
        <Timeline history={history} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;

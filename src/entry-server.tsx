import { renderToString } from 'react-dom/server';
import App from './App';
import { getHistory, getMe, getProjects, getStacks } from './api/client';
import type { PreloadedState } from './api/types';

export async function render(): Promise<{ html: string; preloadedState: PreloadedState }> {
  const [meResult, stacksResult, projectsResult, historyResult] = await Promise.allSettled([
    getMe(),
    getStacks(),
    getProjects(),
    getHistory(),
  ]);

  const preloadedState: PreloadedState = {
    me: meResult.status === 'fulfilled' ? meResult.value : undefined,
    stacks: stacksResult.status === 'fulfilled' ? stacksResult.value : undefined,
    projects: projectsResult.status === 'fulfilled' ? projectsResult.value : undefined,
    history: historyResult.status === 'fulfilled' ? historyResult.value : undefined,
  };

  for (const result of [meResult, stacksResult, projectsResult, historyResult]) {
    if (result.status === 'rejected') {
      console.warn('[prerender] failed to fetch initial data:', result.reason);
    }
  }

  const html = renderToString(<App preloadedState={preloadedState} />);
  return { html, preloadedState };
}

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const { render } = await import(path.join(rootDir, 'dist-server/entry-server.js'));
const { html, preloadedState } = await render();

const indexPath = path.join(rootDir, 'dist/index.html');
let template = readFileSync(indexPath, 'utf-8');

if (!template.includes('<div id="root"></div>')) {
  throw new Error('[prerender] could not find #root mount point in dist/index.html');
}
template = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

const stateJson = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
const mainScriptTag = /<script type="module" crossorigin src="\/assets\/main-[^"]+\.js"><\/script>/;
if (!mainScriptTag.test(template)) {
  throw new Error('[prerender] could not find main entry script tag in dist/index.html');
}
template = template.replace(
  mainScriptTag,
  (match) => `<script>window.__PRELOADED_STATE__ = ${stateJson};</script>\n    ${match}`,
);

writeFileSync(indexPath, template);
console.log('[prerender] injected live data into dist/index.html');

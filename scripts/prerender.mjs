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

// Keep both the rendered markup and the hydration state inside <body>, right after
// #root, so bots/tools that only read <body> (and anything that truncates the raw
// HTML by length) see the real content instead of it being pushed down by <head>.
// The state script is a classic (non-module) script, so it still runs before the
// deferred main module script regardless of where that ends up in the document.
const stateJson = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
template = template.replace(
  '<div id="root"></div>',
  `<div id="root">${html}</div>\n    <script>window.__PRELOADED_STATE__ = ${stateJson};</script>`,
);

writeFileSync(indexPath, template);
console.log('[prerender] injected live data into dist/index.html');

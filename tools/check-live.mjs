import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root } from './validate-content.mjs';
import { outputFiles } from './files.mjs';

const base = new URL('https://mwill20.github.io/KC7-SecOps/');
// The official Pages action omits dotfiles; Actions publishing does not use Jekyll.
const published = outputFiles.filter(file => file !== '.nojekyll');
for (const file of published) {
  const response = await fetch(new URL(file === 'index.html' ? './' : file, base), {
    redirect: 'error', signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200, 'Live asset unavailable: ' + file);
  const mime = response.headers.get('content-type') || '';
  assert.match(mime, file.endsWith('.html') ? /text\/html/i : file.endsWith('.css') ? /text\/css/i : file.endsWith('.svg') ? /image\/svg\+xml/i : /(?:text|application)\/javascript/i, 'Unexpected MIME: ' + file);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), fs.readFileSync(path.join(root, 'dist', file)), 'Live asset differs from checked build: ' + file);
}
for (const file of ['package.json', '.env', 'docs/PRIVACY.md', 'site/app.js', 'tests/unit/state.test.mjs']) {
  const response = await fetch(new URL(file, base), { redirect: 'error', signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 404, 'Development file unexpectedly served: ' + file);
  await response.arrayBuffer();
}
console.log('Live Pages PASS: ' + published.length + ' byte-identical assets with expected MIME types; 5 development paths return 404.');

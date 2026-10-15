import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { root } from './validate-content.mjs';
import { outputFiles, runtimeFiles } from './files.mjs';
const dist = path.join(root, 'dist');
const walk = (dir, prefix = '') => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => { assert.ok(!e.isSymbolicLink(), 'Artifact symlink'); return e.isDirectory() ? walk(path.join(dir, e.name), prefix + e.name + '/') : [prefix + e.name]; });
assert.deepEqual(walk(dist).sort(), [...outputFiles].sort());
for (const file of runtimeFiles) assert.deepEqual(fs.readFileSync(path.join(dist, file)), fs.readFileSync(path.join(root, 'site', file)), 'Runtime source mismatch');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.doesNotMatch(html, /(?:src|href)=["'](?:https?:|\/\/|\/)/i);
for (const file of runtimeFiles.filter(f => f.endsWith('.js'))) {
  const text = fs.readFileSync(path.join(dist, file), 'utf8');
  for (const match of text.matchAll(/\bfrom\s+['"]([^'"]+)['"]/g)) {
    assert.ok(match[1].startsWith('./') || match[1].startsWith('../'));
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1])); assert.ok(outputFiles.includes(target), 'Unbundled module');
  }
}
console.log('Artifact allowlist and relative module graph verified: ' + outputFiles.length + ' static files.');

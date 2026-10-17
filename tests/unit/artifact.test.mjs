import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root } from '../../tools/validate-content.mjs';
test('T12 source shell has early restrictive CSP and relative local assets only', () => {
  const html = fs.readFileSync(path.join(root, 'site/index.html'), 'utf8');
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
  for (const directive of ["default-src 'none'", "connect-src 'none'", "form-action 'none'", "worker-src 'none'", "script-src 'self'", "style-src 'self'"]) assert.ok(html.includes(directive));
  const withoutPlayLink = html.replace('href="https://mwill20.github.io/KC7-SecOps/"', 'href="#course"');
  assert.notEqual(withoutPlayLink, html);
  assert.doesNotMatch(withoutPlayLink, /<script[^>]*>[^<\s]|\son\w+=|https?:\/\//);
});
test('T12 runtime modules have no execution/network/HTML sinks; IndexedDB is feedback-only', () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []);
  for (const name of walk(path.join(root, 'site'))) {
    const source = fs.readFileSync(name, 'utf8');
    assert.doesNotMatch(source, /\b(?:eval|fetch|WebSocket|XMLHttpRequest|Worker)\s*\(|new\s+Function|\.innerHTML|insertAdjacentHTML|document\.write|sessionStorage|sendBeacon|clipboard\.read|localStorage\.clear/);
    if (path.relative(path.join(root, 'site'), name).replaceAll('\\', '/') !== 'feedback/store.js') assert.doesNotMatch(source, /\bindexedDB\b/);
  }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { root } from '../../tools/validate-content.mjs';
test('T12 source shell has early restrictive CSP and relative local assets only', () => {
  const html = fs.readFileSync(path.join(root, 'site/index.html'), 'utf8');
  assert.ok(html.indexOf('Content-Security-Policy') < html.indexOf('<script'));
  for (const directive of ["default-src 'none'", "connect-src 'none'", "form-action 'none'", "worker-src 'none'", "script-src 'self'", "style-src 'self'"]) assert.ok(html.includes(directive));
  assert.doesNotMatch(html, /<script[^>]*>[^<\s]|\son\w+=|https?:\/\//);
});
test('T12 runtime modules have no execution sinks, storage expansion, network APIs or HTML sinks', () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.js') ? [path.join(dir, e.name)] : []);
  for (const name of walk(path.join(root, 'site'))) {
    const source = fs.readFileSync(name, 'utf8');
    assert.doesNotMatch(source, /\b(?:eval|fetch|WebSocket|XMLHttpRequest|Worker)\s*\(|new\s+Function|\.innerHTML|insertAdjacentHTML|document\.write|sessionStorage|indexedDB|sendBeacon|clipboard\.read|localStorage\.clear/);
  }
});

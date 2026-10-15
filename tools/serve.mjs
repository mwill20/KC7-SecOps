import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { root } from './validate-content.mjs';
import { runtimeFiles } from './files.mjs';
const allowed = new Set([...runtimeFiles, 'content.js']);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const port = Number(process.env.KC7_PORT ?? 4173);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PORT_INVALID');
const server = http.createServer((req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('Referrer-Policy', 'no-referrer'); res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let p;
  try { if (!req.url.startsWith('/') || req.url.includes('?') || req.url.includes('%') || req.url.includes('..') || req.url.includes('\\')) throw new Error(); p = req.url; } catch { res.writeHead(400); res.end(); return; }
  if (p.startsWith('/KC7-SecOps/')) p = p.slice('/KC7-SecOps'.length);
  const file = p === '/' ? 'index.html' : p.slice(1);
  if (!allowed.has(file)) { res.writeHead(404); res.end(); return; }
  const filename = path.join(root, 'dist', file);
  if (!fs.existsSync(filename)) { res.writeHead(404); res.end(); return; }
  res.setHeader('Content-Type', types[path.extname(file)]); res.writeHead(200);
  res.end(req.method === 'HEAD' ? undefined : fs.readFileSync(filename));
});
server.listen(port, '127.0.0.1', () => console.log('Local preview: http://127.0.0.1:' + port));
for (const event of ['SIGINT', 'SIGTERM']) process.on(event, () => server.close());

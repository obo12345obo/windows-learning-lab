const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400); res.end(); return; }
  const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  const relative = path.relative(root, file);
  const type = types[path.extname(file).toLowerCase()];
  if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(/[\\/]/).some(p => p.startsWith('.')) || !type) {
    res.writeHead(404); res.end('Not found'); return;
  }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type':type, 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'});
    res.end(req.method === 'HEAD' ? undefined : data);
  });
}).listen(8080, '127.0.0.1', () => console.log('Site running at http://localhost:8080 — Ctrl+C to stop.'));

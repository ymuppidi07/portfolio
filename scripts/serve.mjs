import { createServer } from 'node:http';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const projectRoot = resolve(fileURLToPath(new URL('../', import.meta.url)));
const buildScript = fileURLToPath(new URL('./build.mjs', import.meta.url));
const preferredPort = Number(process.argv[2] || process.env.PORT || 4173);
let port = preferredPort;
const liveReloadClients = new Set();
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf'
};

const runBuild = () => new Promise((resolveBuild) => {
  const child = spawn(process.execPath, [buildScript], {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  child.once('exit', (code) => resolveBuild(code === 0));
  child.once('error', () => resolveBuild(false));
});

let buildRunning = false;
let buildPending = false;
let rebuildTimer;

const rebuild = async () => {
  if (buildRunning) {
    buildPending = true;
    return;
  }
  buildRunning = true;
  do {
    buildPending = false;
    const succeeded = await runBuild();
    if (succeeded) {
      console.log('Change detected — browser refreshed.');
      for (const client of liveReloadClients) client.write('data: reload\n\n');
    } else {
      console.error('Build failed — fix the reported content error and save again.');
    }
  } while (buildPending);
  buildRunning = false;
};

const scheduleRebuild = () => {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(rebuild, 120);
};

if (!await runBuild()) process.exit(1);

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname === '/__live-reload') {
      response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
      });
      response.write(': connected\n\n');
      liveReloadClients.add(response);
      request.on('close', () => liveReloadClients.delete(response));
      return;
    }
    const decoded = decodeURIComponent(url.pathname);
    const safePath = normalize(decoded).replace(/^[/\\]+/, '').replace(/^(\.\.[/\\])+/, '');
    let filePath = resolve(join(root, safePath));
    const fileLower = filePath.toLowerCase();
    const rootLower = root.toLowerCase();
    if (fileLower !== rootLower && !fileLower.startsWith(`${rootLower}${sep}`)) throw new Error('Invalid path');
    const info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) filePath = join(filePath, 'index.html');
    if (!info && !extname(filePath)) filePath = join(filePath, 'index.html');
    const data = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': types[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    response.end(data);
  } catch {
    const notFound = await readFile(join(root, '404', 'index.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(notFound);
  }
});

const watchers = ['content', 'site', 'public'].map((directory) => watch(
  join(projectRoot, directory),
  { recursive: true },
  scheduleRebuild
));

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < preferredPort + 10) {
    port += 1;
    server.listen(port, '127.0.0.1');
    return;
  }
  console.error(`Could not start the live preview: ${error.message}`);
  stop();
});

server.on('listening', () => {
  console.log(`Live portfolio: http://127.0.0.1:${port}`);
  console.log('Saving content, styles, scripts, or media will rebuild and refresh the browser.');
});

server.listen(port, '127.0.0.1');

const stop = () => {
  clearTimeout(rebuildTimer);
  watchers.forEach((watcher) => watcher.close());
  for (const client of liveReloadClients) client.end();
  server.close(() => process.exit(0));
};

process.on('SIGINT', stop);
process.on('SIGTERM', stop);

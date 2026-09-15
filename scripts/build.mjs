import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const fromRoot = (path) => new URL(path, root);
const dist = fromRoot('dist/');
const distPath = fileURLToPath(dist);
const template = await readFile(fromRoot('site/template.html'), 'utf8');
const projects = JSON.parse(await readFile(fromRoot('content/projects.json'), 'utf8'));

const pages = [
  { path: '', page: 'home', title: 'Yashwanth Muppidi — Mechanical Engineer' },
  { path: 'work', page: 'work', title: 'Work — Yashwanth Muppidi' },
  { path: 'work/zipline', page: 'zipline', title: 'Zipline — Yashwanth Muppidi' },
  { path: 'experience', page: 'experience', title: 'Experience — Yashwanth Muppidi' },
  { path: 'about', page: 'about', title: 'About — Yashwanth Muppidi' },
  { path: '404', page: '404', title: 'Not Found — Yashwanth Muppidi' }
];

for (const project of projects.filter((item) => item.status === 'visible')) {
  pages.push({
    path: project.group === 'zipline' ? `work/zipline/${project.slug}` : `work/${project.slug}`,
    page: 'project',
    slug: project.slug,
    title: `${project.title} — Yashwanth Muppidi`
  });
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

await Promise.all([
  cp(fromRoot('content/'), fromRoot('dist/content/'), { recursive: true }),
  cp(fromRoot('public/'), fromRoot('dist/'), { recursive: true }),
  mkdir(fromRoot('dist/assets/'), { recursive: true })
]);

await Promise.all([
  cp(fromRoot('site/app.js'), fromRoot('dist/assets/app.js')),
  cp(fromRoot('site/styles.css'), fromRoot('dist/assets/styles.css')),
  cp(fromRoot('site/favicon.svg'), fromRoot('dist/assets/favicon.svg'))
]);

for (const entry of pages) {
  const html = template
    .replaceAll('{{TITLE}}', entry.title)
    .replaceAll('{{PAGE}}', entry.page)
    .replaceAll('{{SLUG}}', entry.slug || '');
  const output = entry.path ? join(distPath, entry.path, 'index.html') : join(distPath, 'index.html');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html);
}

console.log(`Built ${pages.length} routes in dist/`);

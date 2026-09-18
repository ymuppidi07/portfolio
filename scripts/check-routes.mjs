import { readFile } from 'node:fs/promises';

const projects = JSON.parse(await readFile(new URL('../content/projects.json', import.meta.url), 'utf8'));
const routes = ['/', '/projects/', '/work/', '/experience/', '/assets/Yashwanth_Muppidi_Resume.pdf'];
const baseUrl = process.argv[2] || 'http://127.0.0.1:4173';

for (const project of projects.filter((item) => item.status === 'visible' && item.group !== 'zipline')) {
  routes.push(`/projects/${project.slug}/`, `/work/${project.slug}/`);
}

const results = await Promise.all(routes.map(async (route) => {
  const response = await fetch(`${baseUrl}${route}`);
  return { route, status: response.status, ok: response.ok };
}));

const failures = results.filter((result) => !result.ok);
for (const result of results) console.log(`${result.status} ${result.route}`);
if (failures.length) process.exitCode = 1;

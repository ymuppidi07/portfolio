const root = document.documentElement;
const body = document.body;
const main = document.querySelector('#main');
const header = document.querySelector('#site-header');
const footer = document.querySelector('#site-footer');

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const pathForProject = (project) => project.group === 'zipline'
  ? `/work/zipline/${project.slug}/`
  : `/work/${project.slug}/`;

const arrow = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>`;

const loadData = async () => {
  const [siteResponse, projectResponse] = await Promise.all([
    fetch('/content/site.json'),
    fetch('/content/projects.json')
  ]);
  if (!siteResponse.ok || !projectResponse.ok) throw new Error('Content could not be loaded.');
  return { site: await siteResponse.json(), projects: await projectResponse.json() };
};

const renderHeader = (site) => {
  const page = body.dataset.page;
  const workActive = ['home', 'work', 'project', 'zipline'].includes(page);
  header.innerHTML = `
    <div class="nav-shell">
      <a class="brand" href="/" aria-label="${escapeHtml(site.name)} — home">
        <span class="brand-mark">${escapeHtml(site.shortName)}</span>
        <span class="brand-name">${escapeHtml(site.name)}</span>
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">
        <span class="menu-label">Menu</span><span class="menu-lines" aria-hidden="true"></span>
      </button>
      <nav id="site-nav" aria-label="Main navigation">
        <a ${workActive ? 'aria-current="page"' : ''} href="/work/">Work</a>
        <a ${page === 'experience' ? 'aria-current="page"' : ''} href="/experience/">Experience</a>
        <a ${page === 'about' ? 'aria-current="page"' : ''} href="/about/">About</a>
        <a class="nav-resume" href="${escapeHtml(site.resume)}" target="_blank" rel="noreferrer">Resume ${arrow}</a>
      </nav>
    </div>`;

  const toggle = header.querySelector('.menu-toggle');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('menu-open', !expanded);
  });
  header.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    body.classList.remove('menu-open');
  }));
};

const renderFooter = (site) => {
  footer.innerHTML = `
    <div class="footer-main">
      <p>Have a hardware problem worth solving?</p>
      <a class="footer-email" href="${escapeHtml(site.contact)}" target="_blank" rel="noreferrer">Get in touch ${arrow}</a>
    </div>
    <div class="footer-meta">
      <span>© ${new Date().getFullYear()} ${escapeHtml(site.name)}</span>
      <span>${escapeHtml(site.location)}</span>
      <a href="${escapeHtml(site.linkedin)}" target="_blank" rel="noreferrer">LinkedIn ↗</a>
    </div>`;
};

const projectCard = (project, size = 'standard') => `
  <a class="project-card project-card--${size}" href="${pathForProject(project)}">
    <div class="project-card__visual" aria-hidden="true">
      <span class="visual-index">${String(project.priority).padStart(2, '0')}</span>
      <span class="visual-axis">X&nbsp;&nbsp;Y&nbsp;&nbsp;Z</span>
      <div class="visual-crosshair"></div>
      <div class="visual-track"><i></i><i></i><i></i></div>
    </div>
    <div class="project-card__body">
      <div class="project-card__meta"><span>${escapeHtml(project.organization)}</span><span>${escapeHtml(project.year)}</span></div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <span class="text-link">View case study ${arrow}</span>
    </div>
  </a>`;

const renderHome = (site, projects) => {
  const visible = projects.filter((item) => item.status === 'visible');
  const nemo = visible.find((item) => item.slug === 'nemo');
  const featured = visible.filter((item) => item.featured && item.slug !== 'nemo').sort((a, b) => a.priority - b.priority);
  const additional = visible.filter((item) => item.group === 'additional').sort((a, b) => a.priority - b.priority);
  const zipline = visible.filter((item) => item.group === 'zipline').sort((a, b) => a.priority - b.priority);

  main.innerHTML = `
    <section class="hero section-dark">
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-kicker"><span>Portfolio / 2026</span><span>West Lafayette, IN</span></div>
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(site.eyebrow)}</p>
        <h1><span>Yashwanth</span><span>Muppidi</span></h1>
        <p class="hero-statement">${escapeHtml(site.headline)}</p>
      </div>
      <div class="hero-spec">
        <span class="hero-spec__label">Focus</span>
        <ul>${site.disciplines.map((item, index) => `<li><span>0${index + 1}</span>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
      <div class="hero-scroll" aria-hidden="true"><span></span>Selected work</div>
    </section>

    <section class="selected section-light page-pad">
      <div class="section-heading reveal">
        <div><span class="section-number">01</span><p class="eyebrow">Selected Work</p></div>
        <h2>Engineering in motion.</h2>
        <p>Robotic systems, wearable mechanisms, aircraft, and field hardware—shown through the decisions that made them work.</p>
      </div>
      <div class="feature-wrap reveal">
        ${projectCard(nemo, 'flagship')}
      </div>
      <div class="project-grid reveal">
        ${featured.map((project) => projectCard(project)).join('')}
      </div>
    </section>

    <section class="zipline-section section-blue page-pad">
      <div class="section-heading section-heading--inverse reveal">
        <div><span class="section-number">02</span><p class="eyebrow">Professional Work</p></div>
        <h2>Zipline</h2>
        <p>Mechanical engineering work for autonomous aircraft operations. Case studies remain intentionally bounded to public, approved information.</p>
      </div>
      <div class="zipline-role reveal">
        <div><span>Role</span><strong>Mechanical Engineering Intern</strong></div>
        <div><span>Location</span><strong>South San Francisco, CA</strong></div>
        <div><span>Focus</span><strong>Hardware · Test · Deployment</strong></div>
      </div>
      <div class="zipline-list reveal">
        ${zipline.map((project, index) => `
          <a href="${pathForProject(project)}">
            <span class="zipline-index">0${index + 1}</span>
            <span><strong>${escapeHtml(project.title)}</strong><small>${escapeHtml(project.summary)}</small></span>
            ${arrow}
          </a>`).join('')}
      </div>
    </section>

    <section class="additional section-light page-pad">
      <div class="section-heading section-heading--compact reveal">
        <div><span class="section-number">03</span><p class="eyebrow">Additional Work</p></div>
        <h2>Early builds, lasting lessons.</h2>
      </div>
      <div class="additional-grid reveal">
        ${additional.map((project) => `
          <a class="additional-card" href="${pathForProject(project)}">
            <span>${escapeHtml(project.year)}</span>
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
            ${arrow}
          </a>`).join('')}
      </div>
      <a class="button-link reveal" href="/work/">View all work ${arrow}</a>
    </section>`;
};

const renderWork = (site, projects) => {
  const visible = projects.filter((item) => item.status === 'visible');
  const mainProjects = visible.filter((item) => item.group === 'projects').sort((a, b) => a.priority - b.priority);
  const zipline = visible.filter((item) => item.group === 'zipline').sort((a, b) => a.priority - b.priority);
  const additional = visible.filter((item) => item.group === 'additional').sort((a, b) => a.priority - b.priority);
  main.innerHTML = `
    <section class="page-hero section-dark page-pad">
      <p class="eyebrow">Work / Selected Projects</p>
      <h1>Machines are judged<br />in the physical world.</h1>
      <p>${escapeHtml(site.intro)}</p>
    </section>
    <section class="work-index section-light page-pad">
      <div class="index-label"><span>01</span><h2>Projects</h2><p>Research, team, personal, and academic engineering.</p></div>
      <div class="work-stack">${mainProjects.map((project, index) => projectCard(project, index === 0 ? 'flagship' : 'standard')).join('')}</div>
    </section>
    <section class="work-index section-ink page-pad">
      <div class="index-label"><span>02</span><h2>Zipline</h2><p>Professional work, organized as one collection.</p></div>
      <div class="work-stack">${zipline.map((project) => projectCard(project)).join('')}</div>
    </section>
    <section class="work-index section-light page-pad">
      <div class="index-label"><span>03</span><h2>Additional Work</h2><p>Earlier projects that established the foundation.</p></div>
      <div class="additional-grid">${additional.map((project) => `
        <a class="additional-card" href="${pathForProject(project)}"><span>${escapeHtml(project.year)}</span><h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.summary)}</p>${arrow}</a>`).join('')}</div>
    </section>`;
};

const renderExperience = (site) => {
  main.innerHTML = `
    <section class="page-hero page-hero--light page-pad">
      <p class="eyebrow">Experience</p>
      <h1>Hardware, developed<br />close to the system.</h1>
      <p>Professional and team experience across autonomous aircraft, surgical robotics, medical devices, and humanoid systems.</p>
    </section>
    <section class="experience-list page-pad section-light">
      ${site.experience.map((item, index) => `
        <article class="experience-item reveal">
          <div class="experience-index">${String(index + 1).padStart(2, '0')}</div>
          <div class="experience-title"><h2>${escapeHtml(item.company)}</h2><p>${escapeHtml(item.role)}</p></div>
          <div class="experience-details">
            <div class="experience-meta"><span>${escapeHtml(item.dates)}</span><span>${escapeHtml(item.location)}</span></div>
            <p>${escapeHtml(item.summary)}</p>
            <ul>${item.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join('')}</ul>
            ${item.link ? `<a class="text-link" href="${item.link}">Related work ${arrow}</a>` : ''}
          </div>
        </article>`).join('')}
      <article class="education-card reveal">
        <span>Education</span><h2>${escapeHtml(site.education.school)}</h2><p>${escapeHtml(site.education.program)}</p><strong>${escapeHtml(site.education.dates)}</strong>
      </article>
    </section>`;
};

const renderAbout = (site) => {
  main.innerHTML = `
    <section class="about-hero section-dark page-pad">
      <p class="eyebrow">About</p>
      <h1>Mechanical thinking.<br />System-level view.</h1>
      <div class="about-copy">${site.about.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</div>
    </section>
    <section class="principles section-light page-pad">
      <div class="section-heading section-heading--compact"><div><span class="section-number">01</span><p class="eyebrow">Approach</p></div><h2>How I work</h2></div>
      <div class="principles-grid">${site.principles.map((item, index) => `<article class="reveal"><span>0${index + 1}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join('')}</div>
      <div class="about-contact reveal"><p>Currently based at Purdue University in West Lafayette, Indiana.</p><a class="button-link" href="${escapeHtml(site.contact)}" target="_blank" rel="noreferrer">Start a conversation ${arrow}</a></div>
    </section>`;
};

const renderMedia = (media = [], label = 'Project media') => {
  if (!media.length) return `
    <div class="media-ready" role="img" aria-label="${escapeHtml(label)} area ready for approved media">
      <div class="media-ready__axis"><span>+Y</span><span>+X</span></div>
      <div class="media-ready__mark"></div>
      <p><span>Media system</span>CAD · photography · test · video</p>
    </div>`;
  return `<div class="media-grid">${media.map((item) => {
    if (item.type === 'video') return `<figure><video src="${escapeHtml(item.src)}" ${item.autoplay ? 'autoplay muted loop playsinline' : 'controls'}></video>${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ''}</figure>`;
    return `<figure><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}" loading="lazy" />${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ''}</figure>`;
  }).join('')}</div>`;
};

const renderSection = (section) => {
  const items = section.items || [];
  let bodyContent = '';
  if (section.layout === 'diagram') {
    bodyContent = `<div class="system-diagram">${items.map((item, index) => `<div><span>0${index + 1}</span><strong>${escapeHtml(item)}</strong></div>`).join('')}</div>`;
  } else if (section.layout === 'steps') {
    bodyContent = `<ol class="process-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`;
  } else if (['media', 'gallery', 'split'].includes(section.layout)) {
    bodyContent = renderMedia(section.media || [], section.title);
  } else if (section.layout === 'results' && items.length) {
    bodyContent = `<div class="results-grid">${items.map((item) => `<div><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join('')}</div>`;
  }
  return `<section class="case-section page-pad">
    <div class="case-section__index">${escapeHtml(section.index)}</div>
    <div class="case-section__copy"><p class="eyebrow">${escapeHtml(section.title)}</p><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p></div>
    <div class="case-section__content">${bodyContent}</div>
  </section>`;
};

const renderProject = (projects) => {
  const slug = body.dataset.slug;
  const project = projects.find((item) => item.slug === slug);
  if (!project || project.status !== 'visible') return renderNotFound();
  const visible = projects.filter((item) => item.status === 'visible');
  const currentIndex = visible.findIndex((item) => item.slug === slug);
  const next = visible[(currentIndex + 1) % visible.length];
  main.innerHTML = `
    <article class="case-study">
      <header class="case-hero section-dark page-pad">
        <div class="case-hero__top"><a href="${project.group === 'zipline' ? '/work/zipline/' : '/work/'}">← ${project.group === 'zipline' ? 'Zipline collection' : 'All work'}</a><span>${escapeHtml(project.year)}</span></div>
        <p class="eyebrow">${escapeHtml(project.organization)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="case-lede">${escapeHtml(project.lede)}</p>
        <div class="case-meta"><div><span>Role</span><strong>${escapeHtml(project.role)}</strong></div><div><span>Tools</span><strong>${project.tools.map(escapeHtml).join(' · ')}</strong></div></div>
        ${project.confidential ? '<p class="confidential-note">Selected professional work · public information only</p>' : ''}
        ${renderMedia(project.media, `${project.title} media`)}
      </header>
      ${project.sections.map(renderSection).join('')}
      <nav class="next-project page-pad" aria-label="Next project"><span>Next project</span><a href="${pathForProject(next)}"><strong>${escapeHtml(next.title)}</strong>${arrow}</a></nav>
    </article>`;
};

const renderZipline = (projects) => {
  const items = projects.filter((item) => item.group === 'zipline' && item.status === 'visible').sort((a, b) => a.priority - b.priority);
  main.innerHTML = `
    <section class="collection-hero section-blue page-pad">
      <p class="eyebrow">Professional Work / 2026</p>
      <h1>Zipline</h1>
      <p>Mechanical engineering for hardware that operates in the field. Project pages are structured to communicate process and engineering value while respecting confidential boundaries.</p>
      <div class="collection-meta"><span>Mechanical Engineering Internship</span><span>South San Francisco, CA</span></div>
    </section>
    <section class="collection-projects section-light page-pad">
      <div class="index-label"><span>Selected</span><h2>Project collection</h2><p>Replace the provisional titles and summaries with approved language when ready.</p></div>
      <div class="work-stack">${items.map((item) => projectCard(item, 'standard')).join('')}</div>
    </section>`;
};

const renderNotFound = () => {
  main.innerHTML = `<section class="not-found section-dark page-pad"><p class="eyebrow">404</p><h1>That assembly is off the bench.</h1><a class="button-link" href="/work/">Return to work ${arrow}</a></section>`;
};

const initReveal = () => {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
};

try {
  const { site, projects } = await loadData();
  renderHeader(site);
  renderFooter(site);
  const page = body.dataset.page;
  if (page === 'home') renderHome(site, projects);
  else if (page === 'work') renderWork(site, projects);
  else if (page === 'experience') renderExperience(site);
  else if (page === 'about') renderAbout(site);
  else if (page === 'project') renderProject(projects);
  else if (page === 'zipline') renderZipline(projects);
  else renderNotFound();
  initReveal();
} catch (error) {
  console.error(error);
  main.innerHTML = `<section class="not-found section-dark page-pad"><p class="eyebrow">Content error</p><h1>The portfolio could not be loaded.</h1><p>Run the site through the local preview command rather than opening the HTML file directly.</p></section>`;
}

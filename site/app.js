const body = document.body;
const main = document.querySelector('#main');
const header = document.querySelector('#site-header');
const footer = document.querySelector('#site-footer');

if (['127.0.0.1', 'localhost'].includes(window.location.hostname) && 'EventSource' in window) {
  const liveReload = new EventSource('/__live-reload');
  liveReload.addEventListener('message', (event) => {
    if (event.data === 'reload') window.location.reload();
  });
}

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const arrow = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 5l5 5-5 5"/></svg>`;
const pathForProject = (project) => `/projects/${project.slug}/`;

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
        <a ${page === 'home' ? 'aria-current="page"' : ''} href="/">Home</a>
        <a ${['projects', 'project'].includes(page) ? 'aria-current="page"' : ''} href="/projects/">Projects</a>
        <a ${page === 'experience' ? 'aria-current="page"' : ''} href="/experience/">Experience</a>
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
      <p>${escapeHtml(site.footer.prompt)}</p>
      <a class="footer-email" href="${escapeHtml(site.contact)}" target="_blank" rel="noreferrer">${escapeHtml(site.footer.cta)} ${arrow}</a>
    </div>
    <div class="footer-meta">
      <span>© ${new Date().getFullYear()} ${escapeHtml(site.name)}</span>
      <span>${escapeHtml(site.location)}</span>
      <a href="${escapeHtml(site.linkedin)}" target="_blank" rel="noreferrer">LinkedIn ↗</a>
    </div>`;
};

const projectVisual = (project) => {
  if (project.cover?.src) {
    return `<div class="project-card__visual project-card__visual--image is-empty" data-optional-image>
      <span class="project-card__placeholder">${escapeHtml(project.placeholder || 'Project image not added')}</span>
      <img src="${escapeHtml(project.cover.src)}" alt="${escapeHtml(project.cover.alt || '')}" loading="eager" hidden />
      <span class="visual-index">${String(project.priority).padStart(2, '0')}</span>
    </div>`;
  }
  return `<div class="project-card__visual project-card__visual--empty" aria-label="${escapeHtml(project.placeholder || 'Project image not added')}">
    <span class="visual-index">${String(project.priority).padStart(2, '0')}</span>
    <span class="project-card__placeholder">${escapeHtml(project.placeholder || 'Project media / To be added')}</span>
  </div>`;
};

const projectCard = (project, size = 'standard') => {
  const meta = [project.organization, project.year].filter(Boolean);
  return `<a class="project-card project-card--${size} project-card--${escapeHtml(project.slug)}" href="${pathForProject(project)}">
    ${projectVisual(project)}
    <div class="project-card__body">
      ${meta.length ? `<div class="project-card__meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>` : ''}
      <h2>${escapeHtml(project.title)}</h2>
      <p>${escapeHtml(project.summary)}</p>
      <span class="text-link">Open project ${arrow}</span>
    </div>
  </a>`;
};

const renderHome = (site) => {
  const home = site.home;
  main.innerHTML = `
    <section class="hero section-dark">
      ${home.heroMedia?.src ? `<div class="hero-media"><img src="${escapeHtml(home.heroMedia.src)}" alt="${escapeHtml(home.heroMedia.alt || '')}" /></div>` : ''}
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="hero-kicker"><span>${escapeHtml(home.portfolioLabel)}</span><span>${escapeHtml(home.locationLabel)}</span></div>
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(site.eyebrow)}</p>
        <h1>${home.heroName.map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</h1>
        <p class="hero-statement">${escapeHtml(site.headline)}</p>
      </div>
      <aside class="hero-about" aria-label="Profile and projects">
        <div class="hero-about__portrait is-empty" data-optional-image>
          <span>${escapeHtml(home.profileImage?.placeholder || 'Profile photo')}</span>
          ${home.profileImage?.src ? `<img src="${escapeHtml(home.profileImage.src)}" alt="${escapeHtml(home.profileImage.alt || '')}" loading="eager" hidden />` : ''}
        </div>
        <div class="hero-about__content">
          <h2>${escapeHtml(home.aboutTitle)}</h2>
          ${home.aboutText ? `<p>${escapeHtml(home.aboutText)}</p>` : ''}
          <a class="button-link button-link--primary" href="/projects/">${escapeHtml(home.primaryCta)} ${arrow}</a>
        </div>
      </aside>
    </section>`;
};

const renderProjects = (site, projects) => {
  const visible = projects
    .filter((item) => item.status === 'visible' && item.group !== 'zipline')
    .sort((a, b) => a.priority - b.priority);
  main.innerHTML = `
    <div class="projects-page section-light">
      <section class="projects-index page-pad" aria-label="Engineering projects">
        ${visible.map((project) => projectCard(project, 'standard')).join('')}
      </section>
    </div>`;
};

const renderExperience = (site) => {
  main.innerHTML = `
    <section class="experience-list experience-list--standalone page-pad section-light" aria-label="Experience">
      ${site.experience.map((item, index) => `
        <article class="experience-item reveal">
          <div class="experience-index">${String(index + 1).padStart(2, '0')}</div>
          <div class="experience-title">
            <div class="experience-logo is-empty" data-optional-image>
              <span>${escapeHtml(item.logo?.placeholder || 'Logo')}</span>
              ${item.logo?.src ? `<img src="${escapeHtml(item.logo.src)}" alt="${escapeHtml(item.logo.alt || '')}" loading="eager" hidden />` : ''}
            </div>
            <div><h2>${escapeHtml(item.company)}</h2><p>${escapeHtml(item.role)}</p></div>
          </div>
          <div class="experience-details">
            <div class="experience-meta"><span>${escapeHtml(item.dates)}</span>${item.location ? `<span>${escapeHtml(item.location)}</span>` : ''}</div>
            <p>${escapeHtml(item.summary)}</p>
            ${item.link ? `<a class="text-link" href="${escapeHtml(item.link)}">Related project ${arrow}</a>` : ''}
          </div>
        </article>`).join('')}
      <article class="education-card reveal">
        <span>Education</span><h2>${escapeHtml(site.education.school)}</h2><p>${escapeHtml(site.education.program)}</p><strong>${escapeHtml(site.education.dates)}</strong>
      </article>
    </section>`;
};

const renderMedia = (media = [], label = 'Project media') => {
  if (!media.length) return `
    <div class="media-ready" role="img" aria-label="${escapeHtml(label)} has not been added">
      <p><span>No image added</span>Project media can be added from the content file</p>
    </div>`;
  return `<div class="media-grid">${media.map((item) => {
    if (item.type === 'video') return `<figure><video src="${escapeHtml(item.src)}" ${item.autoplay ? 'autoplay muted loop playsinline' : 'controls'}></video>${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ''}</figure>`;
    return `<figure class="media-item media-item--image is-empty" data-optional-image>
      <span class="media-item__placeholder">No image added</span>
      <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}" loading="eager" hidden />
      ${item.caption ? `<figcaption>${escapeHtml(item.caption)}</figcaption>` : ''}
    </figure>`;
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

const renderWorkInProgressProject = (project) => {
  main.innerHTML = `
    <article class="project-placeholder-page">
      <header class="case-hero wip-hero section-dark page-pad">
        <div class="case-hero__top"><a href="/projects/">← All projects</a><span>${escapeHtml(project.year)}</span></div>
        <p class="eyebrow">${escapeHtml(project.organization)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="case-lede">${escapeHtml(project.summary)}</p>
        <div class="wip-status"><span>${escapeHtml(project.placeholder || 'Work in Progress')}</span></div>
      </header>
    </article>`;
};

const renderStoryMedia = (media, className = '') => {
  if (!media?.src) return '';
  return `<figure class="story-media media-item media-item--image is-empty ${className}" data-optional-image>
    <span class="media-item__placeholder">Image to be added</span>
    <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || '')}" loading="eager" hidden />
    ${media.caption ? `<figcaption>${escapeHtml(media.caption)}</figcaption>` : ''}
  </figure>`;
};

const renderNemoMedia = (media, className = '') => {
  if (!media?.src) return '';
  if (media.type === 'video') return `<figure class="nemo-media nemo-media--video ${className}">
    <video src="${escapeHtml(media.src)}" preload="metadata" muted loop playsinline controls data-autoplay-video></video>
    ${media.caption ? `<figcaption>${escapeHtml(media.caption)}</figcaption>` : ''}
  </figure>`;
  return `<figure class="nemo-media media-item media-item--image is-empty ${className}" data-optional-image>
    <span class="media-item__placeholder">Image to be added</span>
    <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt || '')}" loading="lazy" hidden />
    ${media.caption ? `<figcaption>${escapeHtml(media.caption)}</figcaption>` : ''}
  </figure>`;
};

const renderNemoProject = (project, projects) => {
  const story = project.nemoStory || {};
  const visible = projects
    .filter((item) => item.status === 'visible' && item.group !== 'zipline')
    .sort((a, b) => a.priority - b.priority);
  const currentIndex = visible.findIndex((item) => item.slug === project.slug);
  const next = visible[(currentIndex + 1) % visible.length];
  const meta = [];
  if (project.role) meta.push(`<div><span>Focus</span><strong>${escapeHtml(project.role)}</strong></div>`);
  if (project.tools?.length) meta.push(`<div><span>Tools</span><strong>${project.tools.map(escapeHtml).join(' · ')}</strong></div>`);
  const stats = (story.stats || []).map((item) => `<div><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span></div>`).join('');
  const mediaGroup = (media = [], className = '') => media.map((item, index) => renderNemoMedia(item, `${className} ${index === 0 ? 'is-primary' : ''}`)).join('');
  const architecture = story.architecture || {};
  const engineering = story.engineering || {};
  const testing = story.testing || {};
  const locomotion = story.locomotion || {};
  main.innerHTML = `
    <article class="case-study nemo-story">
      <header class="case-hero section-dark page-pad">
        <div class="case-hero__top"><a href="/projects/">← All projects</a><span>${escapeHtml(project.year)}</span></div>
        <p class="eyebrow">${escapeHtml(project.organization)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="case-lede">${escapeHtml(project.lede)}</p>
        ${meta.length ? `<div class="case-meta">${meta.join('')}</div>` : ''}
        ${stats ? `<div class="nemo-stats">${stats}</div>` : ''}
        <div class="nemo-hero-media">${renderNemoMedia(story.heroMedia)}</div>
      </header>

      <section class="nemo-section nemo-architecture page-pad">
        <div class="nemo-section__copy">
          <p class="eyebrow">${escapeHtml(architecture.eyebrow || '')}</p>
          <h2>${escapeHtml(architecture.title || '')}</h2>
          <p>${escapeHtml(architecture.text || '')}</p>
        </div>
        <div class="nemo-architecture__media">${mediaGroup(architecture.media)}</div>
      </section>

      <section class="nemo-section nemo-engineering page-pad">
        <article class="nemo-engineering__column">
          <div class="nemo-section__copy">
            <p class="eyebrow">${escapeHtml(engineering.analysis?.eyebrow || '')}</p>
            <h2>${escapeHtml(engineering.analysis?.title || '')}</h2>
            <p>${escapeHtml(engineering.analysis?.text || '')}</p>
          </div>
          <div class="nemo-pair">${mediaGroup(engineering.analysis?.media)}</div>
        </article>
        <article class="nemo-engineering__column">
          <div class="nemo-section__copy">
            <p class="eyebrow">${escapeHtml(engineering.upperBody?.eyebrow || '')}</p>
            <h2>${escapeHtml(engineering.upperBody?.title || '')}</h2>
            <p>${escapeHtml(engineering.upperBody?.text || '')}</p>
          </div>
          <div class="nemo-pair">${mediaGroup(engineering.upperBody?.media)}</div>
        </article>
      </section>

      <section class="nemo-section nemo-testing page-pad">
        <div class="nemo-section__copy">
          <p class="eyebrow">${escapeHtml(testing.eyebrow || '')}</p>
          <h2>${escapeHtml(testing.title || '')}</h2>
          <p>${escapeHtml(testing.text || '')}</p>
        </div>
        <div class="nemo-testing__media">${renderNemoMedia(testing.image)}${renderNemoMedia(testing.video, 'nemo-media--result')}</div>
      </section>

      <section class="nemo-section nemo-locomotion page-pad">
        <div class="nemo-section__copy">
          <p class="eyebrow">${escapeHtml(locomotion.eyebrow || '')}</p>
          <h2>${escapeHtml(locomotion.title || '')}</h2>
          <p>${escapeHtml(locomotion.text || '')}</p>
        </div>
        ${renderNemoMedia(locomotion.video, 'nemo-media--payoff')}
      </section>

      <nav class="next-project page-pad" aria-label="Next project"><span>Next project</span><a href="${pathForProject(next)}"><strong>${escapeHtml(next.title)}</strong>${arrow}</a></nav>
    </article>`;
};

const renderNarrativeProject = (project, projects) => {
  const story = project.narrative || {};
  const meta = [];
  const visible = projects
    .filter((item) => item.status === 'visible' && item.group !== 'zipline')
    .sort((a, b) => a.priority - b.priority);
  const currentIndex = visible.findIndex((item) => item.slug === project.slug);
  const next = visible[(currentIndex + 1) % visible.length];
  if (project.role) meta.push(`<div><span>Focus</span><strong>${escapeHtml(project.role)}</strong></div>`);
  if (project.tools?.length) meta.push(`<div><span>Tools</span><strong>${project.tools.map(escapeHtml).join(' · ')}</strong></div>`);
  const block = (name, className, fallbackMediaClass) => {
    const item = story[name];
    if (!item) return '';
    const mediaClass = item.mediaClass || fallbackMediaClass;
    const textOnly = item.layout === 'text-only';
    const visuals = item.secondaryMedia
      ? `<div class="story-media-pair">${renderStoryMedia(item.media, mediaClass)}${renderStoryMedia(item.secondaryMedia, mediaClass)}</div>`
      : renderStoryMedia(item.media, mediaClass);
    return `<section class="story-block ${className}${textOnly ? ' story-block--text-only' : ''} page-pad">
      <div class="story-copy">
        ${item.eyebrow ? `<p class="eyebrow">${escapeHtml(item.eyebrow)}</p>` : ''}
        ${item.title ? `<h2>${escapeHtml(item.title)}</h2>` : ''}
        ${item.text ? `<p>${escapeHtml(item.text)}</p>` : ''}
      </div>
      ${textOnly ? '' : visuals}
    </section>`;
  };
  main.innerHTML = `
    <article class="case-study narrative-project project-story--${escapeHtml(project.slug)}">
      <header class="case-hero section-dark page-pad">
        <div class="case-hero__top"><a href="/projects/">← All projects</a><span>${escapeHtml(project.year)}</span></div>
        <p class="eyebrow">${escapeHtml(project.organization)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="case-lede">${escapeHtml(project.lede)}</p>
        ${meta.length ? `<div class="case-meta">${meta.join('')}</div>` : ''}
        ${story.heroMedia ? `<div class="story-hero-media">${renderStoryMedia(story.heroMedia, story.heroMediaClass || 'story-media--hero')}</div>` : ''}
      </header>
      ${block('intro', 'story-block--intro', 'story-media--portrait')}
      ${block('mechanism', 'story-block--mechanism', 'story-media--cad')}
      ${block('integration', 'story-block--integration', 'story-media--wearable')}
      <nav class="next-project page-pad" aria-label="Next project"><span>Next project</span><a href="${pathForProject(next)}"><strong>${escapeHtml(next.title)}</strong>${arrow}</a></nav>
    </article>`;
};

const renderProject = (projects) => {
  const slug = body.dataset.slug;
  const project = projects.find((item) => item.slug === slug);
  if (!project || project.status !== 'visible') return renderNotFound();
  if (project.projectState === 'work-in-progress') return renderWorkInProgressProject(project);
  if (project.pageLayout === 'nemo') return renderNemoProject(project, projects);
  if (project.pageLayout === 'narrative') return renderNarrativeProject(project, projects);

  const visible = projects
    .filter((item) => item.status === 'visible' && item.group !== 'zipline')
    .sort((a, b) => a.priority - b.priority);
  const currentIndex = visible.findIndex((item) => item.slug === slug);
  const next = visible[(currentIndex + 1) % visible.length];
  const meta = [];
  if (project.role) meta.push(`<div><span>Role</span><strong>${escapeHtml(project.role)}</strong></div>`);
  if (project.tools?.length) meta.push(`<div><span>Tools</span><strong>${project.tools.map(escapeHtml).join(' · ')}</strong></div>`);

  main.innerHTML = `
    <article class="case-study">
      <header class="case-hero section-dark page-pad">
        <div class="case-hero__top"><a href="/projects/">← All projects</a><span>${escapeHtml(project.year)}</span></div>
        <p class="eyebrow">${escapeHtml(project.organization)}</p>
        <h1>${escapeHtml(project.title)}</h1>
        <p class="case-lede">${escapeHtml(project.lede)}</p>
        ${meta.length ? `<div class="case-meta">${meta.join('')}</div>` : ''}
        ${renderMedia(project.media, `${project.title} media`)}
      </header>
      ${project.sections.map(renderSection).join('')}
      <nav class="next-project page-pad" aria-label="Next project"><span>Next project</span><a href="${pathForProject(next)}"><strong>${escapeHtml(next.title)}</strong>${arrow}</a></nav>
    </article>`;
};

const renderNotFound = () => {
  main.innerHTML = `<section class="not-found section-dark page-pad"><p class="eyebrow">404</p><h1>That assembly is off the bench.</h1><a class="button-link" href="/projects/">View projects ${arrow}</a></section>`;
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

const initOptionalImages = () => {
  document.querySelectorAll('[data-optional-image]').forEach((frame) => {
    const image = frame.querySelector('img');
    if (!image) return;
    const showImage = () => {
      image.hidden = false;
      frame.classList.remove('is-empty');
    };
    const showPlaceholder = () => {
      image.hidden = true;
      frame.classList.add('is-empty');
    };
    image.addEventListener('load', showImage, { once: true });
    image.addEventListener('error', showPlaceholder, { once: true });
    if (image.complete) (image.naturalWidth ? showImage : showPlaceholder)();
  });
};

const initAutoplayVideos = () => {
  const videos = document.querySelectorAll('[data-autoplay-video]');
  if (!videos.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.play().catch(() => {});
    else entry.target.pause();
  }), { threshold: 0.55 });
  videos.forEach((video) => observer.observe(video));
};

try {
  const { site, projects } = await loadData();
  renderHeader(site);
  renderFooter(site);
  const page = body.dataset.page;
  if (page === 'home') renderHome(site);
  else if (page === 'projects') renderProjects(site, projects);
  else if (page === 'experience') renderExperience(site);
  else if (page === 'project') renderProject(projects);
  else renderNotFound();
  initOptionalImages();
  initAutoplayVideos();
  initReveal();
} catch (error) {
  console.error(error);
  main.innerHTML = `<section class="not-found section-dark page-pad"><p class="eyebrow">Content error</p><h1>The portfolio could not be loaded.</h1><p>Run the site through the local preview command rather than opening the HTML file directly.</p></section>`;
}

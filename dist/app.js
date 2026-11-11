let data = window.PORTFOLIO;
if (new URLSearchParams(location.search).get('preview') === 'draft') {
  try { const draft = JSON.parse(localStorage.getItem('portfolio-draft-v1')); if (draft && Array.isArray(draft.doors) && Array.isArray(draft.roles) && Array.isArray(draft.timeline)) data = draft; } catch {}
}
const $ = selector => document.querySelector(selector);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('[data-name]').forEach(el => { el.textContent = data.name; });
document.title = `${data.name} — Portfolio`;
$('#intro').textContent = data.intro;
$('#copyright-year').textContent = new Date().getFullYear();
document.querySelectorAll('.wordmark').forEach(brand => { const existing = brand.querySelector('.brand-logo'); if (existing) { existing.src = data.logo || 'images/branding/usman-logo-128.webp'; return; } const logo = document.createElement('img'); logo.src = data.logo || 'usman-dev-logo.png'; logo.alt = 'Usman Dev logo'; logo.className = 'brand-logo'; logo.width = 56; logo.height = 56; brand.prepend(logo); });
if (data.photo) { const portrait = $('#portrait'); if (data.photo !== portrait.getAttribute('src')) { portrait.removeAttribute('srcset'); portrait.removeAttribute('sizes'); portrait.src = data.photo; } portrait.alt = `Portrait of ${data.name}`; $('.portrait-label').hidden = true; }
for (let i = 0; i < 14; i++) $('.spirals').append(document.createElement('i'));
const roles = data.roles.length ? data.roles : ['Web Developer'];
let roleIndex = 0;
$('#role').textContent = roles[0];
setInterval(() => {
  if (document.hidden || reducedMotion.matches || roles.length < 2) return;
  $('#role').classList.add('switching');
  setTimeout(() => { roleIndex = (roleIndex + 1) % roles.length; $('#role').textContent = roles[roleIndex]; $('#role').classList.remove('switching'); }, 330);
}, 2400);
let manualTheme = false;
let currentTheme = null;
function setTheme(dark) { if (currentTheme === dark) return; currentTheme = dark; $('.hero').classList.toggle('dark-hero', dark); $('.theme-toggle').setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme'); }
$('.theme-toggle').addEventListener('click', () => { manualTheme = true; setTheme(!$('.hero').classList.contains('dark-hero')); });
const menu = $('.menu-toggle');
function closeMenu() { $('#navigation').classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = $('#navigation').classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
$('#navigation').querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
function textElement(tag, className, text) { const el = document.createElement(tag); el.className = className; el.textContent = text; return el; }
function safeUrl(value) { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; } }
function safeImage(value) { return typeof value === 'string' && /^images\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..') ? value : safeUrl(value); }
if (data.whatsapp && /^\+?[0-9]{8,15}$/.test(data.whatsapp)) { const url = `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`; const profile = (data.links || []).find(link => link.label === 'WhatsApp'); if (profile) profile.url = url; }
for (const target of ['#hero-socials', '#contact-socials']) {
  $(target).replaceChildren();
  (data.links || []).forEach(profile => { const url = safeUrl(profile.url); if (!url) return; const link = textElement('a', '', `${profile.label} ↗`); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; $(target).append(link); });
}
(data.skills || []).forEach((skill, index) => { const card = document.createElement('article'); card.append(textElement('span', 'skill-index', String(index + 1).padStart(2, '0')), textElement('h3', '', skill.name), textElement('p', '', skill.description)); $('#skills-grid').append(card); });
data.doors.flatMap(door => door.projects).forEach(project => {
  const repo = safeUrl(project.github), live = safeUrl(project.url); if (!repo && !live) return;
  const card = document.createElement('article');
  const cover = safeImage(project.image); if (cover) { const image = document.createElement('img'); image.src = cover; image.alt = `${project.title} — source-based project overview`; image.className = 'featured-cover'; image.width = 1600; image.height = 900; image.loading = 'lazy'; card.append(image); }
  card.append(textElement('span', 'project-type', project.type), textElement('h3', '', project.title), textElement('p', '', project.description));
  const links = document.createElement('div'); links.className = 'project-links';
  [[repo, 'GitHub source ↗'], [live, 'Live website ↗']].forEach(([url, label]) => { if (!url) return; const a = textElement('a', '', label); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; links.append(a); });
  card.append(links); $('#featured-projects').append(card);
  if (Array.isArray(project.gallery) && project.gallery.length) { const button = textElement('button', 'gallery-button', `View ${project.gallery.length} project visuals ↗`); button.addEventListener('click', () => showWork(data.doors.findIndex(door => door.projects.includes(project)))); card.append(button); }
});
if (new URLSearchParams(location.search).get('preview') === 'draft') { const banner = textElement('div', 'draft-banner', 'DRAFT PREVIEW · Only visible in this browser. Export from Studio to publish.'); document.body.prepend(banner); }
const dialog = $('#work-dialog');
function monitor(visual) {
  const el = document.createElement('div'); el.className = 'monitor'; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<div class="monitor-screen"><div class="mini-nav"><span>STUDIO®</span><span>WORK · ABOUT · CONTACT</span></div><div class="mini-circle"></div><div class="mini-heading"></div></div><div class="monitor-stem"></div><div class="monitor-foot"></div>';
  const titles = { editorial: 'SPACES<br>THAT<br>INSPIRE.', portfolio: 'PRODUCT<br>DESIGNER', dashboard: 'Your overview.', app: 'A little more<br>organized.', poster: 'MAKE<br>IT<br>MATTER.' };
  el.querySelector('.mini-heading').innerHTML = titles[visual] || titles.editorial;
  if (visual === 'dashboard') { el.querySelector('.mini-heading').style.cssText = 'font-size:18px;top:40px;left:20px;text-align:left'; el.querySelector('.mini-circle').remove(); const bars = document.createElement('div'); bars.className = 'mini-bars'; bars.innerHTML = '<i></i><i></i><i></i><i></i><i></i>'; el.querySelector('.monitor-screen').append(bars); }
  return el;
}
function showWork(index) {
  const door = data.doors[index];
  $('#work-number').textContent = String(index + 1).padStart(2, '0');
  $('#work-title').textContent = door.title;
  $('#work-description').textContent = door.description;
  $('#work-projects').replaceChildren();
  door.projects.forEach(project => {
    const article = document.createElement('article'); article.className = 'project-card';
    article.classList.add(['editorial', 'portfolio', 'dashboard', 'app', 'poster'].includes(project.visual) ? project.visual : 'editorial');
    const copy = document.createElement('div');
    copy.append(textElement('span', 'project-type', project.type), textElement('h3', '', project.title), textElement('p', '', project.description));
    const url = safeUrl(project.url);
    const repoUrl = safeUrl(project.github);
    const projectLinks = document.createElement('div'); projectLinks.className = 'project-links';
    if (url) { const link = textElement('a', '', /video/i.test(project.type) ? 'Watch video ↗' : 'Live project ↗'); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; projectLinks.append(link); }
    if (repoUrl) { const link = textElement('a', '', 'GitHub source ↗'); link.href = repoUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; projectLinks.append(link); }
    if (!url && !repoUrl) copy.append(textElement('span', 'sample', 'PROJECT DETAILS COMING SOON'));
    copy.append(projectLinks);
    if (safeImage(project.image)) { const image = document.createElement('img'); image.src = safeImage(project.image); image.alt = project.title + ' — documentation overview'; image.className = 'project-image'; image.width = 1600; image.height = 900; image.loading = 'lazy'; article.append(copy, image); }
    else article.append(copy, monitor(project.visual));
    if (Array.isArray(project.gallery) && project.gallery.length) {
      const gallery = document.createElement('div'); gallery.className = 'project-gallery'; gallery.append(textElement('p', 'gallery-label', 'PROJECT VISUAL GUIDE · Documentation graphics, not runtime screenshots.'));
      project.gallery.forEach(item => { const src = safeImage(item.src); if (!src) return; const figure = document.createElement('figure'); const link = document.createElement('a'); link.href = src; link.target = '_blank'; link.rel = 'noopener noreferrer'; const img = document.createElement('img'); img.src = src; img.alt = `${project.title} — ${item.caption}`; img.loading = 'lazy'; img.width = 1600; img.height = 900; link.append(img); figure.append(link, textElement('figcaption', '', item.caption)); gallery.append(figure); }); article.append(gallery);
    }
    $('#work-projects').append(article);
  });
  if (!door.projects.length) $('#work-projects').append(textElement('p', 'work-description', 'New projects are on the way. Explore my GitHub for current work.'));
  dialog.showModal(); dialog.scrollTop = 0; document.body.style.overflow = 'hidden';
}
data.doors.forEach((door, index) => {
  const item = document.createElement('div'); item.className = 'door-item';
  const button = document.createElement('button'); button.className = 'door-button'; button.setAttribute('aria-label', `Open ${door.title} projects`); button.setAttribute('aria-haspopup', 'dialog');
  button.innerHTML = '<span class="door-frame"><span class="door-inside"><span>STEP INSIDE<br>↗</span></span></span><span class="door-slab"><span class="door-plaque"></span><span class="door-knob"></span><span class="door-number"></span></span>';
  if (['blue', 'charcoal', 'sage', 'orange'].includes(door.color)) button.classList.add(door.color);
  button.querySelector('.door-plaque').textContent = door.title;
  button.querySelector('.door-number').textContent = String(index + 1).padStart(2, '0');
  button.addEventListener('click', () => showWork(index));
  const info = document.createElement('div'); info.className = 'door-info'; info.setAttribute('aria-hidden', 'true');
  info.append(textElement('h3', '', door.title)); const list = document.createElement('ul'); door.services.forEach(service => list.append(textElement('li', '', service))); info.append(list, textElement('span', '', door.note));
  item.append(button, info); $('#doors').append(item);
});
$('#close-work').addEventListener('click', () => dialog.close());
$('.bottom-back').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
data.timeline.forEach((chapter, index) => {
  const section = document.createElement('div'); section.className = 'year-chapter'; section.id = `chapter-${index}`; section.dataset.year = chapter.year;
  section.append(textElement('p', 'chapter-year', `${chapter.year} / YOUR JOURNEY`));
  chapter.entries.forEach(entry => { const article = document.createElement('article'); article.className = 'timeline-entry'; article.append(textElement('p', 'entry-label', entry.label), textElement('h3', '', entry.title), textElement('p', '', entry.description)); section.append(article); });
  $('#timeline').append(section);
  const tab = textElement('button', index === 0 ? 'active' : '', chapter.year); tab.setAttribute('aria-label', `Go to ${chapter.year}`); tab.addEventListener('click', () => section.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' })); $('#year-tabs').append(tab);
});
const chapters = [...document.querySelectorAll('.year-chapter')];
const tabs = [...$('#year-tabs').children];
let activeChapter = -1;
function updateScroll() {
  if (!manualTheme) setTheme(window.scrollY > window.innerHeight * .18);
  let current = 0;
  const line = window.innerWidth <= 650 ? 360 : window.innerHeight * .55;
  chapters.forEach((chapter, i) => { if (chapter.getBoundingClientRect().top < line) current = i; });
  if (chapters[current] && current !== activeChapter) { activeChapter = current; $('#year-display').textContent = chapters[current].dataset.year; tabs.forEach((tab, i) => { tab.classList.toggle('active', i === current); tab.setAttribute('aria-pressed', String(i === current)); }); }
}
let ticking = false;
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { updateScroll(); ticking = false; }); } }, { passive: true });
window.addEventListener('resize', updateScroll); updateScroll();
const emailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
const missingEmail = 'Contact details are coming soon. Add your email in content.js to connect.';
const githubProfile = (data.links || []).find(profile => { const url = safeUrl(profile.url); return url && new URL(url).hostname === 'github.com'; });
const contactDetails = document.createElement('div'); contactDetails.className = 'contact-details';
if (emailValid()) { const link = textElement('a', '', data.email); link.href = `mailto:${data.email}`; contactDetails.append(link); }
if (data.whatsapp && /^\+?[0-9]{8,15}$/.test(data.whatsapp)) { const link = textElement('a', '', `WhatsApp ${data.whatsapp}`); link.href = `https://wa.me/${data.whatsapp.replace(/\D/g, '')}`; link.target = '_blank'; link.rel = 'noopener noreferrer'; contactDetails.append(link); }
$('.contact-actions').after(contactDetails);
if (!emailValid()) { $('#copy-email').hidden = true; if (githubProfile) { $('#contact-button').textContent = 'Connect on GitHub '; $('#contact-button').append(textElement('span', '', '↗')); } }
$('#contact-button').addEventListener('click', () => { if (emailValid()) location.href = `mailto:${encodeURIComponent(data.email)}`; else if (githubProfile) window.open(safeUrl(githubProfile.url), '_blank', 'noopener,noreferrer'); else $('#contact-status').textContent = missingEmail; });
$('#copy-email').addEventListener('click', async () => { if (!emailValid()) { $('#contact-status').textContent = missingEmail; return; } try { await navigator.clipboard.writeText(data.email); $('#contact-status').textContent = 'Email copied. Let’s make something happen.'; } catch { $('#contact-status').textContent = `Email: ${data.email}`; } });

if (data.about) { $('#about-heading').textContent = data.about.heading; $('#about-summary').textContent = data.about.summary; for (const [key,label] of [['location','Based in'],['education','Education'],['languages','Languages']]) { if (!data.about[key]) continue; $('#about-facts').append(textElement('dt','',label),textElement('dd','',data.about[key])); } } else $('#about').hidden = true;
if (typeof data.resume === 'string' && (/^documents\/[a-zA-Z0-9_-]+\.pdf$/.test(data.resume) || safeUrl(data.resume))) { for (const target of ['.hero-actions','.contact-actions']) { const link = $(target).querySelector('.resume-link') || textElement('a','resume-link','Download CV ↓'); link.href = data.resume; link.download = 'Usman-Abid-CV.pdf'; if (!link.isConnected) $(target).append(link); } }

if (!(typeof data.resume === 'string' && (/^documents\/[a-zA-Z0-9_-]+\.pdf$/.test(data.resume) || safeUrl(data.resume)))) document.querySelectorAll('.resume-link').forEach(link => link.remove());

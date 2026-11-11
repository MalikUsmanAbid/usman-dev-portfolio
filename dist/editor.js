'use strict';
const storageKey = 'portfolio-draft-v1';
const status = document.querySelector('#status');
const clone = value => JSON.parse(JSON.stringify(value));
let model = clone(window.PORTFOLIO);
function validModel(value) {
  const string = v => typeof v === 'string' && v.length <= 20000;
  const array = v => Array.isArray(v) && v.length <= 100;
  return value && typeof value === 'object' && string(value.name) && string(value.intro) && string(value.photo) && string(value.email)
    && array(value.roles) && value.roles.every(string) && array(value.links) && value.links.every(x => x && string(x.label) && string(x.url))
    && array(value.skills) && value.skills.every(x => x && string(x.name) && string(x.description))
    && array(value.doors) && value.doors.length > 0 && value.doors.every(x => x && string(x.title) && string(x.color) && string(x.note) && string(x.description) && array(x.services) && x.services.every(string) && array(x.projects) && x.projects.every(p => p && ['title', 'description', 'type', 'visual', 'url'].every(k => string(p[k])) && (p.github === undefined || string(p.github)) && (p.image === undefined || string(p.image)) && (p.gallery === undefined || (array(p.gallery) && p.gallery.every(g => g && string(g.src) && string(g.caption))))))
    && array(value.timeline) && value.timeline.every(x => x && string(x.year) && array(x.entries) && x.entries.every(e => e && ['title', 'label', 'description'].every(k => string(e[k]))));
}
function message(text, error = false) { status.textContent = text; status.classList.toggle('notice-error', error); }
try { const draft = JSON.parse(localStorage.getItem(storageKey)); if (validModel(draft)) { model = draft; message('Your saved browser draft is loaded.'); } } catch { message('Browser storage is unavailable. You can still edit and download your content.', true); }
function node(tag, className, text) { const el = document.createElement(tag); el.className = className; if (text) el.textContent = text; return el; }
function checkUrl(input, allowAsset = false) {
  input.setCustomValidity(''); if (!input.value) return;
  if (allowAsset && /^images\/[a-zA-Z0-9_./-]+$/.test(input.value) && !input.value.includes('..')) return;
  try { const url = new URL(input.value); if (!['http:', 'https:'].includes(url.protocol)) throw Error(); }
  catch { input.setCustomValidity('Enter a complete https:// or http:// URL.'); }
}
function field(label, object, key, options = {}) {
  const wrap = node('label', options.wide ? 'wide' : '', label);
  let input;
  if (options.select) { input = document.createElement('select'); options.select.forEach(value => { const option = document.createElement('option'); option.value = value; option.textContent = value; input.append(option); }); }
  else { input = document.createElement(options.multiline ? 'textarea' : 'input'); if (options.multiline) input.rows = 3; else input.type = options.url && !options.asset ? 'url' : 'text'; input.maxLength = options.multiline ? 3000 : 2000; }
  input.value = object[key] || ''; input.required = Boolean(options.required);
  input.addEventListener('input', () => { object[key] = input.value; if (options.url) checkUrl(input, options.asset); message('Unsaved changes. Save a browser draft or download your updated content.'); });
  if (options.url) { checkUrl(input, options.asset); input.addEventListener('blur', () => checkUrl(input, options.asset)); }
  wrap.append(input); return wrap;
}
function removeButton(action, label) { const button = node('button', 'remove', 'Remove'); button.type = 'button'; button.setAttribute('aria-label', label); button.addEventListener('click', () => { action(); renderLists(); message('Item removed from this draft. Save or download when ready.'); }); return button; }
function renderLists() {
  const links = document.querySelector('#links'); links.replaceChildren();
  model.links.forEach((profile, i) => { const entry = node('div', 'entry'); const heading = node('div', 'entry-heading'); heading.append(node('h3', '', `Profile link ${i + 1}`), removeButton(() => model.links.splice(i, 1), `Remove profile link ${i + 1}`)); const fields = node('div', 'fields'); fields.append(field('Label', profile, 'label', { required: true }), field('Profile URL', profile, 'url', { url: true, required: true })); entry.append(heading, fields); links.append(entry); });
  if (!model.links.length) links.append(node('p', 'empty', 'Add GitHub, LinkedIn or another profile you want visitors to see.'));
  const skills = document.querySelector('#skills'); skills.replaceChildren();
  model.skills.forEach((skill, i) => { const entry = node('div', 'entry'); const heading = node('div', 'entry-heading'); heading.append(node('h3', '', `Skill ${i + 1}`), removeButton(() => model.skills.splice(i, 1), `Remove skill ${i + 1}`)); const fields = node('div', 'fields'); fields.append(field('Skill name', skill, 'name', { required: true }), field('Short description', skill, 'description')); entry.append(heading, fields); skills.append(entry); });
  if (!model.skills.length) skills.append(node('p', 'empty', 'Add your first skill.'));
  const categories = document.querySelector('#categories'); categories.replaceChildren();
  model.doors.forEach((door, doorIndex) => {
    const category = node('div', 'category'); const title = node('div', 'category-heading'); const add = node('button', '', '+ Add project'); add.type = 'button'; add.setAttribute('aria-label', `Add project to ${door.title}`);
    add.addEventListener('click', () => { if (door.projects.length >= 100) { message('Keep each category under 100 projects.', true); return; } door.projects.push({ title: '', description: '', type: 'PERSONAL PROJECT', visual: 'editorial', url: '', github: '', image: '' }); renderLists(); message('New project added. Fill in its details, then save.'); });
    title.append(node('h3', '', door.title), add); category.append(title);
    const categoryFields = node('div', 'fields'); categoryFields.append(field('Category name', door, 'title', { required: true }), field('Category introduction', door, 'description')); category.append(categoryFields);
    door.projects.forEach((project, i) => { const entry = node('div', 'entry'); const heading = node('div', 'entry-heading'); heading.append(node('h3', '', `Project ${i + 1}`), removeButton(() => model.doors[doorIndex].projects.splice(i, 1), `Remove project ${i + 1} from ${door.title}`)); const fields = node('div', 'fields'); fields.append(field('Project title', project, 'title', { required: true }), field('Project type / technologies', project, 'type'), field('Description', project, 'description', { multiline: true, wide: true }), field('Live website URL (optional)', project, 'url', { url: true }), field('GitHub repository URL (optional)', project, 'github', { url: true }), field('Image URL or website asset path (optional)', project, 'image', { url: true, asset: true }), field('Fallback preview style', project, 'visual', { select: ['editorial', 'portfolio', 'dashboard', 'app', 'poster'] })); entry.append(heading, fields); category.append(entry); });
    if (!door.projects.length) category.append(node('p', 'empty', 'No projects here yet. Add your next project to this door.'));
    categories.append(category);
  });
}
function renderProfile() { ['name', 'intro', 'email', 'photo', 'whatsapp', 'logo', 'resume'].forEach(key => { document.querySelector('#' + key).value = model[key] || ''; }); }
['name', 'intro', 'email', 'photo', 'whatsapp', 'logo', 'resume'].forEach(key => document.querySelector('#' + key).addEventListener('input', event => { model[key] = event.target.value; message('Unsaved changes. Save a browser draft or download your updated content.'); }));
function validate() { if (!document.querySelector('#studio').reportValidity()) { message('Please complete required fields and check your links.', true); return false; } if (!validModel(model)) { message('This content is incomplete or too large. Check the fields and try again.', true); return false; } return true; }
function save() { if (!validate()) return false; try { localStorage.setItem(storageKey, JSON.stringify(model)); message('Draft saved in this browser. The published website is unchanged.'); return true; } catch { message('Could not save in this browser. Download a JSON backup or content.js to keep your changes.', true); return false; } }
document.querySelector('#studio').addEventListener('submit', event => { event.preventDefault(); save(); });
document.querySelector('#add-link').addEventListener('click', () => { if (model.links.length >= 100) return; model.links.push({ label: '', url: '' }); renderLists(); message('Profile link added. Enter its label and URL.'); });
document.querySelector('#add-skill').addEventListener('click', () => { if (model.skills.length >= 100) return; model.skills.push({ name: '', description: '' }); renderLists(); message('Skill added. Enter its name and description.'); });
document.querySelector('#preview').addEventListener('click', () => { if (save()) window.open('index.html?preview=draft', '_blank', 'noopener'); });
function download(filename, text, type) { const url = URL.createObjectURL(new Blob([text], { type })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
document.querySelector('#download').addEventListener('click', () => { if (!validate()) return; download('content.js', '// Generated by Portfolio Studio. Replace dist/content.js and deploy to publish.\nwindow.PORTFOLIO = ' + JSON.stringify(model, null, 2) + ';\n', 'text/javascript'); message('content.js downloaded. Replace it in your website folder and deploy to publish these changes.'); });
document.querySelector('#backup').addEventListener('click', () => { if (!validate()) return; download('portfolio-backup.json', JSON.stringify(model, null, 2), 'application/json'); message('JSON backup downloaded. Import it in Studio on another device.'); });
document.querySelector('#import').addEventListener('change', async event => { const file = event.target.files[0]; if (!file) return; try { if (file.size > 500000) throw Error('Backup is too large. Maximum size is 500 KB.'); const imported = JSON.parse(await file.text()); if (!validModel(imported)) throw Error('This is not a valid Portfolio Studio backup.'); model = imported; renderProfile(); renderLists(); message('Backup imported for review. Save the draft or download content.js when ready.'); } catch (error) { message(error.message || 'Could not import the backup.', true); } finally { event.target.value = ''; } });
renderProfile(); renderLists();

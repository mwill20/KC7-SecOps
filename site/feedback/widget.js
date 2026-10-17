import { CATEGORIES, LIMITS, prepareImage, readFeedback, saveFeedback, deleteFeedback, exportFeedback } from './store.js';
const node = (tag, text, cls) => { const el = document.createElement(tag); if (text !== undefined) el.textContent = text; if (cls) el.className = cls; return el; };
const add = (parent, ...children) => { parent.append(...children); return parent; };
const button = (text, action, id) => { const b = node('button', text); b.type = 'button'; if (id) b.id = id; b.addEventListener('click', action); return b; };
export function mountFeedback(root, getContext) {
  const opener = button('Feedback & ideas', open, 'feedback-open');
  const dialog = node('dialog', undefined, 'feedback-dialog'); dialog.setAttribute('aria-labelledby', 'feedback-title');
  const heading = node('h2', 'Feedback & upgrade ideas'); heading.id = 'feedback-title';
  const status = node('p', '', 'small'); status.id = 'feedback-status'; status.setAttribute('role', 'status');
  const context = node('p', '', 'small muted');
  const textLabel = node('label', 'What should change? Paste a screenshot here too.'); textLabel.htmlFor = 'feedback-text';
  const text = node('textarea'); text.id = 'feedback-text'; text.rows = 5; text.maxLength = LIMITS.text; text.spellcheck = false; text.autocomplete = 'off'; text.autocapitalize = 'off'; text.setAttribute('autocorrect', 'off');
  const categoryLabel = node('label', 'Feedback type'); categoryLabel.htmlFor = 'feedback-category';
  const category = node('select'); category.id = 'feedback-category'; for (const value of CATEGORIES) { const option = node('option', value); option.value = value; category.append(option); }
  const preview = node('div', undefined, 'feedback-images'); preview.id = 'feedback-images';
  const saved = node('div'); saved.id = 'feedback-saved';
  let draftContext = null, images = [], imageUrls = [], busy = false;
  const urls = new Set();
  const message = value => { status.textContent = value; };
  const lockDraft = locked => { text.disabled = locked; category.disabled = locked; preview.querySelectorAll('button').forEach(b => { b.disabled = locked; }); };
  const revoke = list => { for (const url of list) { URL.revokeObjectURL(url); urls.delete(url); } };
  function showImages() {
    revoke(imageUrls); imageUrls = []; preview.replaceChildren();
    images.forEach((image, i) => {
      const url = URL.createObjectURL(image.blob); urls.add(url); imageUrls.push(url);
      const img = node('img'); img.src = url; img.alt = 'Pasted screenshot ' + (i + 1); img.width = image.width; img.height = image.height;
      preview.append(add(node('figure'), img, button('Remove screenshot ' + (i + 1), () => { images.splice(i, 1); showImages(); })));
    });
  }
  function draftRecord() {
    return { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...draftContext, category: category.value, text: text.value, screenshots: [...images] };
  }
  async function download(entries) {
    try {
      const raw = await exportFeedback(entries), url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
      const a = node('a'); a.href = url; a.download = 'KC7-SecOps-feedback-' + new Date().toISOString().slice(0, 10) + '.json'; dialog.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      message('Export downloaded. Attach that file in a later project chat for review; this site did not upload it.');
    } catch { message('Could not export. Keep the draft open and remove any unsupported or oversized images.'); }
  }
  async function refreshSaved() {
    revoke([...urls].filter(url => !imageUrls.includes(url)));
    saved.replaceChildren(node('p', 'Loading saved feedback…'));
    try {
      const entries = await readFeedback(); saved.replaceChildren(node('h3', entries.length + ' saved in this browser'));
      saved.append(button('Export saved feedback', () => download(entries), 'feedback-export'));
      if (!entries.length) saved.append(node('p', 'No saved feedback yet.', 'small muted'));
      for (const r of entries) {
        const entry = node('article', undefined, 'feedback-entry');
        add(entry, node('h4', r.pageId + ' · ' + r.category), node('p', new Date(r.createdAt).toLocaleString(), 'small muted'), node('p', r.text, 'feedback-note'));
        for (const [i, screenshot] of r.screenshots.entries()) {
          const url = URL.createObjectURL(screenshot.blob); urls.add(url);
          const img = node('img'); img.src = url; img.alt = 'Saved screenshot ' + (i + 1) + ' for ' + r.pageId; img.width = screenshot.width; img.height = screenshot.height; entry.append(img);
        }
        entry.append(button('Delete this feedback', () => {
          const confirm = node('div', undefined, 'row');
          add(confirm, node('span', 'Delete this saved entry permanently?'), button('Delete permanently', async () => {
            try { await deleteFeedback(r.id); message('Feedback deleted from this browser.'); await refreshSaved(); } catch { message('Could not delete feedback. The entry was left in storage.'); }
          }), button('Cancel', () => confirm.remove())); entry.append(confirm);
        }));
        saved.append(entry);
      }
    } catch { saved.replaceChildren(node('p', 'Saved feedback is unavailable or exceeds course storage limits. Your draft can still be exported.', 'notice')); }
  }
  async function open() {
    if (!text.value && !images.length) draftContext = getContext();
    context.textContent = 'Page: ' + draftContext.pageId + (draftContext.contentVersion ? ' · lesson version ' + draftContext.contentVersion : '');
    if (!dialog.open) dialog.showModal();
    text.focus(); await refreshSaved();
  }
  text.addEventListener('paste', async event => {
    const files = [...(event.clipboardData?.items ?? [])].filter(x => x.kind === 'file').map(x => x.getAsFile()).filter(Boolean);
    if (!files.length) return;
    event.preventDefault();
    if (busy || files.length + images.length > LIMITS.images) { message('Up to three screenshots per feedback entry.'); return; }
    busy = true; save.disabled = true;
    try {
      const accepted = [];
      for (const file of files) accepted.push(await prepareImage(file));
      images.push(...accepted); showImages(); message('Screenshot pasted into this draft. Review it before saving.');
    } catch { message('Image rejected. Use a valid PNG, JPEG or WebP up to 2 MiB and 8 million pixels. SVG/HTML and other files are not accepted.'); }
    finally { busy = false; save.disabled = false; }
  });
  const save = button('Save feedback in this browser', async () => {
    if (busy) return;
    busy = true; save.disabled = true; lockDraft(true);
    try {
      await saveFeedback(draftRecord()); text.value = ''; images = []; draftContext = getContext(); showImages();
      context.textContent = 'Page: ' + draftContext.pageId; message('Saved in this browser. Export saved feedback when you want to share it for course updates.'); await refreshSaved();
    } catch (error) {
      message(error?.message === 'FEEDBACK_INVALID' ? 'Add a comment or screenshot first.' : error?.message === 'FEEDBACK_CAPACITY' ? 'Feedback storage is full (50 entries or 10 MiB). Export it, then delete entries you no longer need. This draft is still here.' : 'Browser storage is unavailable. This draft is still here; Export draft keeps a copy.');
    } finally { busy = false; save.disabled = false; lockDraft(false); }
  }, 'feedback-save'); save.className = 'primary';
  add(dialog, add(node('div', undefined, 'row between'), heading, button('Close feedback', () => dialog.close(), 'feedback-close')),
    node('p', 'Save course feedback and sanitized platform/error screenshots here. No internal identifiers, logs or results. Nothing is uploaded automatically.', 'small'),
    node('p', 'Saved only in this browser on this device; clearing site data can remove it. Export a copy and attach it in a later chat so we can retrieve and act on it.', 'small muted'),
    context, categoryLabel, category, textLabel, text,
    node('p', 'Paste with Ctrl+V / Cmd+V while the feedback box is focused. Up to 3 images, 2 MiB each. Review screenshots and their metadata before sharing.', 'small muted'),
    preview, add(node('div', undefined, 'row'), save, button('Export draft', () => download([draftRecord()]), 'feedback-export-draft')), status, saved);
  root.append(opener, dialog);
  window.addEventListener('pagehide', event => { if (!event.persisted) revoke([...urls]); });
}

import bundle from './content.js';
import { mountFeedback } from './feedback/widget.js';
import { evaluateText } from './query/evaluate.js';
import { newAttempt, changeQuery, gradeMethod, reduceAttempt, bestAttempt, total, statusLabel } from './state/scoring.js';
import { loadProgress, saveProgress, clearProgress, forgetProgress } from './state/progress.js';

const app = document.getElementById('app');
const lessons = bundle.lessons;
const challenges = lessons.flatMap(l => l.challenges);
const versions = new Map(lessons.flatMap(l => l.challenges.map(c => [c.id, l.contentVersion])));
const storage = { getItem: k => localStorage.getItem(k), setItem: (k, v) => localStorage.setItem(k, v), removeItem: k => localStorage.removeItem(k) };
const loaded = loadProgress(storage, versions);
let remembered = loaded.mode === 'remembered', records = loaded.progress.records, warning = loaded.warningCode;
let acknowledged = false;
const attempts = new Map();
const messages = {
  STORAGE_UNAVAILABLE: 'Browser storage is unavailable. Progress continues in this session only.',
  PROGRESS_INVALID: 'Saved progress could not be used. It has been left untouched; Clear progress removes it. This session starts fresh.',
  LESSON_CHANGED: 'These lessons or completion rules changed; please reassess. Older saved progress remains preserved until you clear it.',
};
const node = (tag, text, cls) => { const el = document.createElement(tag); if (text !== null && text !== undefined) el.textContent = text; if (cls) el.className = cls; return el; };
const add = (el, ...children) => { children.filter(Boolean).forEach(c => el.append(c)); return el; };
const paragraph = (text, cls) => node('p', text, cls);
const link = (text, href, cls) => { const el = node('a', text, cls); el.href = href; return el; };
const button = (text, action, id, cls) => { const b = node('button', text, cls); b.type = 'button'; if (id) b.id = id; b.addEventListener('click', action); return b; };
const announce = text => { document.getElementById('live').textContent = text; };
function refresh(message, focusId) { render(false); if (focusId) document.getElementById(focusId)?.focus(); if (message) announce(message); }
function persist() { if (remembered) { const error = saveProgress(storage, records, versions); if (error) { warning = error; remembered = false; } } }
function rememberChoice() {
  const wrap = node('label', null, 'choice'); const box = node('input'); box.type = 'checkbox'; box.id = 'remember'; box.checked = remembered;
  box.addEventListener('change', () => {
    remembered = box.checked;
    if (remembered) { warning = null; persist(); }
    else warning = forgetProgress(storage);
    refresh(remembered ? 'Progress remembering enabled.' : 'Progress is session only.', 'remember');
  });
  return add(wrap, box, node('span', 'Remember non-sensitive progress in this browser. Leave off on a shared device.'));
}
function attemptFor(c) { if (!attempts.has(c.id)) attempts.set(c.id, { ...newAttempt(c.id), queryText: c.mission.starter }); return attempts.get(c.id); }
function saveAttempt(c, a) {
  const previous = records.find(r => r.challengeId === c.id);
  const next = bestAttempt(previous, reduceAttempt(a, versions.get(c.id)));
  records = [...records.filter(r => r.challengeId !== c.id), next]; persist();
}
function resetProgress() { warning = clearProgress(storage); records = []; attempts.clear(); remembered = false; refresh('Progress cleared for this course only.', 'clear-progress'); }
function currentRoute() {
  const raw = location.hash.slice(1) || 'course';
  if (['course', 'progress', 'privacy'].includes(raw)) return { view: raw };
  const l = lessons.find(x => raw === x.id); if (l) return { view: 'lesson', lesson: l };
  const c = challenges.find(x => raw === x.id); if (c) return { view: 'challenge', challenge: c, lesson: lessons.find(l => l.challenges.includes(c)) };
  return { view: 'missing' };
}
function main(cls = '') { const m = node('main', null, cls); m.id = 'main'; m.tabIndex = -1; return m; }
function panel(title) { return add(node('section', null, 'panel'), node('h2', title)); }
function onboarding() {
  const m = main('narrow'); add(m, paragraph('BEFORE YOU OPEN THE DESK', 'eyebrow'), node('h1', 'Practice here. Investigate privately.'));
  const p = panel('Your workplace data stays in workplace tools');
  add(p, paragraph('This course grades symbolic Google SecOps Search queries. It does not execute them or connect to your SIEM.'), paragraph('Choose actual users, hosts, IPs, time ranges, and observations only inside authorized workplace tools. Never type or paste them into this site, GitHub, or an external AI service.'), paragraph('Use the site at work only if your organization permits the website and browser storage. A private source repository does not make a hosted website private.', 'notice'));
  const label = node('label', null, 'choice'); const cb = node('input'); cb.type = 'checkbox'; cb.id = 'boundary';
  const start = button('Open the learning path →', () => { acknowledged = true; refresh('Learning path opened.'); document.getElementById('main').focus(); }, 'open-course', 'primary'); start.disabled = true;
  cb.addEventListener('change', () => { start.disabled = !cb.checked; });
  add(label, cb, node('span', 'I will keep actual identifiers, queries with real values, and results exclusively in approved workplace tools.'));
  add(p, label, rememberChoice(), paragraph('Default: session only. Remembering stores scores, hint levels, content versions, and fixed mission flags. No query or answer text is stored.', 'small muted'), start);
  add(m, p); return m;
}
function course() {
  const m = main(); const hero = node('section', null, 'hero'); const intro = node('div');
  add(intro, paragraph('SIGNAL DESK / GOOGLE SECOPS', 'eyebrow'), node('h1', 'Midnight at Meridian.'), paragraph('An unapproved VIP donation screen. A blamed intern. A shared publishing account. Doors open in forty minutes; follow the evidence before choosing a culprit.'), paragraph('Follow one original case through six chapters. Learn a practical analyst move, see a query, then change it yourself. Run it against your authorized work logs separately in SecOps; submit only the training query here.'), link('Start the case →', '#L01', 'primary'));
  const summary = panel('Your learning record');
  add(summary, paragraph(String(records.reduce((n, r) => n + total(r), 0)), 'progress-big'), paragraph('of ' + (challenges.length * 100).toLocaleString('en-US') + ' learning points', 'muted'), add(node('div', null, 'metric'), node('span', 'Symbolic mastery'), node('strong', records.filter(r => r.queryPoints === 70 && r.methodPoints === 20).length + ' / ' + challenges.length)), add(node('div', null, 'metric'), node('span', 'Missions completed'), node('strong', records.filter(r => r.completed && r.methodPoints === 20).length + ' / ' + challenges.length)), paragraph(remembered ? 'Remembered in this browser' : 'Session only', 'small muted'));
  add(hero, intro, summary); add(m, hero);
  add(m, add(node('div', null, 'row between'), node('h2', 'The learning path'), paragraph('06 chapters · ' + challenges.length + ' query missions · no time pressure', 'small muted')));
  const cards = node('div', null, 'cards');
  for (const l of lessons) {
    const mastered = l.challenges.filter(c => records.some(r => r.challengeId === c.id && r.queryPoints === 70 && r.methodPoints === 20)).length;
    add(cards, add(node('article', null, 'card'), node('span', l.id.slice(1), 'number'), paragraph(l.level.toUpperCase() + ' · ~' + l.estimatedMinutes + ' MIN', 'eyebrow'), node('h3', l.title), paragraph(l.objectives[0]), paragraph(mastered + ' / ' + l.challenges.length + ' missions mastered', 'small good'), link('Open chapter →', '#' + l.id)));
  }
  add(m, cards, paragraph('Documentation-checked examples · Not compiled in your tenant. Feature availability and source normalization may differ.', 'notice')); return m;
}
function sidebar(active) {
  const aside = node('aside', null, 'sidebar'); add(aside, paragraph('LEARNING PATH', 'eyebrow')); const nav = node('nav'); nav.setAttribute('aria-label', 'Lessons'); const list = node('ol');
  for (const l of lessons) { const a = link('', '#' + l.id); add(a, node('small', l.id + ' / ' + l.level.toUpperCase()), node('span', l.title)); if (l.id === active.id) a.setAttribute('aria-current', 'step'); add(list, add(node('li'), a)); }
  add(nav, list); add(aside, nav, paragraph('70% query · 20% method · 10% mission completion', 'small muted'), paragraph('Progress is personal learning feedback. It is not certification or evidence of a security finding.', 'small muted')); return aside;
}
function sourceLinks(l) {
  const details = node('details'); add(details, node('summary', 'Official references & verification')); const list = node('ul');
  for (const id of l.sourceIds) { const s = bundle.sources.find(x => x.id === id); const a = link(s.title + ' ↗', s.url); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.referrerPolicy = 'no-referrer'; add(list, add(node('li'), a)); }
  add(details, paragraph('Documentation checked ' + l.verification.documentationCheckedOn + '. Tenant execution: not tested. The course validator supports a bounded Search subset; it is not Google’s compiler.', 'small muted'), list); return details;
}
function breakdown(c) {
  const dl = node('dl', null, 'breakdown');
  for (const x of c.mission.explanation) add(dl, node('dt', x.part), node('dd', x.meaning));
  return dl;
}
function exampleBlock(c, briefing = false) {
  const p = panel(briefing ? 'Your first query' : c.mission.support === 'shown' ? 'See it first' : 'Previous building block');
  add(p, paragraph(c.mission.support === 'shown' ? 'This is a complete Search query. Copy it into authorized SecOps, then select the last 30 minutes there.' : 'You already have this building block. Your next query below adds the change described in the mission.'), node('pre', c.mission.example, 'query-preview'));
  add(p, button('Copy example', async () => {
    try { await navigator.clipboard.writeText(c.mission.example); announce('Example copied. Choose real values only in workplace SecOps.'); }
    catch { announce('Clipboard unavailable. Select the example and copy manually.'); p.querySelector('pre').focus(); }
  }, 'copy-example'));
  p.querySelector('pre').tabIndex = 0;
  if (briefing) add(p, breakdown(c), paragraph(c.mission.remember, 'memory-hook'));
  return p;
}
function lesson(l) {
  const m = main(), layout = node('div', null, 'workspace'), body = node('div'); add(layout, sidebar(l), body);
  add(body, paragraph('CHAPTER ' + l.id.slice(1) + ' / MIDNIGHT AT MERIDIAN', 'eyebrow'), node('h1', l.title), paragraph(l.story, 'case-story'));
  const first = l.challenges[0];
  add(body, add(node('div', null, 'stack'), exampleBlock(first, true), link('Start mission 01 →', '#' + first.id, 'primary')));
  const tasks = panel('Your missions');
  l.challenges.forEach((c, i) => add(tasks, add(node('div', null, 'metric'), link(String(i + 1).padStart(2, '0') + ' · ' + c.title + ' →', '#' + c.id), node('span', statusLabel(records.find(r => r.challengeId === c.id)), 'small muted'))));
  const reading = node('details'); add(reading, node('summary', 'Chapter field guide'));
  const list = node('ul'); l.objectives.forEach(o => add(list, node('li', o))); add(reading, list);
  l.teaching.forEach(t => add(reading, node('h3', t.heading), paragraph(t.text)));
  add(body, add(node('div', null, 'stack'), tasks, reading, sourceLinks(l))); add(m, layout); return m;
}
function scorePanel(c, a) {
  const score = panel('Current attempt'); score.id = 'current-score';
  const current = reduceAttempt(a, versions.get(c.id));
  add(score, paragraph(String(total(current)), 'progress-big'), paragraph('of 100 points', 'muted'));
  const rubric = node('div', null, 'rubric');
  [['Query', current.queryPoints, 70], ['Method', current.methodPoints, 20], ['Completed', current.completionPoints, 10]].forEach(([label, n, max]) => add(rubric, add(node('div'), node('strong', String(n)), node('span', label + ' / ' + max))));
  add(score, rubric, paragraph(statusLabel(current), 'small good'));
  const best = records.find(r => r.challengeId === c.id); if (best) add(score, paragraph('Saved best: ' + total(best) + '/100 · ' + statusLabel(best), 'small muted'));
  add(score, paragraph('Query 70 + method 20 completes the mission and adds 10 completion points. Editing resets the current assessment; saved best stays separate.', 'small muted'));
  return score;
}
function queryFeedback(c, a) {
  const r = a.queryResult, result = node('div', null, 'result'); result.id = 'query-result'; result.tabIndex = -1;
  const title = r.status === 'supported-correct' ? 'Supported query — intent matched' : r.status === 'supported-incorrect' ? 'Supported query — revise the intent' : r.status === 'unsupported' ? 'Unsupported by this course validator' : r.status === 'limit-exceeded' ? 'Course validator limit exceeded' : 'Cannot parse this course query';
  add(result, node('h3', title), paragraph(r.queryPoints + ' / 70 query points', r.status === 'supported-correct' ? 'good' : 'bad'));
  if (r.checks.syntax) add(result, paragraph('Syntax/catalog: 10/10 · Filter intent: ' + (r.checks.filter ? '35/35' : '0/35') + ' · Pipeline: ' + (r.checks.pipeline ? '25/25' : '0/25'), 'small'));
  if (!r.checks.filter && r.checks.syntax) add(result, paragraph('Check what your whole filter selects: event type, action, user role and AND/OR grouping. A broad OR can let unrelated records in.', 'small'));
  if (!r.checks.pipeline && r.checks.syntax) add(result, paragraph('Check what you count or group: users and event records are different. Compare the grouping, metric, sorting and limit with the question.', 'small'));
  if (!r.checks.syntax) add(result, paragraph('Diagnostic: ' + r.diagnostics.map(d => d.code).join(', ') + '. Use the supplied fields, syntax and training placeholders. The editor checks a bounded subset, not every valid Google query. No workplace values belong here.', 'small'));
  if (r.queryPoints === 70) add(result, paragraph('Fictional case card unlocked', 'eyebrow'), paragraph(c.mission.caseUpdate, 'case-update'));
  return result;
}
function composer(c, a) {
  const p = panel('Your training query');
  add(p, paragraph('Type or paste the query using training placeholders only: "__USER__", "__HOST__", 192.0.2.17. Replace them with work values only inside SecOps. This editor never needs your results.', 'small muted'));
  const label = node('label', 'Training query'); label.htmlFor = 'query-editor';
  const editor = node('textarea'); editor.id = 'query-editor'; editor.value = a.queryText; editor.rows = Math.max(4, Math.min(12, a.queryText.split('\n').length + 1)); editor.maxLength = 8192;
  editor.spellcheck = false; editor.autocomplete = 'off'; editor.autocapitalize = 'off'; editor.setAttribute('autocorrect', 'off'); editor.setAttribute('aria-describedby', 'editor-privacy');
  const note = paragraph('Query text lives in this tab only; it is not saved or submitted. This is an external site, even on a work device. Keep real values in SecOps.', 'small muted'); note.id = 'editor-privacy';
  editor.addEventListener('input', () => {
    Object.assign(a, changeQuery(a, editor.value));
    document.getElementById('query-result')?.remove(); document.getElementById('method-result')?.remove();
    p.closest('.desk').querySelectorAll('.method-rationale').forEach(el => el.remove());
    p.closest('.desk').querySelectorAll('input[type=radio]').forEach(el => { el.checked = false; });
    document.getElementById('current-score')?.replaceWith(scorePanel(c, a));
    document.querySelectorAll('[data-gap]').forEach(el => { el.value = ''; });
  });
  add(p, label, editor, note);
  if (c.mission.gaps.length) {
    const help = node('details'); help.open = Boolean(a.gapHelpOpen); add(help, node('summary', 'Help me fill the blanks'));
    for (const gap of c.mission.gaps) {
      const label = node('label', null, 'control'); label.htmlFor = 'gap-' + gap.marker; add(label, node('span', gap.label));
      const select = node('select'); select.id = label.htmlFor; select.dataset.gap = gap.marker;
      const placeholder = node('option', 'Choose for ' + gap.marker); placeholder.value = ''; add(select, placeholder);
      for (const value of gap.options) { const option = node('option', value); option.value = value; add(select, option); }
      select.addEventListener('change', () => {
        if (!select.value || !a.queryText.includes(gap.marker)) return;
        attempts.set(c.id, { ...changeQuery(a, a.queryText.replaceAll(gap.marker, select.value)), gapHelpOpen: true });
        refresh('Blank filled. Check the query when ready.', 'query-editor');
      }); add(label, select); add(help, label);
    } add(p, help);
  }
  add(p, add(node('div', null, 'row'),
    button('Check query', () => { a.queryResult = evaluateText(a.queryText, c.referenceQuery); saveAttempt(c, a); refresh('Query checked. ' + a.queryResult.queryPoints + ' of 70 query points.', 'query-result'); }, 'check-query', 'primary'),
    button('Clear query', () => { attempts.set(c.id, changeQuery(a, '')); refresh('Query cleared. Current assessment reset.', 'query-editor'); }, 'clear-query'),
    button('Copy training query', async () => {
      try { await navigator.clipboard.writeText(a.queryText); announce('Training query copied. Substitute real values only inside workplace SecOps.'); }
      catch { announce('Clipboard unavailable. Select the training query and copy manually.'); editor.focus(); editor.select(); }
    }, 'copy-query')));
  if (a.queryResult) add(p, queryFeedback(c, a));
  return p;
}
function method(c, a) {
  const p = panel('02 / Explain the method');
  c.methodQuestions.forEach(q => {
    const fs = node('fieldset'); add(fs, node('legend', q.prompt));
    q.options.forEach(o => { const label = node('label', null, 'choice'), radio = node('input'); radio.type = 'radio'; radio.name = q.id; radio.value = o.id; radio.id = q.id + '-' + o.id; radio.checked = a.methodChoices[q.id] === o.id;
      radio.addEventListener('change', () => { a.methodChoices[q.id] = o.id; a.methodPoints = null; refresh('Method choice changed. Check method to reassess.', radio.id); }); add(label, radio, node('span', o.label)); add(fs, label); });
    if (a.methodPoints !== null) add(fs, paragraph((a.methodChoices[q.id] === q.correctOption ? 'Correct: ' : 'Explanation: ') + q.rationale, 'small method-rationale'));
    add(p, fs);
  });
  add(p, button('Check method', () => { a.methodPoints = gradeMethod(a, c); saveAttempt(c, a); refresh('Method checked. ' + a.methodPoints + ' of 20 method points.', 'method-result'); }, 'check-method'));
  if (a.methodPoints !== null) { const r = paragraph(a.methodPoints + ' / 20 method points', 'result'); r.id = 'method-result'; r.tabIndex = -1; add(p, r); }
  return p;
}
function challenge(l, c) {
  const a = attemptFor(c), m = main(), layout = node('div', null, 'workspace'), body = node('div'); add(layout, sidebar(l), body);
  const index = l.challenges.indexOf(c);
  add(body, link('← ' + l.id + ' briefing', '#' + l.id), paragraph('CHAPTER ' + l.id.slice(1) + ' · MISSION ' + (index + 1) + ' OF ' + l.challenges.length, 'eyebrow'), node('h1', c.title));
  const trail = node('nav', null, 'mission-trail'); trail.setAttribute('aria-label', 'Chapter missions');
  for (const [i, mission] of l.challenges.entries()) { const a = link(String(i + 1), '#' + mission.id); a.setAttribute('aria-label', 'Mission ' + (i + 1) + ': ' + mission.title); if (mission === c) a.setAttribute('aria-current', 'step'); add(trail, a); }
  add(body, trail, paragraph(c.mission.beat, 'case-story'), paragraph(c.prompt, 'mission-question'));
  const analyst = panel('Think like an analyst'); analyst.classList.add('analyst-note');
  add(analyst, node('h3', c.mission.analystNote.concept), paragraph(c.mission.analystNote.text)); add(body, analyst);
  const desk = node('div', null, 'desk'), left = node('div', null, 'stack'), right = node('aside', null, 'stack');
  const teaching = panel({ shown: 'Watch one', guided: 'Build on it', independent: 'Your turn' }[c.mission.support]);
  if (c.mission.example) add(teaching, exampleBlock(c));
  add(teaching, breakdown(c), paragraph(c.mission.remember, 'memory-hook'));
  if (c.mission.caveat) add(teaching, paragraph(c.mission.caveat, 'notice'));
  const hints = panel('Need a hint?');
  add(hints, paragraph('Three hints, no point penalty. The last one includes the full query.', 'small muted'));
  for (let i = 0; i < a.highestHint; i++) add(hints, node('h3', 'Hint ' + (i + 1)), i === 2 ? node('pre', c.hints[i], 'query-preview') : paragraph(c.hints[i], 'small'));
  if (a.highestHint < 3) add(hints, button('Reveal hint ' + (a.highestHint + 1), () => { a.highestHint++; saveAttempt(c, a); refresh('Hint ' + a.highestHint + ' revealed.', 'hint-panel'); }, 'next-hint'));
  if (a.highestHint === 3) add(hints, button('Load worked example', () => { attempts.set(c.id, changeQuery(a, c.hints[2])); refresh('Worked example loaded. Check it, then explain the method.', 'check-query'); }, 'load-example'));
  hints.id = 'hint-panel'; hints.tabIndex = -1;
  add(left, teaching, composer(c, a), method(c, a));
  add(right, hints, scorePanel(c, a), sourceLinks(l)); add(desk, left, right); add(body, desk);
  const next = challenges[challenges.indexOf(c) + 1]; add(body, add(node('div', null, 'row mission-next'), link(next ? (index === l.challenges.length - 1 ? 'Next chapter →' : 'Next mission →') : 'Review case progress →', next ? '#' + next.id : '#progress', 'primary')));
  add(m, layout); return m;
}
function progress() {
  const m = main('narrow'); add(m, paragraph('YOUR LEARNING RECORD', 'eyebrow'), node('h1', 'Progress, at your pace.'), paragraph(records.reduce((n, r) => n + total(r), 0) + ' / ' + (challenges.length * 100).toLocaleString('en-US') + ' learning points', 'progress-big'));
  const p = panel('Saved best, one attempt at a time');
  for (const c of challenges) { const r = records.find(x => x.challengeId === c.id); add(p, add(node('div', null, 'metric'), link(c.id + ' · ' + c.title, '#' + c.id), node('span', (r ? total(r) : 0) + '/100 · ' + statusLabel(r), 'small'))); }
  add(p, paragraph('A saved best combines query, method and mission-completion points from one attempt. Highest hint use is tracked separately. A learner can edit browser storage; these records are not audit evidence.', 'small muted'), rememberChoice(), button('Clear progress', resetProgress, 'clear-progress'), paragraph('Clears this course’s current and older progress keys and in-memory attempts. Saved feedback is separate; other sites and courses are untouched.', 'small muted'));
  add(m, p); return m;
}
function privacy() {
  const m = main('narrow'); add(m, paragraph('THE WORKPLACE BOUNDARY', 'eyebrow'), node('h1', 'Keep the evidence where it belongs.'));
  const p = panel('What the app receives');
  add(p, paragraph('Training queries with predefined placeholders and fixed method choices. The separate Feedback button accepts your comments and explicitly pasted sanitized UI/error screenshots; nothing is uploaded automatically. Never enter workplace identifiers, logs or results.'), node('h3', 'What the app stores'), paragraph('Course progress is session-only unless you enable remembering; it stores fixed IDs, scores, hint level and mission-completion flags. Training query text is discarded when you leave a mission or reload and is never saved or sent by app code. Feedback is separate: Save feedback keeps your entered comment, explicitly pasted images, page context and feedback date in this browser’s IndexedDB. Export retrieves a file for you to share later. It is not synchronized or automatically available to Codex.'), node('h3', 'What the app contacts'), paragraph('The app loads its static files from the host. It has no runtime AI, analytics, SIEM integration, automatic external content, or backend. Clicking an official reference opens that fixed public documentation link without a referrer. The host may keep ordinary access logs.'), node('h3', 'Limits of this protection'), paragraph('A managed device does not make this public website an internal tool. Browser owners, extensions, compromised releases and scripts on the same origin can inspect text entered here, even without saving it. Local progress is untrusted. Use a dedicated approved origin; do not embed the course in another site. Hosting must enforce framing restrictions if required.'), node('h3', 'Your approved Copilot'), paragraph('Optional Copilot use belongs separately inside your approved work environment and organizational policy. It is not part of the course, a validator, or a reason to send workplace data to another service.'), node('h3', 'What the scores mean'), paragraph('Query structure 70%, method choices 20%, mission completion 10% when both pass. Completion does not attest to a workplace run. This is personal practice, not certification, incident verification, or proof that Google’s compiler accepted a query.'), rememberChoice(), button('Clear progress', resetProgress, 'clear-progress'));
  add(m, p); return m;
}
function render(routeChange = true) {
  const route = currentRoute();
  document.querySelectorAll('.topbar nav a').forEach(a => { if (a.hash === '#' + route.view || a.hash === '#course' && ['lesson', 'challenge'].includes(route.view)) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  let view;
  if (!acknowledged && route.view !== 'privacy') view = onboarding();
  else if (route.view === 'course') view = course();
  else if (route.view === 'lesson') view = lesson(route.lesson);
  else if (route.view === 'challenge') view = challenge(route.lesson, route.challenge);
  else if (route.view === 'progress') view = progress();
  else if (route.view === 'privacy') view = privacy();
  else { view = main('narrow'); add(view, node('h1', 'Page not found'), paragraph('Choose a lesson from the learning path. Query values are never accepted in a route.'), link('Open learning path', '#course')); }
  if (warning) { const n = paragraph(messages[warning] ?? messages.PROGRESS_INVALID, 'notice'); view.prepend(n); }
  app.replaceChildren(view);
  document.title = (view.querySelector('h1')?.textContent ?? 'Learning path') + ' · KC7 SecOps';
  if (routeChange) { view.focus(); window.scrollTo(0, 0); announce('Opened ' + (view.querySelector('h1')?.textContent ?? 'learning path') + '.'); }
}
document.querySelector('.skip').addEventListener('click', e => { e.preventDefault(); document.getElementById('main').focus(); });
window.addEventListener('hashchange', () => { attempts.clear(); render(); });
render();

mountFeedback(document.getElementById('feedback-root'), () => {
  const route = currentRoute();
  if (!acknowledged && route.view !== 'privacy') return { pageId: 'onboarding', contentVersion: null };
  return { pageId: route.challenge?.id ?? route.lesson?.id ?? route.view, contentVersion: route.lesson?.contentVersion ?? null };
});

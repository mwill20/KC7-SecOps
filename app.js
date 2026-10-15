import bundle from './content.js';
import { tokens, tokenMap } from './query/catalog.js';
import { lex } from './query/parser.js';
import { serializeTokens } from './query/serializer.js';
import { evaluateChallenge } from './query/evaluate.js';
import { newAttempt, changeTokens, gradeMethod, reduceAttempt, bestAttempt, total, statusLabel } from './state/scoring.js';
import { loadProgress, saveProgress, clearProgress } from './state/progress.js';

const app = document.getElementById('app');
const lessons = bundle.lessons;
const challenges = lessons.flatMap(l => l.challenges);
const versions = new Map(lessons.flatMap(l => l.challenges.map(c => [c.id, l.contentVersion])));
const storage = { getItem: k => localStorage.getItem(k), setItem: (k, v) => localStorage.setItem(k, v), removeItem: k => localStorage.removeItem(k) };
const loaded = loadProgress(storage, versions);
let remembered = loaded.mode === 'remembered', records = loaded.progress.records, warning = loaded.warningCode;
let acknowledged = false, composerGroup = 'Field', selectedToken = null, insertAt = null;
const attempts = new Map();
const messages = {
  STORAGE_UNAVAILABLE: 'Browser storage is unavailable. Progress continues in this session only.',
  PROGRESS_INVALID: 'Saved progress could not be used. It has been left untouched; Clear progress removes it. This session starts fresh.',
  LESSON_CHANGED: 'This lesson changed; please reassess. Unchanged lesson scores were retained.',
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
    else warning = clearProgress(storage);
    refresh(remembered ? 'Progress remembering enabled.' : 'Progress is session only.', 'remember');
  });
  return add(wrap, box, node('span', 'Remember non-sensitive progress in this browser. Leave off on a shared device.'));
}
function attemptFor(c) { if (!attempts.has(c.id)) attempts.set(c.id, newAttempt(c.id)); return attempts.get(c.id); }
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
  add(p, label, rememberChoice(), paragraph('Default: session only. Remembering stores scores, hint levels, content versions, and fixed completion flags. No query or answer text is stored.', 'small muted'), start);
  add(m, p); return m;
}
function course() {
  const m = main(); const hero = node('section', null, 'hero'); const intro = node('div');
  add(intro, paragraph('SIGNAL DESK / GOOGLE SECOPS', 'eyebrow'), node('h1', 'Ask a sharper question.'), paragraph('Build Search queries. Follow the evidence. Learn what your results can—and cannot—tell you.'), paragraph('Six original lessons take you from event filters to a cautious investigation capstone. Work at your own pace, then practice separately in your authorized SecOps.'), link('Start at lesson 01 →', '#L01', 'primary'));
  const summary = panel('Your learning record');
  add(summary, paragraph(String(records.reduce((n, r) => n + total(r), 0)), 'progress-big'), paragraph('of 1,200 formative points', 'muted'), add(node('div', null, 'metric'), node('span', 'Symbolic mastery'), node('strong', records.filter(r => r.queryPoints === 70 && r.methodPoints === 20).length + ' / 12')), add(node('div', null, 'metric'), node('span', 'Practice self-attested'), node('strong', records.filter(r => r.practiced && r.methodPoints === 20).length + ' / 12')), paragraph(remembered ? 'Remembered in this browser' : 'Session only', 'small muted'));
  add(hero, intro, summary); add(m, hero);
  add(m, add(node('div', null, 'row between'), node('h2', 'The learning path'), paragraph('06 lessons · 12 challenges · no time pressure', 'small muted')));
  const cards = node('div', null, 'cards');
  for (const l of lessons) {
    const mastered = l.challenges.filter(c => records.some(r => r.challengeId === c.id && r.queryPoints === 70 && r.methodPoints === 20)).length;
    add(cards, add(node('article', null, 'card'), node('span', l.id.slice(1), 'number'), paragraph(l.level.toUpperCase() + ' · ~' + l.estimatedMinutes + ' MIN', 'eyebrow'), node('h3', l.title), paragraph(l.objectives[0]), paragraph(mastered + ' / 2 challenges mastered', 'small good'), link('Open lesson →', '#' + l.id)));
  }
  add(m, cards, paragraph('Documentation-checked examples · Not compiled in your tenant. Feature availability and source normalization may differ.', 'notice')); return m;
}
function sidebar(active) {
  const aside = node('aside', null, 'sidebar'); add(aside, paragraph('LEARNING PATH', 'eyebrow')); const nav = node('nav'); nav.setAttribute('aria-label', 'Lessons'); const list = node('ol');
  for (const l of lessons) { const a = link('', '#' + l.id); add(a, node('small', l.id + ' / ' + l.level.toUpperCase()), node('span', l.title)); if (l.id === active.id) a.setAttribute('aria-current', 'step'); add(list, add(node('li'), a)); }
  add(nav, list); add(aside, nav, paragraph('70% query · 20% method · 10% practice', 'small muted'), paragraph('Progress is personal learning feedback. It is not certification or evidence of a security finding.', 'small muted')); return aside;
}
function sourceLinks(l) {
  const details = node('details'); add(details, node('summary', 'Official references & verification')); const list = node('ul');
  for (const id of l.sourceIds) { const s = bundle.sources.find(x => x.id === id); const a = link(s.title + ' ↗', s.url); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.referrerPolicy = 'no-referrer'; add(list, add(node('li'), a)); }
  add(details, paragraph('Documentation checked ' + l.verification.documentationCheckedOn + '. Tenant execution: not tested. The course validator supports a bounded Search subset; it is not Google’s compiler.', 'small muted'), list); return details;
}
function lesson(l) {
  const m = main(), layout = node('div', null, 'workspace'), body = node('div'); add(layout, sidebar(l), body);
  add(body, paragraph(l.id + ' / ' + l.level.toUpperCase(), 'eyebrow'), node('h1', l.title), paragraph(l.story, 'muted'));
  const goals = panel('Your objectives'); const list = node('ul', null, 'checklist'); l.objectives.forEach(o => add(list, node('li', o))); add(goals, list);
  if (l.prerequisites.length) add(goals, paragraph('Suggested preparation: ' + l.prerequisites.join(', ') + '. You can revisit any lesson.', 'small muted'));
  const reading = panel('Briefing'); l.teaching.forEach(t => add(reading, node('h3', t.heading), paragraph(t.text)));
  const tasks = panel('Put it into practice');
  l.challenges.forEach((c, i) => add(tasks, add(node('div', null, 'metric'), link(String(i + 1).padStart(2, '0') + ' · ' + c.title + ' →', '#' + c.id), node('span', statusLabel(records.find(r => r.challengeId === c.id)), 'small muted'))));
  add(body, add(node('div', null, 'stack'), goals, reading, tasks, sourceLinks(l))); add(m, layout); return m;
}
function selectControl(text, values, selected, id, change) {
  const label = node('label', null, 'control'); label.htmlFor = id; add(label, node('span', text)); const select = node('select'); select.id = id;
  values.forEach(v => { const o = node('option', v.label); o.value = v.value; o.selected = v.value === selected; add(select, o); });
  select.addEventListener('change', change); add(label, select); return label;
}
function authoredTokens(query) {
  const parts = lex(query), result = []; let i = 0;
  const choices = tokens.filter(t => t.lexeme !== '\n').map(t => ({ id: t.id, parts: lex(t.lexeme) })).sort((a, b) => b.parts.length - a.parts.length);
  while (i < parts.length) { const token = choices.find(t => t.parts.every((p, n) => parts[i + n]?.kind === p.kind && parts[i + n]?.value === p.value)); if (!token) throw new Error('CONTENT_INVALID'); result.push(token.id); i += token.parts.length; }
  return result;
}
function composer(c, a) {
  const p = panel('01 / Build the query');
  add(p, paragraph('Choose tokens to construct manual YARA-L 2.0 Search. [USER] and [HOST] remain symbols here. This preview cannot accept typing or paste.', 'small muted'));
  const code = node('pre', a.tokenIds.length ? serializeTokens(a.tokenIds) : '// Your symbolic query appears here', 'query-preview'); code.id = 'query-preview'; code.tabIndex = 0; code.setAttribute('aria-label', 'Read-only synthetic query preview'); add(p, code);
  const options = tokens.filter(t => t.group === composerGroup); if (!options.some(t => t.id === selectedToken)) selectedToken = options[0].id;
  const controls = node('div', null, 'row composer-controls');
  add(controls, selectControl('Token group', [...new Set(tokens.map(t => t.group))].map(g => ({ value: g, label: g })), composerGroup, 'token-group', e => { composerGroup = e.target.value; selectedToken = null; refresh(null, 'token-group'); }), selectControl('Token', options.map(t => ({ value: t.id, label: t.label })), selectedToken, 'token-choice', e => { selectedToken = e.target.value; }));
  add(controls, selectControl('Insert position', Array.from({ length: a.tokenIds.length + 1 }, (_, i) => ({ value: String(i), label: i === a.tokenIds.length ? 'At end' : 'Before token ' + (i + 1) })), String(insertAt ?? a.tokenIds.length), 'insert-position', e => { insertAt = Number(e.target.value); }));
  const edit = (ids, message, focus = 'add-token') => { attempts.set(c.id, changeTokens(a, ids)); insertAt = null; refresh(message + ' Current assessment and acknowledgments reset.', focus); };
  const addToken = button('Add token', () => { const ids = [...a.tokenIds]; ids.splice(insertAt ?? ids.length, 0, selectedToken); edit(ids, 'Token added.'); }, 'add-token'); addToken.disabled = a.tokenIds.length >= 512;
  add(controls, addToken); add(p, controls);
  const edits = node('details'); edits.id = 'token-editor'; add(edits, node('summary', 'Edit & reorder ' + a.tokenIds.length + ' tokens'));
  const list = node('ol', null, 'tokens');
  a.tokenIds.forEach((id, i) => {
    const li = node('li'); const up = button('↑', () => { const ids = [...a.tokenIds]; [ids[i - 1], ids[i]] = [ids[i], ids[i - 1]]; edit(ids, 'Token moved.'); }, null); up.disabled = i === 0; up.setAttribute('aria-label', 'Move token ' + (i + 1) + ' up');
    const down = button('↓', () => { const ids = [...a.tokenIds]; [ids[i + 1], ids[i]] = [ids[i], ids[i + 1]]; edit(ids, 'Token moved.'); }); down.disabled = i === a.tokenIds.length - 1; down.setAttribute('aria-label', 'Move token ' + (i + 1) + ' down');
    const remove = button('Remove', () => edit(a.tokenIds.filter((_, n) => n !== i), 'Token removed.')); remove.setAttribute('aria-label', 'Remove token ' + (i + 1));
    add(li, node('code', (i + 1) + '. ' + tokenMap.get(id).label), up, down, remove); add(list, li);
  }); add(edits, list); add(p, edits);
  add(p, add(node('div', null, 'row'), button('Check query', () => { a.queryResult = evaluateChallenge({ challengeId: c.id, tokens: a.tokenIds }, challenges); saveAttempt(c, a); refresh('Query checked. ' + a.queryResult.queryPoints + ' of 70 query points.', 'query-result'); }, 'check-query', 'primary'), button('Clear query', () => edit([], 'Query cleared.'), 'clear-query'), button('Copy synthetic query', async () => { try { await navigator.clipboard.writeText(serializeTokens(a.tokenIds)); announce('Synthetic query copied. Substitute values only inside workplace SecOps.'); } catch { announce('Clipboard unavailable. Select the read-only preview and copy manually.'); code.focus(); } }, 'copy-query')));
  if (a.queryResult) {
    const r = a.queryResult; const result = node('div', null, 'result'); result.id = 'query-result'; result.tabIndex = -1;
    const title = r.status === 'supported-correct' ? 'Supported query — intent matched' : r.status === 'supported-incorrect' ? 'Supported query — revise the intent' : r.status === 'unsupported' ? 'Unsupported by this course validator' : r.status === 'limit-exceeded' ? 'Course validator limit exceeded' : 'Cannot parse this course query';
    add(result, node('h3', title), paragraph(r.queryPoints + ' / 70 query points', r.status === 'supported-correct' ? 'good' : 'bad'));
    if (r.checks.syntax) add(result, paragraph('Syntax/catalog: 10/10 · Filter intent: ' + (r.checks.filter ? '35/35' : '0/35') + ' · Pipeline: ' + (r.checks.pipeline ? '25/25' : '0/25'), 'small'));
    if (!r.checks.filter && r.checks.syntax) add(result, paragraph('The whole filter must answer the prompt. Check the event category, actor/target role, operators, and Boolean grouping. A required predicate inside a broad OR is insufficient.', 'small'));
    if (!r.checks.pipeline && r.checks.syntax) add(result, paragraph('Check grouping, metrics, bucket duration, threshold, sort direction, and limit against the prompt.', 'small'));
    if (!r.checks.syntax) add(result, paragraph('Diagnostic: ' + r.diagnostics.map(d => d.code).join(', ') + '. Check token order, parentheses, field types, and supported sections. This is not a Google compiler verdict.', 'small'));
    add(p, result);
  }
  return p;
}
function method(c, a) {
  const p = panel('02 / Explain the method');
  c.methodQuestions.forEach(q => {
    const fs = node('fieldset'); add(fs, node('legend', q.prompt));
    q.options.forEach(o => { const label = node('label', null, 'choice'), radio = node('input'); radio.type = 'radio'; radio.name = q.id; radio.value = o.id; radio.id = q.id + '-' + o.id; radio.checked = a.methodChoices[q.id] === o.id;
      radio.addEventListener('change', () => { a.methodChoices[q.id] = o.id; a.methodPoints = null; refresh('Method choice changed. Check method to reassess.', radio.id); }); add(label, radio, node('span', o.label)); add(fs, label); });
    if (a.methodPoints !== null) add(fs, paragraph((a.methodChoices[q.id] === q.correctOption ? 'Correct. ' : 'Reconsider. ') + q.rationale, 'small'));
    add(p, fs);
  });
  add(p, button('Check method', () => { a.methodPoints = gradeMethod(a, c); saveAttempt(c, a); refresh('Method checked. ' + a.methodPoints + ' of 20 method points.', 'method-result'); }, 'check-method'));
  if (a.methodPoints !== null) { const r = paragraph(a.methodPoints + ' / 20 method points', 'result'); r.id = 'method-result'; r.tabIndex = -1; add(p, r); }
  return p;
}
function practice(c, a) {
  const p = panel('03 / Practice in authorized SecOps');
  add(p, paragraph('Open your approved SecOps manually. Replace symbols only there. Return no values, queries, logs, counts, or observations to this app.', 'notice'));
  const list = node('ol'); c.executeSteps.forEach(s => add(list, node('li', s))); add(p, list, paragraph(c.debrief, 'small muted'));
  const enabled = a.queryResult?.queryPoints === 70;
  for (const [key, text] of [['executedAcknowledged', 'I ran the adapted query in authorized workplace SecOps'], ['reviewedAcknowledged', 'I reviewed results or a zero-result limitation inside workplace tools']]) {
    const label = node('label', null, 'choice'), box = node('input'); box.type = 'checkbox'; box.id = key; box.checked = a[key]; box.disabled = !enabled;
    box.addEventListener('change', () => { a[key] = box.checked; saveAttempt(c, a); refresh('Practice acknowledgment updated. Execution remains self-attested.', key); }); add(label, box, node('span', text)); add(p, label);
  }
  add(p, paragraph(enabled ? 'Each acknowledgment gives 5 current-attempt points. Only both together save 10 practice points. If execution is unavailable, leave practice pending.' : 'First match the current symbolic query intent (70/70) to enable practice acknowledgments.', 'small muted')); return p;
}
function challenge(l, c) {
  const a = attemptFor(c), m = main(), layout = node('div', null, 'workspace'), body = node('div'); add(layout, sidebar(l), body);
  add(body, link('← ' + l.id + ' briefing', '#' + l.id), paragraph(c.id + ' / SYMBOLIC CHALLENGE', 'eyebrow'), node('h1', c.title), paragraph(c.prompt), paragraph('Search · YARA-L 2.0 · documentation-checked / tenant-unverified', 'tag'));
  const desk = node('div', null, 'desk'), left = node('div', null, 'stack'), right = node('aside', null, 'stack');
  add(left, composer(c, a), method(c, a), practice(c, a));
  const score = panel('Current attempt');
  const current = reduceAttempt(a, l.contentVersion), transient = a.queryResult?.queryPoints === 70 ? (Number(a.executedAcknowledged) + Number(a.reviewedAcknowledged)) * 5 : 0;
  add(score, paragraph(String(current.queryPoints + current.methodPoints + transient), 'progress-big'), paragraph('of 100 points', 'muted'));
  const rubric = node('div', null, 'rubric'); [['Query', current.queryPoints, 70], ['Method', current.methodPoints, 20], ['Practice', transient, 10]].forEach(([label, n, max]) => add(rubric, add(node('div'), node('strong', String(n)), node('span', label + ' / ' + max)))); add(score, rubric, paragraph(statusLabel(current), 'small good'));
  const best = records.find(r => r.challengeId === c.id); if (best) add(score, paragraph('Saved best: ' + total(best) + '/100 · ' + statusLabel(best), 'small muted'));
  add(score, paragraph('Changing query tokens clears the current assessment and acknowledgments. Saved best remains separate.', 'small muted'));
  const hints = panel('A nudge, when you need it');
  add(hints, paragraph('Hints have no point penalty. Hint 3 reveals a worked solution; scores are formative feedback.', 'small muted'));
  for (let i = 0; i < a.highestHint; i++) add(hints, node('h3', 'Hint ' + (i + 1)), i === 2 ? node('pre', c.hints[i], 'query-preview') : paragraph(c.hints[i], 'small'));
  if (a.highestHint < 3) add(hints, button('Reveal hint ' + (a.highestHint + 1), () => { a.highestHint++; saveAttempt(c, a); refresh('Hint ' + a.highestHint + ' revealed.', 'hint-panel'); }, 'next-hint'));
  if (a.highestHint === 3) add(hints, button('Load worked example', () => { attempts.set(c.id, changeTokens(a, authoredTokens(c.hints[2]))); refresh('Worked example loaded. Assess it, then explain the method.', 'check-query'); }, 'load-example'));
  hints.id = 'hint-panel'; hints.tabIndex = -1;
  add(right, score, hints, sourceLinks(l)); add(desk, left, right); add(body, desk);
  const next = challenges[challenges.indexOf(c) + 1]; add(body, add(node('div', null, 'row'), link(next ? 'Next challenge →' : 'Review course progress →', next ? '#' + next.id : '#progress', 'button-link')));
  add(m, layout); return m;
}
function progress() {
  const m = main('narrow'); add(m, paragraph('YOUR LEARNING RECORD', 'eyebrow'), node('h1', 'Progress, at your pace.'), paragraph(records.reduce((n, r) => n + total(r), 0) + ' / 1,200 formative points', 'progress-big'));
  const p = panel('Saved best, one attempt at a time');
  for (const c of challenges) { const r = records.find(x => x.challengeId === c.id); add(p, add(node('div', null, 'metric'), link(c.id + ' · ' + c.title, '#' + c.id), node('span', (r ? total(r) : 0) + '/100 · ' + statusLabel(r), 'small'))); }
  add(p, paragraph('A saved best combines query, method, and practice from one attempt. Highest hint use is tracked separately. A learner can edit browser storage; these records are not audit evidence.', 'small muted'), rememberChoice(), button('Clear progress', resetProgress, 'clear-progress'), paragraph('Clears only this course’s browser key and in-memory attempts. Other sites and courses are untouched.', 'small muted'));
  add(m, p); return m;
}
function privacy() {
  const m = main('narrow'); add(m, paragraph('THE WORKPLACE BOUNDARY', 'eyebrow'), node('h1', 'Keep the evidence where it belongs.'));
  const p = panel('What the app receives');
  add(p, paragraph('Only fixed synthetic query tokens, fixed method choices, hints, and execution/review acknowledgments. There is no actual-data input, upload, free query editor, tenant URL, or clipboard-reading feature.'), node('h3', 'What the app stores'), paragraph('Nothing across sessions by default. If enabled, this browser remembers challenge/content IDs, score components, highest hint level, and self-attested practice flags. Query text, method answers, results, identifiers, and timestamps are not saved.'), node('h3', 'What the app contacts'), paragraph('The app loads its static files from the host. It has no runtime AI, analytics, SIEM integration, automatic external content, or backend. Clicking an official reference opens that fixed public documentation link without a referrer. The host may keep ordinary access logs.'), node('h3', 'Limits of this protection'), paragraph('Browser owners, extensions, compromised releases, and scripts on the same origin can change or inspect the app. Local progress is untrusted. Use a dedicated approved origin; do not embed the course in another site. Hosting must enforce framing restrictions if required.'), node('h3', 'Your approved Copilot'), paragraph('Optional Copilot use belongs separately inside your approved work environment and organizational policy. It is not part of the course, a validator, or a reason to send workplace data to another service.'), node('h3', 'What the scores mean'), paragraph('Query structure 70%, fixed method choices 20%, and execution/review self-attestation 10%. This is personal practice, not certification, incident verification, or proof that Google’s compiler accepted a query.'), rememberChoice(), button('Clear progress', resetProgress, 'clear-progress'));
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
window.addEventListener('hashchange', () => { attempts.clear(); insertAt = null; render(); });
render();

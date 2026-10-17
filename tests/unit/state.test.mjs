import test from 'node:test';
import assert from 'node:assert/strict';
import { newAttempt, changeTokens, changeQuery, gradeMethod, reduceAttempt, bestAttempt, total } from '../../site/state/scoring.js';
import { STORAGE_KEY, LEGACY_STORAGE_KEY, validateProgress, projectProgress, loadProgress, saveProgress, clearProgress, forgetProgress } from '../../site/state/progress.js';
import { assertSchema } from '../../tools/schema.mjs';
import { contentBundle } from '../../tools/validate-content.mjs';
import fs from 'node:fs';
const bundle = contentBundle(), challenge = bundle.lessons[0].challenges[0];
const versions = new Map(bundle.lessons.flatMap(l => l.challenges.map(c => [c.id, l.contentVersion])));
const record = () => ({ challengeId: 'L01-C01', contentVersion: versions.get('L01-C01'), queryPoints: 70, methodPoints: 20, completionPoints: 10, completed: true, highestHint: 0 });
const storage = () => { const map = new Map([['unrelated-course', 'keep']]); return { map, getItem: k => map.get(k) ?? null, setItem: (k, v) => map.set(k, v), removeItem: k => map.delete(k) }; };
test('T10 full 70/20/10 requires query and method; completion never means a workplace run', () => {
  const a = newAttempt(challenge.id);
  a.queryResult = { queryPoints: 70 }; assert.equal(reduceAttempt(a, 3).completionPoints, 0);
  a.methodChoices = { M1: 'A', M2: 'B' }; a.methodPoints = gradeMethod(a, challenge);
  assert.equal(a.methodPoints, 20); assert.equal(total(reduceAttempt(a, 3)), 100);
  assert.equal(reduceAttempt(a, 3).completed, true);
  a.queryResult.queryPoints = 45; assert.equal(reduceAttempt(a, 3).completionPoints, 0);
  const changed = changeTokens(a, ['Field:0']); assert.equal(changed.queryResult, null); assert.equal(changed.methodPoints, null);
  assert.equal(Object.hasOwn(a, 'executedAcknowledged'), false); assert.equal(Object.hasOwn(a, 'reviewedAcknowledged'), false);
});
test('T10 saved score cannot mix components from different attempts; hints cost nothing', () => {
  const a = { ...record(), queryPoints: 70, methodPoints: 0, completionPoints: 0, completed: false };
  const b = { ...record(), queryPoints: 45, methodPoints: 20, completionPoints: 0, completed: false, highestHint: 3 };
  const best = bestAttempt(a, b); assert.equal(total(best), 70); assert.equal(best.methodPoints, 0); assert.equal(best.highestHint, 3);
  assert.equal(total(bestAttempt(record(), { ...record(), highestHint: 3 })), 100);
});
test('T13 opt-in projection omits query/feedback text and clear affects only course progress', () => {
  const s = storage(); assert.equal(loadProgress(s, versions).mode, 'session-only');
  assert.equal(saveProgress(s, [{ ...record(), query: 'DO_NOT_PERSIST', feedback: 'DO_NOT_PERSIST' }], versions), null);
  const raw = s.getItem(STORAGE_KEY); assert.ok(!raw.includes('DO_NOT_PERSIST')); assert.equal(loadProgress(s, versions).mode, 'remembered');
  s.setItem(LEGACY_STORAGE_KEY, 'old'); clearProgress(s);
  assert.equal(s.getItem(STORAGE_KEY), null); assert.equal(s.getItem(LEGACY_STORAGE_KEY), null); assert.equal(s.getItem('unrelated-course'), 'keep');
});
test('T13 prior completion schema remains untouched until explicit clear', () => {
  const s = storage(), raw = '{"schemaVersion":1,"records":[{"private":"SYNTHETIC_SENTINEL"}]}'; s.setItem(LEGACY_STORAGE_KEY, raw);
  const loaded = loadProgress(s, versions);
  assert.equal(loaded.warningCode, 'LESSON_CHANGED'); assert.equal(loaded.mode, 'session-only');
  assert.equal(s.getItem(LEGACY_STORAGE_KEY), raw); assert.equal(s.getItem(STORAGE_KEY), null); assert.doesNotMatch(JSON.stringify(loaded), /SYNTHETIC_SENTINEL/);
  assert.equal(saveProgress(s, [], versions), null); assert.equal(forgetProgress(s), null);
  assert.equal(s.getItem(STORAGE_KEY), null); assert.equal(s.getItem(LEGACY_STORAGE_KEY), raw);
});
test('T13 hostile stored state rejected without deletion or echo', () => {
  const valid = projectProgress([record()]);
  const bad = [null, {}, { ...valid, notes: 'PRIVATE_SENTINEL' }, { ...valid, schemaVersion: 3 }, { ...valid, schemaVersion: 1 }, { ...valid, courseVersion: 2 }, { ...valid, records: [record(), record()] }, { ...valid, records: [{ ...record(), queryPoints: 45 }] }, { ...valid, records: [{ ...record(), methodPoints: 10 }] }, { ...valid, records: [{ ...record(), completed: false }] }, { ...valid, records: [{ ...record(), queryPoints: 71 }] }, { ...valid, records: [{ ...record(), challengeId: '__proto__' }] }, JSON.parse('{"__proto__":{},"schemaVersion":2,"courseVersion":1,"rememberProgress":true,"records":[]}')];
  for (const input of bad) { assert.throws(() => validateProgress(input, versions)); const s = storage(); const raw = JSON.stringify(input); s.setItem(STORAGE_KEY, raw); const result = loadProgress(s, versions); assert.equal(result.mode, 'session-only'); assert.equal(result.progress.records.length, 0); assert.equal(s.getItem(STORAGE_KEY), raw); assert.doesNotMatch(JSON.stringify(result), /PRIVATE_SENTINEL/); }
  for (const raw of ['{', ' '.repeat(16385)]) { const s = storage(); s.setItem(STORAGE_KEY, raw); assert.equal(loadProgress(s, versions).warningCode, 'PROGRESS_INVALID'); }
});
test('T13 content-version invalidation is selective; blocked/quota storage falls back', () => {
  const changed = new Map(versions); changed.set('L01-C01', versions.get('L01-C01') + 1); const s = storage(); s.setItem(STORAGE_KEY, JSON.stringify(projectProgress([record()])));
  const loaded = loadProgress(s, changed); assert.equal(loaded.warningCode, 'LESSON_CHANGED'); assert.equal(loaded.progress.records.length, 0);
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); }, removeItem() { throw new Error('blocked'); } };
  assert.equal(loadProgress(blocked, versions).warningCode, 'STORAGE_UNAVAILABLE'); assert.equal(saveProgress(blocked, [record()], versions), 'STORAGE_UNAVAILABLE'); assert.equal(clearProgress(blocked), 'STORAGE_UNAVAILABLE');
});
test('T02 schema validator rejects unknown keys, invalid type and completion correlation', () => {
  const schema = JSON.parse(fs.readFileSync(new URL('../../schemas/progress.schema.json', import.meta.url)));
  assert.doesNotThrow(() => assertSchema(projectProgress([record()]), schema));
  assert.throws(() => assertSchema(projectProgress([{ ...record(), queryPoints: '70' }]), schema));
  assert.throws(() => assertSchema({ ...projectProgress([]), extra: true }, schema));
  assert.throws(() => assertSchema(projectProgress([{ ...record(), methodPoints: 0 }]), schema));
});
test('T05/T10 typed-query edit clears current query/method/completion without persisting text', () => {
  const a = { ...newAttempt('L01-C01'), queryText: 'old', queryResult: { queryPoints: 70 }, methodChoices: { M1: 'A', M2: 'B' }, methodPoints: 20, highestHint: 2 };
  const next = changeQuery(a, 'SYNTHETIC_PRIVATE_SENTINEL');
  assert.equal(next.queryResult, null); assert.equal(next.methodPoints, null); assert.equal(reduceAttempt(next, 3).completed, false);
  assert.deepEqual(next.methodChoices, { M1: null, M2: null }); assert.equal(next.highestHint, 2); assert.equal(next.queryText, 'SYNTHETIC_PRIVATE_SENTINEL');
  assert.doesNotMatch(JSON.stringify(projectProgress([reduceAttempt(next, 3)])), /SYNTHETIC_PRIVATE_SENTINEL|queryText|tokenIds|methodChoices/);
});

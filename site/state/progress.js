export const STORAGE_KEY = 'kc7-secops:mwill20:KC7-SecOps:progress:v2';
export const LEGACY_STORAGE_KEY = 'kc7-secops:mwill20:KC7-SecOps:progress:v1';
const rootKeys = ['schemaVersion', 'courseVersion', 'rememberProgress', 'records'];
const recordKeys = ['challengeId', 'contentVersion', 'queryPoints', 'methodPoints', 'completionPoints', 'completed', 'highestHint'];
const shape = (x, keys) => x !== null && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).length === keys.length && keys.every(k => Object.hasOwn(x, k));
export const projectProgress = records => ({ schemaVersion: 2, courseVersion: 1, rememberProgress: true, records: records.map(r => ({ challengeId: r.challengeId, contentVersion: r.contentVersion, queryPoints: r.queryPoints, methodPoints: r.methodPoints, completionPoints: r.completionPoints, completed: r.completed, highestHint: r.highestHint })) });
export function validateProgress(input, versions) {
  if (!shape(input, rootKeys) || input.schemaVersion !== 2 || input.courseVersion !== 1 || input.rememberProgress !== true || !Array.isArray(input.records) || input.records.length > 16) throw new Error('PROGRESS_INVALID');
  const ids = new Set(); let stale = false;
  const records = [];
  for (const r of input.records) {
    if (!shape(r, recordKeys) || !versions.has(r.challengeId) || ids.has(r.challengeId) || !Number.isSafeInteger(r.contentVersion) || r.contentVersion < 1 || ![0, 10, 35, 45, 70].includes(r.queryPoints) || ![0, 10, 20].includes(r.methodPoints) || ![0, 10].includes(r.completionPoints) || typeof r.completed !== 'boolean' || ![0, 1, 2, 3].includes(r.highestHint) || r.completed !== (r.completionPoints === 10) || (r.completed && (r.queryPoints !== 70 || r.methodPoints !== 20))) throw new Error('PROGRESS_INVALID');
    ids.add(r.challengeId);
    if (r.contentVersion !== versions.get(r.challengeId)) stale = true;
    else records.push(r);
  }
  return { progress: projectProgress(records), warningCode: stale ? 'LESSON_CHANGED' : null };
}
export function loadProgress(storage, versions) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { mode: 'session-only', progress: projectProgress([]), warningCode: storage.getItem(LEGACY_STORAGE_KEY) === null ? null : 'LESSON_CHANGED' };
    if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > 16384) throw new Error('PROGRESS_INVALID');
    const validated = validateProgress(JSON.parse(raw), versions);
    return { mode: 'remembered', ...validated };
  } catch (error) {
    return { mode: 'session-only', progress: projectProgress([]), warningCode: error?.message === 'PROGRESS_INVALID' || error instanceof SyntaxError ? 'PROGRESS_INVALID' : 'STORAGE_UNAVAILABLE' };
  }
}
export function saveProgress(storage, records, versions) {
  try {
    const { progress } = validateProgress(projectProgress(records), versions);
    const raw = JSON.stringify(progress);
    if (new TextEncoder().encode(raw).length > 16384) throw new Error('PROGRESS_INVALID');
    storage.setItem(STORAGE_KEY, raw);
    return null;
  } catch { return 'STORAGE_UNAVAILABLE'; }
}
export function clearProgress(storage) {
  try { storage.removeItem(STORAGE_KEY); storage.removeItem(LEGACY_STORAGE_KEY); return null; } catch { return 'STORAGE_UNAVAILABLE'; }
}
export function forgetProgress(storage) {
  try { storage.removeItem(STORAGE_KEY); return null; } catch { return 'STORAGE_UNAVAILABLE'; }
}

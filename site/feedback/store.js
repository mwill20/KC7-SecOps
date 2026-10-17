export const FEEDBACK_DB = 'kc7-secops:mwill20:KC7-SecOps:feedback:v1';
export const LIMITS = Object.freeze({ records: 50, text: 4000, images: 3, imageBytes: 2 * 1024 * 1024, pixels: 8000000, side: 8192, totalPixels: 32000000, totalBytes: 10 * 1024 * 1024 });
export const CATEGORIES = Object.freeze(['Teaching', 'Query syntax', 'Field mapping', 'Bug', 'Upgrade idea']);
const pages = new Set(['onboarding', 'course', 'privacy', 'progress', 'missing', ...Array.from({ length: 6 }, (_, i) => 'L0' + (i + 1)), ...Array.from({ length: 6 }, (_, i) => Array.from({ length: i === 0 ? 6 : 2 }, (_, j) => 'L0' + (i + 1) + '-C0' + (j + 1))).flat()]);
const imageTypes = ['image/png', 'image/jpeg', 'image/webp'];
const keys = ['id', 'createdAt', 'pageId', 'contentVersion', 'category', 'text', 'screenshots'];
const shape = (x, expected) => x !== null && typeof x === 'object' && !Array.isArray(x) && Object.keys(x).length === expected.length && expected.every(k => Object.hasOwn(x, k));
const fail = code => { throw new Error(code); };
export function validateFeedback(record) {
  if (!shape(record, keys) || typeof record.id !== 'string' || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(record.id) || typeof record.createdAt !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(record.createdAt) || !Number.isFinite(Date.parse(record.createdAt)) || !pages.has(record.pageId) || !(record.contentVersion === null || Number.isSafeInteger(record.contentVersion) && record.contentVersion > 0) || !CATEGORIES.includes(record.category) || typeof record.text !== 'string' || record.text.length > LIMITS.text || !Array.isArray(record.screenshots) || record.screenshots.length > LIMITS.images || (!record.text.trim() && !record.screenshots.length)) fail('FEEDBACK_INVALID');
  for (const image of record.screenshots) {
    if (!shape(image, ['blob', 'width', 'height']) || !(image.blob instanceof Blob) || !imageTypes.includes(image.blob.type) || image.blob.size < 1 || image.blob.size > LIMITS.imageBytes || !Number.isSafeInteger(image.width) || !Number.isSafeInteger(image.height) || !validDimensions(image.width, image.height)) fail('FEEDBACK_IMAGE');
  }
  return record;
}
export async function prepareImage(blob) {
  if (!(blob instanceof Blob) || !imageTypes.includes(blob.type) || blob.size < 1 || blob.size > LIMITS.imageBytes) fail('FEEDBACK_IMAGE');
  const b = new Uint8Array(await blob.arrayBuffer());
  const png = b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71 && b[4] === 13 && b[5] === 10 && b[6] === 26 && b[7] === 10;
  const jpeg = b[0] === 255 && b[1] === 216 && b[2] === 255;
  const webp = String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP';
  if (!(blob.type === 'image/png' && png || blob.type === 'image/jpeg' && jpeg || blob.type === 'image/webp' && webp)) fail('FEEDBACK_IMAGE');
  if (png) {
    const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
    for (let i = 8; i + 12 <= b.length;) {
      const length = view.getUint32(i);
      if (length > b.length - i - 12) fail('FEEDBACK_IMAGE');
      if (String.fromCharCode(...b.slice(i + 4, i + 8)) === 'acTL') fail('FEEDBACK_IMAGE');
      i += length + 12;
    }
  }
  if (webp && String.fromCharCode(...b.slice(12, 16)) === 'VP8X' && (b[20] & 2)) fail('FEEDBACK_IMAGE');
  const [width, height] = dimensions(b, blob.type);
  if (!validDimensions(width, height)) fail('FEEDBACK_IMAGE');
  let bitmap;
  try {
    bitmap = await createImageBitmap(blob);
    if (!validDimensions(bitmap.width, bitmap.height)) fail('FEEDBACK_IMAGE');
    return { blob: new Blob([blob], { type: blob.type }), width: bitmap.width, height: bitmap.height };
  } catch { fail('FEEDBACK_IMAGE'); }
  finally { bitmap?.close(); }
}
const validDimensions = (w, h) => Number.isSafeInteger(w) && Number.isSafeInteger(h) && w > 0 && h > 0 && w <= LIMITS.side && h <= LIMITS.side && w * h <= LIMITS.pixels;
function dimensions(b, type) {
  const u16 = i => b[i] * 256 + b[i + 1];
  const le24 = i => b[i] + b[i + 1] * 256 + b[i + 2] * 65536;
  const word = i => String.fromCharCode(...b.slice(i, i + 4));
  if (type === 'image/png' && b.length >= 24 && word(12) === 'IHDR') {
    const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
    return [v.getUint32(16), v.getUint32(20)];
  }
  if (type === 'image/webp' && b.length >= 30) {
    if (word(12) === 'VP8X') return [le24(24) + 1, le24(27) + 1];
    if (word(12) === 'VP8 ' && b[23] === 157 && b[24] === 1 && b[25] === 42) return [(b[26] + b[27] * 256) & 16383, (b[28] + b[29] * 256) & 16383];
    if (word(12) === 'VP8L' && b[20] === 47) return [1 + b[21] + (b[22] & 63) * 256, 1 + (b[22] >> 6) + b[23] * 4 + (b[24] & 15) * 1024];
  }
  if (type === 'image/jpeg') {
    let p = 2;
    while (p + 4 <= b.length) {
      if (b[p++] !== 255) break;
      while (b[p] === 255) p++;
      const marker = b[p++];
      if (marker === 217 || marker === 218) break;
      const length = u16(p);
      if (length < 2 || p + length > b.length) break;
      if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker) && length >= 7) return [u16(p + 5), u16(p + 3)];
      p += length;
    }
  }
  fail('FEEDBACK_IMAGE');
}
function openDatabase() {
  return new Promise((resolve, reject) => {
    let request, blocked = false;
    try { request = indexedDB.open(FEEDBACK_DB, 1); } catch { reject(new Error('FEEDBACK_STORAGE')); return; }
    request.onupgradeneeded = () => request.result.createObjectStore('entries', { keyPath: 'id' });
    request.onerror = () => reject(new Error('FEEDBACK_STORAGE'));
    request.onblocked = () => { blocked = true; reject(new Error('FEEDBACK_STORAGE')); };
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}
const sizeOf = record => new TextEncoder().encode(record.text).length + record.screenshots.reduce((n, x) => n + x.blob.size, 0);
const pixelsOf = record => record.screenshots.reduce((n, x) => n + x.width * x.height, 0);
async function transact(mode, action) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let tx, result, errorCode = 'FEEDBACK_STORAGE';
    try {
      tx = db.transaction('entries', mode);
      tx.oncomplete = () => { db.close(); resolve(result); };
      tx.onabort = tx.onerror = () => { db.close(); reject(new Error(errorCode)); };
      const stop = error => { errorCode = ['FEEDBACK_INVALID', 'FEEDBACK_IMAGE', 'FEEDBACK_CAPACITY'].includes(error?.message) ? error.message : 'FEEDBACK_STORAGE'; tx.abort(); };
      action(tx.objectStore('entries'), value => { result = value; }, stop);
    } catch { db.close(); reject(new Error('FEEDBACK_STORAGE')); }
  });
}
function collect(store, done, stop) {
  const entries = []; let bytes = 0, pixels = 0;
  const request = store.openCursor();
  request.onsuccess = () => {
    try {
      const cursor = request.result;
      if (!cursor) { done(entries, bytes, pixels); return; }
      const record = validateFeedback(cursor.value);
      if (entries.length >= LIMITS.records || (bytes += sizeOf(record)) > LIMITS.totalBytes || (pixels += pixelsOf(record)) > LIMITS.totalPixels) fail('FEEDBACK_CAPACITY');
      entries.push(record); cursor.continue();
    } catch (error) { stop(error); }
  };
}
export function readFeedback() {
  return transact('readonly', (store, result, stop) => collect(store, entries => result(entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt))), stop));
}
export function saveFeedback(record) {
  validateFeedback(record);
  return transact('readwrite', (store, result, stop) => collect(store, (entries, bytes, pixels) => {
    try {
      if (entries.length >= LIMITS.records || bytes + sizeOf(record) > LIMITS.totalBytes || pixels + pixelsOf(record) > LIMITS.totalPixels) fail('FEEDBACK_CAPACITY');
      store.add(record); result(true);
    } catch (error) { stop(error); }
  }, stop));
}
export function deleteFeedback(id) {
  if (typeof id !== 'string' || !/^[a-f0-9-]{36}$/.test(id)) fail('FEEDBACK_INVALID');
  return transact('readwrite', (store, result) => { store.delete(id); result(true); });
}
function base64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(new Error('FEEDBACK_STORAGE'));
    reader.readAsDataURL(blob);
  });
}
export async function exportFeedback(entries) {
  if (!Array.isArray(entries) || entries.length > LIMITS.records) fail('FEEDBACK_INVALID');
  let bytes = 0, pixels = 0; const feedback = [];
  for (const entry of entries) {
    const r = validateFeedback(entry);
    if ((bytes += sizeOf(r)) > LIMITS.totalBytes || (pixels += pixelsOf(r)) > LIMITS.totalPixels) fail('FEEDBACK_CAPACITY');
    const screenshots = [];
    for (const image of r.screenshots) screenshots.push({ mimeType: image.blob.type, width: image.width, height: image.height, base64: await base64(image.blob) });
    feedback.push({ id: r.id, createdAt: r.createdAt, pageId: r.pageId, contentVersion: r.contentVersion, category: r.category, text: r.text, screenshots });
  }
  return JSON.stringify({ schemaVersion: 1, product: 'KC7 SecOps feedback', feedback }, null, 2);
}

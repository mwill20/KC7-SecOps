import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFeedback, prepareImage, LIMITS } from '../../site/feedback/store.js';
const record = () => ({ id: '00000000-0000-4000-8000-000000000001', createdAt: '2026-10-17T12:00:00.000Z', pageId: 'L01-C03', contentVersion: 3, category: 'Teaching', text: 'Explain the output variable.', screenshots: [] });
test('F01 feedback records accept only bounded explicit data and fixed page context', () => {
  assert.equal(validateFeedback(record()).pageId, 'L01-C03');
  const mutations = [r => { r.query = 'SYNTHETIC_PRIVATE'; }, r => { r.pageId = 'https://example.org/private'; }, r => { r.pageId = 'L02-C06'; }, r => { r.text = 'x'.repeat(LIMITS.text + 1); }, r => { r.text = ''; }, r => { r.category = 'custom'; }, r => { r.createdAt = 'invalid'; }, r => { r.id = '__proto__'; }, r => { r.contentVersion = -1; }];
  for (const mutate of mutations) { const r = record(); mutate(r); assert.throws(() => validateFeedback(r), /FEEDBACK_INVALID/); }
});
test('F02 screenshot shape, bytes, dimensions and count reject invalid or oversized data', () => {
  const image = { blob: new Blob(['synthetic'], { type: 'image/png' }), width: 8, height: 8 };
  assert.doesNotThrow(() => validateFeedback({ ...record(), screenshots: [image] }));
  for (const bad of [{ ...image, blob: new Blob(['<svg/>'], { type: 'image/svg+xml' }) }, { ...image, width: 0 }, { ...image, width: LIMITS.side + 1 }, { ...image, height: 8000, width: 8000 }, { ...image, blob: new Blob([new Uint8Array(LIMITS.imageBytes + 1)], { type: 'image/png' }) }, { ...image, filename: 'internal-name' }]) assert.throws(() => validateFeedback({ ...record(), screenshots: [bad] }), /FEEDBACK_IMAGE/);
  assert.throws(() => validateFeedback({ ...record(), screenshots: [image, image, image, image] }), /FEEDBACK_INVALID/);
});
test('F02 declared image dimensions are bounded before invoking the decoder', async () => {
  let decodes = 0; const previous = globalThis.createImageBitmap;
  globalThis.createImageBitmap = async () => { decodes++; throw new Error('not a real image'); };
  try {
    const bytes = new Uint8Array(24); bytes.set([137, 80, 78, 71, 13, 10, 26, 10]); bytes.set([73, 72, 68, 82], 12);
    const view = new DataView(bytes.buffer); view.setUint32(16, 100000); view.setUint32(20, 100000);
    await assert.rejects(prepareImage(new Blob([bytes], { type: 'image/png' })), /FEEDBACK_IMAGE/);
    await assert.rejects(prepareImage(new Blob(['<svg/>'], { type: 'image/png' })), /FEEDBACK_IMAGE/);
    assert.equal(decodes, 0);
    view.setUint32(16, 8); view.setUint32(20, 8);
    await assert.rejects(prepareImage(new Blob([bytes], { type: 'image/png' })), /FEEDBACK_IMAGE/);
    assert.equal(decodes, 1);
  } finally { if (previous === undefined) delete globalThis.createImageBitmap; else globalThis.createImageBitmap = previous; }
});

import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import { enter } from './helpers.mjs';
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '../../site/state/progress.js';
async function openFeedback(page) {
  await page.locator('#feedback-open').click();
  await expect(page.getByRole('dialog', { name: 'Feedback & upgrade ideas' })).toBeVisible();
  await expect(page.locator('#feedback-saved')).not.toContainText('Loading');
}
async function pasteImage(page, type = 'image/png', invalid = false) {
  await page.locator('#feedback-text').evaluate(async (el, { type, invalid }) => {
    let blob;
    if (invalid) blob = new Blob(['<svg><script>SYNTHETIC_SENTINEL</script></svg>'], { type });
    else {
      const canvas = document.createElement('canvas'); canvas.width = 16; canvas.height = 12;
      canvas.getContext('2d').fillRect(0, 0, 16, 12);
      blob = await new Promise(resolve => canvas.toBlob(resolve, type));
    }
    const clipboard = new DataTransfer(); clipboard.items.add(new File([blob], 'synthetic-image', { type: blob.type }));
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: clipboard, bubbles: true, cancelable: true }));
  }, { type, invalid });
}
test('T13 opting out of new progress preserves the older record until Clear progress', async ({ page }) => {
  await page.addInitScript(key=>localStorage.setItem(key,'SYNTHETIC_OLD_RECORD'),LEGACY_STORAGE_KEY);
  await enter(page,'#progress');
  await page.locator('#remember').check(); await page.locator('#remember').uncheck();
  expect(await page.evaluate(key=>localStorage.getItem(key),LEGACY_STORAGE_KEY)).toBe('SYNTHETIC_OLD_RECORD');
  expect(await page.evaluate(key=>localStorage.getItem(key),STORAGE_KEY)).toBe(null);
  await page.locator('#clear-progress').click();
  expect(await page.evaluate(key=>localStorage.getItem(key),LEGACY_STORAGE_KEY)).toBe(null);
});
test('F01 every page exposes feedback; explicit paste/save/reload/export retains images privately', async ({ page }) => {
  const requests = []; page.on('request', r => requests.push(r));
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { read: () => { throw new Error('Programmatic clipboard read'); }, readText: () => { throw new Error('Programmatic clipboard read'); } } });
  });
  await page.goto('/'); await openFeedback(page);
  await page.locator('#feedback-close').click();
  await page.locator('#boundary').check(); await page.locator('#open-course').click();
  for (const route of ['#course', '#L01', '#L01-C03', '#progress', '#privacy', '#bad-route']) {
    await page.goto('/' + route); await expect(page.locator('#feedback-open')).toBeVisible();
  }
  await page.goto('/#L01-C03'); await openFeedback(page);
  const note = '<img src=https://example.org/SYNTHETIC_SENTINEL> Explain count_distinct first.';
  await page.locator('#feedback-text').fill(note);
  for (const type of ['image/png', 'image/jpeg', 'image/webp']) {
    await pasteImage(page, type); await expect(page.locator('#feedback-status')).toContainText('Screenshot pasted');
  }
  await expect(page.locator('#feedback-images img')).toHaveCount(3);
  await page.locator('#feedback-save').click(); await expect(page.locator('#feedback-status')).toContainText('Saved in this browser');
  await expect(page.locator('.feedback-entry')).toHaveCount(1);
  await page.reload(); await openFeedback(page);
  await expect(page.locator('.feedback-entry')).toContainText(note); await expect(page.locator('.feedback-entry img')).toHaveCount(3);
  expect(await page.evaluate(async () => (await (await import('/feedback/store.js')).readFeedback())[0].screenshots.every(x => !(x.blob instanceof File) && !('name' in x.blob) && !('lastModified' in x.blob)))).toBe(true);
  const downloadPromise = page.waitForEvent('download'); await page.locator('#feedback-export').click(); const download = await downloadPromise;
  const parsed = JSON.parse(await fs.readFile(await download.path(), 'utf8'));
  expect(parsed.product).toBe('KC7 SecOps feedback'); expect(parsed.feedback[0].pageId).toBe('L01-C03'); expect(parsed.feedback[0].text).toBe(note);
  expect(parsed.feedback[0].screenshots.map(x => x.mimeType)).toEqual(['image/png', 'image/jpeg', 'image/webp']);
  for (const x of parsed.feedback[0].screenshots) { expect(x.width).toBe(16); expect(x.height).toBe(12); expect(Buffer.from(x.base64, 'base64').length).toBeGreaterThan(10); }
  expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe(null);
  for (const r of requests) { const url = r.url(); expect(url).not.toContain('SYNTHETIC'); expect(r.method()).toBe('GET'); expect(r.postData()).toBe(null); if (!url.startsWith('blob:')) { expect(new URL(url).origin).toBe('http://127.0.0.1:4173'); expect(new URL(url).search).toBe(''); } }
  await page.locator('.feedback-entry button').filter({ hasText: 'Delete this feedback' }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click(); await expect(page.locator('.feedback-entry')).toHaveCount(1);
  await page.getByRole('button', { name: 'Delete this feedback', exact: true }).click();
  await page.getByRole('button', { name: 'Delete permanently', exact: true }).click(); await expect(page.locator('.feedback-entry')).toHaveCount(0);
});
test('F02 unsupported/forged/oversized images are rejected before storing; normal text is literal', async ({ page }) => {
  await enter(page, '#L01-C03'); await openFeedback(page);
  await pasteImage(page, 'image/svg+xml', true); await expect(page.locator('#feedback-status')).toContainText('Image rejected'); await expect(page.locator('#feedback-images img')).toHaveCount(0);
  await pasteImage(page, 'image/png', true); await expect(page.locator('#feedback-status')).toContainText('Image rejected');
  await page.locator('#feedback-text').evaluate(el => {
    const bytes = new Uint8Array(24); bytes.set([137,80,78,71,13,10,26,10]); bytes.set([73,72,68,82],12); const v = new DataView(bytes.buffer); v.setUint32(16,100000); v.setUint32(20,100000);
    const dt = new DataTransfer(); dt.items.add(new File([bytes], 'large.png', { type:'image/png' })); el.dispatchEvent(new ClipboardEvent('paste', { clipboardData:dt, bubbles:true,cancelable:true }));
  });
  await expect(page.locator('#feedback-status')).toContainText('Image rejected'); await expect(page.locator('#feedback-images img')).toHaveCount(0);
  await page.locator('#feedback-save').click(); await expect(page.locator('#feedback-status')).toContainText('Add a comment or screenshot');
  await page.locator('#feedback-text').fill('A safe synthetic note'); await page.locator('#feedback-save').click(); await expect(page.locator('.feedback-entry')).toHaveCount(1);
});
test('F03 storage errors retain an exportable draft; course remains usable', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'indexedDB', { value: { open() { throw new DOMException('Blocked', 'SecurityError'); } } }); });
  await enter(page, '#L01-C01'); await openFeedback(page);
  await page.locator('#feedback-text').fill('SYNTHETIC_DRAFT'); await page.locator('#feedback-save').click();
  await expect(page.locator('#feedback-status')).toContainText('storage is unavailable'); await expect(page.locator('#feedback-text')).toHaveValue('SYNTHETIC_DRAFT');
  const pending = page.waitForEvent('download'); await page.locator('#feedback-export-draft').click(); const file = await pending;
  expect(JSON.parse(await fs.readFile(await file.path(), 'utf8')).feedback[0].text).toBe('SYNTHETIC_DRAFT');
  await page.keyboard.press('Escape'); await page.locator('#check-query').click(); await expect(page.locator('#query-result')).toContainText('70 / 70');
});
test('F04 bounded storage refuses overflow without eviction; progress clearing keeps feedback', async ({ page }) => {
  await enter(page); await openFeedback(page);
  await page.evaluate(async () => {
    const { saveFeedback } = await import('/feedback/store.js');
    for (let i = 0; i < 50; i++) await saveFeedback({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), pageId:'course',contentVersion:null,category:'Upgrade idea',text:'Synthetic capacity entry '+i,screenshots:[] });
  });
  await page.locator('#feedback-close').click(); await openFeedback(page); await expect(page.locator('.feedback-entry')).toHaveCount(50);
  await page.locator('#feedback-text').fill('SYNTHETIC_OVERFLOW'); await page.locator('#feedback-save').click(); await expect(page.locator('#feedback-status')).toContainText('storage is full');
  await expect(page.locator('#feedback-text')).toHaveValue('SYNTHETIC_OVERFLOW');
  expect(await page.evaluate(async () => (await (await import('/feedback/store.js')).readFeedback()).length)).toBe(50);
  await page.locator('#feedback-close').click();
  await page.goto('/#progress'); await page.locator('#clear-progress').click();
  expect(await page.evaluate(async () => (await (await import('/feedback/store.js')).readFeedback()).length)).toBe(50);
});
test('F05 write failure rolls back and preserves the draft for export', async ({ page }) => {
  await enter(page); await openFeedback(page);
  await page.evaluate(() => { IDBObjectStore.prototype.add = () => { throw new DOMException('Quota', 'QuotaExceededError'); }; });
  await page.locator('#feedback-text').fill('SYNTHETIC_QUOTA_DRAFT'); await page.locator('#feedback-save').click();
  await expect(page.locator('#feedback-status')).toContainText('storage is unavailable');
  await expect(page.locator('#feedback-text')).toHaveValue('SYNTHETIC_QUOTA_DRAFT');
  expect(await page.evaluate(async () => (await (await import('/feedback/store.js')).readFeedback()).length)).toBe(0);
});
test('F06 malformed stored feedback is not reflected or silently deleted', async ({ page }) => {
  await enter(page); await openFeedback(page); await page.locator('#feedback-close').click();
  await page.evaluate(async () => {
    const { FEEDBACK_DB } = await import('/feedback/store.js');
    await new Promise((resolve, reject) => {
      const request = indexedDB.open(FEEDBACK_DB, 1); request.onerror = reject;
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction('entries','readwrite');
        tx.objectStore('entries').add({id:'00000000-0000-4000-8000-000000000001',text:'<img src=x>SYNTHETIC_STORED_SENTINEL',extra:true});
        tx.oncomplete = () => { db.close(); resolve(); };
      };
    });
  });
  await openFeedback(page);
  await expect(page.locator('#feedback-saved')).toContainText('unavailable');
  await expect(page.getByRole('dialog')).not.toContainText('SYNTHETIC_STORED_SENTINEL');
  await expect(page.locator('#feedback-saved img')).toHaveCount(0);
  expect(await page.evaluate(async () => {
    const { FEEDBACK_DB } = await import('/feedback/store.js');
    return await new Promise(resolve => { const r=indexedDB.open(FEEDBACK_DB,1); r.onsuccess=()=>{ const db=r.result,tx=db.transaction('entries'),q=tx.objectStore('entries').count(); q.onsuccess=()=>resolve(q.result); tx.oncomplete=()=>db.close(); }; });
  })).toBe(1);
});
test('F07 feedback dialog is keyboard accessible at 320px; Escape returns to the launcher', async ({ page }) => {
  await enter(page); await page.setViewportSize({width:320,height:800});
  await page.locator('#feedback-open').focus(); await page.keyboard.press('Enter'); await expect(page.locator('#feedback-text')).toBeFocused();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await page.getByRole('dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.screenshot({path:'test-results/feedback-mobile.png',fullPage:true});
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).not.toBeVisible(); await expect(page.locator('#feedback-open')).toBeFocused();
});
test('R03 language fundamentals are explained before questions; explicit AND and implicit AND both grade', async ({ page }) => {
  await enter(page, '#L01-C02');
  await expect(page.locator('.breakdown')).toContainText('implicit AND');
  await page.locator('#query-editor').fill('metadata.event_type = "USER_LOGIN"\nsecurity_result.action = "ALLOW"');
  await page.locator('#check-query').click(); await expect(page.locator('#query-result')).toContainText('70 / 70');
  await page.locator('#query-editor').fill('metadata.event_type = "USER_LOGIN"\nAND security_result.action = "ALLOW"');
  await page.locator('#check-query').click(); await expect(page.locator('#query-result')).toContainText('70 / 70');
  await page.goto('/#L01-C03');
  await expect(page.getByRole('heading', { name:'Watch one',exact:true })).toBeVisible();
  await expect(page.locator('.breakdown')).toContainText('inside the function name count_distinct');
  await expect(page.locator('.breakdown')).toContainText('empty string');
  await expect(page.locator('.breakdown')).toContainText('Assign the calculation');
  await expect(page.locator('#query-editor')).toHaveValue(/count_distinct\(principal.user.userid\)/);
  await page.locator('#M1-B').check(); await page.locator('#check-method').click();
  await expect(page.locator('.method-rationale').first()).toContainText('The full function name is count_distinct');
  await expect(page.locator('main')).not.toContainText('Reconsider.');
  await expect(page.locator('main')).not.toContainText("already knows every tenant");
  await expect(page.getByRole('heading', { name:/Practice in authorized SecOps/ })).toHaveCount(0);
});
test('F08 delayed real storage locks the draft so edits cannot be lost during saving', async ({ page }) => {
  await page.addInitScript(() => {
    const open = indexedDB.open.bind(indexedDB);
    indexedDB.open = (...args) => {
      const real = open(...args);
      const proxy = { get result() { return real.result; }, onupgradeneeded:null, onerror:null, onblocked:null, onsuccess:null };
      real.onupgradeneeded = event => proxy.onupgradeneeded?.(event);
      real.onerror = event => proxy.onerror?.(event);
      real.onblocked = event => proxy.onblocked?.(event);
      real.onsuccess = event => setTimeout(() => proxy.onsuccess?.(event), 500);
      return proxy;
    };
  });
  await enter(page); await openFeedback(page); await page.locator('#feedback-text').fill('SYNTHETIC_SAVED_SNAPSHOT');
  await pasteImage(page); await expect(page.locator('#feedback-images img')).toHaveCount(1);
  await page.locator('#feedback-save').click();
  await expect(page.locator('#feedback-text')).toBeDisabled(); await expect(page.locator('#feedback-category')).toBeDisabled();
  await expect(page.locator('#feedback-images button')).toBeDisabled();
  await expect(page.locator('#feedback-status')).toContainText('Saved in this browser');
  await expect(page.locator('#feedback-text')).toBeEnabled(); await expect(page.locator('#feedback-text')).toHaveValue('');
  await expect(page.locator('.feedback-entry')).toContainText('SYNTHETIC_SAVED_SNAPSHOT');
});

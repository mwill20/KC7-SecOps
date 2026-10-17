import { test, expect } from '@playwright/test';
import { enter, workedExample } from './helpers.mjs';
import { contentBundle } from '../../tools/validate-content.mjs';
import { STORAGE_KEY } from '../../site/state/progress.js';
const bundle = contentBundle();
test('T02/T04/T10/T15 all 16 missions reach mission completion without tenant execution', async ({ page }) => {
  await enter(page);
  for (const l of bundle.lessons) for (const c of l.challenges) {
    await page.goto('/#' + c.id); await workedExample(page);
    for (const q of c.methodQuestions) await page.locator('#' + q.id + '-' + q.correctOption).check();
    await page.locator('#check-method').click();
    await expect(page.getByText('Mission complete', { exact: true })).toBeVisible();
  }
  await page.goto('/#progress'); await expect(page.locator('.progress-big')).toContainText('1600 / 1,600');
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
});
test('T05/T11 actual flow makes only allowlisted static requests; no payload or secondary store', async ({ page }) => {
  const requests = [], errors = []; page.on('request', r => requests.push({ url: r.url(), method: r.method(), body: r.postData() })); page.on('pageerror', e => errors.push(e.message));
  await page.addInitScript(() => {
    window.__boundaryCalls = [];
    for (const method of ['fetch', 'WebSocket', 'XMLHttpRequest', 'Worker']) Object.defineProperty(window, method, { value: () => { window.__boundaryCalls.push(method); throw new Error('Boundary call'); } });
    Object.defineProperty(navigator, 'sendBeacon', { value: () => { window.__boundaryCalls.push('beacon'); return false; } });
    Object.defineProperty(navigator, 'clipboard', { value: { read: () => { window.__boundaryCalls.push('clipboard.read'); throw new Error(); }, readText: () => { window.__boundaryCalls.push('clipboard.readText'); throw new Error(); }, writeText: async () => { window.__boundaryCalls.push('clipboard.writeText'); throw new Error(); } } });
  });
  await enter(page, '#L03-C02'); await workedExample(page);
  await page.locator('#copy-query').click(); await expect(page.locator('#live')).toContainText('Clipboard unavailable');
  await page.goto('/#progress'); await page.locator('#remember').check();
  const stored = await page.evaluate(key => ({ raw: localStorage.getItem(key), session: sessionStorage.length, cookies: document.cookie }), STORAGE_KEY);
  expect(stored.session).toBe(0); expect(stored.cookies).toBe('');
  const saved = JSON.parse(stored.raw); expect(saved.records[0].completionPoints).toBe(0);
  expect(Object.keys(saved.records[0]).sort()).toEqual(['challengeId', 'contentVersion', 'queryPoints', 'methodPoints', 'completionPoints', 'completed', 'highestHint'].sort());
  expect(stored.raw).not.toMatch(/__USER__|referenceQuery|tokenIds|methodChoices|timestamp/);
  await page.evaluate(() => localStorage.setItem('other-course', 'keep'));
  await page.locator('#clear-progress').click(); expect(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)).toBe(null);
  expect(await page.evaluate(() => localStorage.getItem('other-course'))).toBe('keep');
  expect(await page.evaluate(() => window.__boundaryCalls)).toEqual(['clipboard.writeText']); expect(errors).toEqual([]);
  const allowed = new Set(['/', '/index.html', '/styles.css', '/favicon.svg', '/app.js', '/content.js', '/query/catalog.js', '/query/serializer.js', '/query/parser.js', '/query/equivalence.js', '/query/evaluate.js', '/state/scoring.js', '/state/progress.js', '/feedback/store.js', '/feedback/widget.js']);
  for (const r of requests) { const u = new URL(r.url); expect(u.origin).toBe('http://127.0.0.1:4173'); expect(allowed.has(u.pathname)).toBe(true); expect(u.search).toBe(''); expect(r.method).toBe('GET'); expect(r.body).toBe(null); }
});
test('T13 malformed/future progress is not deleted, reflected, or used', async ({ page }) => {
  await page.addInitScript(key => { localStorage.setItem(key, JSON.stringify({ schemaVersion: 3, courseVersion: 1, rememberProgress: true, records: [], notes: '<img src=x onerror=alert(1)>PRIVATE_SENTINEL' })); }, STORAGE_KEY);
  await enter(page); await expect(page.locator('main')).toContainText('left untouched');
  await expect(page.locator('main')).not.toContainText('PRIVATE_SENTINEL');
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).schemaVersion, STORAGE_KEY)).toBe(3);
  await expect(page.locator('main img')).toHaveCount(0);
});
test('T13 blocked storage and quota failure keep the app usable', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }); });
  await enter(page, '#L01-C01'); await expect(page.locator('main')).toContainText('storage is unavailable'); await workedExample(page);
  await expect(page.locator('#query-result')).toContainText('70 / 70');
  await page.goto('/#privacy'); await page.locator('#remember').click(); await expect(page.locator('#remember')).not.toBeChecked();
});
test('T11 CSP blocks inline script and external connection; references are fixed safe links', async ({ page }) => {
  await enter(page, '#L01');
  await page.getByText('Official references & verification', { exact: true }).click();
  for (const a of await page.locator('main a[target=_blank]').all()) { expect(await a.getAttribute('href')).toMatch(/^https:\/\//); expect(await a.getAttribute('rel')).toBe('noopener noreferrer'); expect(await a.getAttribute('referrerpolicy')).toBe('no-referrer'); }
  await page.evaluate(() => { window.__violations = []; document.addEventListener('securitypolicyviolation', e => window.__violations.push(e.violatedDirective)); const s = document.createElement('script'); s.textContent = 'window.__unsafe = true'; document.head.append(s); fetch('https://example.org/csp-test').catch(() => {}); });
  await expect.poll(() => page.evaluate(() => window.__violations)).toContain('connect-src');
  expect(await page.evaluate(() => Boolean(window.__unsafe))).toBe(false);
  expect((await page.evaluate(() => window.__violations)).some(x => x.startsWith('script-src'))).toBe(true);
});
test('T14 keyboard path, route focus, reduced motion, forced colors and 320px reflow', async ({ page }) => {
  await page.goto('/#L01-C01'); await page.locator('#boundary').focus(); await page.keyboard.press('Space'); await page.keyboard.press('Tab');
  await page.locator('#open-course').focus(); await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
  await page.locator('.skip').focus(); await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused(); expect(page.url()).toContain('#L01-C01');
  await page.locator('#query-editor').focus(); await page.keyboard.press('Control+End');
  await page.keyboard.type(' '); await expect(page.locator('#query-editor')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.locator('#check-query')).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.locator('#query-result')).toContainText('70 / 70');
  await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' }); await page.setViewportSize({ width: 320, height: 800 });
  const overflow = await page.evaluate(() => [...document.querySelectorAll('main,main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).position !== 'absolute').slice(0, 8).map(e => ({ tag: e.tagName, cls: e.className, width: e.getBoundingClientRect().width })));
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), JSON.stringify(overflow)).toBe(true);
  await page.emulateMedia({ forcedColors: 'none' }); await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#course'); await page.screenshot({ path: 'test-results/course.png', fullPage: true });
  await page.goto('/#L06-C01'); await workedExample(page); await page.screenshot({ path: 'test-results/challenge.png', fullPage: true });
});
test('T10 route exit discards query/method inputs while keeping the non-sensitive saved best', async ({ page }) => {
  await enter(page, '#L01-C01'); await workedExample(page);
  await page.locator('#M1-A').check(); await page.locator('#M2-B').check(); await page.locator('#check-method').click();
  await page.goto('/#course'); await page.goto('/#L01-C01');
  await expect(page.locator('#query-editor')).toHaveValue(bundle.lessons[0].challenges[0].mission.starter);
  await expect(page.locator('#M1-A')).not.toBeChecked();
  await expect(page.getByText('Saved best: 100/100 · Mission complete', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Practice in authorized SecOps/ })).toHaveCount(0);
});

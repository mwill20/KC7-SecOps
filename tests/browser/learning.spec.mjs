import { test, expect } from '@playwright/test';
import { enter } from './helpers.mjs';
import { contentBundle } from '../../tools/validate-content.mjs';
import { STORAGE_KEY } from '../../site/state/progress.js';
const chapter = contentBundle().lessons[0];
test('R02 first chapter teaches before testing and progressively grows six real Search queries', async ({ page }) => {
  await enter(page, '#L01');
  await expect(page.getByRole('heading', { name: 'Your first query', exact: true })).toBeVisible();
  await expect(page.locator('pre')).toContainText('metadata.event_type = "USER_LOGIN"');
  await expect(page.locator('.breakdown')).toContainText('what happened?');
  await page.getByRole('link', { name: 'Start mission 01 →' }).click();
  for (const [i, c] of chapter.challenges.entries()) {
    await expect(page.locator('h1')).toHaveText(c.title);
    await expect(page.locator('#query-editor')).toHaveValue(c.mission.starter);
    await expect(page.locator('#next-hint')).toBeVisible();
    if (c.mission.support === 'shown') {
      await expect(page.getByRole('heading', { name: 'Watch one', exact: true })).toBeVisible();
    } else {
      await page.getByText('Help me fill the blanks', { exact: true }).click();
      for (const gap of c.mission.gaps) await page.locator('[data-gap="' + gap.marker + '"]').selectOption(gap.answer);
    }
    await page.locator('#check-query').click(); await expect(page.locator('#query-result')).toContainText('70 / 70');
    await expect(page.locator('#query-result')).toContainText('Fictional case card unlocked');
    await expect(page.locator('#executedAcknowledged')).not.toBeChecked();
    expect(await page.locator('#hint-panel').textContent()).not.toContain('Hint 1');
    if (i < chapter.challenges.length - 1) await page.getByRole('link', { name: 'Next mission →', exact: true }).click();
  }
});
test('R03/R06 hostile typed text never becomes markup, network payload, URL or stored state', async ({ page }) => {
  const requests = [], errors = []; page.on('request', r => requests.push({ url: r.url(), method: r.method(), data: r.postData() })); page.on('pageerror', e => errors.push(e.message));
  await enter(page, '#L01-C01');
  await page.locator('#check-query').click();
  await page.locator('#M1-A').check(); await page.locator('#M2-B').check(); await page.locator('#check-method').click();
  await page.locator('#executedAcknowledged').check(); await page.locator('#reviewedAcknowledged').check();
  const sentinel = '<img src="https://example.org/SYNTHETIC_SENTINEL" onerror="alert(1)">';
  await page.locator('#query-editor').fill(sentinel);
  await expect(page.locator('#query-editor')).toBeFocused();
  await expect(page.locator('#query-result')).toHaveCount(0); await expect(page.locator('#method-result')).toHaveCount(0);
  await expect(page.locator('#M1-A')).not.toBeChecked(); await expect(page.locator('#executedAcknowledged')).not.toBeChecked(); await expect(page.locator('#executedAcknowledged')).toBeDisabled();
  await expect(page.locator('#current-score .progress-big')).toHaveText('0');
  await page.locator('#check-query').click();
  await expect(page.locator('#query-result')).toContainText('0 / 70'); await expect(page.locator('#query-result')).not.toContainText('SYNTHETIC_SENTINEL');
  await expect(page.locator('main img')).toHaveCount(0);
  expect(page.url()).not.toContain('SYNTHETIC');
  await page.goto('/#progress'); await page.locator('#remember').check();
  const stores = await page.evaluate(key => ({ raw: localStorage.getItem(key), session: sessionStorage.length, cookies: document.cookie }), STORAGE_KEY);
  expect(stores.raw).not.toMatch(/SYNTHETIC|queryText|<img|methodChoices/); expect(stores.session).toBe(0); expect(stores.cookies).toBe('');
  for (const r of requests) { expect(new URL(r.url).origin).toBe('http://127.0.0.1:4173'); expect(r.url).not.toMatch(/SYNTHETIC|\?/); expect(r.method).toBe('GET'); expect(r.data).toBe(null); }
  expect(errors).toEqual([]);
  await page.goto('/#L01-C01'); await expect(page.locator('#query-editor')).toHaveValue(chapter.challenges[0].mission.starter);
});
test('R03 editor keeps caret during typing and rejects oversize programmatic input without echo', async ({ page }) => {
  await enter(page, '#L01-C06');
  const editor = page.locator('#query-editor'); await editor.fill(''); await editor.pressSequentially('metadata.event_type = "USER_LOGIN"');
  await expect(editor).toBeFocused(); await expect(editor).toHaveValue('metadata.event_type = "USER_LOGIN"');
  expect(await editor.evaluate(el => el.selectionStart)).toBe(34);
  await editor.evaluate(el => { el.value = 'x'.repeat(8193); el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.locator('#check-query').click(); await expect(page.locator('#query-result')).toContainText('BYTE_LIMIT'); await expect(page.locator('#query-result')).toContainText('0 / 70');
});

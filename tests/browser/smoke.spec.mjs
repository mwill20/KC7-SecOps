import { test, expect } from '@playwright/test';
import { enter } from './helpers.mjs';
for (const prefix of ['', 'KC7-SecOps/']) test('T16 root/subpath navigation ' + (prefix || 'root'), async ({ page }) => {
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await enter(page, prefix); await expect(page.locator('main h1')).toHaveText('Ask a sharper question.');
  await expect(page.locator('.card')).toHaveCount(6);
  await page.goto('/' + prefix + '#L06'); await expect(page.locator('main')).toContainText('preview/pre-GA');
  await page.goto('/' + prefix + '#L06-C01'); await expect(page.locator('#query-preview')).toBeVisible();
  await page.reload(); await expect(page.locator('#boundary')).toBeVisible();
  await page.locator('#boundary').check(); await page.locator('#open-course').click();
  await page.goto('/' + prefix + '#bad-route'); await expect(page.locator('main h1')).toHaveText('Page not found');
  expect(errors).toEqual([]);
});

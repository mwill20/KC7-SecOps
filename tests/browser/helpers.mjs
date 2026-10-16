import { expect } from '@playwright/test';
export async function enter(page, route = '') {
  await page.goto('/' + route); await page.locator('#boundary').check(); await page.locator('#open-course').click();
}
export async function compose(page, text) {
  await page.locator('#query-editor').fill(text);
}
export async function workedExample(page) {
  for (let i = 0; i < 3; i++) await page.locator('#next-hint').click();
  await page.locator('#load-example').click(); await page.locator('#check-query').click();
  await expect(page.locator('#query-result')).toContainText('70 / 70');
}

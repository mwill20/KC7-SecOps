import { test, expect } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { enter } from './helpers.mjs';
import { contentBundle, root } from '../../tools/validate-content.mjs';

test('R04 every mission teaches an investigation concept and reveals only authored clues after a correct query', async ({ page }) => {
  await enter(page, '#L01-C01');
  for (const lesson of contentBundle().lessons) for (const c of lesson.challenges) {
    await page.goto('/#' + c.id); await expect(page.locator('h1')).toHaveText(c.title);
    await expect(page.locator('.analyst-note')).toContainText(c.mission.analystNote.concept);
    await expect(page.locator('.analyst-note')).toContainText(c.mission.analystNote.text);
    await expect(page.locator('.case-update')).toHaveCount(0);
    await page.locator('#query-editor').fill('target.port = 443'); await page.locator('#check-query').click();
    await expect(page.locator('.case-update')).toHaveCount(0);
    await page.locator('#query-editor').fill(c.referenceQuery); await page.locator('#check-query').click();
    await expect(page.locator('.case-update')).toHaveText(c.mission.caseUpdate);
  }
});

test('R05 directly opened source HTML gives the fixed playable URL instead of a false content diagnosis', async ({ page }) => {
  await page.goto(pathToFileURL(path.join(root, 'site/index.html')).href);
  await expect(page.locator('h1')).toHaveText('Open KC7 SecOps');
  await expect(page.getByRole('link', { name: 'Play KC7 SecOps online →' })).toHaveAttribute('href', 'https://mwill20.github.io/KC7-SecOps/');
  await expect(page.locator('main')).not.toContainText('CONTENT_INVALID');
  await expect(page.locator('#query-editor')).toHaveCount(0);
});

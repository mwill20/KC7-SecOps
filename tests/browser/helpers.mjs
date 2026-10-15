import { expect } from '@playwright/test';
import { tokens } from '../../site/query/catalog.js';
import { lex } from '../../site/query/parser.js';
export async function enter(page, route = '') {
  await page.goto('/' + route); await page.locator('#boundary').check(); await page.locator('#open-course').click();
}
export async function compose(page, text) {
  const parts = lex(text); let i = 0;
  const choices = tokens.filter(t => t.lexeme !== '\n').map(t => ({ ...t, parts: lex(t.lexeme) })).sort((a, b) => b.parts.length - a.parts.length);
  while (i < parts.length) {
    const token = choices.find(t => t.parts.every((p, n) => p.kind === parts[i + n]?.kind && p.value === parts[i + n]?.value));
    if (!token) throw new Error('Fixture cannot be composed');
    await page.locator('#token-group').selectOption(token.group);
    await page.locator('#token-choice').selectOption(token.id);
    await page.locator('#add-token').click(); i += token.parts.length;
  }
}
export async function workedExample(page) {
  for (let i = 0; i < 3; i++) await page.locator('#next-hint').click();
  await page.locator('#load-example').click(); await page.locator('#check-query').click();
  await expect(page.locator('#query-result')).toContainText('70 / 70');
}

import { test, expect } from '@playwright/test';
test('T11/T12 developer server rejects submissions and paths outside the static artifact', async ({ request }) => {
  expect((await request.post('/', { data: { synthetic: true } })).status()).toBe(405);
  expect((await request.get('/?symbol=PRIVATE_SENTINEL')).status()).toBe(400);
  for (const path of ['/.git/config', '/.env', '/docs/PRIVACY.md', '/content/lessons/L01.json', '/work/node-v24.21.0/node.exe', '/node_modules/@playwright/test/package.json']) {
    const result = await request.get(path); expect(result.status()).toBe(404); expect(await result.text()).toBe('');
  }
});

import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false, workers: 1, timeout: 30000,
  reporter: [['list']], outputDir: 'test-results',
  use: { baseURL: 'http://127.0.0.1:4173', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' },
  webServer: { command: 'node tools/serve.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: false, timeout: 15000 },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'chrome', testMatch: /smoke\.spec\.mjs/, use: { browserName: 'chromium', channel: 'chrome' } },
    { name: 'edge', testMatch: /smoke\.spec\.mjs/, use: { browserName: 'chromium', channel: 'msedge' } },
  ],
});

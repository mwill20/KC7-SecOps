# Developer setup

Work from `C:\Projects\SecOps KC7` on the personal development machine. Nothing in this document is a workplace learner prerequisite.

Preferred exact runtime is Node 24.21.0, recorded in `.node-version`. Local verification uses the official checksum-verified 24.21.0 binary; earlier development used installed Node 25.8.1. System Node was not changed. npm is 11.11.0. Actual remote CI evidence is recorded in DEPLOYMENT.md and IMPLEMENTATION_STATUS.md. Runtime browser code has no dependencies. The sole direct development dependency is exact `@playwright/test` 1.64.1, with lockfile.

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium
npm run verify
```

Chrome and Edge smoke tests use installed applications in fresh isolated test profiles, without reading signed-in user profiles. On a disposable CI runner, the workflow installs those official channels too. Pinned Playwright selects the test Chromium build.

To preview after validation, run `npm start` and open `http://127.0.0.1:4173` or its `/KC7-SecOps/` subpath. The server binds loopback only, serves exact runtime paths and accepts GET/HEAD only. It is a developer preview, not a production host. Stop with Ctrl+C before testing. `KC7_PORT` can select another integer port from 1024–65535 for preview; acceptance tests use 4173.

`npm run build` validates content and creates `dist/`. It rejects unexpected files/symlinks in an existing output instead of deleting user content. `npm run check:artifact` checks exact output and relative module imports. Deploy only reviewed static output after separate hosting/workplace approval. Opening via `file://` is unsupported for ES modules.

No secrets, cloud account, paid service or `.env` is required. Developer installation uses the network; the learner application loads static assets and only explicitly navigates to documentation.

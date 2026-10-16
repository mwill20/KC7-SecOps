# Troubleshooting

**Preview will not start:** build first and check the port is free. Stop preview before `npm run verify`, which owns a server. Do not expose it on a network interface.

**Sandbox socket error:** use the tool's ordinary approved route for local loopback tests. Do not weaken firewalls, endpoint controls, browser security, or workplace policy.

**Missing browser:** install official test Chromium with `npx playwright install chromium` on the developer machine. Installed Chrome/Edge are required for smoke tests; disposable CI installs official channels. Never attach tests to signed-in user profiles.

**Unexpected artifact file:** inspect the unknown content in `dist/` before relocating anything. The build refuses unknown output and never recursively deletes it.

**Storage invalid/unavailable:** continue session-only. Invalid/future data stays untouched until Clear progress or a deliberate new remember choice. Changed lesson versions drop only stale records. Clearing affects one course key.

**Clipboard blocked:** select and manually copy the training-query text or example. The app never reads the clipboard.

**Unsupported query:** check the course subset and sources. Valid Google syntax outside it can be unsupported here. The training editor accepts only the documented course catalog for grading; no manual credit override. Never paste production values.

**SecOps compilation failure:** retain detailed errors and actual query privately. Check YL2, mapping, features and public documentation. Share only a symbolic template and a permitted pilot status when a correction is needed.

**CLI GitHub authentication fails:** browser login is separate. The repository exists and is public by owner decision. Recheck ordinary authenticated CLI access; browser login is separate. Do not extract browser credentials or infer that historical authentication errors are permanent.

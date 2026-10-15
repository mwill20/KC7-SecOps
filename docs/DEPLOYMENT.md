# GitHub Pages deployment

## Live course — 2026-10-15

**[Play KC7 SecOps](https://mwill20.github.io/KC7-SecOps/)**. No installation, terminal or account is required. Acknowledge the privacy boundary, open the learning path and start lesson 01. Optional non-sensitive browser progress supports resuming in the same browser. Workplace website/storage approval remains separate.

The owner made `mwill20/KC7-SecOps` public; authenticated metadata confirmed `private: false`. The owner then explicitly authorized a separate review agent, supported fixes, and public Pages publication without adding an open-source license. Codex did not change repository visibility, purchase a plan or select another host. GitHub Pages is enabled in `workflow` mode with HTTPS enforced. Private vulnerability reporting was enabled and verified; see SECURITY.md.

## Release identity and remote verification

- Published source: `d1a1d68f8fe119953f9cb127e9568106086d474b`.
- Successful manual run: [38730561420](https://github.com/mwill20/KC7-SecOps/actions/runs/38730561420). Both build and deployment jobs completed successfully.
- Remote Node 24.21.0: content checks, **90 unit tests**, static build/artifact checks and **15 browser tests** passed. The browser suite tests Chromium, Chrome and Edge locally on the runner; it is not mislabeled as live-host testing.
- Built artifact: 13 allowlisted files; aggregate SHA256 `a14b5bcc931f886aeb3d13b272331a2395f08d1ec45a962e5b0843faf53e34c2`, matching the independent review and local build.
- The official Pages upload action excludes dotfiles. The twelve web assets are published; `.nojekyll` is unnecessary for Actions publishing and omitted. Only `dist/` was uploaded, not the source checkout.
- [Independent AI security review](SECURITY_REVIEW.md): **APPROVE**, zero supported findings; independently reproduced full verification and extra hostile/storage/artifact probes. This is not a human audit.

Later documentation-only commits do not automatically publish because the workflow is manual-only. Git history identifies current documentation; the source revision above identifies the actual deployed release. No runtime source was changed after review.

## Actual HTTPS and browser evidence

`node tools/check-live.mjs` passed against the real GitHub Pages address: **12 assets byte-identical to the checked build**, correct HTML/CSS/SVG/JavaScript MIME types, and **five development paths returning 404** (`package.json`, `.env`, `docs/PRIVACY.md`, `site/app.js`, `tests/unit/state.test.mjs`). Before deployment, the same checker failed at the root's 404 response, proving it does not accept an unpublished site.

Actual live Chrome interaction, separate from the runner's loopback tests:

| User behavior | Observed result |
|---|---|
| First entry | Opening is disabled until privacy acknowledgment; session-only is the default; no raw text/file/form input |
| Learning path | Six lesson cards; all six briefing pages open, each with two challenge links; L06 preview/pre-GA caveat visible |
| Challenges | All twelve challenge previews load; practice acknowledgments initially disabled |
| Wrong-role query | Composed L01-C02 with `target.user.userid`: **35/70**, filter intent 0/35; practice remains disabled |
| Correct alternate query/method | Composed reordered principal identity/event filter: **70/70**; correct method choices **20/20**; symbolic mastery at 90, without claiming tenant execution |
| Hints | Three progressive hints appear without penalty; loading the worked solution grades **70/70** |
| Progress/resume | Opt-in saved the 90-point best; after reload and renewed privacy acknowledgment the score was restored |
| Clear progress | Removed the test score and returned the course to zero; remembering returned off. No actual employer data was entered |
| Invalid route/errors | Fixed Page not found shown; no captured console errors during the live flow |

A full-page screenshot was saved from the actual HTTPS course and visually inspected. The course tab was left at `#course`, zero test progress, session-only, ready for the owner. No real SIEM execution or execution acknowledgment was performed in this live test.

The response supplies HSTS and the expected HTML MIME type. No HTTP CSP, X-Frame-Options, X-Content-Type-Options or Permissions-Policy header was observed. The reviewed HTML's early meta CSP/no-referrer policy still applies; do not claim the host enforces framing protection. The static course has no privileged action or protected learner resource. GitHub receives ordinary visitor request metadata as disclosed.

## Maintaining publication

1. Edit authored content/runtime in `content/` and `site/`, not root snapshots or generated output. Preserve the privacy and validator contracts.
2. Run `npm run verify`. Material runtime/security-boundary changes need the focused review described in NEXT_REVIEW_BRIEF.md; documentation-only changes do not create a new review gate.
3. Commit/push under owner authority. In Actions, manually run **Publish course to GitHub Pages** on `main`. It verifies first, uploads only `dist/`, then deploys through the `github-pages` environment. A push alone does not publish.
4. Build the same source locally and run `node tools/check-live.mjs`, then smoke-test actual browser behavior. Record the run, source and outcomes. Never use a local-only test to claim live availability.

The successful run emitted upstream action-runtime warnings: some pinned official Pages actions (including the upload action's pinned nested dependency) declare Node 20 and GitHub forced execution on Node 24. All steps passed. This is an upstream maintenance note, not a failed deployment or an unresolved app-test failure; recheck official action revisions for future changes.

Tenant compilation, telemetry mapping and preview-feature availability remain unverified. Full manual screen-reader/actual 200% browser-zoom assessment is still pending. No WCAG certification, employer policy approval, incident finding or tenant compatibility is inferred from this deployment.

## Historical attempt — 2026-10-14 (superseded)

The following records the earlier private-repository eligibility check, before the owner made the repository public. It is not the current website status.

### Result at that time

GitHub Pages cannot currently be enabled for this private repository under the account's available plan. No site was published. This is a hosting-eligibility restriction, not evidence that the course failed to run.

The owner explicitly requested trying GitHub Pages and testing it. The repository remains private; no plan upgrade, billing change, visibility change, alternative host or new public repository was activated.

### Observed evidence at that time

- Authenticated repository metadata: `mwill20/KC7-SecOps`, `private: true`, `has_pages: false`, default branch `main`.
- Authenticated Pages API: `GET /repos/mwill20/KC7-SecOps/pages` returns HTTP 404. By itself this indicates no accessible configured site, not a specific plan tier.
- Signed-in repository Settings → Pages explicitly displays: **"Upgrade or make this repository public to enable Pages"**. No build-source/publishing selector is offered. The account API did not expose the plan name, so no exact subscription tier is asserted.
- Expected public address `https://mwill20.github.io/KC7-SecOps/` returns HTTP 404. This is a checked candidate address, not a deployed course URL.

GitHub documents Pages for public repositories on Free and private repositories on eligible paid plans: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages .

### Course checks performed at that time

Executed `npx playwright test smoke.spec.mjs --grep 'KC7-SecOps/'` against the actual built static output at the loopback `/KC7-SecOps/` path. **Three tests passed:** test Chromium, installed Chrome and installed Edge. They cover privacy acknowledgment, all six lesson cards, L06 briefing and challenge module loading, reload behavior, invalid routes, and absence of unexpected page errors.

These are local Pages-style path tests. They do not establish successful GitHub deployment or workplace network approval. The earlier full suite remains documented in EVALUATION.md; it was not relabeled as a live-host test. No application code changed for this attempt.

### Next step recorded at that time

The owner must choose an eligible GitHub plan if Pages from this private repo is required, or explicitly approve a different hosting route. Do not upgrade, make source public or switch hosts automatically. When Pages becomes eligible, use an Actions deployment that publishes only the checked `dist/` artifact, followed by testing the actual HTTPS URL. Never publish the entire source checkout.

Independent release review, manual accessibility checks and tenant compatibility status remain separate as recorded in IMPLEMENTATION_STATUS.md. No successful deployment or tenant execution is claimed.

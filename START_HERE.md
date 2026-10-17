# Start here

This is the local KC7 SecOps application and its implementation contracts. Read the live repository and `docs/IMPLEMENTATION_STATUS.md` before relying on older snapshots. The original specification package is preserved under `secops-query-academy-spec/`.

## Ordered startup

1. Read `AGENTS.md`, `README.md`, and `docs/PRD.md`.
2. Read `docs/ARCHITECTURE.md`, `docs/PRIVACY.md`, and `SECURITY.md`.
3. Read `docs/specs/VALIDATOR.md`, `SCORING.md`, and `CONTENT_AND_STATE.md`.
4. Read `docs/CURRICULUM.md`, all six `content/lessons/*.json`, and `docs/UX.md`.
5. Read `docs/BUILD_PLAN.md`, `docs/TEST_PLAN.md`, and `CODEX_BUILD_BRIEF.md`.
6. Verify source-sensitive syntax using `docs/research/SOURCE_MATRIX.md` and `docs/QUERY_REFERENCE.md`.

## Source of truth

PRD and security/privacy contracts constrain every component. Validator and scoring specs define behavior. Lesson JSON files are the sole authoring source for teaching and challenge content; generated previews must not become separate editable copies. Query QA fixtures supplement the lesson references. Resolve contradictions in the documents during the build; never silently weaken the privacy boundary or claim unverified tenant validation.

## Current status

Current 2026-10-17 revision is COMPLETE and LIVE. Remote121unit/30browser checks, independent review, fourteen matching live assets and actual Chrome query/method/feedback checks passed. Read current IMPLEMENTATION_STATUS/HANDOFF before historical records below. Feedback is separate explicit local Save/Delete/JSON export, never automatic query capture/upload/email. Transfer route remains undecided. Completion means query70+method20; old v1 is preserved until Clear. Learners use https://mwill20.github.io/KC7-SecOps/ instead of opening site/index.html.

The 2026-10-16 learning revision is LIVE: six chapters/16 missions, explained examples before testing, guided blanks and a training-query text editor approved by the owner. Local/reviewer/remote full verification passes 116 unit/18 browser tests. The focused independent AI review is SECURITY_REVIEW_2026-10-16.md; actual published source/run/HTTPS/browser evidence is in DEPLOYMENT.md. Read the newest status before the historical release record below. Query text is never saved or sent by app code; accidental real-value entry remains possible and prohibited.

Research, six lessons, and the static application are implemented. Initial source upload was authorized on 2026-10-14. On 2026-10-15 the owner made `mwill20/KC7-SecOps` public and authorized independent review followed by GitHub Pages publication without adding an open-source license. The separate AI review returned APPROVE; see `docs/SECURITY_REVIEW.md`. Pages is configured for manual Actions publication; consult `docs/DEPLOYMENT.md` and live GitHub run status for actual website evidence. Full manual assistive-technology checks, private tenant pilot and workplace-use/storage approval remain unverified.

## Preferred validation after implementation

`npm run verify` runs content validation, unit/contract tests, build, artifact checks, and browser tests. Use the developer setup in `docs/INSTALLATION.md`; learners need only the website, subject to workplace approval when used at work. `node tools/check-live.mjs` checks the published HTTPS assets against `dist/`; use it after building. Neither command runs tenant queries. `qa/TENANT_PILOT.md` describes the separate user-run tenant checks.

## No expansion

No runtime AI, SIEM/API connections, actual logs, datasets, accounts, telemetry, leaderboards, internal investigation notes, progress export/import, custom workplace identifiers, or automatic detection deployment. Separate reviewed course feedback and manual screenshot paste/local export are the owner-approved exception described in docs/FEEDBACK.md. No commit, push, or hosting activation without explicit authority for that action.

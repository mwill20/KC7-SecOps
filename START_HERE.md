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

Research, six lessons, and the static application are implemented. The private `mwill20/KC7-SecOps` repository was verified and the owner explicitly authorized initial commit/push on 2026-10-14; inspect main/origin/main for the uploaded commit. No deployment is authorized. CI configuration is manual-only and has not run remotely. Independent review, full manual assistive-technology checks, private tenant pilot, workplace/hosting approval, and any release license decision remain pending.

## Preferred validation after implementation

`npm run verify` runs content validation, unit/contract tests, build, artifact checks, and browser tests. Use the developer setup in `docs/INSTALLATION.md`; learners need only the future approved website. This command never runs tenant queries. `qa/TENANT_PILOT.md` describes the separate user-run tenant checks.

## No expansion

No runtime AI, SIEM/API connections, actual logs, datasets, accounts, telemetry, leaderboards, notes, progress export/import, custom workplace identifiers, or automatic detection deployment. No commit, push, or hosting activation without explicit authority for that action.

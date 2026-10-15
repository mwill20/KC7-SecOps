# Threat Model — KC7 SecOps

Version 2026-10-14 / 1.1. Framework: web verification concerns with LINDDUN privacy analysis. Status: implemented builder controls; independent security acceptance pending.

## Scope, assets and trust boundaries

The current path is an unprivileged static browser training app. Assets are workplace data that must stay outside the app, authored lesson/query integrity, honest scores, low-sensitivity progress, repository/release authority and host metadata. There is no runtime AI or SIEM authority.

Private repo → developer/static build → approved host (pending) → browser → finite token IDs → parser/evaluator → reducer → optional localStorage. Explicit public documentation navigation and human-only synthetic query copying are separate boundaries. Actual SecOps access/results belong entirely to the employer.

Assumptions: authorized workplace access, approved host/browser use, protected writer/host accounts, and a reviewed release. Browser owners can falsify learning state. No control below proves those assumptions or accepts residual risk for the owner.

## Threats and implemented treatment

Pre-control severity uses likelihood/impact. H/M/L labels are qualitative, not invented metrics.

| ID | Threat / pre-control severity | Current control and evidence | Residual / release condition |
|---|---|---|---|
| 1 | Employer data entry or transmission / Critical | `site/app.js:composer` has closed native choices; `catalog.js` finite constants; `serializer.js` rejects unknown IDs; `parser.js` rejects unsafe literals. T05/T11 browser and negative query checks | Browser-owner tampering/extensions/compromised release remain outside guarantee |
| 2 | HTML/script injection from content/state / High | `app.js:node` uses textContent and fixed DOM elements; strict content/state checks; early CSP in index; T11 inline-script block and stored-XSS rejection | Same-origin script/release compromise can defeat client-side controls |
| 3 | Supply-chain/release modification / High | No runtime dependencies; exact dev pin/lockfile; `tools/files.mjs` allowlist; build rejects extra files/symlinks; check-artifact verifies graph/bytes; manual-only CI actions pinned | Account/host integrity and reviewed release still required; repository inherited existing account-wide Pangea auto-install, to review before source upload |
| 4 | Keyword-only grader rewards unsafe scope or misleading certainty / High | Typed AST, whole Boolean truth tables, normalized pipeline checks in query modules; 56 reference/mutation fixtures plus structural tests; explicit subset/tenant-unverified/non-certification labels | Conservative abstract atoms do not establish full Google semantic equivalence or incident truth |
| 5 | Edited score or false execution flag / Medium | Strict projection/correlation; `scoring.js:bestAttempt` prevents component mixing; status explicitly self-attested and formative | Deliberately untrusted personal scores, never compliance/authz/certification evidence |
| 6 | Oversized/deep query or state exhausts browser / Medium | 8KB query, 512 tokens, 256 nodes, depth 8, 12 atoms; finite pattern data, no regex execution; bounded truth assignments; 16KB stored text; T09/T13 failures | Limits are engineering bounds, not Google engine limits |
| 7 | Same-origin/extension reads progress / Low | Default session-only; `progress.js` strict fields and exact-key clear; no actual values/queries/method answers/timestamps; browser tests inspect storage | Dedicated origin and endpoint/extension posture remain outside app authority |
| 8 | Private source mistaken for approved private website; host metadata / Medium | Onboarding/README/privacy explicitly distinguish source, audience and workplace policy; no deployment or paid service activation | Owner/employer must approve actual host and audience before workplace use |
| 9 | Framing/clickjacking / Low | App has no privileged action; no embedding integrations; honest meta-CSP limitation | Host must provide frame-ancestors header where required; no host selected |
| 10 | Indirect instructions or invented syntax during research/AI development / High | Retrieved pages treated as data; official-source matrix; original authored lessons; no runtime AI or workplace data; tenant-unverified labels | Documentation drift and tenant differences require future checks; optional work Copilot follows employer policy |

## Authority and non-applicability

No protected backend, credentials, multi-user database, RLS or model outputs exist in the runtime. Adding them would require a new scoped design and approval. There are no consequential external learner actions to audit; deliberately recording execution timestamps or payloads would violate this product's minimal-state boundary. Source-control/development evidence handles code changes; self-attested practice is not an employer audit trail.

Code development and initial source commit/push are authorized. Public publishing, license selection and paid activation remain unauthorized. The private remote was empty when checked before upload; existing account-wide Pangea auto-install could not be deselected during creation and was disclosed before push authorization. No global app settings were changed. This authorization does not claim independent review of that integration.

## Open release conditions

1. Separate focused review of implemented input, DOM, network/storage, grader and artifact boundary. Builder tests are not independent acceptance.
2. Full manual screen-reader and browser zoom assessment; automated keyboard/reflow checks are only partial accessibility evidence.
3. Private tenant pilot for compilation, mapping and preview-feature capability; return only permitted fixed status.
4. Host/audience/workplace policy, account-wide app access and any license/cost decision before release/upload/deployment.

Self-attestation, local tampering, compromised same-origin releases, host metadata, extensions and absent host framing control remain explicit residuals. No owner risk acceptance is invented.

## Review log

| Date | Actor | Evidence |
|---|---|---|
| 2026-10-14 | Specification author | Original design model preserved in donor package |
| 2026-10-14 | Builder | Implemented controls mapped above; see implementation status/evaluation for actual test counts and artifact digest. Independent review not performed |

# Threat Model — KC7 SecOps

Version 2026-10-16 / 1.3. Framework: web verification concerns with LINDDUN privacy analysis, retained because the public static browser boundary primarily needs input/release integrity and privacy controls. Status: editor revision independently reviewed APPROVE; see SECURITY_REVIEW_2026-10-16.md for exact bytes and evidence. Published build and actual HTTPS/browser evidence are in DEPLOYMENT.md. This is not a human audit or workplace approval.

## Scope, assets and trust boundaries

The current path is an unprivileged static browser training app. Assets are workplace data that must stay outside the app, authored lesson/query integrity, honest scores, low-sensitivity progress, repository/release authority and host metadata. There is no runtime AI or SIEM authority.

Owner-approved public repo → manual verified build → GitHub Pages artifact → public browser → untrusted training-query textarea → bounded parser/evaluator → reducer → optional localStorage. Explicit public documentation navigation and human-only synthetic query copying are separate boundaries. Actual SecOps access/results belong entirely to the employer.

The deployment boundary sends only allowlisted authored files through `.github/workflows/pages.yml`: a read-only build verifies them, and a separate `github-pages` environment job receives short-lived Pages/OIDC write permissions. The main-branch workflow is manual-only and pins official actions. `tools/check-live.mjs` validates the fixed HTTPS address, MIME and exact bytes and rejects development paths. Ordinary visitors are unauthenticated because all training content is intentionally public; no protected resource is exposed. GitHub receives ordinary request metadata, which the privacy UI discloses.

Assumptions: authorized workplace access, approved host/browser use, protected writer/host accounts, and a reviewed release. Browser owners can falsify learning state. No control below proves those assumptions or accepts residual risk for the owner.

## Threats and implemented treatment

Pre-control severity uses likelihood/impact. H/M/L labels are qualitative, not invented metrics.

| ID | Threat / pre-control severity | Current control and evidence | Residual / release condition |
|---|---|---|---|
| 1 | Employer data entry or transmission / Critical | `app.js:composer` labels placeholders-only and keeps entered text in memory/DOM; `parser.js` rejects unknown literal values for grading, not before entry. No query submission/persistence, fixed diagnostics, text-only DOM, restrictive CSP; T05/T11 test synthetic hostile input against network/storage/DOM boundaries | PARTIAL: ordinary typing/paste can enter real text. Owner explicitly chose this editor after disclosure; this is not employer approval or proof of safe real-data use. Extensions/browser/compromised code can observe entry |
| 2 | HTML/script injection from content/state / High | `app.js:node` uses textContent and fixed DOM elements; strict content/state checks; early CSP in index; T11 inline-script block and stored-XSS rejection | Same-origin script/release compromise can defeat client-side controls |
| 3 | Supply-chain/release modification / High | No runtime dependencies; exact dev pin/lockfile; `tools/files.mjs` allowlist; build rejects extra files/symlinks; check-artifact verifies graph/bytes; manual-only `pages.yml` checks before `dist/` upload, pins actions and confines Pages/OIDC writes to deployment | Writer/host or existing integration compromise could replace the course. Pangea inheritance was disclosed before owner-approved source upload; no general integration audit is claimed. Release bytes independently reviewed; broader account posture remains owner-controlled |
| 4 | Keyword-only grader rewards unsafe scope or misleading certainty / High | Typed AST, whole Boolean truth tables, normalized pipeline checks in query modules; 73 reference/mutation fixtures plus structural tests; explicit subset/tenant-unverified/non-certification labels | Conservative abstract atoms do not establish full Google semantic equivalence or incident truth |
| 5 | Edited score or false execution flag / Medium | Strict projection/correlation; `scoring.js:bestAttempt` prevents component mixing; status explicitly self-attested and formative | Deliberately untrusted personal scores, never compliance/authz/certification evidence |
| 6 | Oversized/deep query or state exhausts browser / Medium | 8KB query, 512 tokens, 256 nodes, depth 8, 12 atoms; finite pattern data, no regex execution; bounded truth assignments; 16KB stored text; T09/T13 failures | Limits are engineering bounds, not Google engine limits |
| 7 | Same-origin/extension reads progress / Low | Default session-only; `progress.js` strict fields and exact-key clear; no actual values/queries/method answers/timestamps; browser tests inspect storage | Dedicated origin and endpoint/extension posture remain outside app authority |
| 8 | Public host mistaken for workplace approval; host metadata / Medium | Onboarding/README/privacy disclose host request metadata and separate public training from workplace policy. Owner explicitly approves public Pages; no visitor payload/API/account | Host/employer network can link visits to IPs. Workplace use/storage approval remains with owner/employer; public publication is not proof of it |
| 9 | Framing/clickjacking / Low | App has no privileged action; no embedding integrations; honest meta-CSP limitation | GitHub Pages deployment has no custom framing-header control. Do not claim frame-ancestors enforcement or embed the course; low-privilege UI remains frameable |
| 10 | Indirect instructions or invented syntax during research/AI development / High | Retrieved pages treated as data; official-source matrix; original authored lessons; no runtime AI or workplace data; tenant-unverified labels | Documentation drift and tenant differences require future checks; optional work Copilot follows employer policy |

## Authority and non-applicability

No protected backend, credentials, multi-user database, RLS or model outputs exist in the runtime. Adding them would require a new scoped design and approval. There are no consequential external learner actions to audit; deliberately recording execution timestamps or payloads would violate this product's minimal-state boundary. Source-control/development evidence handles code changes; self-attested practice is not an employer audit trail.

Code development and source commit/push are authorized. On 2026-10-15 the owner made the repository public and approved a separate review agent, supported fixes, and public GitHub Pages publication without adding an open-source license. Paid activation, different hosts and external messaging remain unauthorized. The initially private remote was empty before upload; existing account-wide Pangea auto-install could not be deselected during creation and was disclosed before push authorization. No global app settings were changed. This authorization does not claim independent review of that integration or employer policy approval.

## Open release conditions

1. Separate focused review of implemented input, DOM, network/storage, grader and artifact boundary completed APPROVE on 2026-10-15: see SECURITY_REVIEW.md. This is an independent AI review; builder tests alone remain insufficient.
2. Full manual screen-reader and browser zoom assessment; automated keyboard/reflow checks are only partial accessibility evidence.
3. Private tenant pilot for compilation, mapping and preview-feature capability; return only permitted fixed status.
4. Owner-approved public GitHub Pages audience, no added open-source license and no paid dependency are recorded. Successful remote build/live tests still need evidence in DEPLOYMENT.md. Workplace policy and broader account/app posture remain external owner checks and do not become verified by publication.

Self-attestation, local tampering, compromised same-origin releases, host metadata, extensions and absent host framing control remain explicit residuals. No owner risk acceptance is invented.

## Review log

| Date | Actor | Evidence |
|---|---|---|
| 2026-10-14 | Specification author | Original design model preserved in donor package |
| 2026-10-14 | Builder | Implemented controls mapped above; see implementation status/evaluation for actual test counts and artifact digest. Independent review not performed |
| 2026-10-15 | Separate review agent | APPROVE for the exact runtime artifact and Pages controls; see SECURITY_REVIEW.md. No tenant, human audit or workplace approval claim |
| 2026-10-15 | Deployment builder | Refreshed only the public Pages boundary against reviewed workflow/live-check files; no runtime/data-input change |

## Editor boundary correction — 2026-10-16

The owner explicitly chose a training-query text editor after disclosure that it cannot prevent accidental real-value paste. Disclosure/unawareness and injection are the changed LINDDUN/web concerns. Query text crosses the public-browser input boundary without authentication; parser bounds/catalog validate it for grading, not for privacy cleansing. DOM `.value`/textContent and fixed diagnostic codes avoid interpreting it as markup. Query text never crosses the storage or network boundary in supported app behavior. Browser extensions, browser recovery/spell-check features and a compromised same-origin release remain outside control. Spelling/autocomplete/autocorrect are disabled as best-effort browser hints. Do not infer employer risk acceptance. Re-test actual requests/storage, hostile markup, stale grades and bounds, and obtain focused independent review before republishing.

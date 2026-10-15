# Independent release security review

## Verdict: APPROVE

Reviewed 2026-10-15 by a separate Codex review agent under the owner's explicit authorization to run an independent review, resolve supported blockers, and publish on GitHub Pages. This is an independent AI review of the implementation, not a human audit, Google validation, workplace approval, or accessibility certification. No supported release-blocking security finding was found. No application changes were made by this reviewer.

Approval covers the reviewed static training boundary and the constrained publication workflow below. The deployment operator must still obtain a successful publishing run and check the actual HTTPS site before claiming that the course is available. This report does not claim that deployment has already occurred.

## Inspected identity and scope

- Runtime source HEAD: `180fd875bf8778dd518cbad74591faa196ef547b`.
- Independently rebuilt artifact: 13 allowlisted files; aggregate SHA256 `a14b5bcc931f886aeb3d13b272331a2395f08d1ec45a962e5b0843faf53e34c2`. The aggregate hashes each sorted relative filename, a NUL byte, and its exact bytes, as implemented by the build. The reviewer separately recalculated it by walking the built directory rather than trusting the recorded digest.
- Newly prepared `.github/workflows/pages.yml`: SHA256 `c8251dabc29c14b6274a260c9886dc8a6b0e6fea037c3d13458c72242185b718`.
- Newly prepared `tools/check-live.mjs`: SHA256 `7507829a4d6239b802d967d770b9e9a7a4db9f4063138407eccfa79d1fcdabf8`.

The workflow and live-check files were inspected as working-tree additions, not falsely attributed to the runtime HEAD. Concurrent parent-agent edits update owner authorization and deployment documentation; they do not change the inspected runtime. Approval is tied to these runtime bytes and reviewed publication controls.

Read: repository `AGENTS.md`, `SECURITY.md`, `docs/NEXT_REVIEW_BRIEF.md`, PRD, PRIVACY, VALIDATOR, SCORING, CONTENT_AND_STATE, TEST_PLAN, EVALUATION, IMPLEMENTATION_STATUS, threat model, progress schema, all six lesson files, runtime HTML/CSS/SVG and JavaScript modules, build/content/schema/artifact/server tools, dependency manifest and lockfile, verification/publication workflows, and the relevant unit/browser suites. The review brief's historical uncommitted-source and private-hosting wording was checked against live Git state and today's explicit owner decisions rather than treated as current authority.

## Independently reproduced evidence

| Check | Result and practical scope |
|---|---|
| Full composed build | Reviewer ran `npm run verify` with the official local Node 24.21.0 runtime: content checks, 90 unit tests, build/artifact checks, and 15 browser tests passed. These were rerun by the reviewer; prior builder results were not substituted for execution. |
| Closed composer through persisted record | Reviewer-authored probe constructed the L01-C02 token IDs, independently serialized/parsed/graded them, selected correct method choices, and produced the required 100-point projection only after both fixed practice acknowledgments. A token change reset the assessment, method grade, and attestation. |
| Wrong scope/type/pipeline | Additional reviewer-authored probes broadened every challenge's filter with an OR branch (12), substituted an invalid enum type (12), changed the capstone bucket/threshold/aggregate/sort/limit (5), and supplied unknown or hostile-looking token IDs (4). None earned full query credit; invalid types/unknown tokens earned zero and unknown values were not reflected. |
| Browser boundary | Rerun browser tests exercised all twelve symbolic masteries; correct and wrong-role L01 flows; absence of text/file/HTML-editable input; only allowlisted static requests; no submission payload/secondary store; fixed documentation links; clipboard fallback; inline-script and external-connection CSP failures. |
| Optional local progress | Reviewer-authored probes confirmed unknown query/notes fields are dropped before saving, malformed stored records are rejected without reflecting or deleting their text, and clearing affects only the exact course key. Rerun tests also covered correlation, duplicate/prototype/future/stale/oversize data and blocked/quota storage. |
| Release artifact | Independently enumerated all 13 files, recalculated the aggregate, and found no docs, tests, tooling, dependencies or developer workspace in `dist/`. Artifact/module-graph checks passed. CSS and SVG contain no external assets or active content. |
| Obvious credential exposure | Pattern scan of 93 tracked files found no private-key marker or common GitHub/AWS/Google credential-token signature. This is a bounded pattern check, not a claim that every possible secret format or full repository history was exhaustively scanned. |
| Public publishing controls | Manual dispatch only, main-branch build only, immutable action revisions, clean lockfile install with lifecycle scripts disabled, full verification before upload, `dist/` only, no retained checkout credentials, bounded jobs, and Pages/OIDC write permissions confined to deployment. No learner secret or SIEM authority is introduced. |
| Planned live proof | `check-live.mjs` uses the fixed HTTPS course address, rejects redirects, imposes request timeouts, checks every published runtime file byte-for-byte and by MIME, and requires five development paths to return 404. It correctly excludes `.nojekyll`, which is unnecessary for an Actions artifact and omitted by the upload action. Its post-deployment success is still the deployment operator's responsibility. |

The browser suite's loopback server was started and stopped by the test runner. No authenticated KC7 session, employer SIEM, actual identifier, log, screenshot or query result was used. The reviewer made no account, repository, host, deployment, commit or push changes.

## Findings

Zero supported findings requiring correction within the reviewed release boundary.

This conclusion follows from the actual data path: only finite authored token IDs reach the serializer; the independent bounded parser and whole-expression evaluator check structure and intent; grading feeds a fixed reducer; and opt-in persistence reconstructs only the non-sensitive projection. Text uses DOM text nodes, source links are fixed HTTPS references with opener/referrer protection, and the early CSP rejects inline execution and programmatic outbound connections. There is no raw-value entry point, runtime network API, backend, account, data upload, runtime AI, regex execution or arbitrary code evaluation. The most important proposed privacy and scope-escape attacks therefore have no supported application path or are rejected by tested controls.

## Security applicability and residuals

- No protected server resource, database, account, credential, multi-user row, or consequential external learner action exists. Application authentication, RLS, backend secret storage and server audit logs are therefore inapplicable. Employer authentication, authorization and audit records remain in SecOps.
- Progress is mutable personal learning feedback. A browser owner can fabricate a structurally valid score or attestation; the app makes no trusted competency, incident or certification claim. Query text, method responses, actual results, identifiers and activity timestamps are not persisted.
- Browser extensions, other scripts on the same origin, compromised repository/host writers, and replacement releases remain outside the client-side guarantee. The repository-scoped storage key prevents collisions; it is not origin isolation. Host/network request metadata is disclosed. No hosting header or access-control capability is assumed.
- GitHub Pages framing/header limitations remain an explicit residual for an app with no authenticated or privileged action. Do not present the meta CSP as a `frame-ancestors` header or claim it prevents framing. The reviewed runtime discloses the limitation and says not to embed the course.
- The owner now authorizes a public repository and public Pages hosting without selecting an open-source license. This does not authorize paid services or represent employer approval to use the website or browser storage at work.
- Full manual assistive-technology/real zoom checks and the private tenant pilot remain unperformed. Automated accessibility evidence is partial. Examples remain documentation-checked and tenant-unverified, with the preview-dependent capstone visibly caveated. Those facts limit compatibility and accessibility claims; they are not evidence of a hidden integration or data disclosure in this static release.
- Existing account-wide GitHub integrations, host operations and future source modifications were not audited as independent products. Static-release approval must not be expanded into a general approval of those services or future features.

## Recommendation

Publish the reviewed allowlisted artifact through the manual main-branch workflow, then require successful live asset verification and browser smoke tests before giving the owner the playable course URL. Retain the tenant-unverified, self-attestation and workplace-policy disclosures.

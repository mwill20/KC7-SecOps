# Objective validation and acceptance plan

The rows below define implementation acceptance coverage and bind PRD requirements. Actual execution and remaining manual checks are recorded in EVALUATION.md and IMPLEMENTATION_STATUS.md. Use only bundled symbolic constants; no real logs, SIEM connection, or synthetic event dataset. Boolean assignments and query strings are specification fixtures, not telemetry.

## Test matrix

| ID | Requirement(s) | Success evidence | Should-fail / limitation evidence |
|---|---|---|---|
| T01 | R01,R11 | Real L01 flow: composer→serializer→parser→grade→method→progress in browser | Wrong-scope/type query cannot achieve mastery; no install required for learner |
| T02 | R02 | Exactly six lessons/sixteen missions; all schema, IDs, references, hints, methods and dependencies valid | Unknown IDs, duplicate questions, cycle, unknown source/symbol, bad reference stop build |
| T03 | R02,R10 | All reference and supported alternate queries give 70; prompts independently agree with intent | Mutation fixtures fail; docs-check label never says tenant validated |
| T04 | R03 | Compose reordered/factored predicates, bound/direct keys, renamed outcome aliases | Unknown token/literal cannot enter supported composer/evaluator |
| T05 | R03,R06,R11 | UI has one training-query textarea, fixed method/gap controls and write-only copy | Paste/drop/type a synthetic out-of-catalog value: input receives the synthetic sentinel, grading rejects it, no diagnostic echo/storage/network transmission; no clipboard read |
| T06 | R04 | Parentheses, implicit/explicit AND, comments, strings, regex tokens, types parsed correctly | Missing paren, escaped delimiter, quoted numeric value, duplicate/out-of-order section, invalid enum/type |
| T07 | R04 | Equivalent Boolean distribution/reordering and catalog regex variants accepted | Broad OR, wrong role, extra nocase, omitted category/nonempty filter cannot pass filter block |
| T08 | R04 | Group keys/aliases, outcomes, bucket, count threshold, sort and limit checked | Wrong count function, swapped metric, missing bucket, changed threshold/limit, extra transforms |
| T09 | R04 | Unsupported status distinct from invalid | Rule/SQL/dedup/multi-event/unknown regex catalog forms get no query points; size/depth/atom limits fail safely |
| T10 | R05,R11 | 70/20/10 arithmetic, retries, mission completion after query70+method20, saved best from one attempt | Stale grade after editing, partial completion persistence, max-by-component mixing, double-counted course score |
| T11 | R06,R07 | During full flow, only static allowlisted resource requests; no payload submission; no query in URL/storage/logs | Instrument fetch/XHR/beacon/WebSocket/clipboard read/form submission; attempts cause test failure; CSP enforcement checked |
| T12 | R07,R12,R14 | Static artifact contains only allowed files; no runtime dependency/AI/remote assets/telemetry | Environment files, docs/QA payloads/maps/node_modules/remote script/Copilot API calls excluded |
| T13 | R08 | Remembering opt-in, valid projection, exact-key clear, version invalidation, session fallback | Oversized/malformed/unknown-key/future-version/prototype/duplicate-ID state rejected; blocked/quota storage remains usable |
| T14 | R09 | Keyboard-only complete flow, screen-reader status, contrast, zoom/reflow and target checks | No inaccessible drag-only action, focus trap/hidden focus, color-only errors; automated checks insufficient alone |
| T15 | R10,R14 | Correct language/context labels, sourced limits, private substitution instructions, Copilot optional | No claim query was executed or incident verified; no actual values requested for pilot |
| T16 | R01,R12 | Chrome and Edge smoke tests; root and `/KC7-SecOps/` asset paths; reload/hash routing | 404/missing modules, blocked clipboard, disabled storage, invalid route handled; no workplace command required |
| T17 | R13 | Exact owner/slug and current public visibility verified; owner-authorized manual Pages workflow publishes only tested `dist/`; live HTTPS assets match the checked build | No automatic push deployment, unauthorized visibility/paid activation or source-checkout hosting; five development paths return 404; public website is not workplace-use approval |

## Fixtures and adversarial cases

`qa/query-cases.json` provides positive and negative cases with expected status and points. Include every reference and alternate, and assert exact point subtotals. Add mutations for each scoring-sensitive predicate and pipeline component; do not stop at a positive-only parser suite.

Bounds tests: max and max+1 bytes/tokens/depth/nodes/atoms; duplicate bindings and alias cycles; condition on an undefined aggregate; unsupported field prefixes; malicious string-like token IDs; comment text containing expected answers; XSS-shaped lesson/stored strings rendered only as literal text or rejected; no `eval` calls. Wrong query intent must remain rejected even if all expected keywords are present.

Privacy browser tests inspect all requests during onboarding, grading, hints, navigation, copy, practice flags and clear progress. Allow only exact GET paths for bundled runtime assets; assert no query parameters or body payloads. Explicit documentation navigation is tested separately: expected fixed URL, noopener/noreferrer, no referrer. Check browser storage after each flow against the strict projection. Assert one labelled training textarea only; no text/file inputs, contenteditable, form, custom datalist, hidden value transport or tenant URL. Fill hostile synthetic text and verify fixed diagnostics/no storage/no network payload. Browser owner/extension tampering remains outside the control claim.

## Accessibility and visual QA

Run keyboard path manually in Chrome and Edge, use a screen reader for route headings/radio groups/errors/status, check contrast and 200% zoom, 320px reflow, forced colors, and reduced motion. Save only synthetic screenshots from the development app, never a workplace SIEM screenshot. Browser screenshots and DOM assertions support evidence; they are not a blanket WCAG conformance certification.

## Proposed command contract

Implemented script contract:

- `npm run validate:content` — schemas plus semantic/intent references.
- `npm test` — native Node unit/contract suite.
- `npm run build` — safe static-output allowlist.
- `npm run test:browser` — Playwright tests on built output.
- `npm run verify` — all above plus artifact/privacy checks, fails on any required failed check.

Development install uses Node 24.21.0 and exact @playwright/test 1.64.1 with a lockfile. Pin any GitHub Action by verified full commit SHA at implementation, do not invent SHAs in this package. Browser packages install in the developer/CI environment only. Check known advisories and use a verified exact patch if needed.

## Verification gates and what they cannot prove

1. **Package/build gate:** content, parser/evaluator, scoring, UI/privacy/storage, static artifact and accessibility checks pass; evidence records exact build revision and commands/results.
2. **Focused security review:** independently inspect implemented input/data flow, CSP, artifact boundaries, and hostile cases before release; zero supported findings is valid. No unrelated publication checklist is imposed on the scoped build.
3. **Tenant pilot:** user privately checks actual compilation and telemetry capability using `qa/TENANT_PILOT.md`. This is an external compatibility check, not the same as app tests. An unavailable feature prevents claiming that lesson tenant-validated, but does not block a truthful symbolic build.
4. **Hosting/workplace gate:** owner approves actual host/access policy and visibility before deployment/work use. No paid service assumed.

Until the tenant pilot completes, label examples documentation-checked/tenant-unverified. Until hosting is approved, deliver static output without publishing. Do not stop local authorized work waiting for either external decision.

## Owner feedback and investigation acceptance — 2026-10-17

| Cases | Requirement / real-path evidence | Must fail or preserve |
|---|---|---|
| F01 | Feedback on every route; actual native-decoded synthetic PNG/JPEG/WebP paste, real IndexedDB save/reload and JSON download with fixed page/version context | Hostile text stays literal; no automatic request carrying feedback |
| F02 | Strict image formats/bytes/header dimensions/native decoder bounds | SVG, forged PNG, oversized declarations and empty entry rejected |
| F03/F05 | Blocked store/quota/aborted write keeps usable course and exportable draft | No partial transaction or draft loss |
| F04 | Fifty-entry bound and aggregate limits; explicit delete only | Entry 51 refused without eviction; Clear progress retains feedback |
| F06 | Loaded records treated as untrusted | Unknown keys/invalid record never reflected or silently deleted |
| F07 | Native modal keyboard focus/Escape and 320px layout | No unreachable close control or horizontal overflow |
| F08 | Slow real-IDB-open save locks draft inputs | No newer edits discarded after the awaited save |
| T13 revision | v2 completion correlation and legacy-key preservation | Remember opt-out cannot delete v1; explicit Clear may remove both known keys |
| R03 | Full first count example, outcome/empty-string/function-name explanations, explicit and implicit AND both70 | Wrong aggregation/method gets useful explanation; no repeated practice panel |
| R04 | Every mission renders practical analyst concept and connected authored clue | Wrong query cannot reveal clue; no workplace result input |
| R05 | Direct file opening shows fixed manually clicked playable HTTPS URL | No misleading CONTENT_INVALID diagnosis or enabled broken assessment |

Unit coverage also rejects oversized declared images before invoking a decoder, missing required analyst notes, unknown feedback keys/page/context and inconsistent completion state. The current full builder run passed 121 unit and 30 browser tests. Exact review/release evidence belongs in IMPLEMENTATION_STATUS.md; no mock/shim result is mislabelled a real browser test.

Feedback tests use synthetic images generated in isolated browser profiles, never employer data. Injected storage failures demonstrate app handling, not actual work-browser compatibility. No email delivery, automatic cross-device sync or organization transfer test is claimed. Tenant compilation, full manual AT and workplace website/storage/download/mail/transfer approval remain unverified.

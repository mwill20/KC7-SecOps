# Objective validation and acceptance plan

The rows below define implementation acceptance coverage and bind PRD requirements. Actual execution and remaining manual checks are recorded in EVALUATION.md and IMPLEMENTATION_STATUS.md. Use only bundled symbolic constants; no real logs, SIEM connection, or synthetic event dataset. Boolean assignments and query strings are specification fixtures, not telemetry.

## Test matrix

| ID | Requirement(s) | Success evidence | Should-fail / limitation evidence |
|---|---|---|---|
| T01 | R01,R11 | Real L01 flow: composer→serializer→parser→grade→method→progress in browser | Wrong-scope/type query cannot achieve mastery; no install required for learner |
| T02 | R02 | Exactly six lessons/twelve challenges; all schema, IDs, references, hints, methods and dependencies valid | Unknown IDs, duplicate questions, cycle, unknown source/symbol, bad reference stop build |
| T03 | R02,R10 | All reference and supported alternate queries give 70; prompts independently agree with intent | Mutation fixtures fail; docs-check label never says tenant validated |
| T04 | R03 | Compose reordered/factored predicates, bound/direct keys, renamed outcome aliases | Unknown token/literal cannot enter supported composer/evaluator |
| T05 | R03,R06,R11 | UI contains only closed choice controls, read-only preview and write-only copy | Paste/drop/type a synthetic out-of-catalog value: no input surface accepts it; no clipboard read |
| T06 | R04 | Parentheses, implicit/explicit AND, comments, strings, regex tokens, types parsed correctly | Missing paren, escaped delimiter, quoted numeric value, duplicate/out-of-order section, invalid enum/type |
| T07 | R04 | Equivalent Boolean distribution/reordering and catalog regex variants accepted | Broad OR, wrong role, extra nocase, omitted category/nonempty filter cannot pass filter block |
| T08 | R04 | Group keys/aliases, outcomes, bucket, count threshold, sort and limit checked | Wrong count function, swapped metric, missing bucket, changed threshold/limit, extra transforms |
| T09 | R04 | Unsupported status distinct from invalid | Rule/SQL/dedup/multi-event/unknown regex catalog forms get no query points; size/depth/atom limits fail safely |
| T10 | R05,R11 | 70/20/10 arithmetic, retries, zero-result self-attestation, saved best from one attempt | Stale acknowledgment after editing, partial completion persistence, max-by-component mixing, double-counted course score |
| T11 | R06,R07 | During full flow, only static allowlisted resource requests; no payload submission; no query in URL/storage/logs | Instrument fetch/XHR/beacon/WebSocket/clipboard read/form submission; attempts cause test failure; CSP enforcement checked |
| T12 | R07,R12,R14 | Static artifact contains only allowed files; no runtime dependency/AI/remote assets/telemetry | Environment files, docs/QA payloads/maps/node_modules/remote script/Copilot API calls excluded |
| T13 | R08 | Remembering opt-in, valid projection, exact-key clear, version invalidation, session fallback | Oversized/malformed/unknown-key/future-version/prototype/duplicate-ID state rejected; blocked/quota storage remains usable |
| T14 | R09 | Keyboard-only complete flow, screen-reader status, contrast, zoom/reflow and target checks | No inaccessible drag-only action, focus trap/hidden focus, color-only errors; automated checks insufficient alone |
| T15 | R10,R14 | Correct language/context labels, sourced limits, private substitution instructions, Copilot optional | No claim query was executed or incident verified; no actual values requested for pilot |
| T16 | R01,R12 | Chrome and Edge smoke tests; root and `/KC7-SecOps/` asset paths; reload/hash routing | 404/missing modules, blocked clipboard, disabled storage, invalid route handled; no workplace command required |
| T17 | R13 | Exact repository owner/slug and private visibility verified if created; artifact prepared separately | No automatic deployment/public visibility/paid activation; source privacy never used as website-access proof |

## Fixtures and adversarial cases

`qa/query-cases.json` provides positive and negative cases with expected status and points. Include every reference and alternate, and assert exact point subtotals. Add mutations for each scoring-sensitive predicate and pipeline component; do not stop at a positive-only parser suite.

Bounds tests: max and max+1 bytes/tokens/depth/nodes/atoms; duplicate bindings and alias cycles; condition on an undefined aggregate; unsupported field prefixes; malicious string-like token IDs; comment text containing expected answers; XSS-shaped lesson/stored strings rendered only as literal text or rejected; no `eval` calls. Wrong query intent must remain rejected even if all expected keywords are present.

Privacy browser tests inspect all requests during onboarding, grading, hints, navigation, copy, practice flags and clear progress. Allow only exact GET paths for bundled runtime assets; assert no query parameters or body payloads. Explicit documentation navigation is tested separately: expected fixed URL, noopener/noreferrer, no referrer. Check browser storage after each flow against the strict projection. Assert no inputs of type text/file, textarea, contenteditable, custom datalist, hidden value transport, or custom tenant URL. Browser owner/extension tampering remains outside the control claim.

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

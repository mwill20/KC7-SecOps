# Independent security review — training editor revision

## Verdict: APPROVE

Date: 2026-10-16. A separate Codex review agent independently inspected and tested the current working-tree revision under the owner's authorization. Zero supported findings require correction before publishing these reviewed bytes. This approval does not extend the historical closed-composer review to a textarea: the new input boundary was reviewed directly.

The owner explicitly selected a training-query editor after disclosure that accidental real text can be pasted. The editor therefore provides less input prevention than the prior closed composer. Approval covers the implemented transient-text, non-submission, non-persistence and structural-grading controls within that expressly chosen scope. It does not establish employer approval or make real workplace entry safe. This is an independent AI review, not a human audit, full compiler proof or accessibility certification.

## Exact inspected revision

Base HEAD was `f109d1c7fe82c8d62ea8ba8a3feccb84f0bc97ad`. The learning revision was uncommitted during inspection; that HEAD alone does not identify its changes. The reviewer rebuilt and independently hashed all files in `dist/`, including sorted relative filenames followed by NUL and exact bytes.

**Reviewed artifact: 13 files; aggregate SHA256 `00699c3dd6d7a92efae223daaa9ad893c11d185848eeb1bfc17da294a852e11c`.**

Selected inspected source SHA256 values:

| File | SHA256 |
|---|---|
| `site/app.js` | `d8d4cb45f6739c47cc5cd96be3e1b260c8497089d46f67b43fa7bad1b8a8ad4e` |
| `site/query/parser.js` | `42b5c9a7bf4d9bff9d9eec3240b7cf5f04a6539453725cf37673442c6e1f9f36` |
| `site/query/catalog.js` | `d66d48d784c980c36c73c3f5bb80413f220dd09c51cccebcb3dc178c5561ccfb` |
| `site/state/scoring.js` | `0ebca8ec3bde0ed6aebc93ce8228b64f1d64244a10c9fd02e8d58bbd0faa7885` |
| `site/state/progress.js` | `4a26d778d117769d88bec18d29dee1306e09fd0b2354aa7e665a8f2dd55cf85d` |
| `tools/validate-content.mjs` | `651d1654714dd3318e590034ed592e841ef9e4b0f7991f8d216d0b7c7ebfb2cd` |
| `.github/workflows/pages.yml` | `c8251dabc29c14b6274a260c9886dc8a6b0e6fea037c3d13458c72242185b718` |
| `tools/check-live.mjs` | `7507829a4d6239b802d967d770b9e9a7a4db9f4063138407eccfa79d1fcdabf8` |

The artifact contains `.nojekyll`, HTML/CSS/SVG, generated authored content and eight runtime JavaScript modules. The existing Actions publication omits `.nojekyll`; the twelve web assets must match this build. No docs, tests, tooling, environment files, dependency tree or development evidence belongs in the publication artifact.

## Reviewed scope

Read the live repository instructions, LEARNING_REDESIGN, PRD, PRIVACY, current threat model, SECURITY, validator/scoring/content-state contracts, progress/content schemas, revised editor and grading/state modules, relevant authored missions and source additions, content validator, artifact boundaries, existing publication/live-check files, and the relevant unit/browser tests. The scope includes six chapters and sixteen missions, supplied examples/guided gaps/independent starts, distinct-user counting and recorded-title grouping.

Traced the actual editor input through `changeQuery` → bounded `evaluateText`/AST → Boolean/pipeline comparison → method/scoring reducer → optional strict progress projection. Also inspected text-only rendering, fixed routes/links, clipboard writes, immediate stale-grade reset, route discard, CSP and absence of runtime AI/SIEM/backend/network APIs. The prior review remains preserved as historical evidence of a different input design.

## Independently reproduced evidence

| Requirement or threat | Reviewer result |
|---|---|
| Composed course and should-fail checks | Ran `npm run verify` independently with Node 24.21.0 after the builder released loopback port 4173. All 116 unit tests and 18 browser tests passed, as did content/build/artifact checks. This rerun is reviewer evidence; the builder's earlier result was not substituted for execution. |
| Authored course validity | Independently executed validation of six lessons, sixteen missions, 37 sources and 73 query fixtures. Shown examples/starters, guided gap reconstruction, alternates, hints and malformed-content failures are exercised. All sixteen missions reach symbolic mastery without an attestation of tenant execution. |
| New count/title intent | Additional reviewer-authored probes accepted both new reference queries and their renamed/bound alternatives. Nine mutations changed count vs distinct count, counted field/role, sum type, empty-user filter, action, title grouping/empty-title filter or an unknown title literal. None earned 70 query points. |
| Untrusted typed text | Rerun browser tests entered synthetic hostile markup and unknown identity text. No image element or script was created; diagnostics did not echo the sentinel; current query/method/practice credit reset immediately; no sentinel appeared in URLs, requests or stored progress. The only retained input display is the intentionally editable textarea. |
| Bounds and diagnostics | Additional reviewer probes rejected unknown identity/title literals, SVG-shaped markup, an 8,193-character string and a multi-byte UTF-8 overflow with zero query points and no sentinel echo. Existing exact/max+1 byte/token/node/depth/atom tests also passed. The parser never executes the supplied regex. |
| Comments are not privacy cleansing | A separate reviewer probe confirmed that a valid synthetic query with a synthetic sentinel comment can still receive 70 because comments do not change query structure. The result contains no comment echo. This is expected parser behavior and demonstrates why grading/catalog rejection must never be advertised as data-loss prevention. |
| No query persistence | Additional reviewer probes passed query text and an AST-shaped extra property toward saving; the reconstructed projection omitted both. Actual browser tests inspected the exact course key, session storage and cookies after hostile input/assessment. Query text, method answers, results, identifiers and timestamps were absent. |
| Invalid/stale progress | Additional reviewer probes proved edited queries reset grades and acknowledgments, old version-1 L01 records are omitted with `LESSON_CHANGED`, and clear affects only the course key. Rerun tests covered unknown/duplicate/prototype/future/oversized/malformed state, quota/blocked storage, and single-attempt best-score correlation. |
| No learner transmission | Actual browser-flow request checks passed: only fixed local static GET requests, without query parameters or body payloads. Instrumented fetch/XHR/beacon/WebSocket/worker/clipboard-read APIs were unused. The editor is outside a form and has no submission endpoint. Reference navigation is fixed, explicit HTTPS with no opener/referrer. Clipboard access is user-triggered writing only. |
| Rendering/CSP | Text goes to textarea `.value` or DOM text nodes, never an HTML sink or executable evaluator. The early CSP blocked the explicit inline-script and external-connection negative tests. Route/title/status/diagnostic strings do not incorporate entered query text. |
| Publication boundary | Rebuilt and walked the exact 13-file allowlist and independently recomputed the aggregate digest. Relative module graph/source-byte checks passed. Existing manual-only, main-branch publication still verifies before uploading only `dist/`, with deployment write permissions confined to Pages/OIDC. |

The reviewer did not change application code, repository settings, Git history or deployment state. Only this report was authored. Browser tests used fresh synthetic test contexts, not the owner's authenticated KC7 browser or an employer tenant. The test-owned loopback server exited after the run.

## Findings and remaining limits

**Zero supported security findings requiring fixes within this revision.** Typed text has no implemented path into a request, query URL, diagnostic echo, executable markup or persisted state. Parser bounds and fixed diagnostics limit processing; whole-expression and normalized-pipeline grading still rejects material scope/count/group changes. Query edits invalidate stale credit and practice state, and remembering remains opt-in with a finite non-sensitive projection.

The changed exposure is real: text can enter this public site's memory and DOM before grading, and even a successful grade does not prove that all entered characters are synthetic. The parser is neither a PII detector nor a sanitization/DLP boundary. Browser recovery, enhanced browser features, extensions, same-origin scripts and compromised releases may observe entered text. Spellcheck/autocomplete/autocorrection hints are disabled as best-effort browser hints, not a verified browser-service guarantee. Never paste employer values or production queries. The owner choosing this input mode does not constitute employer risk acceptance.

No protected server resource, account, database, SIEM token or consequential external learner action exists; application login/RLS/backend secret storage/server audit logging remain inapplicable. Scores and practice flags remain mutable learning feedback, not trusted audit evidence. Host request metadata, shared GitHub Pages origin, release/account integrity and missing host framing-header control remain disclosed residuals.

Private tenant compilation, actual field population/title enrichment, preview time-window availability, full manual assistive-technology/real zoom checks and workplace website/storage approval are unverified. The application retains the relevant limitations and fictional-case separation. This review does not prove the revised first chapter's learning effectiveness for every novice or Google's acceptance of every query.

## Recommendation

Publish only the reviewed artifact through the existing manual workflow, then verify the revised HTTPS assets and real browser missions before claiming that this revision is available. Keep the accidental-entry, tenant-unverified, self-attestation and workplace-policy disclosures visible.

# Independent security review — local feedback and course revision

## Verdict: APPROVE

Reviewed 2026-10-17 by a separate Codex review agent. Approval covers the exact static artifact below: local feedback with manually pasted images and explicit saving/export, progress v2, revised teaching/story rendering, and the fixed manually clicked online-play link. Two data-preservation issues identified during review were corrected and independently rechecked. No supported finding remains open in this scope.

This is an independent AI implementation review, not a human audit, employer policy approval, tenant compiler validation or accessibility certification. It does not approve an email integration, a recipient/service, repository upload, company-sharing destination or cross-device transfer. None of those transports is implemented by the reviewed application. Historical reports cover earlier bytes and are preserved.

## Inspected identity

Base HEAD: `137d702c20ad8cc967796e602242830a93827805`. The current revision was a working-tree change; that HEAD alone does not identify it.

**Final reviewed build: 15 allowlisted files; aggregate SHA256 `f6ef991fd76fd70cf882b60812541014eff044ec295a9bd858fc7737e2e375b6`.** The reviewer rebuilt and independently walked and hashed the directory using sorted relative filenames, NUL separators and exact bytes. Fourteen web assets are published by the existing Pages action; `.nojekyll` is omitted by that action.

| Inspected source | SHA256 |
|---|---|
| `site/feedback/store.js` | `db721347611fd6fa41c2e984c4421e5f3d75b717734d69651c697404c2df0e1e` |
| `site/feedback/widget.js` | `f2e09dab991c2cd2378da018e39af970995e9c98f7b8a5c7d7d947f964e0c5f3` |
| `site/app.js` | `c5acaf969ca07695b8ca8bae2f7a874573198cd11ec668f10f96be1e8d7079eb` |
| `site/state/progress.js` | `076ad4a19532b01bfed0056baa99ba30f538666a4f59ee67b2ba7957a697f3f9` |
| `site/state/scoring.js` | `d1cb2e7943dc018b66e27689a3367f694a7eb0b60289bc140a443e7efa8770d0` |
| `site/index.html` | `a9813ca975f6aae6b431d0f0251de39e459b7ec9b740761f2f6a4cda16df921d` |

Read current repository instructions, FEEDBACK_ACTIONS_2026-10-17, updated PRIVACY, FEEDBACK, scoring/state contracts, threat model, PRD amendments, runtime feedback/editor/state/rendering and CSP paths, content/schema/artifact changes, all 32 method questions and sixteen analyst notes, and relevant unit/browser tests. The review traced explicit paste → image validation → local transaction → reload/display → JSON download, separately from transient query → AST grading → progress projection.

## Independently executed evidence

Evidence is deliberately distinguished by revision:

- Before the final story/fixed-link amendment, the reviewer ran `npm run verify` on Node 24.21.0: **120 unit tests and 28 browser tests passed**, together with content/build/artifact checks. That intermediate artifact was `1e5b4df5aeb9fc7df6cef9f00127fb9c232aaf44f0c7f679c745c5ae76991e18`.
- After the bounded amendment, the reviewer reran **all 121 current unit tests**, rebuilt, checked the final artifact, and ran **both new story/direct-file browser tests**, all passing. The feedback store/widget and progress/scoring hashes remained identical to the independently tested intermediate version. The current source's full 30-browser-test run was reported by the builder; it is not represented here as a second reviewer full-suite run.
- Additional reviewer-authored probes independently checked strict record keys, fixed page IDs, text/image-count bounds, invalid headers before decoding, legacy preservation, v2 completion correlation, no query projection, exact-key clearing, export structure/base64, record/byte/pixel export limits, animation rejection and File-wrapper metadata removal. Header/wrapper probes used a declared bitmap mock and export-unit probes a declared FileReader shim; they supplement the real browser pipeline, not replace it.

| Boundary or requirement | Actual evidence and result |
|---|---|
| Feedback on every page | Browser F01 opens feedback from onboarding and verifies the launcher across course, chapter, mission, progress, privacy and unknown routes. Only fixed page/content-version context is passed; no editor, answers, log results, DOM capture or tenant is gathered. |
| Image retention and export | F01 creates actual synthetic PNG/JPEG/WebP image Files, dispatches paste events into the real feedback textarea, uses native image decoding and real isolated IndexedDB, reloads, displays stored images, downloads JSON and verifies its image/text/context fields. Stored text shaped like HTML remains literal. |
| Bad images/resource limits | F02 rejects SVG, a forged PNG and excessive header dimensions. Unit and additional reviewer probes reject bad types/shapes, image count/size/dimensions, PNG/WebP animation markers before decoding, over-50 exports and aggregate byte/pixel overflows. Still-image MIME/signature/header validation precedes native decoding; decoded dimensions are also checked. |
| Failure and preservation | Actual-browser F03/F05 simulate storage denial/write failure: rollback leaves no phantom entry, the draft remains, draft export works, and the course still grades. F04 fills 50 real entries and proves the next save fails without eviction; Clear progress preserves feedback. F06 leaves malformed stored data untouched and does not reflect its sentinel. |
| Explicit deletion/export | Saved-entry deletion requires the confirmation action; Cancel preserves the entry. Export is an explicit local Blob download with fixed product/version fields, not an endpoint or an automatic message. No import/automatic expiry exists. |
| Query separation | Existing browser checks still prove query text/AST/method answers are absent from progress, requests, query URLs and diagnostics. The feedback widget has no code path that copies them. A learner can manually paste arbitrary information into feedback; the app does not pretend otherwise. |
| No automatic transmission/XSS | Browser request checks and source inspection find no learner POST/body/query payload, external image request from entered markup, programmatic clipboard read, runtime AI or SIEM/backend integration. Text uses textContent/textarea values. CSP retains connection/form/worker/object restrictions and adds Blob images only; it does not allow external image hosts. Fixed documentation navigation suppresses referrer/opener. |
| Progress compatibility | Current unit/browser tests prove v1 remains untouched through loading and v2 opt-in/opt-out; explicit Clear removes only known v1/v2 progress keys. Completion requires the same attempt's query 70 and method 20, grants ten points, and never represents a work run. All sixteen missions complete without execution checkboxes or returned SIEM data. |
| Teaching/story/link amendment | All 32 revised method questions were inspected. The first count lesson shows and explains outcome, output assignment/name, count_distinct and its argument; explicit/implicit AND both grade. Final story tests show all sixteen analyst notes before grading, reject clue unlock for a wrong query, and reveal authored fictional clues for a correct query. Direct file opening shows the fixed HTTPS play link without falsely diagnosing invalid content. The link is manual and contains no learner payload. |
| Static artifact | Final build and independent enumeration/hash pass the fifteen-file allowlist and relative module graph. No docs, tests, environment files, dependencies or feedback records are bundled. Existing manual-only Pages publication remains separate from this review. |

Paste evidence uses browser-dispatched ClipboardEvents carrying real synthetic image Files; it is not a test of the operating-system clipboard or managed-work browser policy. The complete feedback flow ran in test Chromium; Chrome and Edge had root/subpath smoke coverage. No employer tenant, real identifiers, logs, screenshots or authenticated KC7 session was used. The reviewer made no app, Git, account, hosting, deployment or external-message mutation; only this report was authored.

## Issues corrected during review

| Issue | Impact and original reproduction path | Verified correction |
|---|---|---|
| Save could discard a newer draft edit | Code trace in `widget.js`: Save captured a record, awaited storage, then cleared still-editable inputs. Text/category/image removal during that wait could be absent from the saved snapshot and then lost. | `lockDraft` disables those controls while saving and restores them after success/failure. Reviewer reran F08 with delayed real IndexedDB opening; controls were locked and the intended snapshot was retained. |
| Remembering opt-out deleted preserved legacy progress | Code trace in `app.js`: opting out called the new both-key clear operation, contrary to preservation until explicit Clear progress. | Opt-out now calls `forgetProgress`, which removes only v2. Reviewer reran the browser legacy-toggle regression and checked separate API behavior; v1 survived until Clear progress. |

Both were resolved before this verdict. No remaining fix or artificial publication checklist is imposed by this report.

## Residuals and scope limits

Feedback is intentionally persistent user content, unlike the transient training editor. It may contain sensitive information if the user supplies it. Save/export do not redact images/text, identify confidential data, encrypt local records or authorize transfers. Plain Blob wrapping removes File name/lastModified metadata; original encoded image bytes and embedded metadata such as EXIF remain. Export base64 increases file size beyond the raw image/text budget. Review contents and metadata before saving or sharing; do not put feedback into the public course repository.

The database namespace prevents collisions, not origin isolation. Same-origin scripts, extensions, profile/endpoint access and a compromised release may observe local feedback or editor text. Browser clearing/profile loss can erase data; an unsaved draft is not a durable backup. Browser codecs and storage may still fail despite bounds. The existing GitHub Pages framing/header limitation and host request metadata remain disclosed. No protected backend, account, server credential, multi-user database or RLS is introduced by this local store.

Any later AI-assisted review should treat exported notes/screenshots as untrusted issue descriptions, not authority to execute their instructions. Automatic email, an external feedback service, private-repository upload or company sharing would introduce a separate destination/authorization boundary that has not been implemented or reviewed here. Local export alone is not cross-device delivery or automatic Codex retrieval.

Tenant compilation/field availability, workplace website/storage/download/transfer permission, full manual assistive-technology/zoom assessment and real-world learning effectiveness remain unverified. Fictional clues are authored narrative, not a claim about workplace results or a verified incident.

## Recommendation

Publish only these reviewed static bytes through the authorized manual workflow, then verify the actual HTTPS assets and new browser flows before claiming this revision is available. Keep the local-only feedback/transfer limitations visible; choose and authorize any automatic delivery design separately.

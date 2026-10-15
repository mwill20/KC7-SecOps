# Ordered implementation issues and milestones

The owner subsequently authorized research/specification updates and building. This is the ordered implementation plan; see IMPLEMENTATION_STATUS.md for completed local work. Commit, push and publication remain separate authority.

## Roadmap

Private repository setup → one complete L01 path → full validator/pipeline support → all six lessons → complete browser/privacy/accessibility QA → independent security review → private tenant pilot and approved deployment route.

External approvals/tenant access may remain pending while local implementation continues. Do not add full product governance, accounts, or future integrations to make the initial course work.

## M0 — Private repository and working boundary

**Issue 01: Establish `mwill20/KC7-SecOps` and import specifications.**

- Display title KC7 SecOps; repository slug KC7-SecOps because spaces are not allowed.
- Verify authenticated identity and whether the exact repository already exists. If it exists, inspect contents and visibility; do not overwrite or change visibility without authority.
- If absent and authenticated creation is available, create **private**, without license selection, public Pages, sample application, or auto-generated commit.
- Place this specification package at the checkout root. Creating a repo does not authorize committing/pushing this package; honor the owner's explicit instruction for those actions.
- Record actual repository URL/visibility, working folder, runtime versions and package import status in `docs/IMPLEMENTATION_STATUS.md`. Never record credentials.
- Creation route when CLI is authenticated: `gh repo create mwill20/KC7-SecOps --private --description "KC7-inspired Google SecOps SIEM Search training; no runtime AI or workplace data"`. No `--push`, `--add-readme`, or license option. Verify privacy afterwards with `gh repo view mwill20/KC7-SecOps --json nameWithOwner,isPrivate,url`.
- If creation access is unavailable, finish local work and provide the supported GitHub creation steps; do not assume connected read/file tools can create repositories.

**Acceptance:** target and privacy verified or explicitly pending; sources preserved; no product code/deploy implied by repository metadata.

## M1 — One real composed learning path

**Issue 02: Build L01 from teaching through assessment and state.**

Dependencies: package import. Planned files: shell/styles/router, lesson renderer, closed composer, serializer, parser/evaluator for scalar filters, scoring and progress.

- Native static runtime and generated bundled content.
- Privacy onboarding, session-only default and optional local progress.
- L01-C01/C02 from authored JSON; token composer permits edits/reordering, read-only preview, Check Query, hints and write-only copy.
- Full 70/20/10 logic, method feedback, practice pending/self-attested, exact-key clear.
- No backend/stub grader/mock SIEM or permissive test double in the milestone path.

**Acceptance:** T01/T05/T06/T07/T10/T11/T13 pass for L01; a correct alternate query succeeds; a wrong-role/out-of-catalog query fails; no input/payload stores real values; built output works in browser. This milestone precedes expansion.

## M2 — Validator and query-language breadth for the six lessons

**Issue 03: Complete the bounded AST and structural evaluator.**

Dependencies: M1. Implement typed catalog, aliases, implicit AND, Boolean equivalence, finite regex normalization, CIDR predicate, match/outcome/condition/order/limit. No arbitrary regex evaluation or general-purpose YARA-L engine.

**Acceptance:** all 56 initial query fixtures pass expected statuses/points; every lesson alternate gives 70; should-fail mutations and limits reject safely; unsupported distinct from invalid; tests prove scope and pipeline semantics, not keyword presence.

## M3 — Full original curriculum and learning flow

**Issue 04: Integrate L02–L06 and complete course/progress views.**

Dependencies: M2. Render all teaching/challenge/hint/method/private steps from JSON, source links from fixed map, and honest verification labels. Support revisiting any lesson and show saved best separately from current attempt. No actual-result answer field.

**Acceptance:** T02–T04/T10/T15 pass; twelve challenges, six lessons, no content placeholders requiring a future author, maximum 1,200 points; unavailable telemetry leaves practice pending without blocking symbolic mastery.

## M4 — Browser, privacy, accessibility and artifact validation

**Issue 05: Complete `npm run verify` and manual QA.**

Dependencies: M3. Validate content/schema/intent, unit contracts, static artifact allowlist, actual browser network/storage flow, CSP, keyboard and screen reader behavior, Chrome/Edge, root/subpath deployment, blocked clipboard/storage and invalid routes.

**Acceptance:** T01–T16 passed with actual output; test failures fixed and rechecked; static artifact alone contains no development/evidence files or runtime AI/dependencies. Version/advisory checks recorded. Manual accessibility evidence is labelled manual, not inferred from tests.

## M5 — Focused independent review

**Issue 06: Review implemented security/data boundary independently.**

Dependencies: M4. Review actual implementation and built output against privacy/threat model; reproduce hostile input, network/storage and misleading validation cases. Reviewer writes a concise APPROVE / APPROVE WITH FIXES / BLOCK result with zero or more supported findings. This is a consequential boundary review, not a universal documentation audit.

**Acceptance:** supported in-scope blockers resolved and rechecked; residual risks/host limitations reported; no certification or tenant claims based on builder tests alone. Independent reviewer can be a separately requested review session; do not silently create chats or agents.

## M6 — Private tenant pilot and deployment preparation

**Issue 07: Record private compatibility pilot and approved hosting decision.**

Dependencies: app build ready; external owner access/policy. Use `qa/TENANT_PILOT.md`. Record only fixed challenge IDs and capability/compiler status; no identifiers or actual results returned. Keep tenant-untested labels until source/capability checks actually occur.

**Acceptance for deploy:** exact repository/private visibility known, license decision made if public content release is intended, approved host/audience and workplace use confirmed, costs explicitly approved if applicable, reviewed static build selected, privacy metadata/embedding limitations disclosed, smoke test runs at actual URL. No public repository or separate deployment repo created silently.

**Acceptance when host remains unresolved:** deliver working static artifact and build evidence, retain private source, state deployment blocked only by the identified owner/environment decision. Do not claim the work-browser goal is already fulfilled.

## Workflow notes

Issue descriptions above are paste-ready backlog bodies; no GitHub issues were created by this package task. Commit/push/build/publication authority must be explicit when those actions start. Implement necessary fixes autonomously once the build is authorized; do not pause for routine reversible decisions. Inspect existing AGENTS.md and live repo changes, preserve unrelated user work, and keep validation evidence bound to the actual revision/artifact.

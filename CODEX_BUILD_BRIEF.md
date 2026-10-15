# Paste-ready Codex build brief

Build **KC7 SecOps**, an original KC7-inspired Google SecOps **SIEM Search / YARA-L 2.0** training web app, from the specification package in this working directory. First read the live repository and `START_HERE.md`, `AGENTS.md`, `docs/PRD.md`, all component contracts, six lesson JSON files, `docs/BUILD_PLAN.md`, and `docs/TEST_PLAN.md`. Treat this as a later implementation task; the package has no working application yet.

## Repository setup

Owner is **mwill20**. Requested repository is **private**, display title **KC7 SecOps**, slug **KC7-SecOps**. Inspect existing repository state/visibility if it exists; preserve existing content. If absent, creation of that exact private repo is authorized by the owner. Verify authenticated account and private visibility. Do not infer repo creation support from an authenticated KC7 browser or connected file tools. Use the authenticated GitHub CLI or the user's GitHub session if available, or report the specific missing creation capability while continuing local work.

This brief authorizes local implementation once the owner sends it as a build request. It does **not** independently authorize commit, push, license selection, paid service activation, public hosting, external messaging, or workplace SIEM automation. Follow any additional explicit owner authorization in that build session. Do not convert the source to public or create a public deployment repository. Private source does not guarantee a private website. Hosting remains pending an approved route; free Pages only works for a public repository. No paid plan is assumed.

## Non-negotiable behavior

- Learner uses only an approved workplace browser; no install, extension, local server, terminal or executable on that device.
- No runtime AI/Gemini/Copilot/LLM calls, backend, accounts, SIEM/API integration, analytics, tracking, remote runtime dependencies or datasets.
- Real usernames, IPs, hostnames, domains, timestamps, logs, results, tenant URLs and investigation notes remain exclusively in workplace SecOps/approved tools.
- Closed-token query composer only: fields/operators/predefined aliases/parentheses/sections/synthetic constants. No raw editor, textarea, free-text notes, upload, paste/import, custom URL or actual-result answer input.
- Copy synthetic query only. User manually replaces symbols inside SecOps. Never read clipboard or connect to another tab.
- Score each challenge 70 query +20 method +10 self-attested completion. Query grading is an AST/schema/Boolean/pipeline check, not string matching/keywords/AI. Real execution is not independently observable. Zero-result practice can complete after reviewing limitations; unavailable capability leaves practice pending.
- Optional storage is the strict non-sensitive projection only; default session-only, exact-key clear, graceful fallback. No query/AST/method-answer/result storage.

## Stack and scope

Native HTML/CSS/JavaScript ES modules, no runtime dependency or bundler. Development Node **24.21.0** and exact `@playwright/test` **1.64.1** with lockfile; check advisories and document any verified exact patch update. Build tool validates JSON, generates a local content module, and copies only an allowlisted runtime artifact into `dist/`. Learners never install these tools.

Initial content is complete: L01 safe search, L02 roles/Boolean logic, L03 host/process regex, L04 network/CIDR, L05 aggregates, L06 time-bucket capstone. Twelve challenges with method questions and progressive hints. Use the authored content files rather than inventing replacements or relying on KC7 copyrighted question banks.

## Implement in order

1. **Issue 01 / M0:** private repo identity/setup; import specs; implementation status record.
2. **Issue 02 / M1:** one real L01 path: closed composer → serializer → parser → evaluator → method → score → local projection. Prove success and wrong-role/unsafe-input failure in the real browser path before expanding.
3. **Issue 03 / M2:** complete bounded AST grammar, alias resolution, finite regex equivalence, Boolean scope, CIDR, grouping/outcomes/condition/order/limit. Pass every fixture and alternate; unsupported is distinct from invalid.
4. **Issue 04 / M3:** all six lessons/twelve challenges, sources/hints/progress/retries and private execution instructions. No runtime AI.
5. **Issue 05 / M4:** implement and run `npm run verify`: content/schema/semantic checks, unit/contract tests, safe artifact build, browser network/storage/CSP checks, Chrome/Edge root/subpath tests. Complete manual keyboard/screen-reader/reflow/contrast checks.
6. **Issue 06 / M5:** request an independent review of actual consequential privacy/security boundaries through the authorized review workflow; resolve supported in-scope findings, zero findings permitted. Do not silently spawn chats/agents.
7. **Issue 07 / M6:** user-run private tenant pilot and owner-approved host/audience decision. Deliver static output while external decisions are pending; no deployment bypass.

## Definition of done

All twelve authored challenges function; supported equivalent queries are accepted; broad OR, wrong fields/types/count/window/threshold/order/limit and unsafe literals fail as specified; all T01–T16 checks pass with honest evidence. Scores use exact 70/20/10 rules, stale attestations clear after edits, hints do not penalize, local storage contains only the allowed projection, and network traffic is static assets only during learning. Accessibility manual evidence and focused independent security result are recorded before release. Source labels distinguish documentation checks, app tests, tenant self-attestation, and independent review.

Provide `dist/`, validation results, material limitations, and a short updated `docs/IMPLEMENTATION_STATUS.md` bound to the actual revision/build. If tenant/hosting approvals are absent, state those precise remaining dependencies without claiming the workplace-access goal is complete. Do not invent logs, benchmarks, results, certifications or production-readiness claims. Do not expand into SOAR, rule deployment, AI tutoring, accounts or public leaderboards.

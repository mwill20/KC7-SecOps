# Product requirements — KC7 SecOps

Version 1.0 • 2026-10-14 • owner: mwill20. Local implementation is underway/validated separately; see IMPLEMENTATION_STATUS.md for evidence. Requirements below remain the product contract.

## Goal and learner

A working SOC analyst learns to turn hypotheses into Google SecOps SIEM Search queries using YARA-L 2.0, inspect UDM roles and field mappings, pivot cautiously, aggregate events, and state investigation limitations. The app provides symbolic training; practice uses existing authorized workplace SecOps access separately.

Original case: **Signal Desk — investigate without overclaiming**. A training supervisor asks the learner to examine an approved identity or host, distinguish ordinary activity from questions worth investigating, and explain next steps. The story never asserts that a selected real employee is malicious or that an incident exists.

## Success case

On an approved workplace browser, open the training site, read the privacy boundary, complete a lesson using selectable query tokens, receive structural and method feedback, copy a synthetic query, and replace symbols only inside SecOps. Run the search within an authorized time range. Return to the site and attest only that the query ran and results/limitations were reviewed. Resume later using optional non-sensitive local progress.

## Should-fail case

Attempt to enter/paste a real username, IP, tenant URL, log, or result into the site. No input surface accepts it, no clipboard is read, no query/result is stored or transmitted, and unknown literals introduced through a tampered internal message fail closed. A broadened OR query cannot pass simply because it contains expected field names.

## Requirements

| ID | Requirement | Acceptance pointer |
|---|---|---|
| R01 | Learner needs only an approved browser; no install, extensions, terminal, or downloaded executable | T01, T16 |
| R02 | Six complete ordered lessons, two challenges each, teaching, examples, three hints, explanation, method questions, and private execution steps | T02, T03 |
| R03 | Compose alternate symbolic YARA-L Search queries using closed choices; no actual employer values accepted | T04, T05 |
| R04 | Parse an AST, check field types and challenge intent, accept supported equivalent forms, distinguish unsupported syntax | T06–T09 |
| R05 | Per challenge: query 70 + method 20 + completion 10; completion is self-attested, no fixed SIEM answers | T10 |
| R06 | Keep all employer identifiers, logs, timestamps, row counts, screenshots, URLs, and investigative notes exclusively in employer systems | T05, T11 |
| R07 | No runtime AI, backend, SIEM/API integration, server learner storage, account, analytics, tracking, remote content, or datasets | T11, T12 |
| R08 | Persist optional non-sensitive completion state only; session-only fallback and clear-progress control | T13 |
| R09 | WCAG 2.2 AA target; keyboard-complete flow, visible focus, non-color feedback, reflow, screen-reader status | T14 |
| R10 | Distinguish Search, detection rules, UDM schema, and KQL; show documentation and tenant verification status accurately | T03, T15 |
| R11 | First build milestone proves one real composed app path with success and should-fail tests | T01, T05–T10 |
| R12 | Build a static output artifact that works at root and repository subpath without leaking development files | T12, T16 |
| R13 | Private GitHub repository `mwill20/KC7-SecOps`, display title KC7 SecOps; no automatic public deployment | T17 |
| R14 | Optional Copilot use stays separate, approved, symbolic, and untrusted; it never grades or powers the app | T12, T15 |

Test IDs refer to `docs/TEST_PLAN.md`.

## Scope

Manual event filtering, types, booleans, UDM principal/target roles, process regex, IP/CIDR pivots, basic aggregations, fixed time buckets, threshold filtering, interpretation, and zero-result troubleshooting. Source-specific field mapping and available telemetry are checked privately by the learner.

Not included: rule creation/deployment, SOAR, response actions, dashboards creation, real indicators or logs, synthetic event datasets, automatic SIEM execution, AI tutoring, shared scores, public leaderboards, certificates, raw query typing, imports/exports, custom learning content, free-text notes, workplace identifier substitution in the app, or organizational reporting.

## Product decisions

1. Native HTML/CSS/JavaScript ES modules; no runtime framework or dependency. Static publishing suits the data boundary and avoids a server.
2. Closed token composer rather than a raw editor. This sacrifices unrestricted typing to enforce the requirement that actual identifiers never enter the external site.
3. Local AST validation for a documented subset. Full Google compilation and arbitrary semantic equivalence are not feasible without a Google engine/integration.
4. No time pressure, hint penalties, streaks, or compulsory sequential locks. Learners can revisit lessons; the suggested order scaffolds skills.
5. Maximum 1,200 course points, 100 per challenge. Scores show mastery feedback, not verified incident analysis.
6. Query examples visibly say **Documentation checked / Tenant execution not independently verified**. A learner's run is labelled self-attested.

## Repository and hosting

The owner requested a **private** repository named KC7 SecOps. GitHub does not allow spaces in repository names, so use `KC7-SecOps` and retain the display title. Verify the authenticated account and existing repository visibility; never change a repository to public.

Build locally and prepare a static artifact. Hosting is unresolved: free Pages applies to public repositories; Pages from private repositories requires an eligible paid plan, and private Pages access control has separate Enterprise organization requirements. A private source repository does not automatically make a deployed website private. Do not purchase, enable Pages, create a separate public deployment repo, or substitute another host without explicit owner approval. [GitHub Pages availability](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Pages access control](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site), [repository naming](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

Workplace web access, external training approval, allowed local storage, telemetry, and Search capability remain unknown. If public hosting is approved later, publish only non-sensitive authored static assets. No additional paid dependency is assumed.

## Definition of done for this specification task

Complete source-backed design, six authored lessons, exact data and validator contracts, concrete should-fail fixtures, build instructions, and a downloadable package. Application code and tenant validation are later tasks. Repository creation may be performed under the owner's instruction if authenticated creation is available; record its actual outcome separately.

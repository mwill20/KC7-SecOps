# Implementation status

Updated 2026-10-15. Builder, independent AI review and actual deployment evidence are distinguished below; none is workplace approval or tenant validation.

| Item | Current evidence |
|---|---|
| Research/design | Public KC7/repository and official Google sources; authorized read-only Chrome structural observations recorded |
| Lessons | Six original complete lessons / twelve challenges; L06 contentVersion 2 adds preview tumbling-window caveat |
| Repository | Created private at https://github.com/mwill20/KC7-SecOps; owner made it public on 2026-10-15 and live metadata confirmed `private: false`. Codex did not change visibility |
| Local checkout | `C:\Projects\SecOps KC7`; main; exact origin; owner explicitly authorized source commit/push and later public Pages publication. Git history and remote refs identify uploaded snapshots |
| GitHub integration | Existing account-wide Pangea auto-install inherited and disclosed before the owner authorized pushing. No global app settings changed; this is not an independent app-access review |
| Application | Native static UI, closed composer, AST/Boolean/pipeline grader, 70/20/10 scoring, hints, method/private practice and strict opt-in progress implemented |
| Query fixtures | All 56 expected statuses/points pass; references/alternates/hint solutions validate and are palette-constructible |
| Full local verification | PASS on exact official Node 24.21.0: content, 90 unit tests, static build/artifact checks, 15 browser tests |
| Browsers | Test Chromium 156.0.8078.4; Chrome 155.0.8059.40; Edge 155.0.4283.45; fresh isolated profiles |
| Static artifact | 13 files, aggregate SHA256 a14b5bcc931f886aeb3d13b272331a2395f08d1ec45a962e5b0843faf53e34c2 |
| Development dependencies | Playwright 1.64.1 exact, lockfile; npm advisory check returned zero known vulnerabilities on 2026-10-14 |
| CI | Pinned manual-only workflows. Pages run [38730561420](https://github.com/mwill20/KC7-SecOps/actions/runs/38730561420) passed build/full verification and deployment for source `d1a1d68f8fe119953f9cb127e9568106086d474b`. The separate verify-only workflow was not dispatched |
| Accessibility | Automated keyboard/skip/focus/reflow/forced-color/reduced-motion checks pass; screenshots visually inspected. Manual screen-reader and actual 200% browser zoom checks remain pending |
| Independent security review | Separate AI reviewer: APPROVE, zero supported findings, independent 90 unit/15 browser tests and extra hostile probes; exact runtime/workflow identity in SECURITY_REVIEW.md. Not a human audit |
| Tenant compiler/execution pilot | Not performed; all examples remain tenant-unverified |
| Hosting/workplace policy | LIVE at https://mwill20.github.io/KC7-SecOps/ with HTTPS enforced. Twelve published assets match the reviewed build; five development paths return 404. Live Chrome flow passes including grading and progress/resume. DEPLOYMENT.md records details. Workplace website/local-storage approval remains separate and unverified |
| License | Owner explicitly approved publication without adding an open-source license; none added |
| Private security reporting | GitHub private vulnerability reporting enabled and verified on 2026-10-15; SECURITY.md links the reporting flow |

## Milestones

M0 setup and source upload complete. M1 real L01 path passed success and wrong-role failure in browser before the all-course browser acceptance run. M2 bounded validator and M3 six-lesson symbolic flow pass. The generic six-lesson renderer was implemented before the M1 browser checkpoint; this was an implementation-order departure from the planned one-lesson-first expansion, not an acceptance waiver. M4 automated checks pass, with manual assistive-technology checks still open. M5 independent AI review complete APPROVE. M6 public Pages publication and real HTTPS/browser checks pass; evidence is in DEPLOYMENT.md. Private tenant pilot and workplace policy remain external, explicitly unverified checks.

## Runtime and artifact identity

Initial development used installed Node 25.8.1/npm 11.11.0. Final verification ran using the official Node 24.21.0 executable downloaded into ignored `work/node-v24.21.0/`; system Node was not changed. Vendor SHA256 for that executable: ba4e6d110e8c1592a1ecd390f6b05f3da124b13871a5be62b341a07a853c6c32, matched against HTTPS nodejs.org SHASUMS256.txt.

Artifact aggregate hashes UTF-8 file names plus NUL, then exact bytes, in sorted allowlist order. The digest above identifies the tested local deliverable; Git history identifies committed source. Deliverable archive hashes are recorded outside the archives in the output manifest. Original donor specification remains unchanged/ignored. The 13 root runtime copies were present at the owner's push request and matched `dist/` byte-for-byte; they are included without deleting owner content.

No user/employer query was run; no KC7 answer submitted, query executed, replay reset, enrollment or KC7 setting changed. Source commit/push, independent agent review and public GitHub Pages publication without adding an open-source license are authorized. Pages and private vulnerability reporting were enabled on GitHub under this setup. Paid activation, further repository visibility changes, license selection and external messaging remain unauthorized. Workplace access approval is not inferred.

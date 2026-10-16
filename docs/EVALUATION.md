# Evaluation — investigation learning revision (2026-10-16)

Builder evidence below covers the current training-editor revision. The separate AI review in SECURITY_REVIEW_2026-10-16.md returned APPROVE with zero supported security findings and independently reproduced the full suite plus additional hostile/count/title/storage probes for the exact artifact. Pages run 38919299268 also passed the complete suite and published the identical artifact; actual HTTPS assets and all sixteen live mission pages were checked. See DEPLOYMENT.md for precise scope. Historical review/deployment remain preserved separately.

Preferred command `npm run verify`, with the official checksum-verified Node 24.21.0 executable on PATH, passed: **116 unit tests, 18 browser tests, content/build/artifact checks**. The thirteen-file artifact aggregate SHA256 is `00699c3dd6d7a92efae223daaa9ad893c11d185848eeb1bfc17da294a852e11c`. Browser tests use isolated profiles: complete flow in test Chromium; root/subpath smoke in installed Chrome and Edge. No signed-in browser profile was reused for automated tests.

| Goal | Reproduced builder evidence |
|---|---|
| Beginner can start | First chapter visibly supplies a complete query and breakdown before any hint. Browser walkthrough grows through six missions using examples/gap choices without revealing hints |
| All content works | Six chapters/16 IDs, 37 sources, 73 query fixtures; every reference/alternate/hint solution and completed guided starter validates |
| Grading measures query intent | Supported alternate forms earn 70; wrong role, broad OR, wrong action, event-count vs user-count, missing nonempty guard, wrong grouping/metric/window/order/limit and malformed/unsupported input fail their specified checks |
| No output grading | All sixteen missions reach 90-point symbolic mastery, total 1440/1600, without claiming tenant execution. Practice remains unchecked |
| Typed-input boundary | One labelled training textarea; hostile markup stays text, fixed diagnostics do not echo it, no markup node is created, oversized input fails safely. The textarea can still receive accidental real data |
| State freshness | Every typed edit clears current query/method grades, method choices and practice attestations while retaining typing caret; route exit discards text and retains only non-sensitive saved best |
| No query persistence/transmission | Actual browser requests are allowlisted static GETs without parameters/body. Storage contains only fixed progress projection, no query/AST/method choices. SessionStorage/cookies absent; clipboard is write-only |
| Defensive controls | Restrictive CSP blocks explicit negative inline-script/external-fetch probes; strict future/hostile/stale/oversize progress rejection, blocked-storage fallback and exact-key clearing pass |
| Static output | Allowlisted files/source bytes/module graph, root and repository subpath routing, and development server rejection of submissions/private paths pass |
| Accessibility portion | Keyboard/skip/route focus, live feedback, 320px reflow, forced colors/reduced motion and screenshot checks pass. Full manual screen-reader and actual 200% browser zoom checks are unperformed |

The initial browser run caught the guided-help panel closing between two blank selections. It was corrected; full verification rerun passed all 18 browser tests. Expected CSP violation messages come from deliberate negative tests. FORCE_COLOR/NO_COLOR output warnings are test-environment formatting noise.

These are application checks, not Google compilation, work-log testing, incident verification, learner usability research or accessibility certification. Title fields may be absent or enriched later; they do not prove historical job roles or permissions. L06 tumbling-window capability is preview-dependent. No workplace query, log or actual count was entered into this course.

The owner authorized source push and public GitHub Pages publication after focused review. The existing public repository/Pages configuration was rechecked with ordinary authenticated CLI access. Git transport/network checks use the approved tool route, without extracting browser credentials. No new visibility change, paid service, license or external messaging is authorized. Workplace website/storage approval remains external and unverified.

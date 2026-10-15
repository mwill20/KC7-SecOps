# Build evaluation — 2026-10-14

This records the tested local deliverable before initial source upload. Source commit/push was subsequently authorized; current identity is in Git history. Deployment, independent review and tenant validation remain separate.

## Result and scope

The local composed course passes its automated builder verification. It is not independently accepted, tenant-compiled, deployed or a WCAG certification. Six lessons, twelve challenges, 36 sources and 56 query cases are present.

Final command: `npm run verify`, invoked with checksum-verified official Node 24.21.0 and project PATH, completed successfully: **90 unit tests; 15 browser tests; content/build/artifact checks passed**. Earlier development checks also ran on installed Node 25.8.1. npm is 11.11.0, Playwright 1.64.1 exact. Browsers: test Chromium 156.0.8078.4, installed Chrome 155.0.8059.40 and Edge 155.0.4283.45. System runtime/browser profiles were not replaced or reused.

The thirteen-file artifact aggregate SHA256 is `a14b5bcc931f886aeb3d13b272331a2395f08d1ec45a962e5b0843faf53e34c2`. Build/check-artifact calculate and verify the exact allowlist and relative module graph. No source maps, evidence, environment files, tests or development dependencies are served. Archive identity is in the external deliverable manifest, avoiding a self-referential hash.

## Goal and failure evidence

| Contract | Evidence and practical limit |
|---|---|
| T01 | Real browser L01 composer→serializer→parser→grade→method→state; equivalent query gets 70, wrong target role gets 35 and cannot attest practice |
| T02 | Six lessons/12 IDs/36 sources, schema subset and semantic checks; negative content mutations for counts, IDs, cycles, sources, symbols, method/options, query intent and unknown fields stop validation |
| T03/T04 | All 56 fixtures exact status/points; alternate queries and worked solutions accepted; Boolean distribution/De Morgan, alias normalization and palette constructibility checked |
| T05 | Actual DOM has no text/file input, textarea, contenteditable or form; typing sentinel into preview does not change it; unknown token IDs fail without echo |
| T06–T09 | Typed lexing/parsing, comments/literals, unsafe values, role/Boolean scope, metrics/buckets/threshold/order/limit and unsupported context; bounds include exact 8KB/512 tokens/256 nodes and should-fail variants |
| T10 | 70/20/10, half-attestation not persisted, one-attempt saved best, hint flag without penalty, token/route stale-state resets, all twelve symbolic masteries total 1080 without claiming private execution |
| T11 | Actual browser flow requests only exact static GET assets with no parameters/body; guarded fetch/XHR/beacon/WebSocket/worker/clipboard-read paths unused; clipboard fallback; inline script and external fetch blocked by CSP; fixed docs links no opener/referrer |
| T12 | Static file allowlist, source-to-output byte checks, local module graph, early CSP and runtime sink scan pass; server rejects POST, query parameters, and private/developer paths |
| T13 | Exact-key opt-in/clear, strict projection, unknown/malformed/future/oversized/prototype/duplicate/correlated-score failures, stale versions and storage/quota fallback checked |
| T14 | Keyboard composer and skip link, route focus, live status/labels, 320px reflow, forced colors/reduced motion and visual screenshots checked. Full manual AT/zoom verification remains open |
| T15 | Tenant-unverified/Search/subset/self-attested labels and private steps rendered; L06 preview caveat; no real-result input |
| T16 | Fresh Chrome/Edge root and /KC7-SecOps/ smoke, reload/privacy gate/invalid routes pass. Full browser flow is in test Chromium, not every supported browser/device |
| T17 | Owner/name/private badge and empty state verified in authenticated GitHub UI; local origin configured. No source upload, visibility change or publishing |

Bound coverage is targeted, not an exhaustive proof of every grammar combination. The abstract predicate model can decline Google-valid semantic optimizations. No real event data or SIEM execution underlies any result.

## Corrections found during builder validation

A mobile sidebar overflow was fixed. The skip link was prevented from entering the hash router. Route exit now discards current attempt input as the privacy contract requires. Function keyword case normalization was corrected. A blocked-storage test now clicks the deliberately reverting remember control instead of waiting for it to remain checked. A test was corrected to select the authored re.regex alternate from its actual challenge. Relevant corrections passed on recheck; no failing automated check remains.

The runner's inherited FORCE_COLOR/NO_COLOR warning is output-formatting environment noise, not an application error. Expected CSP violations occur only in the explicit negative test. Browser smoke tests collect no unexpected page errors.

## Security and supply chain

No runtime dependencies. `npm audit --json` reported zero known advisories for the pinned development tree on 2026-10-14; this does not prove absence of vulnerabilities. Official action tag revisions were verified with git ls-remote before pinning. CI is workflow_dispatch only, contents read, no persisted checkout credentials, ten-minute limit; it has not run remotely or incurred a build activation here.

Github automatically inherited existing account-wide Pangea access during empty private repo creation. The auto-installed selection was not removable in that form. No source was uploaded; review that existing integration before a later authorized push.

## Checks still requiring another environment or person

- Independently review implemented security/privacy boundaries before release, using the actual files/artifact; builder tests cannot provide that verdict.
- Perform full manual screen-reader, real 200% browser zoom, contrast/target and assistive-technology checks across intended browsers. Visual inspection and automation are partial evidence only.
- Execute the private tenant pilot under employer authorization, without exporting queries/results/identifiers. L06 preview availability must be checked without enabling features.
- Approve host/audience/workplace website and storage policy; evaluate host access logs/headers and any license/cost choice before deployment.
- Run CI only after a separately authorized source upload. No remote CI result is claimed.

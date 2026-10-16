# Privacy contract

**What the learner can enter:** a training-query text editor using predefined placeholders, optional preset gap choices, method selections and practice acknowledgments. The owner approved this editor on 2026-10-16. It can receive accidental real text; the app cannot prevent or undo that entry. Only symbolic values are supported by grading. Do not type/paste real identities, addresses, logs, results or internal URLs.

**What the app persists, when enabled:** fixed lesson/challenge IDs and versions, query/method/completion point totals, a practiced flag, and highest hint level. No query, AST, responses, actual-result category, date/time, browser identifier, user profile, or event history. Progress is learning feedback and can be cleared.

**What the app transmits:** requests for its static assets. No learner payload is submitted. Public documentation links open only after a click; referrer is suppressed. The hosting provider and employer network can still process visitor IP address and ordinary request metadata. GitHub specifically documents visitor IP logging for Pages. Do not claim the whole experience collects no PII. [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Private substitution procedure

1. On the site, type only training syntax and `[USER]`, `[HOST]`, `[IP]`, or another predefined symbol.
2. Copy the displayed **synthetic** Search query. The app never reads the clipboard.
3. Switch to the employer's SecOps query editor manually.
4. Replace the synthetic values there with authorized workplace values; escape quotes/backslashes appropriately inside SecOps.
5. Run within the employer-approved investigation time range and access scope.
6. Inspect events, any returned counts, and investigative notes inside employer tools only.
7. Return and select fixed statements confirming execution and review. Do not bring data back.

The symbol catalog is not a mapping table. The app never asks what `[USER]` means. Query text is held only in the current mission's tab memory and DOM, discarded on route change/reload, and never submitted, logged, included in URLs or persisted by application code. A managed device/work network does not turn this public origin into an employer system. Extensions, browser features and compromised/same-origin code can observe entered text. It cannot substitute or preview the real query. No automatic SecOps deep link carries the query. No screenshot or copy-back proof is requested.

## Browser storage

At onboarding, default to **session-only**. Offer explicit "Remember non-sensitive progress in this browser". Preference and projection share one repository-scoped key, `kc7-secops:mwill20:KC7-SecOps:progress:v1`. localStorage is origin-wide, so other pages/scripts on the same origin may read it; prefixing avoids accidental collisions, not an isolation boundary. No cross-project private data belongs on that origin. Validate and allowlist the loaded projection before rendering or saving.

No storage access beyond that exact key. Clear Progress deletes that key and resets in-memory progress; the app must not clear other sites/projects' storage. Explain that progress can be lost, tampered with, or observed by extensions and managed browsers. Incognito and blocked storage remain usable in session-only mode.

## UI copy

"Use symbols here. Choose real values only inside your workplace SecOps. Never paste workplace information into this site. Your score checks training structure and choices; SecOps execution is self-attested."

"This site has no training-data upload or analytics. Its host still receives ordinary web request metadata."

## Non-applicable controls

There is no application login, server learner profile, database, RLS, SIEM token, or secret. Protected resource authorization remains in employer SecOps. Adding any of these features requires redesign, not silently enabling a dependency.

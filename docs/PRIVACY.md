# Privacy contract

## Three separate boundaries

**Training queries:** the owner-approved editor accepts symbolic training queries, preset gap choices and method selections. Actual workplace identities, addresses, logs, results and internal URLs stay in workplace SecOps. Query text is held only in the current mission's memory/DOM, discarded on route change/reload, and never submitted, logged, included in URLs, exported or persisted by application code. The parser validates training syntax; it cannot prevent accidental real-data entry or undo it.

**Optional progress:** remembering is off by default. The only saved progress is fixed challenge IDs/content versions, query/method/completion scores, a completed flag and highest hint. No query, method answers, AST, user profile, actual-result category, timestamp or event history. Completion means the training query and method checks passed, not that workplace execution occurred.

**Explicit feedback:** a separate Feedback & ideas dialog accepts comments and manually pasted PNG/JPEG/WebP screenshots. Save stores these in this browser's IndexedDB; Export downloads a JSON file containing comments and encoded images. No automatic upload, email, GitHub issue, cross-device sync or Codex retrieval exists. The user must review the export and choose an employer-permitted transfer route. The destination remains undecided.

## Private query practice

1. Type only training syntax and predefined symbols such as [USER], [HOST] or [IP] on this site.
2. Copy the synthetic Search query, then substitute real values only inside authorized workplace SecOps.
3. Run and inspect events/counts within employer tools. Do not return the output or adapted real query.

The app never asks what a symbol means and does not carry queries in SecOps deep links. It does not read the clipboard programmatically. Feedback image paste handles only the user's paste event in the feedback textarea; it never captures the screen, course editor, SIEM, clipboard history or other tabs.

## Local storage and retention

Progress uses localStorage key `kc7-secops:mwill20:KC7-SecOps:progress:v2`. Old v1 progress is detected but not migrated, rewritten or deleted automatically. Turning remembering off removes only v2. Explicit Clear progress removes the two known progress keys and resets current progress; it does not touch feedback or other projects' data. Loaded state is strictly allowlisted and bounded before use.

Feedback uses IndexedDB database `kc7-secops:mwill20:KC7-SecOps:feedback:v1`, version 1, store `entries`. Each entry contains a local random ID, feedback creation time, fixed page ID/content version, fixed category, comment and image blobs with dimensions. It contains no automatically captured query, account, tenant, URL or user identity. Text entered manually can of course contain information the user supplies.

Limits: 4,000 characters and three images per entry; 2 MiB and eight million pixels per image; 8,192 pixels per side. The database accepts at most 50 entries, 10 MiB of image bytes and 32 million image pixels. PNG/JPEG/WebP type/signature/header bounds are checked before native decoding; SVG and animated PNG/WebP are rejected. Limits are app safeguards, not guarantees about all browser codecs.

Saving is explicit and locks draft inputs while its atomic transaction finishes. Storage denial, malformed records, quota and full-capacity errors do not silently delete entries; a draft remains available for export. Per-entry deletion asks for confirmation. No automatic expiry, eviction or import. Browser clearing, profile loss or device replacement can still erase feedback; export any feedback you want to retain.

Image File wrappers are converted to plain Blobs so filenames and File lastModified values are not stored. Encoded image bytes are preserved: embedded metadata such as EXIF is NOT removed. There is no automatic screenshot redaction or detection of confidential data. Review image contents and metadata before saving or transferring.

Local data is not encrypted by this app. Browser profiles, managed endpoints, extensions and other scripts on the same origin may access it. Repository prefixes avoid key collisions, not origin isolation; other projects on mwill20.github.io share that origin. A public repository/site does not automatically publish browser-local feedback, but a compromised release could read it.

## Network and transfer

The application makes only requests for allowlisted static assets. Its CSP blocks application connections; fixed official references open after a user click with referrer suppression. Feedback download is a local Blob URL, not an upload. Image previews use Blob URLs. The app has no analytics or automatic feedback destination.

The hosting provider and employer network can process visitor IP addresses and ordinary request metadata. Do not claim zero PII collection for the overall hosted experience. [GitHub Pages data collection](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

Work-to-personal email, a separate private repository file upload, or approved company sharing are candidate transfer routes only if organizational policy permits them. This app does not authorize or perform such transfers. See [Feedback usage](FEEDBACK.md).

## Non-applicable controls and limitations

There is no application account, backend, SIEM integration, secret, server learner profile or multi-user server database. Server authorization/RLS are therefore not applicable; employer SecOps enforces its own access controls. A local IndexedDB store does exist for feedback. Adding a protected service or automatic transfer requires a new approved design.

A managed work device does not make the public training origin an employer system. Workplace website/storage/transfer approval, tenant compilation and endpoint posture remain unverified.

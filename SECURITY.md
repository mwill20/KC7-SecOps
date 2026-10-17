# Security policy and boundary

This application teaches query construction. It has no authority to access SecOps, analyze employer data, classify a real incident, or perform response actions. Do not put workplace information into this repository, issues, app, test artifacts, or third-party AI prompts.

## Required implementation controls

- Transient training-query editor and fixed reflection questions; only bundled symbol literals and documented public enums are supported for grading. The textarea can receive accidental real data and does not make it safe to enter.
- No user-controlled HTML, executable content, arbitrary regex execution, dynamic imports from user values, `eval`, or `new Function`.
- Render text with text nodes; allow only bundled HTTPS reference links, opened on explicit user action with no referrer/opener.
- No runtime backend/API, analytics, external asset fetches, remote content, SIEM links with query payloads, programmatic clipboard reads, or automatic data uploads. User-initiated screenshot paste in the feedback textarea is separate.
- Bounded parsing and equivalence checks; fail safely on unsupported or malformed input.
- Strict local progress projection, size limit, schema/version checks, per-repository storage key, and session-only mode when storage is unavailable.
- Build an allowlisted static output folder; never publish the whole checkout or QA evidence by accident.
- Review supply chain, privacy boundary, and should-fail tests before release. Builder tests alone are not independent security acceptance.

Authentication, RLS, secret storage, and server audit logs are not applicable because there are no accounts, private server resources, server database, credentials, or server learner actions. Employer SecOps authentication/authorization and search audit records remain managed by the employer. Local training progress is mutable and untrusted, not a forensic audit log.

## Reporting a vulnerability

GitHub private vulnerability reporting was enabled and verified on 2026-10-15. Use the repository's [Security → Advisories](https://github.com/mwill20/KC7-SecOps/security/advisories) reporting flow to report privately. Do not include employer identifiers, actual queries, logs, or screenshots in any report. A report may identify an affected component, synthetic reproduction, expected/actual behavior, and build version.

## Release boundary

Public hosting requires owner approval of the host/audience and an independent review of the implemented data boundary. The owner explicitly approved public GitHub Pages publication on 2026-10-15, following review, without adding an open-source license. Workplace use and optional browser storage still require organizational policy approval separately. Host IP logging and browser/extension observation are outside the app's control and must be disclosed. See `docs/PRIVACY.md` and `docs/threat-models/THREAT_MODEL.md`.

## Training editor boundary (2026-10-16)

The owner approved a training-query textarea after disclosure of accidental paste risk. It accepts untrusted text and grades only catalog placeholders with bounded parsing and fixed, non-echo diagnostics. Application code never submits, persists or logs query text; navigation/reload discards it. Input cannot prevent accidental workplace entry or endpoint/extension observation. Do not paste production queries with real values. The changed boundary requires focused independent review before this revision is republished; the historical review is not acceptance of the new editor.

## Local feedback/export boundary (2026-10-17)

Owner-approved separate feedback permits manually entered comments and reviewed still PNG/JPEG/WebP screenshots. Explicit Save retains them in bounded local IndexedDB; explicit Export creates a local JSON download. No automatic query/screen/DOM/clipboard capture, external endpoint, email or cross-device synchronization. No transport destination selected. Local files can be transferred only under organizational policy; this app never publishes them to its public repository.

Strict record/page/category/length/image byte/pixel/count validation precedes local persistence; type/signature/header bounds precede native image decoding. SVG and animated formats are rejected. Render text literally; image previews use local Blob URLs under CSP. Save locks editing, failure preserves draft, capacity refusal never silently evicts, and deletion asks confirmation. Progress clearing touches only the known progress keys, not feedback. See docs/FEEDBACK.md for exact limits and tests.

Original encoded image metadata stays intact; no DLP, redaction, encryption or guaranteed backup. Same-origin code, extensions, endpoint/profile access and browser clearing remain residuals. Focused independent review must bind the current changed artifact before publication; earlier approval is not acceptance of new bytes.

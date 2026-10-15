# Security policy and boundary

This application teaches query construction. It has no authority to access SecOps, analyze employer data, classify a real incident, or perform response actions. Do not put workplace information into this repository, issues, app, test artifacts, or third-party AI prompts.

## Required implementation controls

- Closed-choice composer and reflection questions; every string literal comes from the bundled symbol catalog or documented public enums.
- No user-controlled HTML, executable content, arbitrary regex execution, dynamic imports from user values, `eval`, or `new Function`.
- Render text with text nodes; allow only bundled HTTPS reference links, opened on explicit user action with no referrer/opener.
- No runtime backend/API, analytics, external asset fetches, remote content, SIEM links with query payloads, clipboard reads, or data uploads.
- Bounded parsing and equivalence checks; fail safely on unsupported or malformed input.
- Strict local progress projection, size limit, schema/version checks, per-repository storage key, and session-only mode when storage is unavailable.
- Build an allowlisted static output folder; never publish the whole checkout or QA evidence by accident.
- Review supply chain, privacy boundary, and should-fail tests before release. Builder tests alone are not independent security acceptance.

Authentication, RLS, secret storage, and server audit logs are not applicable because there are no accounts, private server resources, database, credentials, or server learner actions. Employer SecOps authentication/authorization and search audit records remain managed by the employer. Local training progress is mutable and untrusted, not a forensic audit log.

## Reporting a vulnerability

GitHub private vulnerability reporting was enabled and verified on 2026-10-15. Use the repository's [Security → Advisories](https://github.com/mwill20/KC7-SecOps/security/advisories) reporting flow to report privately. Do not include employer identifiers, actual queries, logs, or screenshots in any report. A report may identify an affected component, synthetic reproduction, expected/actual behavior, and build version.

## Release boundary

Public hosting requires owner approval of the host/audience and an independent review of the implemented data boundary. The owner explicitly approved public GitHub Pages publication on 2026-10-15, following review, without adding an open-source license. Workplace use and optional browser storage still require organizational policy approval separately. Host IP logging and browser/extension observation are outside the app's control and must be disclosed. See `docs/PRIVACY.md` and `docs/threat-models/THREAT_MODEL.md`.

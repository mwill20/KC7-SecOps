# Repository-specific Codex instructions

Build only the behavior in `docs/PRD.md` and the referenced contracts. Inspect live state before editing. The root now contains a local application; read `docs/IMPLEMENTATION_STATUS.md` and `HANDOFF.md` for current evidence. The preserved specification subfolder is a donor snapshot.

- Start with the one-lesson composed path in `docs/BUILD_PLAN.md`; include the real composer, serializer, parser, evaluator, scoring, and privacy-safe progress reducer.
- Maintain browser-only learner use, no runtime AI, no SIEM integration, and no supported workplace-data input.
- Owner corrections authorize the training-query editor and a separate feedback dialog on every page. Training query text must never persist or transmit. Feedback text and explicitly pasted sanitized PNG/JPEG/WebP screenshots may be saved in a bounded browser-only IndexedDB and explicitly exported for later review. No backend, automatic upload/issue posting, tenant/custom URLs, real-data result fields or programmatic clipboard reads. User-initiated paste is scoped to the feedback box. Accidental real text/images can enter; disclose this honestly.
- No server-side learner storage. Course progress persists only the v2 projection in `schemas/progress.schema.json`; old v1 data remains untouched until explicit Clear progress. Feedback has a separate bounded store and export; never automatically capture queries, ASTs, method responses, workplace output or screenshots. The repeated SecOps-practice panel was removed; completion means query and method passed, not SIEM execution.
- No runtime dependencies, CDN assets, external fonts, trackers, automatic external requests, service worker, or remote content loading.
- Tests must prove the requested behavior and should-fail cases. Do not replace the AST evaluator with string comparison, regex keyword counting, or AI grading.
- Supported subset means supported subset. Report unsupported syntax separately from invalid syntax and incorrect challenge intent.
- Preserve original authored content and source attribution. Do not copy KC7 questions, scenarios, assets, credentials, or logs.
- Browser tests use only synthetic constants. Do not automate the employer's SecOps or KC7 authenticated session.
- Record consequential choices and updated validation in `docs/IMPLEMENTATION_STATUS.md` during the later build.
- No commit, push, public publishing, license selection, or external messaging without explicit user instructions.

The named planned files/functions in the threat model are implementation targets, not evidence of controls already implemented.

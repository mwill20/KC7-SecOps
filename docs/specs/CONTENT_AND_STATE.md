# Content and browser state contract

## Purpose

Keep authored teaching separate from application logic, and ensure persisted progress cannot grow into an employer-data store. Explicit feedback has its own separately approved local store; it is not query or progress capture. This is a JSON/file and local-function contract, not a database or server API.

## Authoring sources

- `content/lessons/L01.json` through `L06.json`: teaching and scored challenge content.
- `content/symbols.json`: fixed display labels and synthetic literals. It contains no real-value mapping.
- `content/sources.json`: fixed primary reference URLs; the matrix records supplemental URLs, retrieval limits and source conflicts.
- `schemas/lesson.schema.json`, `symbols.schema.json`, `sources.schema.json`: JSON Schema Draft 2020-12 shapes.
- `docs/research/SOURCE_MATRIX.md`: primary source IDs and provenance.
- `qa/query-cases.json`: independent alternate/mutation fixtures, not user logs.

All strings are plain text. Content permits no HTML, Markdown execution, scripts, embeds, dynamic URLs, event records, uploads, or arbitrary template substitution. Queries display as text in a code region. The renderer may create static markup around them, but never interpret authored/user strings with innerHTML. Public reference URLs are compiled from the explicit source map in the build; they are not accepted through query parameters or browser input.

The build may transform these JSON files into one local `site/content.js` ES module. Its default export is `{courseVersion:1, lessons:Lesson[], symbols:Symbol[], sources:Source[]}`. Source is `{id,title,url}` from `content/sources.json`, with IDs declared in the research matrix and literal HTTPS URLs in the audited allowlist. No remote fetch at runtime. Do not duplicate lesson prose into hand-edited Markdown or code constants.

## Semantic validation beyond JSON Schema

Before a build, require exactly six lesson IDs, sixteen globally unique challenge IDs, matching Lxx parents, contentVersion >=1, no duplicate prerequisites/self-dependency/cycles, unique source/symbol IDs, source IDs resolving to the source map, exactly M1/M2 method IDs, and exactly one A/B/C option each with a matching answer key. Reference and alternate queries must parse/type-check within catalog/limits. Every alternate must produce query 70 against its challenge. Query fixtures must refer to existing challenge IDs. No unbound symbol or unknown literal allowed.

Never accept a content file from URL parameters, storage, file upload, paste, or a network API. Invalid authored content stops the build rather than falling back to permissive evaluation. If browser modules fail to initialize, the static fallback supplies a fixed manual play link and does not enable assessment; direct file opening is not evidence of invalid lesson content.

## Composer state

Memory only:

```text
Attempt { challengeId, queryText, tokenIds[], queryResult|null,
          methodChoices: {M1:"A"|"B"|"C"|null,M2:...}, methodResult|null,
          highestHint:0|1|2|3 }
```

The owner-approved training textarea accepts symbolic query typing/paste, bounded to 8,192 UTF-8 bytes by the parser and 8,192 characters by the UI. Query text stays in memory/DOM only, clears on route exit/reload, and never enters storage, URLs, diagnostics, telemetry or requests. Edits reset all current grades, method choices and completion immediately without moving the typing caret. Fixed diagnostics never echo unknown input. Optional preset gap selections insert only authored fragments. Copy is user-triggered, write-only; a clipboard denial falls back to selecting text manually. No programmatic clipboard reading, workplace deep links, result inputs, remote uploads or sanitization of production queries. Manually initiated screenshot paste is supported only in the separate feedback dialog.

Each challenge has required `mission` content: support (shown/guided/independent), beat, analystNote {concept,text}, example, starter, syntax explanation pairs, remember, fictional caseUpdate, caveat and gaps. The analyst concept appears before query construction; the authored clue appears only after query70 and never depends on real results. Shown examples/starters must grade 70. Guided starters contain unique declared markers and their allowed answers must reconstruct a 70-point solution. Independent starts empty. New concepts can still receive complete examples in later chapters. L01 has six missions, each other chapter two. The schema and semantic validator enforce these contracts.

## Persisted schema and API

Use `schemas/progress.schema.json`. Example non-sensitive projection:

```json
{
  "schemaVersion": 2,
  "courseVersion": 1,
  "rememberProgress": true,
  "records": [
    {
      "challengeId": "L01-C01",
      "contentVersion": 3,
      "queryPoints": 70,
      "methodPoints": 20,
      "completionPoints": 10,
      "completed": true,
      "highestHint": 1
    }
  ]
}
```

`loadProgress()` returns `{mode:"remembered"|"session-only", progress, warningCode|null}`. Use `kc7-secops:mwill20:KC7-SecOps:progress:v2`; cap stored value at 16,384 UTF-8 bytes before JSON parsing. Validate shape, enum domains, unique challenge IDs, versions and completion/query/method correlation. Reconstruct a fresh projection by allowlisting each named property, without spreading untrusted objects. Do not treat `__proto__`, inherited properties, unknown IDs, or user strings as state.

`projectProgress(attemptRecords)` returns only the permitted schema. `saveProgress(progress)` writes that projection only after validation and only if the learner enabled remembering. `forgetProgress()` removes only v2 when remembering is turned off. Explicit `clearProgress()` removes the two known v1/v2 progress keys and resets memory, leaving feedback untouched. If only v1 exists, detect its presence, keep it untouched, and show a changed-lesson warning; do not parse, migrate or reinterpret its practiced flag. Never clear all origin storage. On SecurityError/quota/failure, keep usable in-memory progress and show a fixed `STORAGE_UNAVAILABLE` message.

Changing a lesson contentVersion invalidates that lesson's saved records; omit stale records during load and show "This lesson changed; please reassess." Unknown future schema/course version is not guessed or migrated: remain session-only and offer Clear Progress. Do not auto-delete unknown stored data before user action. No version migration may introduce additional fields silently.

## Route/input constraints

Routes contain only fixed lesson/challenge/view IDs. No query values in query strings, fragments, navigation history, DOM attributes, error telemetry, console logs, sessionStorage, IndexedDB, cookies, cache, or downloads of query/progress data. The browser's normal static-asset cache is not an app progress store. There is no query/progress export or import. Separate feedback export is defined below. Generated score summaries contain no actual result category or time of activity.

## Limitations

This editor can receive accidental employer values. Only training catalog literals are supported by grading, and no entered query is persisted or transmitted by app code. It cannot stop entry, endpoint/browser observation, a compromised release or browser-owner tampering. There is no privacy claim based on heuristic PII detection. Same-origin scripts/extensions may inspect non-sensitive state. Scores and completion flags are untrusted personal learning records, not audit evidence.

## Separate feedback contract — owner amendment 2026-10-17

`site/feedback/store.js` owns local IndexedDB; `widget.js` owns the separate feedback UI. The course editor, method answers and progress are never copied into it. `mountFeedback` receives only fixed page/content-version context.

Database `kc7-secops:mwill20:KC7-SecOps:feedback:v1`, version 1, object store `entries`, keyPath `id`. Strict record keys: id, createdAt, pageId, contentVersion, category, text, screenshots. UUID/local feedback time; fixed page/category allowlists; nullable positive content version; 4,000-character text. Each screenshot has exactly blob, width, height.

Bounds: 3 images/entry; 2 MiB and 8 million pixels/image; 8,192 pixels/side; 50 records, 10 MiB total image bytes and 32 million total pixels. Supported still PNG/JPEG/WebP require MIME/signature/header dimensions and native decode; SVG, APNG and animated WebP fail. Plain Blob wrapping omits the File wrapper but preserves embedded image metadata.

`saveFeedback` validates input and uses one capacity-read/add transaction: no silent overwrite or eviction. UI locks draft editing until completion; failure preserves the draft. `readFeedback` validates loaded records and aggregate bounds before returning literal display data. `deleteFeedback` deletes one known UUID after UI confirmation. No import or automatic expiry.

`exportFeedback` validates all data and creates local JSON: schemaVersion 1, product 'KC7 SecOps feedback', feedback array of strict records whose screenshot blobs become mimeType/width/height/base64. It downloads only after a user click. No query/DOM/clipboard capture, external endpoint, remote upload or automatic Codex retrieval. Transfer destination is undecided; see ../FEEDBACK.md and ../PRIVACY.md.

Feedback text and images are optional user-provided content. They may be sensitive even though the course requests only non-sensitive material. No automated redaction, DLP, encryption or metadata stripping is claimed. Same-origin/profile/extension access and clearing remain residual risks.

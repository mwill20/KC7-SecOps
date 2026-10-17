# Feedback and upgrade ideas

Select **Feedback & ideas** on any course page, including onboarding, privacy and missing-page views. This is separate from query grading.

1. Describe the teaching issue, syntax mismatch, error or upgrade idea. The page/mission and content version are recorded automatically; query text and answers are not.
2. Paste a reviewed screenshot into the feedback text box if useful. PNG, JPEG and WebP still images are supported; you can remove an image before saving.
3. Select **Save feedback in this browser** to retain the entry on this device/profile. Closing the dialog keeps an unsaved draft only while the page remains loaded.
4. Select **Export saved feedback** to download a JSON bundle, or **Export draft** if local storage is unavailable. Images travel inside the file.
5. Transfer the reviewed file through an employer-permitted route. At home, attach it to the Codex/ChatGPT conversation or place it in an authorized working folder for review.

Different work/home browsers are fine once the file is transferred. The app itself does not sync browsers, send email, publish issues, upload files or grant Codex access. Email to yourself, files in a separate private repository, or approved organizational sharing are possible routes, subject to policy. No destination has been selected. Do not put feedback in the public course repository.

## What is retained

Each record: random local ID, feedback creation time, fixed course page/mission ID, content version, category, comment and screenshot blobs/dimensions. Export uses schemaVersion 1 and product 'KC7 SecOps feedback'; its feedback array contains the same records, with images represented by mimeType, width, height and base64.

Limits: 4,000 characters, 3 images/entry, 2 MiB and 8 million pixels/image, 8,192 pixels/side. The store holds up to 50 entries, 10 MiB of image bytes and 32 million pixels. Reaching a limit refuses a new save and keeps existing feedback. Export before explicitly deleting entries you no longer need.

Storage is local IndexedDB database kc7-secops:mwill20:KC7-SecOps:feedback:v1. This is not encrypted or backed up by the app. Browser clearing/profile loss can erase it. Per-entry deletion asks for confirmation; Clear progress does not delete feedback.

Review contents before paste/save/export. No automatic redaction or confidential-data detection exists. The File wrapper/name/lastModified is omitted, but original encoded bytes and embedded image metadata remain. A public site does not automatically publish local feedback; compromised same-origin code, extensions and endpoint access can still expose it. Workplace storage and transfer permission are separate from owner permission to publish the course.

## Implementation and evidence

- Capture/render: site/feedback/widget.js; literal text, safe local previews, scoped user paste event and native modal dialog.
- Storage/export: site/feedback/store.js; strict keys/enums, header/type/dimension checks before decoding, bounded transactions and explicit local file download.
- Browser cases F01–F08 cover actual PNG/JPEG/WebP paste/save/reload/download, rejected images, storage/capacity failures, rollback, malformed data, keyboard/reflow and slow-save input locking.
- Privacy and threat controls: PRIVACY.md and threat-models/THREAT_MODEL.md. Separate focused review is required before this changed storage boundary is republished.

These tests use synthetic comments/images and isolated browser profiles. They do not verify work-device downloads, email, organizational sharing, tenant fields, screenshot confidentiality or workplace policy.

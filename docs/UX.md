# Current flow — 2026-10-16

This revision supersedes the earlier token-only wireframe below. Keep the existing responsive shell. Home introduces Midnight at Meridian; a chapter briefing immediately shows its first complete query and explanation. Mission pages show story beat → investigative question → supplied example or previous building block → concise syntax breakdown → training-query editor → query feedback and fictional earned case card → optional method and private practice → next mission. A numbered chapter trail and visible hint panel support movement. Guidance fades from full examples to marked blanks to an empty editor; new concepts still get examples. There is no SIEM-output question or actual-data field. Query editing must preserve caret/focus, clear stale current grades, and retain only non-sensitive saved best. Copy is write-only; failures select text for manual copy. Keyboard, screen-reader status, forced colors, reduced motion and 320px reflow remain targets. The old wireframe is historical design rationale where it conflicts.

# Accessible flow and wireframes

## Interaction decisions

Use a quiet case-workspace style with original typography and CSS shapes. No KC7 mascot, copied artwork, branded imitation, confetti, animations required for meaning, chat interface, leaderboard, login, or personal name. System fonts; responsive single-column flow on small screens. Desktop can show teaching and composer side by side. Estimated times are labelled estimates.

## Onboarding

```text
KC7 SecOps — Google SecOps SIEM Search practice
Original course. Not affiliated with KC7 or Google.

Use symbols here. Real values and results stay in workplace SecOps.
[Read privacy details]
[ ] I understand this site never takes workplace identifiers or logs.

(o) Session only — progress clears when this tab is reloaded
( ) Remember non-sensitive progress in this browser

[Start lesson 1]  [Browse curriculum]
```

The privacy acknowledgment is required before entering the composer but is not persisted as a personal consent record. Do not require employer-policy attestation on the site as a substitute for actual approval. Work-browser use begins only once the owner has established policy approval.

## Course view

Six cards show title, level, objectives, planning estimate, two challenge status labels, and suggested prerequisites. All cards are reachable; prereqs recommend sequence without locks. Total score and progress show query mastery and self-attested practice separately. Do not advertise a completed investigation or verified finding.

## Challenge view

```text
Skip to main content
KC7 SecOps | Course | Progress | Privacy | Clear progress

L02 / Challenge 1: Search either identity role
Documentation checked 2026-10-14 • Tenant execution not independently verified

Case question and short teaching
Use [USER]. Pick its real value only inside SecOps.

QUERY COMPOSER
[Field ▼] [Operator ▼] [Symbol/constant ▼] [Add token]
[AND] [OR] [(] [)] [NOT] [Section ▼] [Alias ▼]
Ordered token list: [Move left] [Move right] [Remove]
Read-only syntax preview
[Check query] [Hint 1] [Copy synthetic query]

FEEDBACK
Syntax 10/10 • Filter 35/35 • Structure 25/25
or: “Your target-user branch can bypass the login filter.”
Unsupported: “This form is not graded by the course validator.”

METHOD
M1 labelled radio group (A/B/C)
M2 labelled radio group (A/B/C)
[Check method] — explanation appears after check

WORKPLACE PRACTICE — manually switch to your SecOps tab
Private steps; no tenant URL/input control
[ ] I ran the adapted query in authorized workplace SecOps.
[ ] I reviewed results or a zero-result limitation in workplace tools.
[Record self-attested practice]

Query 70 | Method 20 | Completion 0 → Symbolic mastery
[Previous] [Next challenge] [Back to course]
```

Hints reveal one level at a time, explain that there is no penalty, and do not steal focus. Worked answer appears at level 3; it must remain labelled as a worked answer. Copy button is disabled until the query is supported-correct, preventing accidental copying of malformed syntax. This is a learning safeguard, not employer security approval. Learners may read/reference teaching regardless.

## Feedback states

- Invalid syntax/types: mark the selected token location with a textual explanation and move focus to an error summary on Check Query.
- Supported incorrect: show which scoring blocks failed, explain scope or pipeline difference, and permit retry.
- Unsupported: neutral message with supported-subset link; do not label Google syntax invalid.
- Limit exceeded: fixed message and Reset Composer button.
- Storage unavailable: persistent, non-blocking session-only banner.
- Missing tenant telemetry/capability: explain how to leave practice pending; no score entry for invented results.
- Saved best attempt vs current attempt: clearly label both to avoid stale attestation carrying over.

## Accessibility requirements

Target WCAG 2.2 AA: semantic landmarks/headings, skip link, labelled native controls, complete keyboard operation, no keyboard traps, visible focus unobscured by sticky elements, no color-only feedback, text contrast >=4.5:1 (large text >=3:1), non-text contrast >=3:1, minimum 24x24 CSS-pixel targets with spacing, and 320px reflow. Query code may scroll in its region without forcing whole-page horizontal scrolling. Support text zoom 200%, forced colors, and reduced motion. No timed tasks.

After route changes focus the main heading. Results use a concise aria-live polite status; avoid rereading the whole query. Radio group question and result explanations have explicit associations. Validation error list identifies affected controls by safe label. Progress meters have textual equivalents and accessible names.

Reference links have descriptive titles and announce a new tab if used; `noopener noreferrer` and referrer policy apply. No automatic external navigation. Test keyboard-only and a screen reader manually in addition to browser assertions; automated checks do not establish complete conformance. [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Usability acceptance

A new learner can find the privacy rule, compose an alternative query, see why broad Boolean logic fails, use a hint, complete method questions, leave practice pending, and clear saved progress without needing a terminal, app installation, free-text entry, or access to external AI.

# Curriculum and instructional design

## Learning progression

The case is **Midnight at Meridian**, an original fictional planetarium investigation. All practice is authorized read-only Search; selecting an employee, device, IP, or subnet does not imply wrongdoing. Estimated lesson durations below are planning estimates, not measured performance claims.

| Lesson | Estimate | Objectives | New syntax | Evidence |
|---|---:|---|---|---|
| L01 — The midnight roll call | 45 min | Category, success/failure, distinct users vs records, recorded job titles, private identity pivot | field path, =, AND, != empty, outcome, count_distinct, match | Six missions: full examples then guided gaps |
| L02 — Roles and Boolean boundaries | 35 min | Actor vs target, constrained alternatives, failure-action interpretation | Explicit AND/OR and parentheses | Equivalent distribution accepted; broadened OR rejected |
| L03 — Host/process pivot | 40 min | Endpoint roles, suffix precision, RE2, cautious interpretation | Regex literal, nocase, re.regex alternate | Single/combined suffix and split OR forms |
| L04 — Network pivot | 40 min | Directional IPs, repeated-field caution, CIDR, numeric types | net.ip_in_range_cidr, numeric port | Positive direction predicates and type failures |
| L05 — Aggregate summaries | 45 min | Group keys, distinct record IDs, byte-field limitations | match, outcome, count_distinct, sum, order, limit | Two exact pipeline contracts with alias alternatives |
| L06 — Time and capstone | 50 min | Fixed buckets, count threshold, private timeline pivot, evidence limits | by 5m, outcome condition | Threshold/bucket mutation tests and private chronology review |

The six lesson JSON files are complete authoring sources: chapter field guides, six L01 missions and two in each later chapter, reference and alternate queries, three progressive hints, two scored method questions per challenge, practical analyst concepts, authored case clues, and documentation status. No lesson requires real datasets or fixed SIEM answers on the site.

## Learning loop

1. **Show and explain:** a short story beat, complete query or previous building block, then concise syntax explanations and a memory hook.
2. **Construct:** start with a supplied query, then guided blanks, then an independent query. New concepts still receive examples. Type/paste training syntax with placeholders; never actual work values.
3. **Check:** deterministic feedback identifies syntax, scope and pipeline problems separately.
4. **Reason:** two multiple-choice investigation decisions, with explanations after grading.
5. **Practice privately:** copy safe synthetic text and adapt inside workplace SecOps.
6. **Reflect:** consider an original debrief in approved workplace notes; keep actual observations in workplace tools; no acknowledgment is scored.
7. **Revisit:** retry without penalty; saved mastery is separate from current attempt.

## Assessment evidence

- Observable locally: constructed query syntax in the supported subset, Boolean scope equivalence, group/outcome/threshold/order/limit structure, selected method answers.
- Separate private practice: actual SecOps compilation/execution and review is not measured by this site.
- Unobservable: selected real values, real search results, private reasoning quality, actual incident detection, complete coverage, or query performance in the tenant.

Hints are staged: conceptual nudge, syntax scaffold, worked answer. No points deducted. The UI records highest hint level as a non-sensitive flag and says hints support learning. Worked answers can produce full points; therefore mastery scores are formative, not proof of unassisted skill. Progress badges are personal and not shareable credentials.

## Prerequisites and unavailable data

Prerequisite links recommend order without locking later lessons. If authorized telemetry/capability is missing, learners can still complete the course (100/100) by passing current query and method checks. Private workplace practice is unmeasured. Review empty results against range/mapping/coverage rather than inventing data. Do not fabricate matching activity, generate suspicious events, or bypass access restrictions.

## Later course progression — not part of initial build

1. Dedup and repeated-field quantifiers with source-specific examples.
2. Cross-event correlation and joins in Search.
3. Entity context and data tables only when authorized/available.
4. Investigation coverage and tuning methodology.
5. Detection rule literacy as a separately scoped course; deployment still needs employer authority.

These are backlog, not additional initial lessons. Do not add SOAR or operational automation.

## Investigation and fundamentals correction — 2026-10-17

The original story now follows an unapproved donation-screen change before a charity premiere: a blamed intern, sponsor demo package and shared publishing account. Each query follows a concrete investigative question; earned authored clues develop competing explanations. A practical analyst concept is visible on every mission: event versus incident, authentication versus business authorization, account versus human, titles versus privileges, failure baselines, pivots, UDM roles, scope, dual-use tools, pattern precision, address attribution, ports, triage, bytes, burst corroboration and evidence-based handoff.

These are teaching concepts, not new SIEM capabilities. No story fact is generated from workplace results. First count_distinct is fully shown; outcome/alias/empty-string/implicit-AND explanations precede assessment. All 32 method questions were revised to test plausible constructions and reasoning. Story originality is retained; no KC7 question bank or case is copied.

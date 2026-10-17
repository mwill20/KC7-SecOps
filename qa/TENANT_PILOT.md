# Private tenant compatibility pilot

This is performed **by the authorized learner inside workplace SecOps**, after the app build is ready and policy allows the course. Codex does not connect to the tenant or ask for actual identifiers/results. These checks were not performed during specification research.

## Before a lesson

Confirm manual YL2 Search access, an approved investigation range, source telemetry, and relevant UDM mapping. Inspect a normalized event in SecOps. If the expected user/host/action/path differs, adapt privately and note the difference in employer tools. Do not send the event, tenant URL, mapping sample, substituted query, timestamp, or compiler message containing real values back to Codex/GitHub/the site.

## Checks

| Challenge(s) | Private verification | Allowed compatibility status to share |
|---|---|---|
| L01-C01/C02 | USER_LOGIN category and ALLOW action compile; source normalization checked | compiled / unavailable / syntax correction needed |
| L01-C03/C04 | Distinct nonempty user IDs counted; optional principal.user.title grouping compiles and title population/enrichment limits are understood | compiled / field unavailable / syntax correction needed |
| L01-C05/C06 | FAIL distinct metadata.id count and exact symbolic-user pivot compile after private substitution | compiled / unavailable / syntax correction needed |
| L02-C01/C02 | Boolean grouping and documented action normalization behave as intended | compiled / unavailable / syntax correction needed |
| L03-C01/C02 | RE2 suffix/nocase and process path mapping available; no process is launched | compiled / telemetry unavailable / platform mismatch |
| L04-C01/C02 | Direction/repeated IP mapping and CIDR/port syntax compile | compiled / unavailable / syntax correction needed |
| L05-C01/C02 | Statistics, grouping, count_distinct IDs, sum mapping and output ordering available | compiled / field unavailable / capability unavailable |
| L06-C01 | Preview/pre-GA tumbling-window availability confirmed without enabling features; by 5m and numeric outcome condition compile; fixed buckets understood | compiled / capability unavailable / syntax correction needed |
| L06-C02 | ALLOW/user follow-up compiles; chronology reviewed privately if evidence exists | compiled / unavailable / syntax correction needed |

Share at most the challenge ID and one fixed capability/compiler status. No actual row count, event/result category, real values, exact range, raw logs, or sensitive error text. Compatibility status is not proof of result correctness or coverage. Progress v2 stores course completion, not practice/execution. Separate optional feedback may retain reviewed platform/error screenshots with no internal data, per docs/PRIVACY.md; it does not automatically capture or validate confidentiality and has no automatic transfer destination. Workplace use/storage/transfer still requires policy permission.

## Empty results

Check range/timezone, permissions, field roles/case, source population, ingestion delay, and whether the chosen telemetry is available. Do not widen beyond authorization. A compiled/executed zero-result query may earn practice acknowledgment after reviewing the limitation. A query that did not execute remains practice pending. Missing data is not a demand to create synthetic events in the employer environment.

## Syntax corrections

If a template fails compilation, retain the actual failed query privately. Compare the public template and official documentation; report only the symbolic template plus a sanitized generic error category if needed. A developer reproduces the public syntax and updates lesson content/fixtures and contentVersion. Do not claim a correction validated until the user repeats the private compiler check.

## Pilot record

Record compatibility separately from app QA. Suggested non-sensitive record: course/build version, challenge ID, status enum, whether a symbolic documentation correction is needed. Detailed notes stay in employer tools. No dated per-user execution history is required by the app. Pilot results never imply all sources, tenants or operational conditions are supported.

# Research evidence and source matrix

Research date: **2026-10-14**. Sources were opened/read through web or GitHub tools. Evidence is paraphrased; no authenticated KC7 session, question bank, credentials, copied scenarios, full articles, or datasets are included. The referenced ChatGPT conversation supplied intent only; its earlier file claims were not treated as verified artifacts.

## KC7 findings and design translation

| ID | Primary source | Observed evidence | Consequence / confidence |
|---|---|---|---|
| K01 | [Public homepage](https://kc7cyber.com/) | Public sample has story, query/result investigation questions, point values, completion display, guest/account choices, and scoreboard | Use an original case and personal progress. Do not reproduce questions or fixed answers. High confidence in the public sample; not a claim about every module |
| K02 | [Module catalog](https://kc7cyber.com/modules) | Analyst I–IV pathways describe progressively less guidance; visible filters include difficulty, time, status | Graduate from guided filters to a capstone. Dynamic game list was not fully available in text extraction; no exhaustive catalog claim |
| K03 | [Making the most of KC7](https://kc7cyber.com/blog/making-the-most-of-kc7) | Official guidance emphasizes notes, reflection, easier cases first, retries, and increasingly independent pivots | Reflect via fixed choices externally; keep detailed notes only in employer systems. Hints without penalties are our design, not an asserted KC7 policy |
| K04 | [Host resources](https://docs.kc7cyber.com/) | Describes event hosting and platform-provided teaching | No installation for learner is a useful pattern; our app has no event administration |
| K05 | [Dashboard overview](https://docs.kc7cyber.com/dashboard/overview) | Classrooms, games, enrollments, roles, progress and leaderboards are documented | These require identities/server state in KC7; exclude them from this private single-learner app |
| K06 | [Public repository README](https://github.com/KC7-Foundation/kc7) | KQL/ADX investigations with generated intrusion activity; Python application | Reference architecture only. No fork or runtime code reuse |
| K07 | [models.py at inspected revision](https://github.com/KC7-Foundation/kc7/blob/f1f054c2c271b0766392b2fb2cffcdc3cd3a539d/app/server/models.py) | User/team/session persistence is present | This is a different boundary from our no-account static app |
| K08 | [game_functions.py](https://github.com/KC7-Foundation/kc7/blob/f1f054c2c271b0766392b2fb2cffcdc3cd3a539d/app/server/game_functions.py), [uploadLogs.py](https://github.com/KC7-Foundation/kc7/blob/f1f054c2c271b0766392b2fb2cffcdc3cd3a539d/app/server/modules/logging/uploadLogs.py) | Activity generation and Azure Kusto upload/client code are present | No generated logs or cloud ingestion in our product |
| K09 | [views.py](https://github.com/KC7-Foundation/kc7/blob/f1f054c2c271b0766392b2fb2cffcdc3cd3a539d/app/server/views.py) | Admin/mitigation routes exist; `get_score` immediately returns an empty object at this revision | Public repo cannot establish the live website's scoring implementation |
| K10 | [docs/index.md](https://github.com/KC7-Foundation/kc7/blob/f1f054c2c271b0766392b2fb2cffcdc3cd3a539d/docs/index.md), [docs/usage.md](https://github.com/KC7-Foundation/kc7/blob/f1f054c2c271b0766392b2fb2cffcdc3cd3a539d/docs/usage.md) | Documentation includes unrelated Lumache template material | Do not use it as a complete curriculum or architecture authority |
| K11 | [Public training PDF entry](https://github.com/KC7-Foundation/kc7/blob/main/training_materials/KC7%20-%20Cyber%20Challenge%20Training.pdf) | File exists in the inspected tree; direct PDF retrieval failed | Metadata only inspected. Contents, slides, and detailed onboarding not verified |

Repository revision inspected: `f1f054c2c271b0766392b2fb2cffcdc3cd3a539d`. Recursive tree was returned complete. This proves what that repository contains, not that it matches KC7's production platform. Public site counters/catalog counts were inconsistent across surfaces and are irrelevant to the design; none are used as claims. Exact live hint penalties, answer normalization, backend grading, and private modules remain unknown.

## Google SecOps source coverage

| ID | Official source | Verified topic | Used in |
|---|---|---|---|
| G01 | [Understand search](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search) | Manual YL2 editor, time-range controls, UDM lookup, event/statistical Search | L01, privacy-safe execution workflow |
| G02 | [Search syntax reference](https://docs.cloud.google.com/chronicle/docs/investigation/search-syntax-reference) | Typed literals, comparisons, Boolean grouping, nocase, regex, grouped fields | L01–L04, lexer/catalog |
| G03 | [Get started with YARA-L 2.0](https://docs.cloud.google.com/chronicle/docs/yara-l/getting-started2) | Omitted events header, variables, Search/rule structures, grouping/outcome examples | L01, L05, rule boundary |
| G04 | [UDM field list](https://docs.cloud.google.com/chronicle/docs/reference/udm-field-list) | Principal/target roles; user ID, hostname, IP, process/file, action and event type definitions | Field catalog, all lessons |
| G05 | [Search best practices](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search-best-practices) | Implicit AND, narrow filters, event-time range and ingestion-time distinction | L02, troubleshooting |
| G06 | [Statistics and aggregation](https://docs.cloud.google.com/chronicle/docs/investigation/statistics-aggregations-in-udm-search) | match/outcome/order/limit, count, count_distinct, sum, default values, ingestion delay | L05, query QA |
| G07 | [Conditions in Search](https://docs.cloud.google.com/chronicle/docs/investigation/yara-l-2-0-conditions) | Outcome comparison conditions and match requirement | L06 threshold |
| G08 | [Match syntax](https://docs.cloud.google.com/chronicle/docs/yara-l/match-syntax) | Direct fields and placeholders as grouping keys | L05, L06 |
| G09 | [Windowing logic](https://docs.cloud.google.com/chronicle/docs/yara-l/windowing-logic) | Tumbling `by` vs other windows; tumbling is explicitly preview/pre-GA and customer/region dependent | L06 capability caveat; omit sliding/hop exercises |
| G10 | [Search-to-GoogleSQL examples](https://docs.cloud.google.com/chronicle/docs/reference/standard-sql/yara-l-google-sql-translate) | Worked Search query with `by 5m` | L06 corroboration, not a SQL course |
| G11 | [re.regex](https://docs.cloud.google.com/chronicle/docs/detection/yara-l-2-0-functions/re-regex) | Function and regex-literal forms, substring matching, RE2 anchors and omissions | L03, alternate forms |
| G12 | [net.ip_in_range_cidr](https://docs.cloud.google.com/chronicle/docs/detection/yara-l-2-0-functions/net-ip_in_range_cidr) | Search support, IPv4/IPv6, BOOL return and CIDR arguments | L04 |
| G13 | [Deduplicate search results](https://docs.cloud.google.com/chronicle/docs/investigation/deduplication-yaral) | dedup section, post-outcome grouping, limitations on unaggregated fields | Reference/future progression; MVP validator marks dedup unsupported |
| G14 | [Search vs rule results](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search-vs-rules-results) | Engines, windows, repeated fields and detection deduplication affect result agreement | L04, L06, QA limitations |
| G15 | [Data availability](https://docs.cloud.google.com/chronicle/docs/investigation/expected-data-availability-for-search) | Ingestion stages affect query availability | All private no-result paths |
| G16 | [Single/multiple event examples](https://docs.cloud.google.com/chronicle/docs/yara-l/yara-l-2-0-examples2) | Separate Search/rule examples; supported correlation patterns | Reference only; no automated rule building |

Examples in this package are authored combinations of these documented constructs with safe synthetic constants. **Documentation checked** means field/operator/function/section form inspected in these references. It does not mean compiler-checked, data-verified, performance-tested, or tenant-executed.

## Other primary sources

| ID | Source | Evidence / use |
|---|---|---|
| P01 | [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) | Static hosting, plan availability, repository subpaths, visitor IP logging |
| P02 | [GitHub Pages access control](https://docs.github.com/en/enterprise-cloud@latest/pages/getting-started-with-github-pages/changing-the-visibility-of-your-github-pages-site) | Private source does not automatically imply private site; Enterprise org requirements for private publishing |
| P03 | [GitHub repository creation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) | Repository naming/visibility and CLI creation |
| P04 | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility target and manual/automated verification |
| P05 | [CSP standard](https://w3c.github.io/webappsec-csp/) | Meta policy restrictions; frame-ancestors is not enforced from meta |
| P06 | [RFC 5737](https://www.rfc-editor.org/info/rfc5737/) | Documentation IPv4 ranges; use 192.0.2.17 and 192.0.2.0/24 as fixed synthetic examples |
| P07 | [Microsoft Copilot enterprise data protection](https://learn.microsoft.com/en-us/microsoft-365/copilot/enterprise-data-protection), [privacy/protections](https://learn.microsoft.com/en-us/copilot/privacy-and-protections) | Approved work Copilot may have EDP; web grounding has a separate processing path. Not proof of the user's configuration |
| P08 | [KQL where](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/whereoperator), [summarize](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/summarize-operator), [has](https://learn.microsoft.com/en-us/kusto/query/has-operator) | Conceptual KQL comparison; do not substitute KQL syntax into YARA-L |
| P09 | [Node downloads](https://nodejs.org/en/download), [Playwright package](https://github.com/microsoft/playwright/blob/v1.64.1/packages/playwright-test/package.json), [release](https://github.com/microsoft/playwright/releases/tag/v1.64.1) | Development version pins 24.21.0 / 1.64.1; no runtime AI/agent feature used |

## Source conflicts and conservative decisions

1. Google's overview table describes match as required for rules but nearby text allows single-event rules without match. Teach the supported distinction: detection rules have an enclosing rule context and a condition; single-event rules can omit match. Do not require match for every rule.
2. Match/window documentation and Search-vs-rule material differ in wording about `over` support. MVP teaches `by 5m` tumbling buckets, corroborated by worked Search examples. Do not teach `over` as interchangeable with `by`, or claim fixed buckets catch every rolling-window burst.
3. The conditions page's introductory limitations are narrower than its later explicit outcome-condition section. Use the later documented numeric outcome condition for L06 and mark tenant compiler validation pending.
4. Some generic keyword lists mix constructs from other YARA contexts. Do not teach `contains`, `startswith`, `wide`, or file-scanning syntax from those lists as verified Search operators. Use the Search-specific reference.
5. Dedup guidance and examples require care around repeated fields. Dedup remains reference-only in the initial course; no automatic equivalence with count_distinct.

## Unknowns and verification paths

- Workplace public web/local storage approval: owner confirms; never bypass network policy.
- Search UI/dialect and stats/window/condition availability: owner checks in SecOps; use `qa/TENANT_PILOT.md` without exporting identifiers.
- Field population and principal/target mapping: inspect an authorized event in SecOps. Do not infer availability from the UDM dictionary.
- Real query result correctness and real incident conclusions: app cannot verify; review in workplace systems.
- Full YARA-L semantic equivalence: unavailable locally; validator is conservative and bounded.
- GitHub repository creation: completed through the owner's signed-in browser after exact name/owner/private checks. Empty private state verified; no commit/push. CLI authentication remains unavailable. Existing account-wide Pangea was auto-installed by GitHub and could not be deselected; review access before source upload.
- License and approved host: pending owner choices; no paid path assumed.

## Authorized live KC7 observations

The owner explicitly authorized read-only inspection of the logged-in Chrome tab, superseding the earlier Work-browser-only limitation. Brief structural observations supplement K02: Analyst I–IV pathways; case pages with story/objectives/requirements/difficulty; completed-case review/replay distinction; and navigation for questions, training guides, rankings and teams. The observed challenge workspace has a collapsible question pane, answer/submit/skip/next controls and a query/data workspace with run, tables, history and formatting controls. No answer, query execution, replay reset, enrollment or settings action was performed by the agent. An Exit Replay control was visible; its presence does not establish how the session entered that state.

Our translation is an original lesson briefing, symbolic query workspace, progressive hints and private progress. No KC7 question text, scenario prose, profile identifiers, scores or assets were retained. Exact hint penalties, answer normalization, live grading internals and all private curriculum content remain unverified. The temporary approval-review usage block cleared after the owner reported restored capacity; normal read-only inspection then succeeded. No bypass was used.

During implementation, official Google Search syntax, aggregation, conditions and windowing references were rechecked. L06 contentVersion is now 2 to add the explicit preview availability caveat. This remains documentation evidence, never tenant compilation.
# Research additions — investigation-led revision (2026-10-16)

G17 — [Distinct users in Search](https://docs.cloud.google.com/chronicle/docs/yara-l/transition_spl_yaral), official Google documentation. Documents USER_LOGIN plus outcome count_distinct(principal.user.userid). L01 adds explicit ALLOW and nonempty-user filters for its successful-account question. Documentation checked; tenant compilation remains untested.

Authorized KC7 module-flow observations and the limits of that inspection are recorded in [KC7 flow review](KC7_FLOW_REVIEW_2026-10-16.md). These inform teaching sequence, not copied course prose or answers.

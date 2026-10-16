# KC7 learning-flow review — 2026-10-16

The owner requested studying four named modules in the authenticated Chrome session. Read the Security Analyst I path and the modules' normal Questions/review interfaces. Account completion records were preserved: no answers submitted, queries executed, replay reset, enrollment or score action. Only these structural observations and original design decisions are retained; no question bank, answers, lyrics, assets or proprietary scenario text is imported.

| Module / inspected scope | Observed teaching mechanics | Application here |
|---|---|---|
| [A Rap Beef](https://kc7cyber.com/m/a-rap-beef-an-intro-to-security-investigations-187): opening story steps and first supplied-query steps | Short story beats establish the learner's role and a concrete investigation. A complete executable query precedes early questions; explanations connect table, field, operator and value. Questions sit beside the query workspace with previous/next navigation | Original case and small missions; complete explained Search example before assessment; persistent query desk; one obvious next step |
| [How to play KC7](https://kc7cyber.com/m/how-to-play-kc7-1663): chapter menu, opening, workflow, help and investigative-mindset steps | Brief onboarding explains the working loop. Hints are visible, short and encouraged. Its authored data schemas are distinguished from vendor-specific logs | Short first-run instructions, accessible hint button, explicit separate SecOps tab; real UDM schema/capability checks rather than pretending KC7 tables exist in SecOps |
| [A Scandal in Valdoria](https://kc7cyber.com/m/a-scandal-in-valdoria-a-political-mystery-132): chapter map, opening and selected fundamentals steps | Story precedes technical work. Early templates are complete; a later fundamentals query leaves a missing command/field to fill. Chapters move from language foundations to investigative pivots | Faded scaffolding: example, guided starter, independent mission. Reuse earlier syntax while introducing one new operation. Original setting/characters and result-independent case updates |
| [KQL 101](https://kc7cyber.com/m/kql-101-an-introduction-to-kusto-query-language): chapter map and selected table/field/operator examples | Data concepts precede commands. Operator lessons explain purpose, give syntax and then a specific task; distinct values are distinguished from duplicate rows | Explain event/field/value before operators; demonstrate distinct accounts versus login records; job-title grouping only where recorded in the tenant |

This was a targeted review of openings, chapter transitions, help and representative scaffolding, not a claim of newly completing every question or executing the datasets. KC7's complete integration and fixed-answer datasets are different from this app's privacy-preserving external-SIEM workflow. We can adapt its teaching pattern, but cannot reproduce fixed case findings from arbitrary workplace logs.

## Google evidence checked for the new path

- [Search UI and time range](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search): manual query and relative time-range controls.
- [SPL-to-YARA-L reference](https://docs.cloud.google.com/chronicle/docs/yara-l/transition_spl_yaral): `count_distinct(principal.user.userid)` in Search outcome; aggregation purpose. This is an official syntax source, not instruction to use SPL/KQL.
- [UDM field list](https://docs.cloud.google.com/chronicle/docs/reference/udm-field-list): User `title` is a scalar job-title field; `department` is repeated; system roles are separate. Schema existence is not proof of population or historical enrichment semantics.

Queries remain documentation-checked and tenant-unverified. Do not substitute a table/operator name mechanically or claim login events contain a complete workforce directory.

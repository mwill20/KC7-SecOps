# Search reference and language boundaries

Checked 2026-10-14; distinct-user/title additions checked 2026-10-16. Examples are documentation-checked, not tenant-compiled. Each lesson carries source IDs from the research matrix.

## Three different concepts

**UDM** is the normalized event schema: much like a SIEM's normalized fields after ingestion. **Search** is the interactive UI and query execution context. **YARA-L 2.0** is a language used in Search and detection authoring, with context-dependent structures and capabilities. A known UDM field may be absent from a particular source's events. [UDM reference](https://docs.cloud.google.com/chronicle/docs/reference/udm-field-list).

| Concern | YARA-L Search taught here | Detection rule context |
|---|---|---|
| Entry | Manual YL2 Search editor, with a UI time range | Rule authoring/managed execution |
| Envelope | No enclosing `rule` block; `events:` may be omitted | `rule name { ... }` and event-variable context |
| Condition | Optional; outcome threshold with match used in L06 | Required trigger logic; single-event rule may omit match |
| Grouping | Direct UDM field or bound variable in match | Correlation grouping and supported detection windows |
| Output | Event rows or aggregated Search rows | Detections; execution/deduplication differs |
| Operation | Authorized read-only manual search | Deployment/scheduling changes excluded from course |

Do not paste an entire detection rule into Search or automatically wrap a Search query and deploy it. [YARA-L introduction](https://docs.cloud.google.com/chronicle/docs/yara-l/getting-started2), [execution differences](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search-vs-rules-results).

## Typed filters and operators

Use `=`, `!=`, `<`, `<=`, `>`, `>=` where the field type permits. Strings/enums are quoted; numbers/booleans are not. Use AND/OR/NOT and parentheses; omitted conjunctions imply AND. Case-insensitive text comparisons use `nocase`. RE2 regex literals use `/.../`, with explicit anchors for the intended match. See [Search syntax](https://docs.cloud.google.com/chronicle/docs/investigation/search-syntax-reference) and [best practices](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search-best-practices).

```yaral
metadata.event_type = "USER_LOGIN"
principal.user.userid = "__USER__"
```

`__USER__` is a **synthetic training literal**, not a YARA-L variable. A real YARA-L placeholder variable such as `$user` binds a field, e.g. `$user = principal.user.userid`. An app symbol such as `[USER]` is a UI label; never place square-bracket labels literally into the query.

In SecOps only, escape `\` as `\\` and embedded `"` as `\"` in a quoted string. The app never asks for the real value. Exact-match case sensitivity is intentional in lessons; do not assume account canonicalization.

## Regex and network functions

`re.regex(field, pattern)` and field regex-literal comparison are supported; RE2 does not support lookaround/backreferences. Regex matches substrings unless anchored. The app recognizes a small authored pattern catalog and never runs learner-provided regex. [re.regex reference](https://docs.cloud.google.com/chronicle/docs/detection/yara-l-2-0-functions/re-regex).

```yaral
metadata.event_type = "PROCESS_LAUNCH"
principal.hostname = "__HOST__"
target.process.file.full_path = /\\powershell\.exe$/ nocase
```

```yaral
metadata.event_type = "NETWORK_CONNECTION"
net.ip_in_range_cidr(target.ip, "192.0.2.0/24")
target.port = 443
```

The CIDR is a documentation-range stand-in, not a threat indicator or recommendation to search it in production. Replace it only in SecOps if authorized. [CIDR function](https://docs.cloud.google.com/chronicle/docs/detection/yara-l-2-0-functions/net-ip_in_range_cidr), [RFC 5737](https://www.rfc-editor.org/info/rfc5737/).

## Aggregation and time

`match` defines keys, `outcome` calculates aggregates, `condition` can filter aggregate results, `order` sorts, and `limit` limits output rows. A limit is not an event collection limit. `count(metadata.id)` counts rows; `count_distinct(metadata.id)` counts distinct IDs, not necessarily distinct real-world actions across vendors. Zero/default values and repeated fields can affect counting. [Statistics](https://docs.cloud.google.com/chronicle/docs/investigation/statistics-aggregations-in-udm-search).

```yaral
metadata.event_type = "USER_LOGIN"
security_result.action = "FAIL"
principal.user.userid != ""
$user = principal.user.userid
match:
  $user by 5m
outcome:
  $failures = count_distinct(metadata.id)
condition:
  $failures > 3
order:
  $failures desc
limit:
  20
```

This asks about fixed five-minute buckets within the Search UI range. It does not prove a rolling burst, brute force, or compromise. Nearby-window boundary events can split the count. Source corroboration: [Search translation example](https://docs.cloud.google.com/chronicle/docs/reference/standard-sql/yara-l-google-sql-translate), [outcome conditions](https://docs.cloud.google.com/chronicle/docs/investigation/yara-l-2-0-conditions), [windowing](https://docs.cloud.google.com/chronicle/docs/yara-l/windowing-logic).

## Wider supported platform vs course subset

The platform also documents grouped aliases (`ip`, `hostname`, etc.), dedup, arrays, more aggregates, joins, entities, data tables, and more. Those are not all graded in v1.0. Grouped aliases broaden the selected fields and are not equivalent to a directional field. Repeated IP equality in Search matches an occurrence; do not assume `!=` excludes all occurrences or transfer negation rewrites to rules. [Grouped fields](https://docs.cloud.google.com/chronicle/docs/investigation/search-syntax-reference), [dedup](https://docs.cloud.google.com/chronicle/docs/investigation/deduplication-yaral), [Search/rules differences](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search-vs-rules-results).

## First-chapter additions: users and recorded titles

The Search time picker supplies the last 30 minutes. `USER_LOGIN` selects attempts; adding `security_result.action = "ALLOW"` selects records with a normalized allow action. This distinct-account question excludes blank IDs:

```yaral
metadata.event_type = "USER_LOGIN"
security_result.action = "ALLOW"
principal.user.userid != ""
outcome:
  $users = count_distinct(principal.user.userid)
```

For recorded job-title groups, add `principal.user.title != ""` to the filter and `match: principal.user.title` before outcome. Keep the same distinct-user metric. User `title` is documented, but logs/enrichment may not supply it. It is not a permission role, and a recorded/enriched value does not establish the person's historical title at login time. Users can appear in more than one title group across records, so group counts need not sum to the global distinct-user total. [Official distinct-user example](https://docs.cloud.google.com/chronicle/docs/yara-l/transition_spl_yaral), [UDM User fields](https://docs.cloud.google.com/chronicle/docs/reference/udm-field-list).

## KQL comparison

| Familiar KQL idea | Search counterpart | Important difference |
|---|---|---|
| `Table | where ...` | UDM filter expressions | No KQL table/pipe syntax in these YL2 searches |
| `Column == "value"` | `field = "value"` | Operator spelling and field schema differ |
| `summarize ... by ...` | match keys + outcome aggregates | Aggregation signatures differ; YARA-L count takes an expression |
| `bin(Time, 5m)` | match key `by 5m` | Preview tumbling-window availability, Search UI range and bucket boundaries still matter |
| `sort by ... desc | take 20` | order + limit sections | Sort output after aggregation, not a query scan budget |
| `has "term"` | Choose documented exact/regex behavior | KQL term matching is not automatically a regex or substring equivalent |

These are conceptual bridges, not automatic translations. [KQL filtering](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/whereoperator), [aggregation](https://learn.microsoft.com/en-us/azure/data-explorer/kusto/query/summarize-operator), [term matching](https://learn.microsoft.com/en-us/kusto/query/has-operator).

## Tenant verification sequence

Select manual YL2, inspect field definitions and populated source events, choose an authorized narrow time range, replace symbols privately, fix compiler feedback locally, and inspect event details before interpreting aggregates. A no-result search may reflect range, permission, mapping, ingestion, or absent activity. [Search UI](https://docs.cloud.google.com/chronicle/docs/investigation/udm-search), [data availability](https://docs.cloud.google.com/chronicle/docs/investigation/expected-data-availability-for-search).

# Deterministic Search validator specification

## Purpose and platform

Grade the authored YARA-L **Search subset** against each challenge's intent without AI, remote compilation, datasets, or exact query-string matching. The parser consumes the training editor's text independently of the composer. An AST is a structured description of syntax, analogous to the conditions and grouping in a normalized SIEM correlation rule.

This is not Google's compiler, a full YARA-L implementation, a regex equivalence solver, or a detector of real incidents. It may conservatively decline valid platform syntax. Unsupported forms receive **Unsupported by this course validator**, never **Invalid YARA-L**. There is no manual override or self-graded query credit in v1.0.

## Limits

Reject before parsing if UTF-8 size > 8,192 bytes. Maximum tokens 512, AST nodes 256, nesting depth 8, Boolean primitive atoms 12, bindings 8, outcomes 4, group keys 4, sort keys 4. No regex execution. Equivalence examines at most 4,096 Boolean assignments and at most 256 nodes per assignment. Stop on the first difference; bounds checked before expansion. These are local engineering limits, not Google platform limits.

No worker, network, dynamic code, arbitrary imports, eval, or `new Function`. Use fixed loops and data structures. Pattern strings are parsed as data only. All diagnostics use fixed codes, field catalog names and safe symbol IDs; never echo unknown input text.

## Recognized fields and constants

| Field | Type / cardinality | Permitted usage |
|---|---|---|
| metadata.event_type | enum, scalar | = / != with USER_LOGIN, PROCESS_LAUNCH, NETWORK_CONNECTION |
| security_result.action | enum under repeated security_result | Positive = with FAIL, ALLOW, BLOCK; no negation rewrites |
| principal.user.userid, target.user.userid | string, scalar at these paths | = / != with __USER__ or empty; optional nocase is recognized but not equivalent to exact matching |
| principal.user.title, target.user.title | string, scalar | nonempty filter using != empty; grouping/binding; no actual title literal |
| principal.hostname, target.hostname | string, scalar | = / != with __HOST__; optional nocase |
| principal.ip, target.ip | string, repeated | Positive = with 192.0.2.17; CIDR call; no NOT/!= in supported IP subset |
| target.process.file.full_path | string, scalar | = with catalog regex; re.regex alternate; nocase |
| target.port | integer, scalar | Numeric comparisons; grouping/binding |
| network.sent_bytes | integer, scalar | Numeric comparisons or sum aggregate |
| metadata.id | string, scalar | count/count_distinct aggregate only; never a filter predicate |

String literal allowlist: `__USER__`, `__HOST__`, empty string, the above enums, `192.0.2.17`, `192.0.2.0/24`, and the predefined function-pattern encodings. No hostname/domain/IP/identity literal outside that catalog. Numeric catalog: integers 0–20 plus 80 and 443; arbitrary numbers are rejected. Duration palette: `1m`, `5m`, `10m`, `1h`; L06 requires exactly `by 5m`. Variables: `$user`, `$account`, `$u`, `$port`, `$events`, `$total`, `$failures`, `$n`, `$bytes`, `$volume`, `$users`, `$unique_users`, `$title`. Preset names limit the composer; the parser's internal contract recognizes those names only. Same query can use any suitable distinct preset aliases.

Catalog values are safe authored data. A raw custom value is rejected with `UNSAFE_LITERAL` and no echoed value. There is no redaction heuristic that permits arbitrary strings after attempting to identify PII.

## Grammar

The following is a design grammar, not a claim to describe every valid Google query. Keywords are case-insensitive; field paths, variables, enum values, and case-sensitive literals are not folded. Source offsets retained for diagnostics must not be persisted.

```text
Search      := ["events:"] EventsExpr [Match] [Outcome] [Condition] [Order] [Limit] EOF
EventsExpr  := OrExpr
OrExpr      := AndExpr (OR AndExpr)*
AndExpr     := Unary ((AND | implicit conjunction) Unary)*
Unary       := NOT Unary | "(" OrExpr ")" | Predicate | Binding
Predicate   := Operand Compare Literal [nocase]
             | Field "=" RegexLiteral [nocase]
             | "re.regex" "(" Field "," PatternString ")" [nocase]
             | "net.ip_in_range_cidr" "(" Field "," CidrString ")"
Binding     := Variable "=" Field | Field "=" Variable
Operand     := Field | Variable
Compare     := "=" | "!=" | "<" | "<=" | ">" | ">="
Match       := "match:" Key ("," Key)* ["by" Duration]
Key         := Field | Variable
Outcome     := "outcome:" OutcomeAssignment+
OutcomeAssignment := Variable "=" Aggregate "(" Operand ")"
Aggregate   := count | count_distinct | sum
Condition   := "condition:" ConditionOr
ConditionOr := ConditionAnd (OR ConditionAnd)*
ConditionAnd := ConditionUnary (AND ConditionUnary)*
ConditionUnary := NOT ConditionUnary | "(" ConditionOr ")" | Variable Compare Integer
Order       := "order:" SortKey ("," SortKey)*
SortKey     := Variable [asc | desc]
Limit       := "limit:" Integer
```

Implicit conjunction is allowed only when the next token begins another complete Events predicate/binding or parenthesized expression. It is not applied in condition/outcome/group lists. Stop expression parsing at a tokenized section header. Duplicate or out-of-order sections are syntax errors. A field/variable binding is legal only as a positive required top-level AND term, not under NOT/OR. Remove bindings from the filter AST after validation and substitution; ambiguous duplicate bindings, cycles, unbound variables, or use of an outcome variable in events is invalid.

Lexer: scan double-quoted strings with escaped quote/backslash; preserve their decoded values. Scan regex delimiters without treating `//` inside strings/regex as a comment. Recognize `//` line comments outside literals, ignoring them before semantic checks. Backtick pattern strings may be recognized internally for documented re.regex forms, but only catalog patterns are accepted. Never strip comments using a global regex. Braces/rule/meta/SQL/pipes/joins/grouped aliases/dedup/select/options/multi-event prefixes/array indexing and other functions are **unsupported syntax** unless the input itself is malformed. Do not silently drop unsupported sections.

## AST shape and semantics

Internal Query object:

```text
Query { filter: BoolExpr, bindings: Binding[], match: Group|null,
        outcomes: Outcome[], condition: BoolExpr|null,
        order: Sort[], limit: integer|null }
BoolExpr = And(children) | Or(children) | Not(child) | Atom(typed predicate)
Binding { name, field }
Group { keys: resolved field paths[], window: null | {kind:"by", seconds} }
Outcome { name, function:"count"|"count_distinct"|"sum", field }
Sort { outcomeName, direction:"asc"|"desc" }
```

Parser/type checks prove only conformity to this grammar/catalog. Aggregate argument types, duplicates, group bindings and outcome references must be checked. Numeric outcome conditions require a defined numeric aggregate; match is mandatory for the course's conditional aggregates. Sum supports only network.sent_bytes in this course. Count/count_distinct support metadata.id; count_distinct also supports principal.user.userid and target.user.userid. Match uses userid, recorded user title or target.port for current challenges; other catalog fields may parse but fail challenge intent. Default sort direction is asc.

## Normalization and equivalence

1. Normalize keyword case, redundant parentheses, implicit AND, and flat same-kind Boolean groups. Preserve string case and modifiers.
2. Resolve one-to-one field bindings, whether `variable = field` or `field = variable`. Variables are alpha-renamed by their resolved field or aggregate signature, not textual names.
3. Atom identity includes field, operator, typed value and nocase. Do not merge different roles, grouped aliases, modifiers, or repeat-field negations.
4. Normalize only catalog-proved process alternatives: the combined `\\(powershell|pwsh)\.exe$` pattern with nocase becomes OR of the two recognized suffix atoms with nocase. A re.regex pattern decoded to the same catalog pattern becomes the same atom. A pattern with missing anchor, altered escaping, substring match, different case flag, or another engine feature is not equivalent.
5. For the union of reference/candidate atoms (max 12), compare truth tables. Equality of all assignments proves Boolean equivalence over these abstract atoms. This handles conjunction order, redundant terms, factoring/distribution, and NOT/De Morgan for supported scalar predicates. Do not assume independent atoms encode Google's full data semantics. The conservative model can reject a valid semantic optimization; it must not claim full engine equivalence.
6. For each aggregate, resolve field and function into its semantic signature. Group keys compare as sets after binding resolution, and duration/type must match exactly. Outcomes compare as signature multisets; duplicate signatures are rejected. Require exactly the reference outcomes; extra metrics/keys change the challenge contract.
7. Condition references resolve to outcome signatures. Normalize integer count comparisons (`> 3` ↔ `>= 4`); do not do this for byte sums or arbitrary floats. Other comparisons retain their explicit operator/value. Boolean equivalence of the supported condition AST follows the same bounded algorithm.
8. Sort key signatures and directions compare as an ordered list. Limit must match the reference. Empty reference pipeline means no match/outcome/condition/order/limit; do not accept arbitrary extra transforms.

Do not merely check that a required predicate appears somewhere. Example `A AND B OR C` is not equivalent to `A AND (B OR C)`: a truth assignment with A=false and C=true is a counterexample. Show a fixed educational explanation using atom labels, never invented SIEM event rows or user data.

## API contract — local function only

`evaluateChallenge({challengeId, tokens})` takes a known challenge ID and a maximum 512-element array of catalog token IDs. Serialization and parse are independent checks. Unknown IDs fail before text construction. No HTTP endpoint.

Result: `{status, queryPoints, checks, diagnostics}`. Status is `supported-correct`, `supported-incorrect`, `invalid`, `unsupported`, or `limit-exceeded`. Checks are fixed IDs `syntax`, `filter`, `pipeline` with booleans. Diagnostics are bounded arrays of `{code, tokenIndex|null, messageId}`; message IDs refer to authored safe feedback, not source text. Query points follow the scoring contract. Invalid/unsupported/limit-exceeded earn 0 query points and no completion eligibility.

`evaluateText(text, reference)` consumes untrusted training-editor text, enforces bounds through `parseSearch`, returns fixed diagnostics and catches parser errors without echoing the input. This is a local function, never an HTTP endpoint. The legacy token API remains tested but is not the learner UI. Text is not read from URLs, postMessage, storage or programmatic clipboard access. Never claim the textarea prevents accidental real entry.

## Required failures and validation

Reject wrong type, enum case, unknown literal, invalid escape, unbound alias, duplicate sections, nesting/token limits, rule wrapper, hidden expected words in comments, wrong role, broad OR, dropped nonempty filter, count instead of distinct count, swapped aggregate sort, missing time bucket, changed threshold, incorrect limit, and extra pipeline sections. Every accepted alternate query in lesson JSON must pass and every negative fixture in `qa/query-cases.json` must produce its specified class of outcome.

Reference queries must be parsed/type-checked with the same parser in content validation, but challenge intent is independently reviewed against the lesson prompt. Tests that only compare a reference with itself are insufficient. Use mutation and alternate-form tests to prove meaningful differences.

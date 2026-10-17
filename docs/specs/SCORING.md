# Scoring and completion contract

| Category | Points | Deterministic evidence |
|---|---:|---|
| Query syntax/schema | 10 | Supported parse, catalog and type checks pass |
| Query filter intent | 35 | Whole Boolean filter equivalent to reference intent |
| Query pipeline structure | 25 | Requested grouping, outcomes, bucket, threshold, order and limit match |
| Method decision 1 | 10 | Correct fixed-choice answer M1 |
| Method decision 2 | 10 | Correct fixed-choice answer M2 |
| Mission completion | 10 | Current query is 70 and current method assessment is 20 |

Total 100 per mission; query 70, method 20, completion 10. Sixteen missions total 1,600. No workplace output, execution checkbox, result count, screenshot proof or private investigation note is needed for a score. Feedback images are a separate optional improvement channel, never grading evidence.

Unsupported, unsafe, invalid or limit-exceeded queries get zero query points. Supported wrong filters/pipelines may earn independent passing blocks. Completion is ten only when both current query and method checks pass; otherwise zero. A score of 100 displays **Mission complete**, not a verified SIEM execution or professional certification.

## Attempts and hints

Unlimited retries; three progressive hints without deductions. The final worked solution may receive full credit; this is formative learning. Questions test relevant syntax, construction and investigative scope using plausible alternatives. Wrong-answer feedback explains the rule rather than scolding the learner.

Query edits invalidate current query results, method selections/results and completion. Method edits invalidate the method grade until rechecked. Inputs are memory-only. The current attempt is distinct from the saved best.

`reduceAttempt` forms one attempt record. `bestAttempt` replaces a saved record only for a higher total, then query/method/completion tie-breaks; a full tie keeps saved components. Highest hint merges independently. Never combine score components from unrelated attempts. No timestamp or execution evidence is needed.

## Progress and tampering

Schema v2 stores challenge/content version, query/method/completion points, `completed` and highest hint only. `completed` must equal completionPoints === 10, and true requires query 70 and method 20. Old v1 practice attestations are not reinterpreted as new completion; they remain untouched until explicit Clear progress.

Remembering opt-out removes only v2. Clear progress removes v1 and v2, never feedback. Unknown fields/versions, invalid IDs/numbers or inconsistent correlations are rejected with fixed diagnostics and no silent data deletion. Structurally valid local edits can falsify scores: these are personal learning state, not audit or authorization evidence.

## Verification

Unit and browser checks prove 70/20/10, parser-failure zero, alternate valid syntax 70, wrong-method partial points, completion only after both checks, edit invalidation, one-attempt saved best, no hint penalty, all sixteen mission totals 1,600, strict v2 state and preservation of legacy records. No tenant result or execution claim follows from these checks.

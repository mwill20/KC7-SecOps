# Scoring and completion contract

## Points per challenge

| Category | Points | Deterministic evidence |
|---|---:|---|
| Query syntax/schema | 10 | Fully supported parse, catalog and type checks pass |
| Query filter intent | 35 | Whole Boolean filter equivalent to the reference intent |
| Query pipeline structure | 25 | Grouping, outcomes, bucket, threshold, order and limit equivalent to the requested pipeline |
| Method decision 1 | 10 | Correct fixed-choice answer to method question M1 |
| Method decision 2 | 10 | Correct fixed-choice answer to method question M2 |
| Completion: executed | 5 | Fixed checkbox: "I ran the adapted query in authorized workplace SecOps" |
| Completion: reviewed | 5 | Fixed checkbox: "I reviewed results or a zero-result limitation inside workplace tools" |

Total 100; query subtotal 70, method 20, completion 10. Maximum course total 1,200. Syntax-invalid, unsafe, unsupported, or limit-exceeded queries get 0 query points; do not award pipeline points for an unparsed query. Supported-but-wrong filter/pipeline can earn the independent passing blocks. Method points are independent, but mastery requires both correct choices.

Completion checkboxes are enabled only for the **current** query at 70/70. Store completion points only when both boxes are selected (10) and query 70; an incomplete selection may display 5 transiently but is not persisted or marked practiced. No screenshot, count, result field, note, URL, or identifier is requested. A query that did not run because of capability/telemetry restrictions cannot earn the execution points. An executed query with zero results may qualify when limitations were reviewed.

## Status

- **In progress:** query <70 or method <20.
- **Symbolic mastery:** query 70 and method 20, practice not attested; 90/100.
- **Practiced — self-attested:** query 70, method 20, both acknowledgments; 100/100.
- **Unsupported by validator / invalid syntax:** diagnostic for current attempt, no correctness claim; saved prior progress remains labelled separately.

All statuses are private formative feedback. No certification, public leaderboards, employer competency claims, attack verdict, or independently verified execution badge. Selecting a correct method answer proves that selection, not the user's private investigation process.

## Retry and hint rules

Unlimited retries; no hint deductions, speed points, streaks, or negative points. Highest hint level 0–3 is saved as a flag if progress persistence is enabled. Hint 3 reveals a worked solution and can still receive full credit; the UI discloses this limitation.

Changing query tokens invalidates current query feedback, method selections/grades, and completion acknowledgment. Changing method selections clears the current method grade until rechecked. Current attempt inputs remain memory-only. Never carry an old attestation onto a changed query.

`reduceAttempt` builds a record for a single fully assessed attempt. Compare its total with saved best total; replace only on higher total, or on equal total with greater query points, then method points, then completion points. A tie retains the saved score components. Merge highest hint level separately. Do not assemble an impossible best score by independently taking maxima from unrelated attempts. No timestamp is needed.

## Error and tampering behavior

Loaded progress is untrusted. Shape validation restricts point domains and correlations, but cannot prove legitimate achievement; do not create hashes/signatures pretending to provide trusted scoring. localStorage edits are accepted only if structurally valid and remain self-reported learning state. Unknown fields, future schema versions, invalid numbers/IDs, or incorrect practiced/completion correlation are rejected with a safe reset message. The app touches only its own storage key.

## Checks

Prove 70/20/10 arithmetic; parser failure gives query 0; correct equivalent syntax gives 70; one method error gives 10; no execution gives no persisted completion points; no telemetry leaves practice pending; executed zero-result review can complete; changed query invalidates current attestation; saved best scores derive from one attempt; hints have no penalty; course score sums the 12 saved challenge totals without double-counting.

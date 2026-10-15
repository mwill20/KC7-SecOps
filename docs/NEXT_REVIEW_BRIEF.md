# Independent review brief

This is a ready-to-use request for the owner's separately initiated review. Its presence does not authorize spawning agents or messaging/creating another chat.

Review the KC7 SecOps implementation at C:\Projects\SecOps KC7 independently against PRD, PRIVACY, SECURITY, specs/VALIDATOR, SCORING, CONTENT_AND_STATE and the threat model. Read live files and status before relying on builder claims. The source is uncommitted; use the output source-archive digest or independently record the inspected file hashes. Static artifact aggregate is documented in IMPLEMENTATION_STATUS.md.

Inspect the composed closed-token→serializer→parser→Boolean/pipeline grade→scoring→optional progress path, text rendering/CSP, storage projection and static artifact. Reproduce relevant success and should-fail cases using synthetic constants only. Preferred command npm run verify; the tests own loopback port 4173. Read evaluation limits. No tenant/KC7 query execution, real workplace values, account changes, commit, push or publishing.

Review independently; do not treat passing builder tests as acceptance. Write only docs/SECURITY_REVIEW.md with APPROVE / APPROVE WITH FIXES / BLOCK, zero or more supported findings, exact reproduction/location/impact and next step. Distinguish actual blockers from optional improvements and external manual/policy checks. Do not edit application files unless the owner explicitly authorizes corrections in that review.

Unresolved release context: manual screen-reader/real zoom checks; private tenant pilot and preview availability; approved host/audience/workplace policy; inherited account-wide Pangea before source upload; license choice before public release. Do not invent acceptance, deployment or risk sign-off.

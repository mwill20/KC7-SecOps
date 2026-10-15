# KC7 SecOps — local build delivery

Historical delivery report from before initial source upload. The owner subsequently authorized commit/push; use IMPLEMENTATION_STATUS.md and Git refs for current source status. The archive identities below remain those of the earlier local deliverables.

2026-10-14. The local browser course is built in `C:\Projects\SecOps KC7` with six original lessons and twelve challenges. It includes the symbolic token composer, structural alternate-query grading, progressive hints, method questions, 70/20/10 scoring, private practice steps and optional non-sensitive progress.

The empty private repository exists at https://github.com/mwill20/KC7-SecOps . Local main has no commits and points to it. Nothing has been committed, pushed or deployed. GitHub inherited existing account-wide Pangea access; review that connection before uploading source. No global app setting or paid plan was changed.

Final full verification passed on official checksum-verified Node 24.21.0: 90 unit tests, 15 browser tests, content validation, build and artifact checks. Chrome/Edge root/subpath smoke tests passed. The static artifact has 13 files and aggregate SHA256 a14b5bcc931f886aeb3d13b272331a2395f08d1ec45a962e5b0843faf53e34c2. Dependency advisory check reported zero known vulnerabilities. Detailed coverage and limits are in docs/EVALUATION.md.

## Open the local course

On the personal development machine, open a terminal in the workspace and run `npm start`; then open `http://127.0.0.1:4173`. The built output is already present there. Stop the server with Ctrl+C. To recreate it from the source archive on a development device, follow README.md: install the pinned dev dependencies/browser, run `npm run verify`, then `npm start`.

Do not install development tools on the work device. Browser-only workplace access needs the future approved hosted URL. The static ZIP must be served over HTTP(S); opening index.html with file:// is unsupported.

## Delivered files

- KC7-SecOps-source-0.1.0.zip: current application, specifications, lessons, tests, documentation, project instructions and manual-only CI. Excludes .git, dependencies, binaries, ignored work, donor copies and output evidence.
- KC7-SecOps-static-0.1.0.zip: the thirteen browser runtime files only. No publishing is performed by this archive.
- CHATGPT_PROJECT_INSTRUCTIONS.md: paste into the ChatGPT project's instructions.
- PROJECT_CONTEXT.md: add as a dated project source, along with current readable docs. Synced project sources remain read-only references.
- BUILD_REPORT.md and SHA256SUMS.json: delivery status and exact archive/file identities. Screenshots show the local app and verified private repo.

## Remaining release work

Independent implemented security review; full manual screen-reader/real 200% zoom checks; private tenant compilation/capability pilot; approved host/audience/workplace website/storage policy; review inherited GitHub app access; any public-release license choice. The next review brief is in docs/NEXT_REVIEW_BRIEF.md.

Examples are documentation-checked, tenant-unverified. Google documents L06 tumbling windows as preview/pre-GA. The course never receives actual identities, logs or results and has no runtime AI, backend or SIEM integration. Local scores are formative/self-attested. Do not call this independently accepted, tenant-validated, deployed, certified or production-ready.

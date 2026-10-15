# KC7 SecOps

An original course for analysts learning **Google Security Operations SIEM Search with YARA-L 2.0**. Six lessons and twelve challenges teach query construction, investigation method, and appropriately bounded conclusions.

The static app is implemented. The owner authorized its initial commit and push to the **private** [mwill20/KC7-SecOps](https://github.com/mwill20/KC7-SecOps) repository on 2026-10-14. Git history and the remote main branch identify the uploaded source. No website deployment is included. See [implementation status](docs/IMPLEMENTATION_STATUS.md) for validation and outstanding checks.

## Practice without exporting workplace data

Build queries from fixed fields, operators and symbols such as `[USER]`. A deterministic local validator checks structure and supported alternate forms. Practice separately in authorized workplace SecOps, substituting values only there. The course receives no identifiers, logs, results, tenant URLs, screenshots or notes.

Scoring is 70 query points, 20 fixed-choice method points, and 10 for execution/review self-attestation. Symbolic mastery needs no tenant execution. Hints have no penalty; the last reveals a worked solution. Scores are personal learning feedback, not certification or incident evidence.

## Developer quickstart

On the development machine, from this directory:

```powershell
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium
npm run verify
npm start
```

Open `http://127.0.0.1:4173`. Chrome and Edge must also be installed for their smoke tests. Stop preview before verification, which owns its own server. Preferred Node is 24.21.0; actual tested runtime is recorded in status. See [installation](docs/INSTALLATION.md), [usage](docs/USAGE.md), and [troubleshooting](docs/TROUBLESHOOTING.md).

Learners do not install tools or run commands at work. Workplace browser access needs an approved hosting route. Private source does not automatically make a website private or policy-approved.

## Repository map

- [START_HERE](START_HERE.md), [HANDOFF](HANDOFF.md): startup and current work.
- `site/`: native HTML/CSS/modules, composer, bounded AST validator, scoring and optional local progress.
- `content/lessons/`: six complete lessons, challenges, hints, method questions and private practice steps.
- [PRD](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [privacy](docs/PRIVACY.md), [threat model](docs/threat-models/THREAT_MODEL.md), [SECURITY](SECURITY.md).
- [Sources](docs/research/SOURCE_MATRIX.md), [query reference](docs/QUERY_REFERENCE.md), [curriculum](docs/CURRICULUM.md), [validator contract](docs/specs/VALIDATOR.md), and [evaluation](docs/EVALUATION.md).
- `tests/`, `qa/`, `schemas/`: executable checks, mutation fixtures, content/state contracts and private pilot protocol.
- `dist/`, after building: thirteen allowlisted static files, excluding development/evidence files.
- `.github/workflows/verify.yml`: pinned, manual-only CI configuration, not run remotely; no deployment.

The original donor package remains preserved and ignored under `secops-query-academy-spec/`. Root code/documents govern current work. [CODEX_BUILD_BRIEF](CODEX_BUILD_BRIEF.md) is the original ordered brief; read live status before restarting anything.

The root also contains a browser runtime snapshot matching the validated build at initial upload. Author application changes in `site/` and `content/`; `npm run build` generates `dist/`. Future hosting must serve the reviewed static artifact, not the complete source checkout.

## Boundaries and limitations

No runtime AI, backend, accounts, SIEM integration, event dataset, upload, raw editor, clipboard read, tracking or automatic external content. Optional storage contains only fixed IDs, scores, hint levels, versions and practice flags. Query/method inputs clear when leaving a challenge or reloading.

The validator supports a bounded Search subset, not Google's compiler. Queries are documentation-checked and **tenant-unverified**. Mapping, permissions, telemetry and features need private checks. L06 tumbling windows are preview/pre-GA and may be unavailable. Missing capability leaves practice pending; executed zero-result queries may qualify after limitation review.

Independent review and full manual accessibility checks remain pending. Host metadata, compromised releases, same-origin scripts and extensions limit client-side protection. See [limitations](docs/LIMITATIONS.md).

## Attribution and license

Inspired by KC7's narrative investigations and graduated learning. Case, content, scoring and code are original; no KC7 question bank, artwork, code or datasets are included. Not affiliated with KC7, Google or Microsoft. Primary sources are linked in the matrix.

TODO: owner chooses a license before public release. No public-use license has been selected.

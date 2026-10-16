# KC7 SecOps

An original course for analysts learning **Google Security Operations SIEM Search with YARA-L 2.0**. Six chapters and sixteen investigation missions teach query construction, investigation method, and appropriately bounded conclusions.

**[Play KC7 SecOps →](https://mwill20.github.io/KC7-SecOps/)** — no install, account or setup command.

Read the privacy notice, open the learning path and choose **Start the case**. Optional **Remember non-sensitive progress** lets you resume in the same browser. Leave it off on a shared device. Use workplace tools separately for any real query execution.

Revised course published on GitHub Pages on 2026-10-16. The owner made the repository public and authorized independent review and publication. The [focused AI security review](docs/SECURITY_REVIEW_2026-10-16.md) approved this editor revision; local/reviewer/remote verification passed 116 unit and 18 browser tests, and actual HTTPS assets/all sixteen live mission pages were checked. See [deployment evidence](docs/DEPLOYMENT.md) and [implementation status](docs/IMPLEMENTATION_STATUS.md). Workplace website/storage approval and tenant compatibility remain separate, unverified checks.

## Practice without exporting workplace data

Type training queries using the supplied fields, operators and placeholders such as `"__USER__"`. A deterministic local validator checks structure and supported alternate forms. Practice separately in authorized workplace SecOps, substituting values only there. The editor can receive accidental real text; never enter identifiers, logs, results, tenant URLs, screenshots or notes. Query text is never saved or sent by app code.

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

Learners use the website link above. Workplace use requires organizational approval of the website and optional local storage. Public availability does not establish workplace approval.

## Repository map

- [START_HERE](START_HERE.md), [HANDOFF](HANDOFF.md): startup and current work.
- `site/`: native HTML/CSS/modules, composer, bounded AST validator, scoring and optional local progress.
- `content/lessons/`: six complete lessons, challenges, hints, method questions and private practice steps.
- [PRD](docs/PRD.md), [architecture](docs/ARCHITECTURE.md), [privacy](docs/PRIVACY.md), [threat model](docs/threat-models/THREAT_MODEL.md), [SECURITY](SECURITY.md).
- [Sources](docs/research/SOURCE_MATRIX.md), [query reference](docs/QUERY_REFERENCE.md), [curriculum](docs/CURRICULUM.md), [validator contract](docs/specs/VALIDATOR.md), and [evaluation](docs/EVALUATION.md).
- `tests/`, `qa/`, `schemas/`: executable checks, mutation fixtures, content/state contracts and private pilot protocol.
- `dist/`, after building: thirteen allowlisted static files, excluding development/evidence files.
- `.github/workflows/verify.yml`: separate pinned, manual-only verification configuration.
- `.github/workflows/pages.yml`: manual-only publication; verifies the course before uploading only `dist/`, then deploys through GitHub Pages. First run passed.
- `tools/check-live.mjs`: verifies actual HTTPS asset bytes/MIME types and excluded development paths after publication.

The original donor package remains preserved and ignored under `secops-query-academy-spec/`. Root code/documents govern current work. [CODEX_BUILD_BRIEF](CODEX_BUILD_BRIEF.md) is the original ordered brief; read live status before restarting anything.

The root also contains a browser runtime snapshot matching the validated build at initial upload. Author application changes in `site/` and `content/`; `npm run build` generates `dist/`. Hosting serves the reviewed static artifact; never publish the complete source checkout.

## Boundaries and limitations

No runtime AI, backend, accounts, SIEM integration, event dataset, upload, clipboard read, tracking or automatic external content. The training-query editor accepts symbolic syntax; optional storage contains only fixed IDs, scores, hint levels, versions and practice flags. Query/method inputs clear when leaving a mission or reloading.

The validator supports a bounded Search subset, not Google's compiler. Queries are documentation-checked and **tenant-unverified**. Mapping, permissions, telemetry and features need private checks. L06 tumbling windows are preview/pre-GA and may be unavailable. Missing capability leaves practice pending; executed zero-result queries may qualify after limitation review.

Independent AI release review completed with no supported security findings. Full manual accessibility checks and tenant validation remain unperformed. Host metadata, compromised releases, same-origin scripts and extensions limit client-side protection. See [limitations](docs/LIMITATIONS.md). Updated lessons require reassessment of older saved content versions; query text is never part of saved progress.

## Attribution and license

Inspired by KC7's narrative investigations and graduated learning. Case, content, scoring and code are original; no KC7 question bank, artwork, code or datasets are included. Not affiliated with KC7, Google or Microsoft. Primary sources are linked in the matrix.

The owner approved publication without adding an open-source license. No license was added.

## Investigation-led learning revision

Midnight at Meridian uses a fictional planetarium case, complete starter queries, short explanations, progressively reduced guidance and three hints per mission. Type or paste **training queries with placeholders** for local structural grading. Run against authorized workplace logs separately in SecOps; never return real identifiers or results. The first chapter grows from `USER_LOGIN` to successful sign-ins, distinct account counts, recorded job titles and failed attempts. Job titles depend on source/enrichment coverage and are not permission roles or proof of a historical position. Query text is never saved or sent by app code, but the editor can receive accidental real text; managed devices do not change that public-site boundary. See `docs/LEARNING_REDESIGN.md` for current revision status.

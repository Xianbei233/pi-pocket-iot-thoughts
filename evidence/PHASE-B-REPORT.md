# Phase B — independent final candidate acceptance

## Decision
**PASS. All existing acceptance gates are green.** Phase-A original five failures pass after the single business-fix batch. No assertion relaxed. No further test/repair loop; test files frozen for planner acceptance. No commit/push/publish or production install/enable.

## Identity and snapshot
Test role; high complexity real loader/offline installation and safety regressions. Authorized/requested model `openai/gpt-6.1-sol`, thinking `high`, inherited original settings. Actual provider/model/thinking metadata **not obtained** from available metadata receipts. A formal failure receipt explicitly reported an `openai/gpt-6.1-sol` **Subscription Sharing usage limit** interruption during this phase. This was a subscription usage-limit event, **not an authentication failure**. After Owner said “继续”, execution resumed and completed on the same original channel, without model/thinking changes, fallback or model probe. No explicit model mismatch or thinking clamp was observed.

Project `/home/xianbei233/Work/pi-pocket-iot-thoughts`, branch `pocket-adapter`, unborn HEAD/no commit/no remotes at fingerprint time. Pocket read-only 0.18.0 @ `564058ef9768c0ee64a074257563576c257ede84`; Node v26.10.0; pi-ai/pi-durable 1.1.0. Upstream fixed `2bdf1ef78e9decdea7bbc3d5a2664160a2a83e8e`; no new online research. Tester/developer received behavior specifications without reading/copying upstream source/prompts/fixtures; main planner did inspect upstream source for verification.

| Object | SHA-256 |
|---|---|
| iot-thoughts.ts | `4b6673a00ad9b1c79f265f4565c8bed6e11cdb23996f896b687cfe774c1d8fdd` |
| manifest.json (external self hash) | `4618d4156542f1fadb0e37f8bba9c8a7a851778ce35f0257058b4516dec097de` |
| dist/pi-pocket-iot-thoughts-0.1.0.tgz | `81d214458a2661ac541e74ef97752c2571715bc503caa74c7b8aa609f11b3689` |

Full source/test/script/doc/package fingerprints: `phase-b/fingerprint.json`.

## Actual executed gates
All complete logs and exit receipts are under `evidence/phase-b/`.

| Gate | Exit/result | Log / receipt |
|---|---|---|
| npm test | **0; 45/45 pass, 0 failed/skipped/cancelled** | test.log / test.exit |
| npm run check | **0** | check.log / check.exit |
| npm run lint | **0** | lint.log / lint.exit |
| npm run format:check | **0** | format-check.log / format-check.exit |
| actual scripts/pack.mjs isolated copy | **0; 22,497 bytes, 9 files** | pack-valid.log / pack-valid.exit |
| exact dist/manifest audit | **0** | audit-final.log / audit-final.exit; dist-audit.json |
| final immutable fingerprints | **0** | fingerprint.log / fingerprint.exit |
| actual loader/native faux isolated install lifecycle | **pass** in npm test | test.log; integration-summary.json |

OS bounds: full test180s, integration internal115s (within120s), check70s, lint/format45s, pack subprocess30s, audit25s. Full test finished approximately2.84s. tsconfig includes test/**/*.ts; eslint . and prettier --check . cover all five test files. No hidden failed gate.

## Original failed cases and docs A3
- A1: original factual Tool output assertion now passes with exact whole-source kept.
- A2: original four negative/undecided bodies now pass exact source grounding and conservative non-positive/non-decided labels: `We do not support option A.`, `We have not yet decided whether to choose A.`, `No decision has been made.`, `还未决定采用A。`. Their original assertions remain in core/regressions tests.
- A3 independently read corrected actual docs: design.md describes bounded cooperative yields instead of fully synchronous execution; install.md says env is inherited by the Pocket process at launch, a different shell export cannot update it, and reload rereads only its current process.env. Updated environment requires the isolated Pocket process started/restarted with it.

## Final dist truly exercised
`dist-audit.json` verifies exactly nine regular non-symlink/non-hardlink entries: LICENSE, PROVENANCE.md, README.md, config.example.json, docs/design.md, docs/install.md, iot-thoughts.ts, manifest.json, package.json. All eight non-self manifest digests verified; manifest external SHA recorded above. Every packed byte equals shipped checkout content; final source/package hash and22497byte size match authorized candidate.

Actual integration creates offline npm tar and asserts **byte-for-byte equality with final dist before installing the module from that tar**. See `integration-dist-equivalence.json`. Actual scripts/pack.mjs isolated smoke independently produces identical hash/size/files. Dist and all three phase-b/artifacts tgz files match. No source-only/mock substitution for final package.

Real Pocket test/helpers.ts is imported first to isolate agent/home/work/data. Real App loader + native faux provider, not fake registration. Initial off -> owner enable -> natural-language visible note request -> actual toolResult -> ordinary compressed result echo passes. Native tool definitions/base prompt unchanged; real native read synthetic fixture passes. Concurrent sessions/calls, reload, enabled restart, disable, removal/restart all pass. Owner enable uses actual App owner method, not browser clicking.

Full actual backend output exceeds native50KB default without truncation: CJK23992UTF16chars ->72382bytes; escaped controls23992chars ->144322bytes. Complete fenced JSON parses and kept text exactly matches original. Plugin outputLimits exercised through real loader; native truncation not mocked. Defanged closing tags are display data, not byte-exact archival; offsets refer to original source.

Native faux has synthetic1000000contextWindow to avoid unrelated Pocket context-summary generation on giant escaped fixtures; no output-limit bypass. Large assistant reply is a short acknowledgement while backend result verified in full; ordinary turn echoes actual compact payload. Checked tool turns exactly two faux calls; concurrent pair four. Full fixture23faux requests/zero paid requests is not agent usage.

## Other existing contract checks passed
Strict config/options/type/prototype/unknown permissions; oversize reject even disabled; frozen defaults; eight bilingual labels including tradeoff/neutral/pending; deployment profile; differing-polarity duplicate retention; UTF16/emoji/CRLF offsets; critical node/output budgets; strict shortening or exact keep; explicit omissions/unverified; fenced code/factual output protection; pre/active abort/dispose, timeout and listener/timer cleanup; closing-tag defang/data-not-instructions/heuristic notices. Packaging rejects unexpected docs/scripts, source/manifest symlinks and digest tamper. Link script rejects node_modules directory/dangling symlinks/non-directory without modifying synthetic outside target.

## Tester changes / evidence provenance
Only test/** and evidence/** writes by tester. Phase-B harness-only changes add optional stage evidence directory and optional final-dist byte-equivalence assertion; no original semantic assertion modified or relaxed. Business/docs/config/package/manifest untouched by tester. Test files now frozen.

Earlier on-disk evidence copied to phase-a-preserved/ before phase B;27developer receipt files copied to dev-resume-logs/, not misrepresented as independent acceptance. Developer test runs had already refreshed root helper package artifacts before phase B: preserved current copies carry their actual final-candidate hashes, not original phase-A tar hashes. Original Phase-A report retains its historical hashes. Root phase-a-fingerprint.json referenced there was absent on resume; unavailable historical file was not fabricated. Original terminal core/factory hashes matched; regressions file was read and not edited in phase B.

Two audit setup failures retained (inline Python quoting, missing historical fingerprint file); corrected evidence bookkeeping retained full product assertions and yielded audit-final.exit0. No business fix/retest loop was added. Final gate receipts re-read once on Owner continuation without rerunning shell/tests.

## Usage and unverified boundaries
PHASE-B-USAGE.json records requested test channel/high and unavailable actual metadata. Generation/input/cacheRead/cacheWrite/outputIncludingReasoning/totalInput/avg-maxContext/aggregateToolReturnBytes **not obtained** from exposed host telemetry. The Subscription Sharing usage-limit interruption and Owner-authorized same-channel recovery are recorded separately; they do not provide numeric usage or actual thinking metadata. No metric probes or tool/faux-count substitution.

No paid provider, browser UI clicking, production enable/install, hidden-reasoning/DSH interception, perfect arbitrary-language classification, model-injection immunity, secret filtering or Guard interception of plugin internals claimed. Normal Pocket tool argument/result persistence/provider transmission still applies. These are stated first-version boundaries, not unresolved failures.

**Ready for main-planner acceptance; paused without committing or further autonomous work.**

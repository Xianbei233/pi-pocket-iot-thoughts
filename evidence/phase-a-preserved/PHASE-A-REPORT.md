# Phase A — independent test baseline (paused for one implementation batch)

## Identity, snapshot and scope
- Test role, high complexity (real loader, safety boundaries and offline packaging); requested/authorized channel `openai/gpt-6.1-sol`, thinking `high`. Actual provider/model/thinking metadata **not obtained** through available tools; no explicit clamp, model mismatch or quota/auth failure observed. No model switch/fallback/probe performed.
- Branch `pocket-adapter`, unborn HEAD/no commit. Business source SHA-256 `d90e88861bdc93725ce580458c4418d96589ac183b786b62e4518c2ef30fd8c8`; full source/test/script/doc fingerprints: `phase-a-fingerprint.json`.
- Pocket read-only reference: 0.18.0 @ `564058ef9768c0ee64a074257563576c257ede84`; Node v26.10.0, pi-ai/pi-durable 1.1.0.
- Tester edits confined to `test/**` and `evidence/**`. Temporary synthetic project/install folders are removed by test cleanup. No production enable/install, paid model API, hardware, network/MCP or real session fixtures.
- Tester/developer received behavior specifications and did not read/copy upstream IoT source/prompts/fixtures; main planner did inspect upstream source for verification. Do not generalize tester provenance to all participants.

## Final phase-A gates
| Gate | Exit | Complete log |
|---|---:|---|
| npm test | **1** — 40/45 pass, 5 fail | `phase-a-npm-test-final.log` + `.exit` |
| npm run check | 0 | `phase-a-npm-check-final.log` + `.exit` |
| npm run lint | 0 | `phase-a-npm-lint-final.log` + `.exit` |
| npm run format:check | 0 | `phase-a-npm-format-check-final.log` + `.exit` |
| real loader/faux integration | 0 | included in final npm test; standalone `phase-a-integration-real-final.log` + `.exit` |
| actual scripts/pack.mjs on isolated copy | 0 | `pack-valid.log` + `.exit`; exercised by final npm test |

`check` includes `test/**/*.ts`; lint is `eslint .`, format is `prettier --check .`, with test not ignored. All five new test files are actually covered. Test-owned schema narrowing, non-null fixture assertion and formatting were repaired without loosening assertions. Initial failures/logs remain preserved. Interrupted pre-resume shell did not return an exit receipt: `integration-initial.interrupted.json` explicitly says exit not obtained.

## ONE consolidated implementation-fix list
### A1 — factual tool output is compacted instead of conservatively kept
- Business location: `iot-thoughts.ts:580-587`, protected-content detection/extraction entry. It protects fenced blocks but not explicit factual tool output.
- Minimal input: `"Tool output:\n" + '{"record":1,"value":7}\n{"record":2,"value":8}\n{"record":3,"value":9}\n'.repeat(8)`, config `{...DEFAULT_CONFIG,minChars:1}`.
- Original assertion: `test/core.test.ts:190`, status strictly `kept` and full original text preserved. Actual status is `compacted`; rows/header can be deduplicated/omitted as heuristic notes.
- Evidence: final npm-test log, test `fenced repeated code and factual tool output remain intact`; same failure in `phase-a-unit-expanded.log` (exit 1).

### A2 — negative and undecided prose gets positive/decided tags (four cases, one inference fix)
- Business location: `iot-thoughts.ts:353-389` (`inferTag`).
- For each body below, source is body + newline + `Plan: Run synthetic tests tomorrow.` + newline + `Neutral: A plain local observation.` + newline + 20 repeated synthetic background notes; resolve config with minChars=0,maxNodes=16.
| Body | Actual | Required conservative labels |
|---|---|---|
| `We do not support option A.` | support | oppose or neutral |
| `We have not yet decided whether to choose A.` | decision | open or neutral |
| `No decision has been made.` | decision | open or neutral |
| `还未决定采用A。` | decision | open or neutral |
- Original assertions: `test/regressions.test.ts:138-148`, status compacted, exact body retained and source grounded, tag must belong to the listed allowed conservative labels. All four fail only the tag assertion. No sentence was removed to manufacture a pass.
- Evidence: `phase-a-npm-test-final.log` / exit 1, `phase-a-unit-expanded.log` / exit 1.

### A3 — two documentation corrections (planner-owned handoff to developer)
- `docs/design.md:21`: “整个流程同步” contradicts actual async cooperative yields.
- `docs/install.md:36-44`: exporting a variable in a different shell cannot mutate the running Pocket process environment; saving/reloading only rereads that process existing environment. State how to start/restart Pocket with the updated deployment environment.

No implementation/doc change was made by tester. Stop here and wait for the single planner-coordinated business-fix batch, then phase B reruns these original assertions/all gates.

## Passing boundary evidence
- Strict config/options, unknown permissions/prototype/symbol/type rejection; oversize rejection including disabled; exact frozen defaults; actual deployment profile selection.
- Eight Chinese/English tag families including tradeoff/neutral and pending; UTF16/CRLF/emoji offsets exclude labels; duplicate differing-polarity nodes retained; critical budgets keep original; pre/active abort/dispose cancel and listener/timer checks; deterministic timeout error.
- Real `test/helpers.ts` imported first: temporary agent dir/home/work/data; actual App loader and real native faux provider, not fake tool registration. Baseline off → owner enable → natural-language visible notes → actual toolResult → ordinary echoed compact result. Native tool definitions/base prompt unchanged; real native read of synthetic file passes; two simultaneous sessions isolated. Reload, enabled restart, disable and remove/restart pass.
- Large fixtures are 23,992 UTF16 chars each. Actual backend toolResult is complete parseable JSON: CJK **72,382 bytes**, escaped controls **144,322 bytes**, exact kept source. Both exceed Pocket default 50KB tool result cap. Native truncation was not mocked/removed: module fixed outputLimits are tested through loader. Defanged closing tags are safe display data, not byte-exact archival; grounding compares original input.
- Scripted provider has an explicitly large synthetic context window (1,000,000), normal real faux provider implementation; prevents unrelated native context summarization on giant escaped fixtures. Native default output cap remains intact, tested via backend messages. First harness attempt also triggered native title generation from a long first request; shortening that natural-language request eliminated it. Both initial false extra-request failures and corrected evidence retained.
- `integration-summary.json`: 23 actual synthetic faux requests across the full scenario, zero paid requests. This is fixture traffic, NOT this test agent generation/token usage. Per checked tool turn exactly two faux calls; concurrent pair four.
- Exact allowlisted offline payload; manifest digests; source copied from actual tarball and equality/hash checked. `scripts/pack.mjs` succeeds on isolated copy; unexpected docs/private.txt, scripts/extra.mjs, source and manifest symlinks, digest tamper all rejected. Link script directory/dangling symlink and non-directory node_modules cases leave synthetic outside target unchanged.
- Offline tar SHA-256 `30d67ce1bd16fc6046d994d59af8abc35eb7794fbaf072db49603cc5f8ff4087` in `artifacts/pi-pocket-iot-thoughts-0.1.0.tgz`, identical to `artifacts/verified-script-output.tgz`. This is a failed-acceptance phase-A candidate, not a release or approved installation.

## Usage observation — stage A, test role only
Exact requested channel: openai/gpt-6.1-sol / high; actual metadata not obtained. Real generation count, input, cacheRead, cacheWrite, output including reasoning, total input=input+cacheRead+cacheWrite, average/max request context, and aggregate tool-return bytes: **not obtained** from available host usage fields. No inference from tool count, transcript length or faux requestCount; no extra provider probes. Other roles usage not collected by tester. Source: available tool/session receipts expose no corresponding usage telemetry.

## Unverified limits
No real model/provider behavior, hidden reasoning/DSH interception, production installation/UI clicking, adversarial-model obedience resistance or Guard interception of module internals claimed. Owner enabling is exercised through real App owner method, not browser UI. Tool arguments/results retain normal Pocket persistence and provider transmission. Not a secrets filter. Five failing semantic assertions plus two doc corrections prevent acceptance.

# Pocket 0.20.0 Phase A: PASS

All independent isolated prerequisites pass. No production mutation occurred.
Pause for the planner's later authorized production installation and acceptance assignment.
The current Owner policy is to leave the final production plugin installed and enabled after a later PASS.
Temporary lifecycle disable and uninstall in this phase apply only to isolated test data.

## Exact baseline and compatibility

- Pocket: 0.20.0 at `d1b97e1d995742dae90b20bcd1ce9545fdfc58c5`.
- Pocket working tree: clean before and after this phase.
- Actual SDK packages: `@earendil-works/pi-ai` 1.3.0 and `@earendil-works/pi-durable` 1.3.0.
- Plugin dependency links resolve to those exact Pocket SDK installations.
- Extension API: 2. Current API documentation says it remains 2 since 0.19.0.
- Public types expose `Web.api`. `src/server/extension-web.ts:36` defines `POCKET_API = 2`.
- The existing plugin declares `pocketApi = 2` and returns `output`, as the current tool guide requires.
- No API or SDK incompatibility was found. No business or test adaptation was needed.

The tester read the latest AGENTS and owner-testing template.
The tester read the current extension index, modules, tools, testing, security, and API-version guides completely.
The public type file was read through its continuation. The actual current test helpers were read.

## Artifact identity

- Plugin branch: `pocket-adapter`.
- Base commit: `c570eb35a1a0a0c157762fd9f319948e6dca66f4` plus preserved uncommitted repairs.
- The base commit alone does not identify the current adapted source.
- Candidate: `dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz`.
- Candidate SHA-256: `31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e`.
- Candidate size: 22672 bytes; exactly 9 regular files.
- Source SHA-256: `cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4`.
- Manifest SHA-256: `1525899983a0c210f421e4e81ea1a9b06e268cb85afbba816c1465f7edca0fca`.
- All 8 manifest payload digests pass. Every archived payload equals the working file.
- The lifecycle-installed tarball is byte-identical to this candidate.
- The actual isolated pack script produces the same candidate hash, size, and file count.

The manifest still truthfully records historical `verifiedWith.pocket: 0.19.0`.
This new external evidence records 0.20.0 validation without modifying the immutable package or its documentation.

## Gates

| Gate | OS bound | Exit | Result |
| --- | --- | --- | --- |
| Baseline and hash-only dictionary check | 20 seconds | 0 | PASS |
| npm run check, run alone | 45 seconds | 0 | PASS on first attempt |
| npm test | 180 seconds | 0 | 56/56 pass, 0 skipped |
| npm run lint | 45 seconds | 0 | PASS |
| npm run format:check | 45 seconds | 0 | PASS |
| Targeted core/regression/factory | 45 seconds | 0 | 46/46 pass |
| Actual current helper-first loader lifecycle | 120 seconds | 0 | 1/1 pass |
| Packaging and actual isolated pack smoke | 45 seconds | 0 | 9/9 pass |
| Exact request through installed tool, 2 runs | 120 seconds | 0 | Both strict passes |
| Final archive/digest/preservation audit | 45 seconds | 0 | PASS |

The suite contains the original 45 cases plus 11 previously approved regressions.
No existing assertion was weakened or changed in this phase.
Each gate has full `<gate>.log`, `<gate>.exit`, and `<gate>.receipt` files in this folder.
The receipts record commands, timestamps, OS bounds, and exits.
The type-check ran alone before heavy gates. No automatic retry or bound increase occurred.
The historical 0.19 first-check timeout 124 and isolated recheck 0 remain in their original evidence.
They are not replaced by this new first-attempt 0.20 check pass.

## Actual Pocket loader and lifecycle

The tests import the current actual Pocket `test/helpers.ts` first.
Those helpers isolate agent, home, work, and data before the application import.
The provider is native `faux/faux-1`, not a real model provider or a mock application loader.
The candidate extracted into temporary data has the approved source hash.

The existing real-loader integration passes:

- Initially off, enable, reload, isolated application restart, disable, removal, and restart after removal.
- Synthetic notes to tool call, successful backend toolResult, and assistant response.
- Native tool definitions and system body unchanged.
- A real native read of a synthetic file in isolated work.
- Grounded extraction, negative/pending/numeric preservation, and concurrent-session isolation.
- Rejected extra arguments, hostile closing-tag defanging, and complete large CJK/control-character results.

The lifecycle integration records 23 faux requests and 0 paid requests.
These faux request counts are not this agent's generation or token usage.
The temporary app and package sandboxes are cleaned up by the existing helpers/tests.

Evidence: `test/integration-summary.json`, `test/integration-dist-equivalence.json`, and `test/pack-valid.log`.
Equivalent targeted evidence is under `integration/` and `packaging/`.

## Exact unchanged acceptance fixture

The new evidence harness reuses the previously reviewed helper-first harness.
Only evidence paths and the expected Pocket baseline parameter change.
It requires `IOT_TEST_DIST_PACKAGE` and `IOT_TEST_POCKET_HEAD`.
The original 7-condition helper is copied byte-for-byte.
The captured request file is copied byte-for-byte and its UTF-8 hash is checked before invocation.
No fixture or acceptance-standard change occurs.

- Request: 684 UTF-16 units; full profile; defaults; 8 CRLF sequences; 22 background repetitions.
- Request UTF-8 SHA-256: `eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e`.
- Configuration environment variable: absent, not mutated.
- Rendered output: 233 UTF-16 units, below the trimmed input length of 683.

| Condition | Run 1 | Run 2 |
| --- | --- | --- |
| status compacted | true | true |
| exactly 8 nodes | true | true |
| all 8 expected tags | true | true |
| all source slices grounded | true | true |
| emoji-bearing node | true | true |
| verified false | true | true |
| strictly shorter | true | true |
| exactly 1 of each category | true | true |
| integer and in-bounds UTF-16 ranges | true | true |
| faux calls | 2 | 2 |

Both raw tool texts are byte-identical: 2296 UTF-8 bytes.
Both have SHA-256 `e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2`.
This matches the expected 0.19 output without an output-semantics change.

| Tag | start | end | Grounded |
| --- | ---: | ---: | --- |
| support, with emoji | 3 | 23 | yes |
| oppose | 28 | 45 | yes |
| tradeoff | 50 | 68 | yes |
| open | 73 | 90 | yes |
| plan | 95 | 112 | yes |
| decision | 117 | 133 | yes |
| risk | 138 | 155 | yes |
| neutral | 160 | 176 | yes |

Full request, raw return, and raw text are durable before parse and check evaluation.
See `request.json`, `original-acceptance-logic.js`, `run-1/`, `run-2/`, `run-receipt.json`, and `acceptance-summary.json`.
Both run folders contain `raw-tool-return.json`, `raw-tool-text.txt`, `parsed.json`, and `per-condition.json`.
The separate acceptance exit is 0.

## Dictionary and preservation

The production dictionary file is checked only by hashing its bytes.
It is not imported, executed, rewritten, or overwritten.
Its SHA-256 remains `15a0ceb363d92c7d0fc2b75c89a13f88e101285aa417db85039857aeda8e965e` before and after.
The supplied claims of dictionary version 0.8.0, 1475 strings, and 295 templates are not independently parsed or validated here.
The hash-only check proves preservation, not translation completeness.

The before/after snapshots prove that all tracked plugin files, the uncommitted diff, candidate bytes, and 2 original .tmp files remain unchanged.
The Pocket checkout remains clean at the exact target HEAD.
All writes in the project are new evidence under `evidence/deploy-020/`.
Old evidence, failed raw reproductions, old packages, and all working changes remain preserved.
See `preservation-before.json`, `preservation-after.json`, and `audit.log`.

## Limits and next boundary

No production API, browser, credentials, sessionDB, real fixture, paid provider probe, MCP, hardware, model, Guard, core, dictionary, other plugin, or production configuration was changed or used for testing.
No production restart, remote push, merge, or commit occurred.
No LayerFS deployment was performed. No production inventory count is forced or assumed.
The current browser authentication state was not probed.
The later live installation and ONE actual production call require separate planner authorization.
This is Phase A readiness evidence, not a new live production pass.
The final Owner policy is to remain installed and enabled after the later authorized live PASS.

## Role and usage

Requested role/model/thinking: test / `hww/gpt-6.1-sol` / `high`.
Actual provider/model/thinking metadata: not obtained.
No explicit clamp, mismatch, or provider failure was reported. No model change or fallback occurred.
Generation, input, cacheRead, cacheWrite, outputIncludingReasoning, totalInput, average context, maximum context, and tool return bytes: not obtained.
No usage or paid-model probe was sent.

All Phase A gates pass. Pause here.

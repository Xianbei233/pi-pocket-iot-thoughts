# Final adapted Stage 1 preflight: PASS

All requested local prerequisite gates pass on Pocket 0.19.0.
Production acceptance has not started. This report does not authorize a production restart or installation.
The failed original preflight evidence remains unchanged.

## Exact identities

- Pocket: 0.19.0 at HEAD `eae8ccf6c615ea2188f9b88e9252455917b081d4`.
- Plugin branch: `pocket-adapter`. Base HEAD: `c570eb35a1a0a0c157762fd9f319948e6dca66f4`.
- The adapted source is an uncommitted working-tree change. The base HEAD alone does not identify it.
- Candidate: `/home/xianbei233/Work/pi-pocket-iot-thoughts/dist/deploy-019/pi-pocket-iot-thoughts-0.1.0.tgz`.
- Candidate SHA-256: `f9e2351acca07ff5f43ff49f3502ef5ca03b34d4f2a4f7ef1a24994b581c6c8b`.
- Candidate size: 22492 bytes. Exactly 9 regular files.
- Source SHA-256: `b4564f4ee0a7db8a753459b97cc277a3f85ac158ecfbc55c8171cb89e9f1fdaf`.
- Manifest SHA-256: `6d56a7dc9885fcea7fe6c7d489af51eb3dc0995c349a044a26796223a2254dda`.
- `pocketApi = 2`; Pocket requirement: `>=0.19.0`; both peer dependencies: `1.3.0`.
- All 8 manifest payload digests pass. All archive payload bytes equal the working files.
- The integration-installed tarball is byte-identical to this exact candidate.
- The actual isolated `scripts/pack.mjs` produces the same size and SHA-256.

## Gates and OS bounds

| Gate | OS bound | Exit | Result |
| --- | --- | --- | --- |
| `npm test` | 180 seconds | 0 | 45 pass, 0 fail, 0 skipped |
| `npm run check` | 45 seconds | 0 | PASS |
| `npm run lint` | 45 seconds | 0 | PASS |
| `npm run format:check` | 45 seconds | 0 | PASS |
| Exact archive, digest, and adaptation-scope audit | 20 seconds | 0 | PASS |
| Targeted core, regression, and factory tests | 45 seconds | 0 | 35 pass |
| Targeted real loader/native faux integration | 120 seconds | 0 | 1 pass |
| Targeted packaging and isolated pack-script tests | 45 seconds | 0 | 9 pass |

Each gate ran once in this final preflight. The full suite contains the same targeted tests.
The targeted runs give the separate requested OS bounds. They are not failure retries.
No test assertions were weakened. No feature tests were added. No automatic repair loop ran.

The first gate batch started at 2026-10-23 15:39:36 +08:00.
The full suite finished at 15:39:41. The last gate in that batch finished at 15:39:48.

The full logs, exit receipts, commands, timestamps, and bounds are in this folder:

- `test.log`, `test.exit`, `test.receipt`.
- `check.log`, `check.exit`, `check.receipt`.
- `lint.log`, `lint.exit`, `lint.receipt`.
- `format-check.log`, `format-check.exit`, `format-check.receipt`.
- `audit.log`, `audit.exit`, `audit.receipt`.
- `unit.log`, `unit.exit`, `unit.receipt`.
- `integration.log`, `integration.exit`, `integration.receipt`.
- `packaging.log`, `packaging.exit`, `packaging.receipt`.

The actual pack-script log is `test/pack-valid.log`; its exit receipt is `test/pack-valid.exit` (0).
The targeted packaging run also has `packaging/pack-valid.log` and its exit receipt (0).
Negative packaging cases deliberately produce nonzero script exits. Their parent assertions all pass.

## Real loader and core end-to-end evidence

The existing integration test imports the actual Pocket `test/helpers.ts` first.
The helpers isolate agent, home, work, and data before the application import.
The test uses native `faux/faux-1`. It does not use a paid provider or a mocked application loader.

The integration installs the offline tarball into isolated data, then checks:

- The module is initially off.
- Enable loads the final `pocketApi = 2` module without an error.
- A synthetic natural-language note request produces a successful backend `toolResult`.
- The assistant receives that result and produces the expected response.
- Source offsets reproduce the exact extracted text.
- Negative, pending, numeric, and decision text remains present.
- Each ordinary and large-result tool turn uses exactly 2 faux calls, with no auxiliary compression request.
- Native tool definitions, system-body content, and user text remain unchanged.
- Native read works on a synthetic file in the isolated working directory.
- Concurrent sessions do not exchange their source markers.
- Invalid extra arguments produce an error result.
- Hostile closing tags are defanged and results remain labelled unverified data.
- Reload, isolated application restart, disable, removal, and restart after removal pass.

The full-suite integration records 23 faux requests and 0 paid requests.
These are test-provider requests, not this agent session's generation count.

The large CJK result is 72382 bytes. The escaped-control result is 144322 bytes.
Both retain complete JSON and the exact kept text beyond the native default 50 KiB byte limit.
The targeted integration repeats the same unchanged acceptance test and passes.

Evidence:

- `test/integration-summary.json`.
- `test/integration-dist-equivalence.json`.
- `test/integration-request-summary.json`.
- `test/integration-cjk-output.json`.
- `test/integration-escaped-output.json`.
- Equivalent targeted-run evidence is under `integration/`.

## Adaptation and preservation

The audit confirms that source changes are limited to the result key, API level, and API comment.
The node extraction implementation is otherwise byte-for-byte unchanged from the base source.
The test change is exactly 3 accesses from `result.content` to `result.output` in `test/factory.test.ts`.
All assertions, filters, and maps remain. No new casts or `any` types hide the result contract.
The other 4 test files remain byte-for-byte unchanged from the base commit.

The old candidate retains SHA-256 `81d214458a2661ac541e74ef97752c2571715bc503caa74c7b8aa609f11b3689`.
Both existing untracked `.tmp` files retain SHA-256 `b27fb3444cbaf19c483b796ae853cf0466616abcd20724c11797ff867904b4ca`.
This final run writes reports and logs only under `evidence/deploy-019/adapted-preflight/`.
The tests use temporary isolated application and packaging directories, then clean them up.
Old evidence was not overwritten.

## Limits and production status

No production extension file, configuration, session database, model, Guard setting, or server process was changed.
No shared browser, credentials, real session fixtures, real MCP, hardware, paid model probe, remote push, or global configuration change was used.
The application restarts in the test are isolated application restarts, not production restarts.
The faux script proves the loader/tool/result path. It does not prove that a real model will choose the tool unaided.
Production backup, installation, and final production acceptance remain separate later steps.

## Session role and usage

Requested role/model/thinking: test / `hww/gpt-6.1-sol` / `high`.
Actual runtime provider/model/thinking metadata: not obtained.
No explicit clamp, model mismatch, or provider failure was reported by the available tools.
No settings were changed. No model fallback was used.

Authoritative usage counters for this new session are not exposed in the available tool results.
No metric probe was sent. Missing fields are not inferred from tool counts or context size.

| Metric | Value |
| --- | --- |
| Generation count | not obtained |
| Input | not obtained |
| Cache read | not obtained |
| Cache write | not obtained |
| Output including reasoning | not obtained |
| Total input | not obtained |
| Average context | not obtained |
| Maximum context | not obtained |
| Tool return bytes | not obtained |

Pause here. All local Stage 1 prerequisites pass for this exact candidate and baseline.
The planner must assign production acceptance after the approved backup and installation.

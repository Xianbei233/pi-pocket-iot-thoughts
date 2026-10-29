# Stage 1 preflight: BLOCKED

The immutable package passes the actual Pocket 0.19 runtime integration test.
The mandatory type-check gate fails. Do not proceed to production installation.
This report does not replace the historical Phase B report.

## Baselines and identities

- Pocket: 0.19.0, HEAD `eae8ccf6c615ea2188f9b88e9252455917b081d4`.
- Pocket dependencies: `@earendil-works/pi-durable` 1.3.0 and `@earendil-works/pi-ai` 1.3.0.
- Plugin branch: `pocket-adapter`.
- Plugin HEAD: `c570eb35a1a0a0c157762fd9f319948e6dca66f4`.
- Node: 26.10.0. npm: 11.19.1.
- Candidate: `dist/pi-pocket-iot-thoughts-0.1.0.tgz`, 22497 bytes, exactly 9 regular files.
- Candidate SHA-256: `81d214458a2661ac541e74ef97752c2571715bc503caa74c7b8aa609f11b3689`.
- Source SHA-256: `4b6673a00ad9b1c79f265f4565c8bed6e11cdb23996f896b687cfe774c1d8fdd`.
- Manifest SHA-256: `4618d4156542f1fadb0e37f8bba9c8a7a851778ce35f0257058b4516dec097de`.
- All 8 manifest payload digests pass. All archive files equal the working files.
- The isolated pack-script output has the same candidate size and SHA-256.
- The installed integration tarball is byte-identical to the candidate.

## Gates

| Gate | OS bound | Exit | Result |
| --- | --- | --- | --- |
| Core, regression, factory tests | 45 seconds | 0 | 35 pass |
| Actual loader and native faux integration | 120 seconds | 0 | 1 pass |
| Packaging tests, including actual isolated pack script | 45 seconds | 0 | 9 pass |
| `npm run check` | 45 seconds | 2 | FAIL |
| `npm run lint` | 45 seconds | 0 | PASS |
| `npm run format:check` | 45 seconds | 0 | PASS |
| Exact archive and digest audit | 20 seconds | 0 | PASS |
| Full `npm test` gate | planned 180 seconds | not run | Stopped after the mandatory failure |

The gates were admitted in one parallel batch. No additional test gate ran after the failure was reviewed.
Each gate has its full `<gate>.log` and `<gate>.exit` in this folder.
The 6 command gates also have `<gate>.receipt` with timestamps, commands, bounds, and exit codes.
The audit has `audit.log` and `audit.exit`.
The pack script has `packaging/pack-valid.log` and `packaging/pack-valid.exit`.
Negative packaging-case script exits are expected nonzero values. Their parent assertions pass.

## Blocking defect

`npm run check` reports these errors against the current dependencies:

- `iot-thoughts.ts(736,9)`: TS2322. The tool returns `Promise<{ content: ... }>`, which is not assignable to `Promise<ToolExecutionResult<JsonValue>>`.
- `test/factory.test.ts(61,32)`, `(62,25)`, and `(81,36)`: TS2339. `content` does not exist on `ToolExecutionResult<JsonValue>`.
- `test/factory.test.ts(63,18)` and `(64,15)`: TS7006. `part` implicitly has type `any`.

The source contract error is not only a test-harness error. The planner must decide the next authorized scope.
No source, type bridge, tests, or assertions were changed. No repair or retry loop was attempted.

## Actual runtime evidence

The test imports the actual Pocket `test/helpers.ts` first.
The helpers isolate agent, home, work, and data before the application import.
The integration uses native `faux/faux-1`, not a paid provider.

The real loader accepts this `pocketApi = 1` drop-in and converts the legacy result contract.
Synthetic natural-language notes produce a successful backend `toolResult`.
The test checks grounded source offsets and preserved negative, pending, numeric, and decision text.
Ordinary and large-result cases use exactly 2 faux calls per turn, with no auxiliary compression request.
There are 23 faux requests in the complete integration lifecycle and 0 paid requests.

The integration passes initial-off, enable, reload, isolated application restart, disable, removal, and restart-after-removal checks.
Native tool definitions and the system body stay unchanged. A native read of a synthetic file passes.
Concurrent sessions stay isolated. Malformed arguments fail. Hostile closing tags are defanged.
CJK and escaped-control results exceed 50 KiB and stay complete.

See `integration/integration-summary.json`, `integration/integration-dist-equivalence.json`, and `integration/integration-request-summary.json`.
These runtime passes do not make the failed static gate pass.

## Preservation and limits

Only new files under `evidence/deploy-019/preflight/` were written in the project.
The 2 existing untracked `.tmp` files retain SHA-256 `b27fb3444cbaf19c483b796ae853cf0466616abcd20724c11797ff867904b4ca`.
Tracked files remain unchanged. Old evidence remains unchanged.
No production extension, configuration, session database, or server process was changed.
No shared browser, real session fixture, credentials, real MCP, hardware, paid provider probe, remote push, or global configuration change was used.
A test application restart is not a production restart.
Stage 2 and final production acceptance have not started.

## Session role and usage

Requested role/model/thinking: test / `hww/gpt-6.1-sol` / `high`.
Actual runtime provider/model/thinking metadata: not obtained.
No explicit clamp, model mismatch, or provider failure was reported by the available tools.
No model was changed, and no fallback was used.

The available tool responses do not expose authoritative generation or usage counters for this new session.
No metric probe was sent.

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

Pause here. Production installation must wait for the planner's decision and all required prerequisites.

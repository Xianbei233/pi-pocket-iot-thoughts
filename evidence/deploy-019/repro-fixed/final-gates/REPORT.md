# Final negation-repair preflight: BLOCKED

The exact 8-category acceptance now passes in 2 real-loader invocations.
The mandatory type-check gate did not complete within its OS bound.
Do not proceed to production on this report.

## Gate results

| Gate | OS bound | Exit | Result |
| --- | --- | --- | --- |
| npm test | 180 seconds | 0 | 56/56 pass; 0 skipped |
| npm run check | 45 seconds | 124 | TIMEOUT; no TypeScript diagnostic captured |
| npm run lint | 45 seconds | 0 | PASS |
| npm run format:check | 45 seconds | 0 | PASS |
| Targeted core/regression/factory | 45 seconds | 0 | 46/46 pass |
| Targeted real-loader lifecycle integration | 120 seconds | 0 | 1/1 pass |
| Targeted packaging and actual isolated pack smoke | 45 seconds | 0 | 9/9 pass |
| Exact real-loader request, 2 invocations | 120 seconds | 0 | Both strict predicates PASS |
| Exact archive, manifest, preservation, and diff audit | 45 seconds | 0 | PASS |

The independent gates ran in one parallel batch. The tester stopped after reviewing the timeout.
No repair, type-check retry, bound increase, or extra full-suite run was attempted.
The timeout is not proof of a TypeScript error. It is also not a passing check.
Concurrent execution may have affected runtime, but the cause is not established.
The planner must authorize any follow-up verification explicitly.

Each gate has its complete `<gate>.log`, `<gate>.exit`, and `<gate>.receipt` in this folder.
The receipts contain the command, timestamps, OS bound, and exit.
The check started at 2026-10-23T16:19:46+08:00 and ended at 16:20:32 with exit 124.
The log contains the tsc command but no diagnostic before termination.

## Candidate and fixed-diff identity

- Pocket 0.19.0 HEAD: `eae8ccf6c615ea2188f9b88e9252455917b081d4`.
- Actual pi-ai and pi-durable baseline: 1.3.0.
- Candidate: `dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz`.
- Candidate SHA-256: `31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e`.
- Size: 22672 bytes; exactly 9 regular files.
- Source SHA-256: `cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4`.
- Manifest SHA-256: `1525899983a0c210f421e4e81ea1a9b06e268cb85afbba816c1465f7edca0fca`.
- Git source-diff SHA-256: `3bf1291888b16872f38dc500000ef17b19e5b63b912fdcd25fa4f9d200f1e523`.

The audit confirms that only the narrow negation change and its comment differ from the prior adapted source.
Selection, budgets, configuration, and input processing are otherwise byte-identical.
All 8 manifest payload digests pass. Archive bytes equal working files.
The installed lifecycle-test tarball is byte-identical to this candidate.
The actual isolated pack script produces the same size and candidate SHA-256.
See `audit.log`, `source-diff.txt`, `test/integration-dist-equivalence.json`, and `test/pack-valid.log`.

## Tests and preservation

The suite retains the original 45 cases and adds 11 regressions, for 56 total.
The added cases cover:

- The exact production request with default configuration and full profile.
- 1 each of all 8 tags, grounded ranges, emoji, false verified, and strict shortening.
- True 无备份, 无权限, 无法, and 无批准 under a one-node budget.
- Kept fallback when true critical nodes exceed that budget.
- 无害 with a separate 不 negation or a separate 无 negation in the same sentence.

The original regression body is byte-identical after excluding the new imports and appended cases.
Other original test files remain unchanged except the already approved 3 factory result-key accesses.
No new test uses an any cast or a result cast to hide a mismatch.
The earlier single-file format gate exited 0.
The earlier preservation-helper script had a quoting SyntaxError; the final independent audit replaces that failed evidence check and passes.
No plugin or test was changed to repair that helper error.
Old candidate packages, failed Stage R evidence, and both original .tmp files remain preserved.

## Exact real-loader reproduction

The harness imports the actual Pocket helpers first and installs the approved candidate in isolated data.
It requires `IOT_TEST_DIST_PACKAGE` and verifies the new candidate and source hashes.
It does not validate the prior candidate by mistake.
It reads the captured request bytes and copies them unchanged before invocation.
The original acceptance helper is copied byte-for-byte; none of its 7 conditions changed.

Request identity:

- Exactly 684 UTF-16 units.
- UTF-8 SHA-256: `eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e`.
- Exact full profile, defaults, CRLF prefix, emoji, and 22 background repetitions.
- No plugin environment configuration is present or mutated.

| Check | Run 1 | Run 2 |
| --- | --- | --- |
| Tool-level error | false | false |
| Status compacted | PASS | PASS |
| Exactly 8 nodes | PASS | PASS |
| All 8 tags | PASS | PASS |
| All source slices grounded | PASS | PASS |
| Emoji-bearing node | PASS | PASS |
| Verified false | PASS | PASS |
| Strictly shorter | PASS | PASS |
| Exactly 1 of each expected tag | PASS | PASS |
| Integer, in-bounds UTF-16 ranges | PASS | PASS |
| Faux requests | 2 | 2 |

Both texts are byte-identical: 2296 UTF-8 bytes.
Their SHA-256 is `e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2`.
The rendered text is 233 UTF-16 units, below the trimmed source length of 683.
The raw backend result, verbatim text, parsed payload, and every individual check were saved before acceptance evaluation.
See `run-1/`, `run-2/`, `acceptance-summary.json`, `request.json`, and `run-receipt.json`.
The exact-request acceptance exit is 0.

## Lifecycle and production limits

The actual helper-first native-faux lifecycle integration passes initial-off, enable, reload, isolated restart, disable, removal, and restart after removal.
Native tool definitions, system body, and native synthetic-file read remain correct.
Concurrent-session isolation and complete large tool results also pass.
No real provider was called.

This stage did not use a browser or mutate production, other plugins, models, Guard, or configuration.
It did not restart production, push, commit, inspect sessionDB, use real hardware/MCP, or send a paid probe.
The current production module inventory is intentionally not hardcoded by this local gate.
The planner must capture a fresh baseline for any later authorized deployment.
No later production invocation is authorized by this blocked report.

## Role and usage

Requested role/model/thinking: test / `hww/gpt-6.1-sol` / `high`.
Actual runtime metadata: not obtained. No explicit clamp, mismatch, or provider failure was reported.
No settings change or fallback occurred.
Generation, input, cacheRead, cacheWrite, outputIncludingReasoning, totalInput, average/maximum context, and tool return bytes: not obtained.
No usage probe was sent.

Stop here. The only open prerequisite is a successfully completed mandatory type-check gate.

## Authorized same-bound type-check recheck — final disposition PASS

The planner authorized exactly 1 same-command timeout-diagnosis recheck.
The tester ran `npm run check` alone with the same 45-second OS bound.
It exited 0. No business, test, package, configuration, or bound change occurred.
The source, manifest, package metadata, all 5 test files, and candidate hashes are identical before and after the command.
The hash-comparison exit is 0.

Truthful gate history: **first check timeout 124; isolated same-bound recheck 0**.
The original `check.log`, `check.exit`, and `check.receipt` remain unchanged.
The recheck evidence is:

- `check-recheck.log`.
- `check-recheck.exit`.
- `check-recheck.receipt`.
- `check-recheck.before.sha256` and `check-recheck.after.sha256`.

No already-green test, integration, package, lint, or format gate was rerun.
The earlier timeout cause remains unconfirmed. The successful isolated recheck does not erase it.

### Latest consolidated result

All final local prerequisites now pass for candidate SHA-256:
`31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e`.

- Full suite: 56/56 pass, consisting of 45 original cases and 11 new regressions.
- Check: first timeout 124, then authorized isolated same-bound recheck 0.
- Lint, format, targeted unit, real-loader lifecycle, packaging, and exact archive/manifest audit: exit 0.
- Exact original 684-UTF-16 request: 2 byte-identical strict passes through the installed real-loader tool.
- All 7 original predicate conditions pass, with 1 of each category and grounded emoji-bearing source offsets.
- The original request and predicate bytes remain unchanged.

Complete raw durable result paths:

- `run-1/raw-tool-return.json` and `run-1/raw-tool-text.txt`.
- `run-2/raw-tool-return.json` and `run-2/raw-tool-text.txt`.
- Each run also has `parsed.json` and `per-condition.json`.
- `request.json`, `acceptance-summary.json`, and `run-receipt.json` retain the exact request and aggregate proof.

This is a local preflight PASS, not production acceptance.
Production remains unchanged. No browser, real provider, or usage probe was used.
Actual model metadata and all requested usage metrics remain not obtained.
Pause for the planner's authorized live installation and production invocation assignment.

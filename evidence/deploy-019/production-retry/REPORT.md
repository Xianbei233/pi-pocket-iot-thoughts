# Final production test cycle: PASS; currently UNINSTALLED

The authorized production test cycle passes.
The Owner required official disable and planned uninstall after the successful test.
The plugin is now absent and disabled. It does not remain active in production.
This is successful planned cleanup, not failure rollback.

## Exact artifact and baseline

- Pocket: 0.19.0 at `eae8ccf6c615ea2188f9b88e9252455917b081d4`.
- pi-ai and pi-durable: 1.3.0 each.
- Final package: `dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz`, 22672 bytes, 9 regular files.
- Package SHA-256: `31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e`.
- Source SHA-256: `cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4`.
- Manifest SHA-256: `1525899983a0c210f421e4e81ea1a9b06e268cb85afbba816c1465f7edca0fca`.
- The working tree remains uncommitted from base `c570eb35a1a0a0c157762fd9f319948e6dca66f4`.
- That base commit does not identify the final source. Use the source and package hashes above.

## Local prerequisites and truthful history

The final suite passes 56/56 cases: all 45 original cases plus 11 regressions.
Lint, format, targeted unit, actual loader lifecycle, packaging smoke, and exact manifest/archive gates exit 0.
The first check gate times out with exit 124 at its 45-second OS bound, without a TypeScript diagnostic.
The planner authorizes 1 isolated same-command recheck at the same 45-second bound. It exits 0.
Source, test, and package hashes remain unchanged across that recheck.
No failed receipt is overwritten and no assertion is weakened.

The exact 684-UTF-16 request passes all original conditions in 2 isolated installed-tool calls.
Their full raw texts are byte-identical to this production result.
See `evidence/deploy-019/repro-fixed/final-gates/REPORT.md` and its durable raw directories.

The earlier API adaptation changes the result key from content to output and declares pocketApi 2.
The later localized repair excludes the 无 inside exact 无害 from the bare-negation rule.
Other negations in the same sentence remain critical. Selection, limits, and configuration stay unchanged.
All earlier failed production evidence, failed exact reproduction, diagnosis, old packages, and the 2 original .tmp files remain preserved.
The earlier production raw payload was not captured; this new successful result does not rewrite that history.

## Independent actual production tool acceptance

The tester invokes `tools.iot_thoughts_compact` exactly 1 time through codemode.
The execution timestamp is 2026-10-23T08:29:19.769Z.
The tester uses the exact captured parameters with profile full and the unchanged 684-UTF-16 input.
The full request, original predicate, and expected tags are saved before invocation.
The entire raw return is durably written immediately after the tool returns, before parsing or acceptance evaluation.
The tool call succeeds and all acceptance checks pass. No exception or evidence-write failure occurs.

| Original condition | Result |
| --- | --- |
| status compacted | true |
| exactly 8 nodes | true |
| all 8 tags | true |
| all source slices grounded | true |
| emoji-bearing node | true |
| verified false | true |
| strictly shorter than trimmed source | true |

Each expected category occurs exactly 1 time.
Every range uses integer, in-bounds UTF-16 offsets.
Input length is 684; trimmed input length is 683; rendered output length is 233.

| Tag | UTF-16 start | UTF-16 end | Exact source slice | Emoji |
| --- | ---: | ---: | --- | --- |
| support | 3 | 23 | matches | yes |
| oppose | 28 | 45 | matches | no |
| tradeoff | 50 | 68 | matches | no |
| open | 73 | 90 | matches | no |
| plan | 95 | 112 | matches | no |
| decision | 117 | 133 | matches | no |
| risk | 138 | 155 | matches | no |
| neutral | 160 | 176 | matches | no |

Request UTF-8 SHA-256:
`eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e`.
Raw return length: 2296 UTF-8 bytes.
Raw SHA-256:
`e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2`.
This equals the raw text hash from both isolated exact-input runs.

Own durable evidence in this folder:

- `request.json`, `original-acceptance-logic.js`, and `expected-tags.json`.
- `invocation-before.json` and `runtime-tool-shape.json`.
- `raw-tool-return.txt`, `raw-tool-return.json`, and `raw-tool-text.txt`.
- `raw-saved-receipt.json`, `parsed.json`, and `per-condition.json`.
- `hashes.json`, `receipt.json`, and `acceptance.exit` (0).

The production call is not a paid-model probe. No auxiliary provider probe, fixture retry, or second live call occurs.
Faux request counts from local tests are not agent usage metrics.

## Planner-supplied official API and UI evidence

These browser and API observations come from the planner, not independent tester UI checks.
The tester does not use its separate blank browser instance.
See `planner-ui-and-lifecycle.json`.

- Pre-install baseline: 27 modules, 25 enabled, 0 errors, IoT absent.
- Enable at 2026-10-23T08:27:44.959Z: HTTP 200, 28 modules, 26 enabled, 0 errors, IoT enabled, exposed tool present.
- No other module changes are reported.

| Enabled homepage check | Desktop | Mobile |
| --- | --- | --- |
| Timestamp | 2026-10-23T08:28:59.340Z | 2026-10-23T08:29:36.519Z |
| Viewport | 1280x800 | 390x844 |
| scrollWidth / clientWidth | 1280 / 1280 | 390 / 390 |
| Horizontal overflow | false | false |
| GET extensions | HTTP 200 | HTTP 200 |
| Modules / enabled / errors | 28 / 26 / 0 | 28 / 26 / 0 |
| IoT enabled / error | true / null | true / null |
| Window errors / rejections | [] / [] | [] / [] |
| Console | empty | empty |

The planner checks the authenticated production homepage while the plugin is enabled.
Node-output UI is not independently rendered or verified.
The actual tool call and its backend result provide separate evidence.
Screenshots are observed in the planner browser tool. No filesystem PNG path is returned and no archived PNG is claimed.

## Official disable and successful planned uninstall

The planner officially disables IoT at 2026-10-23T08:31:00.310Z with HTTP 200.
The list before uninstall has 28 modules, 25 enabled, 0 errors, IoT false, and extensions [].
No other module changes are reported.

The tester independently reads the safe planned-uninstall receipt and uninstall log.
The known regular file has inode 5549717 and the approved final source hash.
The precheck succeeds, unlink exits 0, and the target is absent.
The inventory comparison exits 0. All other extension files are identical, with no additions or removals.
The uninstall receipt timestamp is 2026-10-23T08:31:31.986Z.

The planner supplies the final authenticated GET at 2026-10-23T08:32:33.509Z:

- HTTP 200; Pocket 0.19.0.
- 27 modules, 25 enabled, 0 errors.
- IoT absent.
- changedExistingModules [] and addedModules [].
- Guard unchanged.

The live configuration SHA-256 equals the new backup:
`cdd86518e826573d18be37fca93f09a050f5ca31bcc4752a5ecb090449090c48`.
The configuration is not directly overwritten. No new configuration residue remains.
Any pre-existing disabled marker is unchanged from that backup.
The restricted backup remains at `/home/xianbei233/Work/pi-pocket-iot-thoughts-deploy-private-20261023-162653`.
Its directory mode is 0700 and its configuration backup mode is 0600.
The tester does not read the configuration backup contents.

## Limits, role, and usage

No production restart, push, commit, core change, other-plugin mutation, Guard change, or model change occurs in this test cycle.
No real MCP, hardware, sessionDB recovery, or broad history access is used.
The final state is not a sustained deployment: IoT is UNINSTALLED and disabled as the Owner requested.
Business working-tree changes remain uncommitted. No implicit commit is authorized.

Requested tester model/thinking: `hww/gpt-6.1-sol` / `high`.
Actual runtime metadata is not obtained. No explicit clamp, mismatch, provider failure, or fallback is reported.
Per-role planner/developer/tester generation, input, cacheRead, cacheWrite, output including reasoning, total input, average/maximum context, and tool return bytes are not exposed and not obtained.
See `usage.json`. No metric probe is sent.

All requested evidence is durable. Freeze all work here. Do not invoke, enable, repair, rerun, commit, push, or restart.

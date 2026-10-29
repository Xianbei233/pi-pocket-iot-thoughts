# Pocket 0.20 final result: DEPLOYED, INSTALLED, ENABLED

The authorized deployment and production acceptance pass.
The final Owner instruction requires IoT to remain installed and enabled for normal use.
Earlier 0.19 cleanup instructions are replaced. No disable or uninstall follows this PASS.

## Baseline and immutable artifact

- Pocket 0.20.0 at `d1b97e1d995742dae90b20bcd1ce9545fdfc58c5`.
- Extension API 2; actual pi-ai and pi-durable 1.3.0.
- The planner confirms the production checkout remains clean after acceptance.
- Fresh pre-IoT production baseline: 28 modules, 25 enabled, 0 errors.
- Final candidate: `dist/deploy-019-negation/pi-pocket-iot-thoughts-0.1.0.tgz`.
- Package SHA-256: `31237760ab17934878dc21c338fe4a417541e0eefdaedcc25270cb1a5af3464e`.
- Package size: 22672 bytes, exactly 9 regular payload files.
- Source SHA-256: `cc254c7925958797c25961bfeceb857b13d958d00cb00bd23f4b489ac0a67ed4`.
- Manifest SHA-256: `1525899983a0c210f421e4e81ea1a9b06e268cb85afbba816c1465f7edca0fca`.
- Plugin branch: `pocket-adapter`; base commit `c570eb35a1a0a0c157762fd9f319948e6dca66f4` plus preserved uncommitted repairs.
- That base commit does not identify the current working source. Use the actual source and package hashes above.

The package is unchanged from the approved localized API-result and 无害-negation repairs.
The historical manifest verifiedWith record stays truthful. New 0.20 validation is external evidence.
No source, test, manifest, or package edit was needed for 0.20.

## Independent 0.20 preflight

This session independently runs the actual current helper-first isolated Pocket application with native faux.
The full suite passes 56/56 cases: 45 original cases plus 11 regressions, with no skipped cases.
All required gates exit 0:

- Full npm test, 180-second OS bound.
- Type-check, run alone, first attempt, 45-second bound.
- Lint and format checks.
- Targeted core/regression/factory tests, 46 cases, 45-second bound.
- Current real-loader lifecycle integration, 120-second bound.
- Packaging tests and actual isolated pack smoke.
- Exact 9-regular-file payload and all 8 manifest digests.
- Before/after working-file, dictionary-hash, and checkout preservation audit.
- Exact original request through the installed candidate twice, with byte-identical strict passes.

The current 0.20 check passes on its first attempt. The old 0.19 timeout is historical, not a current failure.
All old failure, diagnosis, recheck, raw-output, and package evidence remains preserved.
No original assertion was weakened. No test or business file changed in this 0.20 deployment task.

The lifecycle installation tarball is byte-identical to the candidate.
The actual isolated pack script produces the same candidate hash, size, and file count.
Temporary lifecycle enable/reload/restart/disable/removal checks affect only isolated data.
They do not disable or remove the final production installation.

Full logs, bounds, exits, exact-request raw results, and preservation evidence are in:
`evidence/deploy-020/preflight/REPORT.md` and its referenced files.

## Independent ONE actual production call

This session invokes `tools.iot_thoughts_compact` exactly 1 time through the enabled production runtime.
No factory import, mock, extra model call, or changed fixture substitutes for that call.
The full exact request and predicate are saved before invocation.
The complete raw return is durably written immediately after the call, before parsing or checking.
The call succeeds. All acceptance and durable-write checks pass.

The exact input remains 684 UTF-16 units with full profile, defaults, CRLF prefix, emoji, and 22 background repetitions.
Request UTF-8 SHA-256:
`eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e`.
Rendered output is 233 UTF-16 units, below trimmed input length 683.

| Original condition | Result |
| --- | --- |
| status compacted | true |
| exactly 8 nodes | true |
| all 8 expected tags | true |
| every source slice grounded | true |
| emoji-bearing node | true |
| verified false | true |
| strictly shorter | true |

Each expected tag occurs exactly 1 time. Every range is integer and in bounds.

| Tag | UTF-16 start | UTF-16 end | Grounded | Emoji |
| --- | ---: | ---: | --- | --- |
| support | 3 | 23 | yes | yes |
| oppose | 28 | 45 | yes | no |
| tradeoff | 50 | 68 | yes | no |
| open | 73 | 90 | yes | no |
| plan | 95 | 112 | yes | no |
| decision | 117 | 133 | yes | no |
| risk | 138 | 155 | yes | no |
| neutral | 160 | 176 | yes | no |

Raw return: 2296 UTF-8 bytes, SHA-256:
`e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2`.
It exactly matches both isolated 0.20 strict-request outputs and the expected repaired output.
No tool exception, evidence-write failure, second fixture, or retry occurs.

Own durable production evidence in this folder:

- `request.json`, `original-acceptance-logic.js`, `expected-tags.json`.
- `invocation-before.json` and `runtime-tool-shape.json`.
- `raw-tool-return.txt`, `raw-tool-return.json`, and `raw-tool-text.txt`.
- `raw-saved-receipt.json`, `parsed.json`, and `per-condition.json`.
- `hashes.json`, `receipt.json`, and `acceptance.exit` (0).

## Planner-supplied official lifecycle and essential UI

These API, browser, installed-filesystem, and dictionary-count observations are supplied by the planner.
They are not independent tester browser observations. This session does not use its separate browser.
See `planner-final-state.json`.

- Official enable: HTTP 200 at 2026-10-23T12:02:35.067Z.
- Official reload: HTTP 200 at 2026-10-23T12:02:35.110Z.
- Both show 29 modules, 26 enabled, 0 errors, and changedOtherModules [].
- IoT is enabled and registers read-only tool `iot_thoughts_compact`.

Essential authenticated homepage check at 2026-10-23T12:03:28.921Z:

- Owner; HTTP 200; running Pocket 0.20.0.
- Title Pi Pocket; 98 controls; body accessible.
- Window error and rejection arrays empty; console empty after login.
- Earlier pre-login 401 entries are cleared and are not acceptance errors.
- No screenshot matrix was requested or run. No archived screenshot paths are claimed.
- No independent node-output UI rendering is claimed; the actual backend call is separate proof.

Final post-acceptance authenticated GET at 2026-10-23T12:05:24.607Z:

- HTTP 200; Owner; running Pocket 0.20.0.
- 29 modules, 26 enabled, 0 errors.
- IoT enabled; registered read-only `iot_thoughts_compact` present.
- changedExistingModules [] and addedModules [iot-thoughts.ts].
- Guard unchanged.
- Essential homepage remains accessible with 98 controls and no error/rejection or console entries.

The planner confirms the installed source is a regular file of 29502 bytes at the approved source hash.
Its installation inode is 5697273. Its bytes equal the working source.

## Dictionary, backup, and other-state preservation

The tester independently verifies only the dictionary hash before and after local preflight.
The tester does not import, execute, overwrite, or edit the dictionary.
The planner supplies its AST and authenticated-locale verification:

- Dictionary enabled, version 0.8.0, locale zh-CN.
- 1475 strings and 295 templates.
- Size 129367 bytes.
- SHA-256 unchanged: `15a0ceb363d92c7d0fc2b75c89a13f88e101285aa417db85039857aeda8e965e`.

Fresh restricted backup:
`/home/xianbei233/Work/pi-pocket-iot-thoughts-deploy-private-020-20261023-200120`.
Directory mode 0700; configuration snapshot mode 0600; snapshots remain preserved.
Configuration snapshot SHA-256:
`1506edf243921d0e28ba109b43b823500f1b078a7b36b6e6e8c494f30ab1d0fd`.
Extensions snapshot SHA-256:
`ee4347844abaf779d5db4124bf9e9203072349554ce3e485ceacfe2c6a90fa5c`.
The tester does not read configuration snapshot contents.

All plugin uncommitted changes, old evidence, old packages, and both original .tmp files remain preserved.
No existing module, dictionary, core, Guard, or model setting is changed by this deployment.
No production restart, remote push, merge, commit, hardware/MCP use, liveDB access, or paid-provider probe occurs.
Only the authorized IoT installation and official enable/reload change production state.
No post-PASS cleanup is performed or authorized.

## Role, usage, and final boundary

Requested tester model/thinking: `hww/gpt-6.1-sol` / `high`.
Actual runtime model/thinking metadata: not obtained.
No explicit clamp, mismatch, provider failure, settings change, or fallback is reported.
Actual planner/developer/tester generation, input, cacheRead, cacheWrite, output including reasoning, total input, average/maximum context, and tool return bytes are not exposed and not obtained.
See `usage.json`. Tool counts and faux calls are not substituted for usage. No usage probe is sent.

Final status: **DEPLOYED, INSTALLED, ENABLED for normal use**.
Scope is complete. Freeze this agent's work after this report.
Do not repeat calls, retest, clean up, disable, uninstall, edit business files, commit, push, merge, or restart.
PiP uses the main planner's final report to release LayerFS session 86677. This tester does not release that session.

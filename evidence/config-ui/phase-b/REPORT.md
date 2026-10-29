# Configuration UI Phase B: BLOCKED by 3 preserved test-contract conflicts

The single repair batch resolves all 4 consolidated Phase A findings in independent verification.
The real desktop/mobile settings workflow now works. Cross-factory single-winner and zero-getter-execution assertions pass.
The full suite is not green: 99 cases, 96 pass, 3 fail, 0 skipped.
The 3 failures are preserved Phase A expectations that conflict with the approved fresh-file/closed-module contract.
No assertion is removed or weakened. No business or client change is made by the tester.
The planner must resolve these precise test-observation contracts before deployment. This is not an overall PASS.

## Exact candidate

- Pocket 0.20.0 at d1b97e1d995742dae90b20bcd1ce9545fdfc58c5; SDK 1.3.0; API 2.
- Candidate: dist/config-ui-0.2.0-fixed/pi-pocket-iot-thoughts-0.2.0.tgz.
- SHA-256: 0f8cee40144ac4f315b7390424981d2b8510cdb345210af361d39753146f1ce4.
- 35548 bytes; exactly 11 regular files; all 10 manifest payload digests pass.
- Source: 14cdef54b0f0584199e0005a4dceb48af9b727eb7077ec56f71ea19a6f996287.
- JS: 4770e0dc86635ff9b31dbef796a1648f5acf5e33da9aac1873ecf6e754f66bf7.
- CSS: 0094a93f2beda4f95e4510791a4677183333b432881faecbee1510ddd045f7ff.
- Manifest: 49ea87dddf3963946f7c51e899de6023c62e7827d87e97eea814b885c340f7d5.

The exact package supplies the installed server and both browser files. No client stub or project-only substitute is used.
The isolated pack smoke reproduces this exact candidate hash and size.
core.test.ts and regressions.test.ts retain their baseline bytes. The original 56 cases remain in the suite.
The full total is 56 original plus 43 configuration/package additions = 99.
All Phase A failure assertions remain present, including single-winner/409 and getter rejection/zero execution/no write.

## Gate results

| Gate | Bound | Exit | Result |
| --- | --- | --- | --- |
| npm run check, alone | 45s | 0 | PASS |
| npm test | 180s | 1 | 99 cases; 96 pass; 3 fail |
| npm run lint | 45s | 0 | PASS |
| npm run format:check | 45s | 0 | PASS |
| Targeted settings/cross-version/lock | 45s | 1 | Same 3 preserved failures |
| Actual Pocket HTTP/native-faux config workflow | 120s | 0 | PASS |
| Exact installed-tool request twice | 120s | 0 | Both strict passes |
| Exact 11-file and manifest audit | 45s | 0 | PASS |

The full suite runs once. No repeated full-suite or repair loop follows the 3 failures.
Each gate has full log, exit, command, timestamps, and OS-bound receipt in this folder.
No timeout occurs in this Phase B. The earlier Phase A failures remain unchanged in phase-a/.

## The 3 remaining failures, classified from evidence

### 1. External valid disk update versus stale-memory expectation

Test: test/config-settings.test.ts:251; failing assertion at 269.
The test writes an external valid config with maxNodes 5, then submits a stale revision for maxNodes 4.
The save correctly returns 409 and preserves the external file.
The test then expects GET effective settings to stay at the old default maxNodes 8.
The repaired GET correctly refreshes from the valid own file and returns 5.
This is exactly what the separately authorized stale-factory GET/next-tool refresh regression requires.
Both expectations cannot hold for the same GET contract.
No lost-update or stale-save success remains. The file stays at 5.

### 2. Calling GET on a disposed module

Test: test/config-settings.test.ts:359; failing observation at 386.
The test first verifies aborted and disposed saves reject and the valid file bytes remain unchanged.
It then calls GET through the disposed old factory to inspect the former snapshot.
The repaired lifecycle rejects that GET with 408 cancelled.
The official loader removes disposed routes; normal clients cannot use that old handler afterward.
A new factory on the same valid data reads the preserved maxNodes 5 in the independent contract diagnosis.
This failure is an observation through an ended capability, not evidence of a committed failed save.

### 3. GET while the config pathname is deliberately an unsafe directory

Test: test/config-settings.test.ts:439; failing observation at 456.
The test replaces config.json with a directory that contains the original bytes as a sentinel.
The save rejects safely. The subsequent GET tries to inspect memory through the now-invalid disk pathname.
Fresh-file validation rejects it with 500 config-operation-failed rather than returning a stale valid view.
The sentinel bytes remain unchanged. After restoring the exact valid file, a fresh GET returns maxNodes 4.
This is consistent with fail-closed unsafe-file reads, but conflicts with the test's old GET-as-memory-probe assumption.

Evidence: test.log, settings.log, contract-diagnosis.json, contract-diagnosis.log, and contract-diagnosis.exit (0).
The diagnosis uses only temporary own files and direct handlers. It is supplementary, not a replacement test suite.
The tester does not silently reinterpret these failures as passes or edit those assertions.
Suggested planner decision: authorize precise test observation changes that retain all no-write/conflict/cancellation safety checks while observing valid fresh state through a live factory.
No additional business repair is demonstrated necessary by these 3 failures.

## Phase A repairs independently verified

- Real page rendering now succeeds at 1280x800 and 390x844 after normal visible home-entry clicks.
- Cross-factory same-revision concurrent saves yield exactly 1 fulfillment and 1 HTTP 409.
- The winner's file remains valid. GET/next-tool refresh tests pass across already-loaded factories.
- Top-level body getter test rejects with 400, executes zero getters, and leaves state/file unchanged.
- Help, bounds, units, validation, lock explanation, reset warning, and precedence have meaningful English text.
- A foreign config.lock yields bounded 409 and is not deleted.
- Disposal while waiting on a foreign lock aborts without commit or foreign-lock removal.
- Own directory is actually changed from 0755 to 0700 before a successful save; file mode is 0600.
- Owned lock/temp residue checks pass after successful and failed operations.

The existing safety tests for malformed env/config, nested getters, unknown fields, arrays, prototypes, bounds, symlink directory/file, hardlink, FIFO, oversized file, stale revision, and merged env cross-bounds pass.
No claim is made that normal extension filesystem IO is Guard-intercepted.

## Independent real UI workflow

Only the tester's synthetic isolated application/browser is used, at http://127.0.0.2:44935.
No production browser, login context, credential, sessionDB, service, or module is accessed.
The page is opened by clicking the visible IoT 配置 / IoT settings entry from each normal main screen.
No private page activation or render stub is used.

The exact 7 named setting controls render:

- enabled: public Switch.
- profile: compact/balanced/full selector.
- minChars, maxInputChars, maxNodes, maxOutputChars, timeoutMs: 5 integer inputs.

The planner clarified the earlier count of 8 controls was a wording error. No setting is added or removed to match that count.
The separate 8 extraction categories and 7 predicate conditions remain unchanged.

Observed workflow:

1. Desktop shows default values, field limits/help/units, hot-apply status, and the distinction between algorithm enable and Menu → Extensions module enable.
2. A real Switch click and Save stores enabled false. Authenticated own GET returns stored/effective false.
3. A normal native-faux tool turn returns kept/disabled with the full text unchanged.
4. Page reload and normal entry navigation preserve the saved false setting.
5. Invalid maxNodes 99 produces visible bilingual validation: Enter a whole number from 1 to 16.
6. A separate direct HTTP POST with maxNodes 99 returns 400 and leaves stored/effective values unchanged.
7. Reset opens explicit confirm/cancel controls. Cancel leaves false unchanged. Confirm restores defaults and shows truthful English status.
8. Mobile normal-home entry renders all 7 controls without horizontal page overflow.
9. Mobile Save stores compact/maxNodes 3. Readback shows those exact values.
10. The next actual native-faux tool turn returns compacted with profile compact and 3 nodes.
11. Mobile page reload preserves those settings. Isolated module reload also preserves them.
12. Reloading only the synthetic module with explicit env enabled false/profile balanced/maxNodes 2 shows disabled controls and both stored/effective values.
13. Reset restores saved defaults, while env still wins. The visible warning and GET show stored true/full/8 versus effective false/balanced/2.
14. The synthetic env is removed and the module reloaded. Original effective defaults are restored.
15. A simulated second-tab valid update makes a stale GUI save return 409. The visible bilingual error remains while the form refreshes to server values; no false save-success status occurs.
16. A final explicit reset restores original defaults. Final GET confirms true/full/400/24000/8/8000/1000.

Raw synthetic tool results are saved before result evaluation as ui/tool-disabled-desktop.json, ui/tool-mobile-compact.json, and ui/tool-restored-defaults.json.
The summaries show kept/disabled, compact/3 nodes, and restored full/default behavior, respectively.
Route readbacks, validation, reset, env-lock, conflict, and restore receipts are stored in ui/.
See ui/verified-ui-summary.json and ui-summary.log (exit 0).

Screenshots are observed in the browser tool for mobile settings and final desktop settings.
The tool returns no filesystem PNG path. No archived PNG is claimed.
Final current isolated console is empty. Expected intentional invalid-POST 400 and stale-POST 409 entries are kept distinct from unhandled errors.
Old connection-refused entries from the stopped Phase A origin are historical browser logs, not Phase B candidate failures.
The settings page remains within 1280 and 390 pixel page widths. Internal panel scrolling is not treated as failure.
Initial async UI actions that raced load/render were re-observed after controls existed; raw early observations remain preserved and are not presented as confirmed successes.

## Exact unchanged extraction proof

The captured request remains 684 UTF-16 units with profile full and default config.
Request SHA-256: eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e.
The original predicate helper remains unchanged.
Both installed-tool runs pass all 7 conditions, 1 each of all 8 categories, emoji preservation, and integer/in-bounds UTF-16 grounding.
Both raw texts are byte-identical: 2296 bytes; SHA-256 e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2.
Output remains 233 UTF-16 units from trimmed input 683.
Full request/raw/parsed/per-condition evidence is durable before checks in run-1/ and run-2/.

## Limits and stop boundary

This report cannot declare all gates green because the 3 preserved test-contract conflicts remain unresolved.
No test is skipped, removed, or weakened. All original Phase A assertions remain unchanged.
There is no second automatic business repair batch.
The planner must decide the narrow observation contract, then authorize any test-only adjustment/recheck.

Device-node tests, forced chmod failure under another OS identity, and a precisely injected filesystem exception after rename are not performed.
Lock-wait cancellation, normal 0700 enforcement, atomic-path rejection, foreign-lock preservation, and cross-version contention have direct evidence.
The isolated UI server receives SIGTERM after final settings restoration and capture; its own helper cleans temporary app data.
Production remains on the earlier enabled IoT version and is not changed by this phase.
LayerFS PID4071753, dictionary, Guard, models, services, core, production auth, and all old evidence/packages/two .tmp files are preserved.
No paid probe, hardware/MCP, push, merge, commit, production restart, enable, reload, or cleanup occurs.

Requested tester model/thinking: hww/gpt-6.1-sol / high. Actual runtime metadata: not obtained.
Generation/input/cacheRead/cacheWrite/outputIncludingReasoning/totalInput/average-max-context/tool-return-bytes: not obtained.
No metric probe is sent. Faux/tool counts are not substituted for agent usage.

Final disposition: business/UI Phase A repairs verified; overall Phase B BLOCKED pending explicit test-observation contract decision.
Stop and pause here.

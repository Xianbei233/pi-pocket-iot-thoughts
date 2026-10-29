# Configuration UI 0.2.0 Phase A: BLOCKED — consolidated findings

Do not deploy this candidate. There are 3 confirmed business/UI blockers.
The tester makes no business/client change and does not start an automatic repair loop.
Production 0.1.0, LayerFS, dictionary, Guard, services, models, and authentication remain untouched.

## Candidate

- Candidate: dist/config-ui-0.2.0/pi-pocket-iot-thoughts-0.2.0.tgz.
- SHA-256: db5d2685cb77b070add5351f721ed02c56bcfa7c476ad5b34d7021f965e3a6db.
- 33337 bytes; exactly 11 regular files; all 10 manifest payload digests pass.
- Source: f46361712783ba9274076ce858d608dcf3f4fed04712043ab93a04cbe2607713.
- Client JS: cea5a0752f5ffed55d72b02af75fc0b5bcd4b9c2ae0b36985ae071ce6facf9b2.
- CSS: 0094a93f2beda4f95e4510791a4677183333b432881faecbee1510ddd045f7ff.
- Manifest: 0cd324ef4d6de0560e1d58c679ec693abb035470e7b0154d2a3ced1174d0a219.
- Host: Pocket 0.20.0, d1b97e1d995742dae90b20bcd1ce9545fdfc58c5, SDK 1.3.0, API 2.

## Confirmed finding 1 — settings page fails after normal home navigation

Severity: blocker. Reproduced in the actual isolated authenticated Pocket browser with the exact package.
At 1280x800, the tester clicks the visible IoT 配置 / IoT settings rail button from the normal home screen.
At 390x844, the tester returns to the normal mobile home and clicks its visible IoT entry.
Both pages fail with: Failed to execute 'insertBefore' on 'Node': parameter 1 is not of type 'Node'.
Both render 0 numeric/select/switch controls. The console records the page TypeError at extension-ui.js:2259.
The entry is visible at both sizes, but the configuration workflow cannot render.
No private page activation or evaluate-based page opening substitutes for these clicks.

Evidence: ui-navigation-failure.json. Screenshots were observed in the tester browser tool at both sizes.
The tool returned viewport images without filesystem paths. No archived PNG path is invented.
The normal isolated server is http://127.0.0.2:32913 and uses synthetic temporary users/data only.
The desktop observation is at 2026-10-23T13:45:04.203Z; mobile is at 13:45:49.026Z.

Relevant candidate location: iot-thoughts/index.js SettingsPage, especially the html template near line 432.
The text there contains unescaped less-than signs in the precedence explanation.
That is a suspected template cause, not a separately proven root cause. The browser failure itself is confirmed.
The developer must fix the page without weakening the visible-entry or form-workflow acceptance.

Blocked by this finding: browser save, persistence, invalid-input display, reset cancel/confirm, env-lock display, Switch behavior, and visible English help.
Server-only passes do not replace these UI requirements.

## Confirmed finding 2 — concurrent factories both commit the same disk revision

Severity: high; lost update. This is not a single-factory queue test.
The test creates 2 separate module factories with the same temporary host.dataDir.
Both GET the same revision. They concurrently POST maxNodes 4 and 5 with that original revision.
Both requests succeed. The disk ends with 5, while factory A retains 4 and factory B retains 5 in hot memory.
The required result is 1 success and 1 HTTP 409, with no stale successful memory state.
This fails in the full suite and the independent targeted settings run.

Exact test: test/config-settings.test.ts, two factory versions sharing one directory cannot both commit the same revision.
Evidence: settings/cross-factory-revision.json and test/cross-factory-revision.json.
Implementation locations: writeStoredConfig at iot-thoughts.ts:531; revision check at 539; atomic rename at 563; per-factory enqueue at 1057.
The current revision check runs before temporary write/fsync, with no shared cross-version admission boundary.
Preserve the original single-winner and 409 assertions. A single-factory queue pass is not sufficient.

## Confirmed finding 3 — top-level request getter executes and commits settings

Severity: high against the explicit strict-object contract.
A synthetic plain body has revision plus an enumerable settings getter.
The getter returns a full valid configuration with maxNodes 4.
The route executes the getter 2 times and accepts/saves the request.
The required behavior is HTTP 400, zero getter execution, and no file/memory change.
HTTP JSON cannot carry a getter; this is the required direct route-handler hostile-object boundary test.
It is not a claim that remote JSON itself contains executable getters.

Exact test: top-level getters/prototypes, unknown body fields and oversized body reject without executing accessors.
Evidence: getter-observation.json; getter-observation.log/exit/receipt; settings.log and test.log.
Implementation location: requestBody at iot-thoughts.ts:1076, JSON.stringify(body) at 1082 before accessor-descriptor validation.
requestSettings validates nested settings separately, but this does not protect the top-level body getter.
Keep the test's reject/no-execution/no-write assertions unchanged.

## English fallback contract gap

The page currently has bilingual main labels but Chinese-only help, numeric/cross-field validation, and stored/effective lock explanations.
Examples are FIELDS hints and problems() near client line 91, numeric notes near 360, and precedence/reset explanations.
The shipped client text proves this content gap. The failed page prevents a visible-language workflow check.
Provide local English alongside all meaningful messages or a local language mode. Do not import private shared i18n.
This is not permission to change the production dictionary.

## Gate history and tester-owned harness corrections

The first type-check exits 2 because the tester initially missed awaits in 4 async factory call sites.
The tester adds those awaits only, preserving all original tool assertions.
The corrected type-check runs alone at the same 45-second bound and exits 0.
Original logs remain preserved as check.log and check-harness-corrected.log.

The initial expanded packaging cases use slash-containing evidence labels for client symlinks.
Their evidence writes fail with ENOENT, not because the candidate escapes rejection.
The tester sanitizes only the log label. The corrected packaging run passes all 12 cases.
No symlink, unknown-file, tamper, regular-file, hash, or exact-client assertion is weakened.

A candidate-audit shell helper initially has a quoting error. It is replaced with a test-owned Python file.
The corrected audit exits 0. No business/package change occurs for that correction.

| Gate | OS bound | Exit | Result |
| --- | --- | --- | --- |
| Initial full npm test | 180s | 1 | 94 cases, 90 pass, 4 fail |
| Initial check | 45s, alone | 2 | tester async-await harness errors |
| Corrected check | 45s, alone | 0 | PASS |
| Lint | 45s | 0 | PASS |
| Format check | 45s | 0 | PASS |
| Targeted settings | 45s | 1 | 2 confirmed business failures |
| Real Pocket HTTP/config/native-faux | 120s | 0 | PASS |
| Corrected original core/regression/factory | 45s | 0 | 46/46 pass |
| Corrected packaging | 45s | 0 | 12/12 pass |
| Exact installed-tool request | 120s | 0 | 2 strict byte-identical passes |
| Corrected exact candidate audit | 45s | 0 | PASS |

The 94-case suite consists of the original 56 cases plus 38 additions.
The full run has 2 business failures and 2 tester log-path failures. The latter are independently corrected and verified.
The tester does not rerun the entire suite to imply a green candidate while business failures remain.
There is no overall PASS. Original failed logs and all corrected receipts remain durable.

## Passing independent coverage

The actual helper-first Pocket application uses the candidate source and both browser files from its tarball.
Owner GET/save works. Guest, viewer, single-session guest, unauthenticated and missing-header requests reject without writes.
The owner-only browser client is absent from non-owner authenticated metadata and cannot be fetched by those users.
Actual native-faux turns show saved enabled false gives kept/disabled, then saved compact/maxNodes 3 changes the next tool call.
The HTTP test verifies module reload, isolated app restart, reset, and restoration of default effective settings.
There are no paid provider requests. Faux counts are not agent usage.

The existing 0.1 extraction tests, negative-semantics regressions, read-only/replay/schema assertions and UTF-16 behavior remain.
core.test.ts and regressions.test.ts are byte-identical to their configuration-task baseline copies.
Factory tests only await the public async setup and supply a temporary dataDir/public Web doubles.
The full real-loader lifecycle still passes initial-off, enable, reload, isolated restart, disable, removal, and removal restart.

The exact captured request remains 684 UTF-16 units with SHA-256 eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e.
The original 7-condition helper is unchanged. Both exact installed-tool calls pass all 7 conditions, one of each tag, and integer/in-bounds grounded emoji ranges.
Both raw text hashes remain e8592a9a8c028d413fb21c22528dddcd4a120090e2cce47ed11fb3ba2b7df3b2, 2296 bytes, output 233 UTF-16 units.
Full request/raw/parsed/check files are saved before acceptance in run-1/ and run-2/.

Missing config uses defaults without seeding. Normal save produces directory 0700 and file 0600.
Malformed env/config, directory/file symlinks, hardlink, FIFO and oversized file reject without changing the outside sentinel.
Explicit env keys override only those keys; reset keeps env; invalid merged cross-bounds reject before writing.
Single-factory stale/concurrent saves and a pre-existing external disk change correctly produce conflict.
Already-aborted and already-disposed saves preserve valid file/memory and leave no temp residue.
Replacing the target with a directory produces a safe failure preserving the hot snapshot and sentinel.

## Remaining unverified review cases

The swallowed chmod failure at source line 526 is a code-review concern, not a reproduced permissions failure.
Normal restrictive modes pass. Failure injection where chmod cannot enforce 0700 remains unverified.
Disposal after temporary write but before rename, external change specifically during fsync-to-rename, device-file creation, and post-rename failure injection are not independently exercised.
Do not claim these pass from single-factory or already-aborted cases.
See review-limits.json for the explicit coverage boundary.

## Files and stop boundary

Plan: evidence/config-ui/TESTPLAN.md.
Full gate logs and exit/bound receipts: this phase-a folder.
Browser failure: ui-navigation-failure.json.
HTTP proof: http/config-http-summary.json and full raw synthetic tool results.
Lost update: settings/cross-factory-revision.json.
Getter side effect: getter-observation.json.
Exact request: request.json, original-acceptance-logic.js, run-1/, run-2/, acceptance-summary.json.
Candidate audit: candidate-audit-helper-corrected.log.

Only test/** and new evidence/config-ui/** are changed by the tester.
No production API/browser/write/reload, credential/sessionDB access, service operation, hardware/MCP, model/Guard/core/dictionary change, push, or commit occurs.
The isolated synthetic UI server receives SIGTERM after evidence capture; the helper performs its own data cleanup.
No actual production authentication conclusion is drawn from this private browser.

Requested test role/model/thinking: hww/gpt-6.1-sol / high. Actual runtime metadata: not obtained.
Generation/input/cacheRead/cacheWrite/outputIncludingReasoning/totalInput/average-max-context/tool-return-bytes: not obtained.
No metric or paid-provider probe is sent. No fallback occurs.

Stop here. The planner must issue one consolidated business/client repair batch, then require original-assertion retest and complete visible UI acceptance.

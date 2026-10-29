# Production outcome: acceptance FAILED; rollback COMPLETE

## Separate results

The adapted local Pocket 0.19.0 preflight passes all 45 tests and all static/package gates.
See `evidence/deploy-019/adapted-preflight/REPORT.md`.
That result does not make production acceptance pass.

The planner reports that the actual production `iot_thoughts_compact` call succeeded at the tool level.
The compound script parsed its JSON, then failed a strict combined acceptance predicate.
The predicate checked compacted status, 8 nodes, all 8 tags, grounding, emoji, false verified, and shorter output.
The script printed no raw payload or individual check before it threw.
Its failed codemode store writes were not committed.
The individual failing condition and raw output are not captured.

A missing category is not confirmed. A product defect is not confirmed.
Earlier category-specific wording was an unverified inference and must not be used as a finding.
The exact UTF-16 grounding result is not obtained.
No different fixture or additional tool call was run by this tester.

The task describes a synthetic input with 8 Chinese tagged sentences, emoji, and CRLF.
The tags are support, oppose, tradeoff, open, plan, decision, risk, and neutral.
It also contains 22 identical background lines with the text 无害.
A selection, conservative-negation, or predicate interaction is possible but is not independently verified.
The cause remains unknown.

## Candidate and baseline

- Pocket: 0.19.0 at `eae8ccf6c615ea2188f9b88e9252455917b081d4`.
- Candidate: `dist/deploy-019/pi-pocket-iot-thoughts-0.1.0.tgz`.
- Package SHA-256: `f9e2351acca07ff5f43ff49f3502ef5ca03b34d4f2a4f7ef1a24994b581c6c8b`.
- Source SHA-256: `b4564f4ee0a7db8a753459b97cc277a3f85ac158ecfbc55c8171cb89e9f1fdaf`.
- Manifest SHA-256: `6d56a7dc9885fcea7fe6c7d489af51eb3dc0995c349a044a26796223a2254dda`.

## Independent receipt inspection

The tester read only the restricted deployment receipt, rollback receipt, and rollback log.
The tester did not read the configuration backup, snapshot contents, credentials, session database, or live conversation text.

The deployment receipt confirms that only the known source was installed.
Its installed source hash equals the approved source hash above.
The installed file had inode 5498864, size 29267 bytes, mode 0600, and link count 1.
The deployment inventory reports that other extension files remained unchanged.

The rollback receipt records official disable with HTTP 200 at 2026-10-23T07:47:50.557Z.
The rollback log verifies the installed inode and source hash before removal.
The removal exit code is 0, and the target file is absent.
The inventory comparison exit code is 0. Other extension files are unchanged, with no additions or removals.
The receipt timestamp is 2026-10-23T07:49:04.703Z.
No production restart, source repair, or push occurred.

The planner reports an official final GET at 2026-10-23T07:50:23.125Z:

- HTTP 200.
- 27 modules, 25 enabled, 0 errors.
- IoT absent.
- `changedExistingModules: []`.

This final GET is planner-supplied evidence, not an independent GET by this tester.
No unrelated concurrent module change is shown by the supplied inventory or final comparison.
The tester did not toggle or remove another module.

The whole configuration hash differs from the backup after official enable/disable.
The configuration was not blindly restored or overwritten.
The rollback receipt attributes this difference to the possible retained official disabled marker.
No separate configuration edit is reported.

## UI verification limit

The handed-off tester browser is `about:blank` at 1280x800, not an authenticated production page.
The tester checked this twice, with no intervening navigation or mutation.
All 4 requested safe globals are absent:

- `window.__iotProductionEnabledReceipt`.
- `window.__iotProductionFailureDisable`.
- `window.__iotRollbackObserved`.
- `window.__iotDeployConsole`.

The blank page console is empty. This is not evidence about the production console.
No authenticated URL or production controls are available in this browser handoff.
The tester did not guess a URL, log in, recover a live session, or inspect broad browser storage.
No screenshots were taken of the blank page as false production evidence.

Enabled-plugin desktop and mobile UI acceptance: not verified.
Rolled-back desktop and mobile UI acceptance: not verified.
Mobile overflow, production-page console, and an independent final GET: not obtained.
The initial pre-login HTTP 401 is not treated as an acceptance error.

## Evidence files

- `safe-filesystem-receipts.json`: selected safe deployment/rollback fields and evidence attribution.
- `rollback.log`: the bounded rollback log.
- `production-outcome-clarification.json`: the corrected predicate result and input description.
- `browser-handoff-blocked.md`: the browser access limitation.

The tester writes only new evidence in `evidence/deploy-019/production/`.
The tester did not change tests, business code, production state, Guard, models, or other plugins in this phase.
No paid probe, tool fixture retry, MCP/hardware operation, fix, commit, push, or restart was performed.

## Role and usage

Requested role/model/thinking: test / `hww/gpt-6.1-sol` / `high`.
Actual model/thinking metadata: not obtained.
No explicit clamp, model mismatch, or provider failure was reported.
No settings change or fallback occurred.

Generation count, input, cacheRead, cacheWrite, outputIncludingReasoning, totalInput, average context, maximum context, and tool return bytes: not obtained.
No metric probe was sent.

## Final disposition

Local preflight: PASS.
Production tool invocation: succeeded, according to the planner.
Strict combined production acceptance: FAILED; exact subcondition not captured.
Official disable and known-file removal rollback: COMPLETE, supported by the inspected receipts.
Rolled-back authenticated UI checks: BLOCKED by the blank browser handoff, not claimed as passed.

Freeze here. Do not fix, retry the fixture, re-enable, commit, push, or restart production.

## Planner-supplied rollback UI verification — final addendum

This addendum records planner-supplied evidence. It is not independent tester UI verification.
The independent blank-browser handoff evidence above and its separate file remain unchanged.
No browser action, tool fixture retry, or new probe was performed for this addendum.

| Check | Desktop | Mobile |
| --- | --- | --- |
| Verified at | 2026-10-23T07:57:39.244Z | 2026-10-23T07:58:22.968Z |
| Authenticated production homepage | verified by planner | verified by planner |
| Viewport | 1280x800 | 390x844 |
| scrollWidth / clientWidth | 1280 / 1280 | 390 / 390 |
| Horizontal overflow | none | none |
| Official GET extensions | HTTP 200 | HTTP 200 |
| Modules / enabled / errors | 27 / 25 / 0 | 27 / 25 / 0 |
| IoT | absent | absent |
| Window errors / rejections | [] / [] | [] / [] |
| Console | empty | empty |

The planner observed screenshots in the browser tool as viewport images.
The tool returned no filesystem paths. No PNG archive or screenshot path is claimed.
See `planner-rollback-ui.json` for the safe attributed results.

Rolled-back desktop and mobile UI: verified by the planner only.
Enabled-plugin desktop and mobile UI: UNVERIFIED.
Production raw output and the exact failed predicate: not captured.
The successful local preflight and rollback UI do not make production acceptance pass.

The adapted source changes remain frozen and uncommitted because deployment failed.
No source, test, production, or prior evidence file was changed for this addendum.
Only this report was appended, and the new safe planner receipt was saved.

Planner, developer, and tester generation, input, cacheRead, cacheWrite, output including reasoning, total input, average/maximum context, and tool return bytes: not obtained.
These fields are not exposed. No paid probe or metric probe was sent.

Final state: production acceptance FAILED; rollback COMPLETE; rolled-back UI verified by the planner.
All work stops. Do not fix, retry, re-enable, commit, push, or restart production.

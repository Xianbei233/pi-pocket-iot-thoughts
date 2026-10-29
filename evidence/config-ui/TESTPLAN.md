# IoT 0.2.0 configuration UI independent test plan

## Boundary

Use hww/gpt-6.1-sol with requested high. Actual runtime metadata and usage are not exposed.
Write only test/** and new evidence/config-ui/**. Preserve all 56 original cases and assertions.
Do not mutate the enabled production 0.1.0 plugin, production data, dictionary, Guard, models, or other plugins.
The production slot belongs to the LayerFS navigation repair until PiP releases it.
No production API, browser, installation, enable, reload, restart, or paid provider probe is permitted.

## Existing-file scope

Read factory, integration, packaging, core, and regression tests before changes.
Only adapt factory harness to awaited async setup with own temporary host.dataDir and public Web registration mocks.
Keep all original tool assertions. Use rejects rather than throws only where setup is now async.
Copy full candidate client payload in integration and packaging sandboxes.
Require the exact new allowlist and all client hashes; retain malicious-extra-file and symlink rejections.
Do not change core or extraction regressions or the exact 684-UTF-16 request/predicate.

## New tests

1. Factory-route filesystem tests: missing/default/no seed; safe file persistence and permissions; full-settings strict validation; reset confirmation; malformed file/env fail closed; explicit env-key precedence and merged cross-bounds.
2. Hot apply: snapshot at tool-call start, next-call update, disabled kept behavior, profile caps, persistence across module/app reload, restore original settings.
3. Concurrency/safety: stale revision 409; concurrent same-revision single winner; external disk revision change; atomic old-file preservation; temporary-file cleanup on abort/unload/failure; fixed own path; symlink directory/file, hardlink, FIFO/device and oversized-file rejection.
4. Real helper-first Pocket HTTP: owner GET/POST; guest/viewer/single-session/unauth and missing-header rejection without writes; client access hidden; actual faux tool turns with stored settings.
5. Isolated browser: visible home entry at 390x844 and 1280x800, click it rather than private openPage; all 7 settings plus language control, units/limits/help/loading/status/locks; valid save/readback/page and module persistence; invalid form and server rejection; explicit reset cancel/confirm; restore settings; screenshots limited to useful proof.

## Evidence and final gates

Wait for the exact 0.2.0 candidate path/hash before final gates.
Run type-check alone at OS 45s, unit 45s, integration 120s, full suite 180s; preserve complete logs and exit receipts.
Run lint/format under actual project config; format only owned tests/evidence files.
Audit exact package allowlist, regular files, manifest digests, no config/private fixture inclusion, and actual isolated pack smoke.
Run exact original installed-tool request at least 2 times; persist full request/raw/parsed/checks before assertions.
Require all 7 original conditions, 1 each of 8 tags, emoji/UTF-16 grounding, and deterministic raw output with defaults.
Use one consolidated Phase A defect list, at most one authorized business repair batch, and original-assertion retest.
Do not create an automatic repair loop. Stop after gates pass and report readiness pending production-slot release.

## Reports

Distinguish direct factory tests, actual Pocket HTTP/loader tests, and visible browser proof.
Filesystem IO inside the extension is not Guard-intercepted; do not claim otherwise.
Use only synthetic tokens, notes, temporary paths, and native faux. Do not equate faux calls or tool counts with usage.
Actual unavailable generation/input/cacheRead/cacheWrite/output/totalInput/average-max-context/tool-return-bytes: not obtained.

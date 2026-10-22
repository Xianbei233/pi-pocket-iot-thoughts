# Independent test plan

## Scope and provenance
- Test role requested: openai/gpt-6.1-sol, thinking high. Actual provider/model/thinking not exposed by available tool metadata; no clamp/auth failure observed. Do not infer actual from requested.
- Only test/** and evidence/** are test-owned. Tester/developer did not read/copy upstream IoT source/prompts/fixtures; main planner did inspect upstream source to verify behavior. Synthetic visible notes only.
- Pocket production code is read-only; integration imports its actual test/helpers.ts first, then actual App loader and faux scripted provider. Helper isolates PI_CODING_AGENT_DIR, home, work and data. No production app, credentials, paid model, hardware, MCP or external model probes.
- Read fully: docs/index.md, extensions.md, extensions/testing.md, tools.md, modules.md, host.md, cleanups.md, prompt-sections.md, reference/host.md, policies/index.md, policies/security-model.md, SECURITY.md; actual helpers.ts and docs-examples.test.ts.

## Gates
1. Strict config defaults/unknown/prototype/descriptor/integer/bounds/secret-safe errors; direct API input/options validation.
2. Extractive grounding with UTF16/emoji/CRLF; eight bilingual tags; deny/risks/pending/decisions retained or whole source kept; never cut negation/numeric sentences. Profiles preserve semantic polarity and expose source tags if regrouped.
3. Strict shortening or exact original keep; empty/short/disabled/too-large; max nodes/output; duplicate/filler omissions explicit; code and factual tool-output keep.
4. Abort before/during, real timeout under deterministic clock harness if necessary, dispose cancellation; timers/listeners cleaned. No shared call/session content.
5. Factory schema has only text/profile and additionalProperties false, replay safe/readOnlyHint true; defang plus data-not-instructions and heuristic/unverified warnings. Invalid config fails closed without raw env content.
6. Actual loader with package payload offline copied into temporary extensions: initial off, enable, natural language -> tool -> echoed grounded compact result, native tools/body unchanged, exactly two faux requests per tool turn; concurrent sessions. Disable/reload/restart/removal; no misleading hidden-CoT/DSH claims.
7. Inspect actual tar allowlist, manifest hashes and copy installed artifact rather than a mock. Run npm test/check/lint/format:check with bounded logs, preserve failures and retest without weakening assertions.

## Execution
Every command batch has OS timeout (unit45s/integration120s/full180s), complete log and exit-code files under evidence/. Business failures are consolidated to the main planner as path + minimal reproduction + original assertion; tester does not edit implementation.

## Explicit limits
Faux integration proves Pocket loader/tool wiring, not paid-provider behavior, hidden reasoning interception, DSH equivalence, hostile text immunity or Guard interception of extension internals. Tool parameters/results have normal Pocket persistence/provider transmission; not secret filtering.

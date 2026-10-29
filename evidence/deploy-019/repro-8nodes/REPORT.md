# Stage R diagnosis: exact request reproduced; strict acceptance FAILS

## Scope and outcome

This stage used only an isolated Pocket application and native faux provider.
No production state, browser, real provider, existing test, or plugin implementation was changed.
The exact supplied request ran 2 times through the real installed candidate and Pocket loader.
Both invocations succeeded at the tool level. Both fail the strict combined acceptance predicate.
Both full tool texts are byte-identical.
No fixture variation, repair, full-suite run, or deployment was performed.

The earlier production raw result remains unavailable. This new evidence diagnoses the exact isolated reproduction.
It must not be described as recovery of the original production payload.

## Request and identities

- Parameters: exactly `{ text: source, profile: 'full' }`.
- Configuration: defaults. `PI_POCKET_IOT_THOUGHTS_CONFIG` was absent and was not mutated.
- Input: 684 UTF-16 units, 1972 UTF-8 bytes, 8 CRLF sequences, and 30 LF characters in total.
- Prefix: 178 UTF-16 units. Background line repetition: 22.
- Input UTF-8 SHA-256: `eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e`.
- Pocket: 0.19.0 at `eae8ccf6c615ea2188f9b88e9252455917b081d4`.
- Actual Pocket pi-ai and pi-durable versions: 1.3.0 each.
- Plugin base HEAD: `c570eb35a1a0a0c157762fd9f319948e6dca66f4`; adapted working files remain uncommitted.
- Candidate: `dist/deploy-019/pi-pocket-iot-thoughts-0.1.0.tgz`.
- Candidate SHA-256: `f9e2351acca07ff5f43ff49f3502ef5ca03b34d4f2a4f7ef1a24994b581c6c8b`; 22492 bytes.
- Source SHA-256: `b4564f4ee0a7db8a753459b97cc277a3f85ac158ecfbc55c8171cb89e9f1fdaf`.
- Manifest SHA-256: `6d56a7dc9885fcea7fe6c7d489af51eb3dc0995c349a044a26796223a2254dda`.

The harness imports actual Pocket `test/helpers.ts` first.
It extracts the module from the exact candidate and verifies its source hash before installing it in temporary isolated data.
The real loader shows it initially off, then enabled without an error.
Each new isolated conversation uses 2 native faux requests: one tool call and one post-result response.
There are 4 faux requests and 0 paid provider requests across both invocations.
The application and temporary helper data were closed and cleaned up.

## Individual checks: identical in both runs

| Original condition | Result |
| --- | --- |
| status is compacted | PASS |
| node count is 8 | PASS |
| all 8 expected tags occur | FAIL: support absent |
| every node matches source.slice(start, end) | PASS |
| a selected node contains the emoji | FAIL |
| verified is false | PASS |
| result text is shorter than source.trim() | PASS |
| Combined predicate | FAIL |

Actual tag counts:

| Tag | Expected | Actual |
| --- | --- | --- |
| support | 1 | 0 |
| oppose | 1 | 1 |
| tradeoff | 1 | 1 |
| open | 1 | 1 |
| plan | 1 | 1 |
| decision | 1 | 1 |
| risk | 1 | 1 |
| neutral | 1 | 2 |

Both results have `status: compacted`, `reason: compacted`, `charsIn: 684`, `charsOut: 235`, `omitted: 22`, and `verified: false`.
The trimmed source is 683 UTF-16 units. No kept fallback occurs.

The selected UTF-16 ranges are:

| Tag | start | end | Grounded |
| --- | ---: | ---: | --- |
| oppose | 28 | 45 | yes |
| tradeoff | 50 | 68 | yes |
| open | 73 | 90 | yes |
| plan | 95 | 112 | yes |
| decision | 117 | 133 | yes |
| risk | 138 | 155 | yes |
| neutral, explicit | 160 | 176 | yes |
| neutral, background | 178 | 200 | yes |

The omitted support node contains the only emoji.
All returned offsets are grounded, but the emoji-bearing support range is not exercised by the returned nodes.
That distinction matters: vacuous emoji-range coverage is not a pass.

Both raw tool texts have 2315 UTF-8 bytes and SHA-256:
`827a557ebfde1c843370e02f381707f8cec93b4a53920ea7255797b2e9234ce4`.

## Causal diagnosis from current code and contract

1. `iot-thoughts.ts:74-75` treats a bare `无` anywhere in a sentence as a negation marker.
2. `isCritical` at lines 408-409 makes every negation-matching sentence mandatory.
3. Explicit label parsing at lines 413-434 preserves the label but still applies `isCritical` to its body.
4. The explicit neutral body contains `无害`. The repeated unlabelled background also contains `无害`.
5. Both bodies therefore become critical neutral candidates. The background repetitions deduplicate to 1 candidate at lines 478-488.
6. The 30 sentence units become 9 unique candidates: the 8 labelled sentences plus 1 background sentence.
7. There are 6 critical candidates: oppose, open, decision, risk, explicit neutral, and background neutral.
8. Defaults set `maxNodes: 8`, `maxOutputChars: 8000`, and `profile: full` at lines 162-169.
9. Critical count 6 is below the effective node limit 8. Their rendered text fits the character budget.
10. The kept/node-budget-insufficient checks at lines 610-617 do not apply to this input.
11. The selector starts with all critical candidates at line 620. Only 2 slots remain.
12. The rest sorts by tag rank at lines 626-628. tradeoff and plan rank ahead of support at lines 137-145.
13. The 2 slots go to tradeoff and plan. The selector stops at 8 nodes at lines 630-632.
14. Support is excluded. Its emoji is excluded with it. All selected ranges remain correct.
15. Rendering is shorter than the original, so lines 670-684 return compacted, not kept.

The derivation is saved in `selection-trace.json`; relevant implementation lines are saved in `source-evidence.txt`.
The trace is supplementary code reasoning, not another invocation or a modified implementation.

## Product defect versus acceptance standard

The current README describes critical-node preservation, an upper node limit, and conservative kept fallback.
The design document explicitly includes bare `无` among critical negation markers.
It also documents critical-first selection and lower priority for support than tradeoff or plan.
It does not promise that every compacted result contains all 8 tag categories.

Therefore, this reproduction is consistent with the current documented implementation contract.
It does not establish a loader, serialization, nondeterminism, or UTF-16 grounding defect.
The broad negation rule has a semantic false-positive on `无害`, but that behavior is present in the documented conservative rule.
Treat it as a confirmed cause of this acceptance mismatch, not an independently established contract violation.

The original combined predicate is a valid test of the Owner's stronger requirement.
It is not a valid unconditional expectation derived from the existing general compaction contract for this exact input.
The acceptance script also had an observability defect: it threw before persisting the raw output and individual checks.
This reproduction fixes evidence capture only; it does not change or weaken acceptance.

No evidence supports changing `status === compacted` to permit kept as an equivalent 8-node result.
A kept result returns the complete source but an empty nodes array at lines 510-519.
Raw input retention is not the same as extracting 8 grounded category nodes.

## Smallest truthful next criterion and repair decision

Keep the exact source, default configuration, full profile, and all original conditions for the Owner's required gate.
For this fixture, also report the explicit source label for each expected tag and require one grounded representative per label.
That makes category evidence unambiguous without weakening any existing condition.
Keep mandatory raw-result and per-condition persistence before the final assertion.
Run the same input repeatedly after an approved repair; do not substitute a friendlier fixture.

The present package cannot pass that gate. A script-only relaxation cannot preserve the stated requirement.
Changing only the numeric node limit to 9 would violate the exact-8 predicate and requires a different configuration.
Prioritizing support while dropping the mandatory background candidate would violate the present critical-preservation rule.
A kept fallback would also fail the exact-8 extracted-node requirement.

The planner must decide one bounded implementation/contract repair before further acceptance.
A narrowly approved non-negating use of `无害` in critical detection is a candidate for that repair.
It must preserve true negations, explicit critical tags, grounded ranges, and the existing conservative fallback cases.
This is a proposal, not an implemented or verified fix.
The alternate choice is an explicit revision of the Owner's requirement; that cannot be presented as passing the original gate.

For an approved requirement repair, use the unchanged supplied fixture as the regression input.
Preserve all original checks: compacted, exactly 8 nodes, all 8 tags, all source slices, emoji node, verified false, and shorter text.
Do not delete or weaken the existing critical-node and negative-semantics assertions.
No regression file was added or changed in Stage R.

## Durable evidence and exit semantics

Before invocation, the harness saves `request.json`, `expected-tags.json`, `baseline.json`, and the initial `run-receipt.json`.
The full reconstructed predicate is `original-acceptance-logic.js`; its reconstruction is explicitly labelled in the file.
Each run saves the complete backend result and verbatim text before parsing or evaluating acceptance.
The run directories contain:

- `invocation-before.json`.
- `raw-tool-return.json` and `raw-tool-text.txt`.
- `tool-call.json` with the synthetic assistant tool call and response.
- `parsed.json`.
- `per-condition.json`, including expected/actual counts and every UTF-16 range.

The harness exits 0 because capture and both invocations completed without an exception.
The OS exit is 0, with a 120-second bound in `os.receipt` and complete output in `harness.log`.
Strict acceptance is a separate FAIL, recorded as exit 1 in `acceptance.exit`.
No exception was discarded. No top-level acceptance throw occurs before evidence is flushed.

## Preservation and production limits

Only new files under `evidence/deploy-019/repro-8nodes/` were written in the project.
The 2 existing untracked .tmp files retain their original SHA-256.
Earlier evidence and adapted source/test files were not changed.
No production mutation, production restart, shared browser, sessionDB read, broad real-history recovery, real provider, MCP, hardware, push, or commit occurred.
The task supplies a newer production baseline of 28 modules, 26 enabled, 0 errors, with IoT absent.
This stage does not inspect or alter that baseline or remove the concurrently installed plugin.
The earlier local 45-test pass and production rollback evidence remain separate.

## Role and usage

Requested role/model/thinking: test / `hww/gpt-6.1-sol` / `high`.
Actual runtime provider/model/thinking metadata: not obtained.
No explicit clamp, model mismatch, or provider failure was reported. No settings change or fallback occurred.
Generation, input, cacheRead, cacheWrite, outputIncludingReasoning, totalInput, average context, maximum context, and tool return bytes: not obtained.
No usage or paid-model probe was sent.

Stop after this consolidated diagnosis. No fix, full suite, or deployment is authorized by this report.

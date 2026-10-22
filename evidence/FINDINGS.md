# Findings sent for implementation fixes

Initial snapshot tests: evidence/core-initial.log, exit 1, 9/11 passed.

- B1 runtime options unknown fields ignored: core.test.ts direct `compactVisibleNotes(notes, {root:'/synthetic'} as never)` must reject. iot-thoughts.ts resolves only options?.profile.
- B2 active cancellation ineffective: async function does all work synchronously; start valid 48KB text promise then immediately controller.abort() returns success instead of rejection. core.test.ts retains original rejection assertion.
- B3 over-limit direct input returns kept `input-too-large` not rejection; contract says reject over-limit, no silent truncation. Add dedicated test (currently masked by B1 in same test).
- B4 initial Tag/TAG_WORDS uses fact rather than required tradeoff and misses neutral/pending English mappings. Add exact bilingual eight-family regression. Unknown plain note must remain neutral, never fact assertion.

Additional planner requirement: real loader near-limit CJK/control character output must not get silently truncated by native 50KB limit. Parse complete fenced JSON from actual backend toolResult and verify original kept source. Defanged closing tags are display-safe, not byte-exact archival; node offsets remain in original input.

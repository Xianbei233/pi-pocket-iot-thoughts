import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_CONFIG, compactVisibleNotes, resolveConfig } from "../iot-thoughts.ts";

const config = (values: Record<string, unknown> = {}) =>
    resolveConfig({ ...DEFAULT_CONFIG, minChars: 1, ...values });
const filler = "Neutral: This is a synthetic repeated background observation.\n";
const critical = [
    "Oppose: We must not deploy version 4.2 before review.",
    "Risk: The estimated loss is 17.5%, not 0%.",
    "Pending: Approval remains unresolved and has not been granted.",
    "Decision: Retain the existing 3 backups.",
];
const notes = [...critical, ...Array(16).fill(filler.trim())].join("\n");

function grounding(source: string, result: Awaited<ReturnType<typeof compactVisibleNotes>>) {
    assert.equal(result.verified, false);
    assert.equal(result.charsIn, source.length);
    assert.equal(result.charsOut, result.text.length);
    assert.ok(Number.isInteger(result.omitted) && result.omitted >= 0);
    for (const node of result.nodes) {
        assert.ok(Number.isInteger(node.start) && Number.isInteger(node.end));
        assert.ok(node.start >= 0 && node.end <= source.length && node.start < node.end);
        assert.equal(source.slice(node.start, node.end), node.text);
    }
    if (result.status === "compacted") {
        assert.ok(result.text.length < source.trim().length);
    } else {
        assert.equal(result.status, "kept");
        assert.equal(result.text, source);
    }
}

test("config defaults are exact and frozen", () => {
    assert.deepEqual(DEFAULT_CONFIG, {
        enabled: true,
        profile: "full",
        minChars: 400,
        maxInputChars: 24000,
        maxNodes: 8,
        maxOutputChars: 8000,
        timeoutMs: 1000,
    });
    assert.deepEqual(resolveConfig(undefined), DEFAULT_CONFIG);
    assert.ok(Object.isFrozen(resolveConfig({})));
});

test("config rejects hostile objects, unknown fields, bad types and unsafe bounds without echo", () => {
    const secret = "SYNTHETIC_SECRET_NOT_REAL_27";
    const invalid: unknown[] = [
        null,
        [],
        true,
        9,
        "x",
        { root: secret },
        { enabled: "true" },
        { profile: "turbo" },
        { minChars: -1 },
        { minChars: 1.5 },
        { maxInputChars: 64001 },
        { maxNodes: 0 },
        { maxNodes: 17 },
        { timeoutMs: 9 },
        { timeoutMs: 5001 },
        { maxOutputChars: 24001 },
        { maxInputChars: Infinity },
        { maxInputChars: NaN },
        JSON.parse('{"__proto__":{"enabled":true}}'),
        { constructor: secret },
        Object.create({ enabled: true }),
    ];
    for (const raw of invalid) {
        assert.throws(
            () => resolveConfig(raw),
            (error: unknown) => {
                assert.ok(error instanceof Error);
                assert.ok(!error.message.includes(secret));
                return true;
            },
        );
    }
    assert.equal(({} as Record<string, unknown>).polluted, undefined);
    assert.doesNotThrow(() =>
        config({ maxInputChars: 64000, maxOutputChars: 64000, maxNodes: 16, timeoutMs: 5000 }),
    );
});

test("runtime direct calls validate config/options/text rather than relying on TS or schema", async () => {
    await assert.rejects(() => compactVisibleNotes(42 as never));
    await assert.rejects(() => compactVisibleNotes(notes, { profile: "invented" } as never));
    await assert.rejects(() => compactVisibleNotes(notes, { root: "/synthetic" } as never));
    await assert.rejects(() => compactVisibleNotes(notes, {}, { ...DEFAULT_CONFIG, maxNodes: 99 }));
    await assert.rejects(() => compactVisibleNotes("x".repeat(64001), {}, config({ maxInputChars: 64000 })));
});

test("deduplicates visible notes; important negative/pending/decision numeric sentences are grounded", async () => {
    const result = await compactVisibleNotes(notes, {}, config());
    grounding(notes, result);
    assert.equal(result.status, "compacted");
    assert.ok(result.omitted > 0);
    for (const line of critical) {
        const body = line.slice(line.indexOf(":") + 2);
        assert.ok(
            result.nodes.some((node) => node.text === body || node.text === line),
            body,
        );
        assert.ok(result.text.includes(body), body);
    }
});

test("UTF16 emoji and CRLF offsets exclude source labels", async () => {
    const source =
        "支持: 😀 可考虑方案A。\r\n反对: 不可删除现有3份备份。\r\n待定: 尚未批准预算2500元。\r\n风险: 数据丢失率可能为0.5%。\r\n" +
        filler.repeat(16);
    const result = await compactVisibleNotes(source, {}, config());
    grounding(source, result);
    assert.equal(result.status, "compacted");
    for (const text of [
        "😀 可考虑方案A。",
        "不可删除现有3份备份。",
        "尚未批准预算2500元。",
        "数据丢失率可能为0.5%。",
    ]) {
        assert.ok(
            result.nodes.some((node) => node.text === text),
            text,
        );
    }
});

test("all profiles retain polarity/source evidence without inventing completed plans", async () => {
    const source =
        "Support: Proceed with the local prototype.\nOppose: Do not send any private data.\nTradeoff: Speed versus cost remains a tradeoff.\nPending: Waiting for approval.\nPlan: We plan to test tomorrow; this has not run.\nDecision: Keep three backups.\nRisk: Data may be lost.\nNeutral: Plain observation.\n" +
        filler.repeat(16);
    for (const profile of ["compact", "balanced", "full"] as const) {
        const result = await compactVisibleNotes(source, { profile }, config({ maxNodes: 16 }));
        grounding(source, result);
        if (profile === "full") assert.equal(result.status, "compacted");
        for (const text of [
            "Do not send any private data.",
            "Waiting for approval.",
            "Keep three backups.",
            "Data may be lost.",
        ]) {
            assert.ok(result.text.includes(text), `${profile}: ${text}`);
        }
        assert.ok(!result.text.includes("Testing completed"));
        if (result.status === "compacted")
            assert.ok(
                result.nodes.some(
                    (node) =>
                        /oppose|反对/i.test(node.tag) ||
                        /oppose|反对/i.test(String((node as unknown as Record<string, unknown>).sourceTag)),
                ),
            );
    }
});

test("empty/short/disabled and not-shorter preserve exact original", async () => {
    for (const [text, cfg] of [
        ["", DEFAULT_CONFIG],
        ["  short\r\n", DEFAULT_CONFIG],
        [notes, config({ enabled: false })],
        ["Risk: Never lose 3 backups.", config()],
    ] as const) {
        const result = await compactVisibleNotes(text, {}, cfg);
        grounding(text, result);
        assert.equal(result.status, "kept");
    }
});

test("insufficient output or node budget keeps all important source rather than dropping it", async () => {
    for (const values of [{ maxNodes: 1 }, { maxOutputChars: 100 }]) {
        const result = await compactVisibleNotes(notes, {}, config(values));
        grounding(notes, result);
        assert.equal(result.status, "kept");
    }
});

test("fenced repeated code and factual tool output remain intact", async () => {
    for (const text of [
        "```js\n" + "if (!approved) return false;\n".repeat(24) + "```",
        "Tool output:\n" + '{"status":"pending","count":3}\n'.repeat(24),
        "Tool output:\n" +
            '{"record":1,"value":7}\n{"record":2,"value":8}\n{"record":3,"value":9}\n'.repeat(8),
    ]) {
        const result = await compactVisibleNotes(text, {}, config());
        grounding(text, result);
        assert.equal(result.status, "kept");
    }
});

test("pre-abort and active abort reject, do not return apparent success", async () => {
    const first = new AbortController();
    first.abort();
    await assert.rejects(() => compactVisibleNotes(notes, {}, config(), first.signal), /abort|cancel/i);
    const second = new AbortController();
    const pending = compactVisibleNotes(
        filler.repeat(800),
        {},
        config({ maxInputChars: 64000 }),
        second.signal,
    );
    second.abort();
    await assert.rejects(() => pending, /abort|cancel/i);
});

test("concurrent calls cannot leak or reuse another input", async () => {
    const sources = Array.from(
        { length: 12 },
        (_, i) => `Risk: SYNTHETIC_SESSION_${i} must not lose ${i + 1} backups.\n` + filler.repeat(16),
    );
    const results = await Promise.all(sources.map((text) => compactVisibleNotes(text, {}, config())));
    results.forEach((result, i) => {
        grounding(sources[i]!, result);
        assert.ok(result.text.includes(`SYNTHETIC_SESSION_${i} `));
        for (let j = 0; j < sources.length; j++)
            if (i !== j) assert.ok(!result.text.includes(`SYNTHETIC_SESSION_${j} `));
    });
});

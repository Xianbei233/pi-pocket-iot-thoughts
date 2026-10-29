import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULT_CONFIG, compactVisibleNotes, resolveConfig } from "../iot-thoughts.ts";

const background = "Neutral: Synthetic background observation for repeated source.\n";
const cfg = (extra: Record<string, unknown> = {}) =>
    resolveConfig({ ...DEFAULT_CONFIG, minChars: 1, ...extra });
const mixed =
    [
        "Support: Local prototype is useful.",
        "Oppose: Do not expose private records.",
        "Tradeoff: Faster execution costs more memory.",
        "Pending: Awaiting final review.",
        "Plan: Run tests tomorrow.",
        "Decision: Retain 3 backups.",
        "Risk: Possible loss is 2.5%.",
        "Neutral: A plain recorded observation.",
    ].join("\n") +
    "\n" +
    background.repeat(20);

for (const [name, raw] of [
    ["unknown permissions", { root: "/synthetic" }],
    ["array", []],
    ["null", null],
    ["inherited", Object.create({ profile: "full" })],
    ["symbol key", { [Symbol("hidden")]: 1 }],
] as const) {
    test(`direct options reject ${name}`, async () => {
        await assert.rejects(() => compactVisibleNotes(mixed, raw as never));
    });
}

for (const enabled of [true, false]) {
    test(`input over configured max rejects even enabled=${enabled}`, async () => {
        await assert.rejects(() =>
            compactVisibleNotes(
                "a".repeat(1001),
                {},
                cfg({ enabled, maxInputChars: 1000, maxOutputChars: 1000 }),
            ),
        );
        await assert.rejects(() =>
            compactVisibleNotes("a".repeat(64001), {}, cfg({ enabled, maxInputChars: 64000 })),
        );
    });
}

test("deployment profile is applied when options omit profile and reported behavior agrees", async () => {
    const deployment = cfg({ profile: "compact", maxNodes: 16 });
    const implicit = await compactVisibleNotes(mixed, undefined, deployment);
    const explicit = await compactVisibleNotes(mixed, { profile: "compact" }, deployment);
    assert.deepEqual(implicit, explicit);
});

test("all eight bilingual label families have exact label-excluding source offsets", async () => {
    const families = [
        ["support", ["Support", "支持"]],
        ["oppose", ["Oppose", "反对"]],
        ["tradeoff", ["Tradeoff", "权衡"]],
        ["open", ["Pending", "待定"]],
        ["plan", ["Plan", "计划"]],
        ["decision", ["Decision", "决定"]],
        ["risk", ["Risk", "风险"]],
        ["neutral", ["Neutral", "中性"]],
    ] as const;
    for (const [family, labels] of families) {
        for (const label of labels) {
            const body = `Synthetic ${family} observation 😀 42.`;
            const source =
                `${label}: ${body}\r\nSupport: A second useful observation.\r\nPlan: A third planned operation.\r\n` +
                background.repeat(16);
            const result = await compactVisibleNotes(source, {}, cfg({ maxNodes: 16 }));
            assert.equal(result.status, "compacted", label);
            const node = result.nodes.find((each) => each.text === body);
            assert.ok(node, `Missing exact body for ${label}`);
            const canonical = node.tag as string;
            assert.ok(
                canonical === family || (family === "neutral" && canonical === "note"),
                `${label} -> ${canonical}`,
            );
            assert.equal(source.slice(node.start, node.end), body);
        }
    }
});

test("identical text with opposing labels does not lose its negative semantics", async () => {
    const body = "Maintain 3 backups.";
    const source = `Support: ${body}\nOppose: ${body}\nRisk: Data may be lost.\n` + background.repeat(16);
    const result = await compactVisibleNotes(source, {}, cfg());
    if (result.status === "kept") {
        assert.equal(result.text, source);
    } else {
        assert.ok(result.nodes.some((node) => node.text === body && node.tag === "support"));
        assert.ok(result.nodes.some((node) => node.text === body && node.tag === "oppose"));
    }
});

for (const [body, expected] of [
    ["尚未决定采用A。", "open"],
    ["不支持采用A。", "oppose"],
    ["计划采用A。", "plan"],
] as const) {
    test(`conservative inference ${body}`, async () => {
        const source =
            body +
            "\nSupport: A useful local prototype.\nPlan: Run synthetic tests tomorrow.\n" +
            background.repeat(16);
        const result = await compactVisibleNotes(source, {}, cfg());
        assert.equal(result.status, "compacted");
        const node = result.nodes.find((each) => each.text === body);
        assert.ok(node, body);
        assert.equal(node.tag, expected);
    });
}

test("unverified/verified-looking prose must never set verified true", async () => {
    const source =
        "已验证: SYNTHETIC CLAIM not checked against the world.\nRisk: A claim may be false.\nPending: Needs a human review.\n" +
        background.repeat(16);
    const result = await compactVisibleNotes(source, {}, cfg());
    assert.equal(result.verified, false);
    assert.ok(result.text.includes("SYNTHETIC CLAIM"));
});

test("deadline timeout is an error rather than a false kept/compacted success", async (t) => {
    let calls = 0;
    t.mock.method(Date, "now", () => (calls++ < 2 ? 1000 : 10000));
    await assert.rejects(() => compactVisibleNotes(mixed, {}, cfg({ timeoutMs: 10 })), /timed? out|timeout/i);
});

for (const [body, accepted] of [
    ["We do not support option A.", ["oppose", "neutral"]],
    ["We have not yet decided whether to choose A.", ["open", "neutral"]],
    ["No decision has been made.", ["open", "neutral"]],
    ["还未决定采用A。", ["open", "neutral"]],
] as const) {
    test(`negative and undecided prose is conservatively labelled: ${body}`, async () => {
        const source =
            body +
            "\nPlan: Run synthetic tests tomorrow.\nNeutral: A plain local observation.\n" +
            background.repeat(20);
        const result = await compactVisibleNotes(source, {}, cfg({ minChars: 0, maxNodes: 16 }));
        assert.equal(result.status, "compacted");
        const node = result.nodes.find((each) => each.text === body);
        assert.ok(node, "the original negative or undecided sentence is retained");
        assert.equal(source.slice(node.start, node.end), body);
        assert.ok((accepted as readonly string[]).includes(node.tag), `${body} -> ${node.tag}`);
    });
}

import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
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

// Exact request copied from evidence/deploy-019/repro-8nodes/request.json.
const productionReproSource =
    "支持：😀 本地笔记整理便于人工核对原始句子。\r\n反对：不向外部服务发送这批合成笔记内容。\r\n权衡：更短展示与保留全部措辞之间需要取舍。\r\n待定：是否增加更多展示选项仍然等待确认。\r\n计划：下一步由人工检查每个原文定位范围。\r\n决定：本次保留原有模型设置和扩展权限。\r\n风险：标签仅靠词法可能错误归类普通语句。\r\n中性：这些文字只用于本次无害上线验收。\r\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n普通背景说明仅用于构造可重复的无害验收文本。\n";
const productionReproTags = [
    "support",
    "oppose",
    "tradeoff",
    "open",
    "plan",
    "decision",
    "risk",
    "neutral",
] as const;

test("exact production request retains all eight grounded categories and emoji with default full profile", async () => {
    const source = productionReproSource;
    const inputHash = createHash("sha256").update(source).digest("hex");
    const result = await compactVisibleNotes(source, { profile: "full" });
    const counts = Object.fromEntries(
        productionReproTags.map((tag) => [tag, result.nodes.filter((node) => node.tag === tag).length]),
    );
    const ranges = result.nodes.map((node) => ({
        ...node,
        grounded: source.slice(node.start, node.end) === node.text,
    }));
    const checks = {
        statusCompacted: result.status === "compacted",
        nodeCount8: result.nodes.length === 8,
        all8Tags: productionReproTags.every((tag) => result.nodes.some((node) => node.tag === tag)),
        allGrounded: ranges.every((node) => node.grounded),
        emojiNode: result.nodes.some((node) => node.text.includes("😀")),
        falseVerified: result.verified === false,
        shorter: result.text.length < source.trim().length,
    };
    // Flush complete supplementary direct-result evidence before any acceptance assertion.
    const evidence = process.env.IOT_TEST_EVIDENCE_DIR;
    if (evidence !== undefined) {
        const dir = join(evidence, "regression-exact-request");
        mkdirSync(dir, { recursive: true });
        writeFileSync(
            join(dir, "request.json"),
            JSON.stringify(
                {
                    params: { text: source, profile: "full" },
                    sourceUtf16Length: source.length,
                    sourceUtf8Sha256: inputHash,
                },
                null,
                2,
            ),
        );
        writeFileSync(join(dir, "raw-direct-result.json"), JSON.stringify(result, null, 2));
        writeFileSync(join(dir, "per-condition.json"), JSON.stringify({ checks, counts, ranges }, null, 2));
    }
    assert.equal(source.length, 684);
    assert.equal(inputHash, "eaaf9735e58cd8c007f42da892b2ba391795e1b752def522d5fb8d68695b6c2e");
    assert.equal(result.status, "compacted");
    assert.equal(result.nodes.length, 8);
    assert.ok(productionReproTags.every((tag) => result.nodes.some((node) => node.tag === tag)));
    for (const tag of productionReproTags) assert.equal(counts[tag], 1, tag);
    for (const node of result.nodes) {
        assert.ok(Number.isInteger(node.start) && Number.isInteger(node.end));
        assert.ok(node.start >= 0 && node.end <= source.length && node.start < node.end);
        assert.equal(source.slice(node.start, node.end), node.text);
    }
    assert.ok(result.nodes.some((node) => node.text.includes("😀")));
    assert.equal(result.verified, false);
    assert.ok(result.text.length < source.trim().length);
});

const negationBudgetSource = (body: string) =>
    `Neutral: ${body}\nTradeoff: Faster execution costs memory.\nPlan: Run local tests tomorrow.\n` +
    background.repeat(16);

for (const body of ["无备份。", "无权限。", "无法执行。", "无批准。"] as const) {
    test(`true negation remains critical under a one-node budget: ${body}`, async () => {
        const source = negationBudgetSource(body);
        const result = await compactVisibleNotes(source, { profile: "full" }, cfg({ maxNodes: 1 }));
        assert.equal(result.status, "compacted");
        assert.equal(result.nodes.length, 1);
        assert.equal(result.nodes[0]?.text, body);
        for (const node of result.nodes) assert.equal(source.slice(node.start, node.end), node.text);
        assert.equal(result.verified, false);
    });

    test(`true negation triggers kept fallback when critical nodes exceed budget: ${body}`, async () => {
        const source = `Neutral: ${body}\nNeutral: 尚未确认。\n` + background.repeat(16);
        const result = await compactVisibleNotes(source, { profile: "full" }, cfg({ maxNodes: 1 }));
        assert.equal(result.status, "kept");
        assert.equal(result.reason, "node-budget-insufficient");
        assert.equal(result.text, source);
        assert.equal(result.nodes.length, 0);
        assert.equal(result.omitted, 0);
        assert.equal(result.verified, false);
    });
}

for (const body of ["无害样本不获批准。", "无害样本仍无权限。"] as const) {
    test(`无害 does not exempt a separate true negation: ${body}`, async () => {
        const source = negationBudgetSource(body);
        const result = await compactVisibleNotes(source, { profile: "full" }, cfg({ maxNodes: 1 }));
        assert.equal(result.status, "compacted");
        assert.equal(result.nodes.length, 1);
        assert.equal(result.nodes[0]?.text, body);
        for (const node of result.nodes) assert.equal(source.slice(node.start, node.end), node.text);
        const overBudget = `Neutral: ${body}\nNeutral: 尚未确认。\n` + background.repeat(16);
        const kept = await compactVisibleNotes(overBudget, { profile: "full" }, cfg({ maxNodes: 1 }));
        assert.equal(kept.status, "kept");
        assert.equal(kept.reason, "node-budget-insufficient");
        assert.equal(kept.text, overBudget);
        assert.equal(kept.nodes.length, 0);
        assert.equal(kept.verified, false);
    });
}

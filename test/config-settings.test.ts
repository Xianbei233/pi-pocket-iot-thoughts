import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
    chmodSync,
    existsSync,
    linkSync,
    lstatSync,
    mkdirSync,
    readFileSync,
    readdirSync,
    rmSync,
    symlinkSync,
    writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { test } from "node:test";
import { DEFAULT_CONFIG } from "../iot-thoughts.ts";
import { fullSettings, moduleHarness, noteFixture, sandbox, statusIs } from "./config-support.ts";

const envKey = "PI_POCKET_IOT_THOUGHTS_CONFIG";
function withEnv(value: string | undefined) {
    const old = process.env[envKey];
    if (value === undefined) delete process.env[envKey];
    else process.env[envKey] = value;
    return () => {
        if (old === undefined) delete process.env[envKey];
        else process.env[envKey] = old;
    };
}

test("config defaults do not seed own files; routes/client explicitly owner-only", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const view = await h.call("GET", "config");
        assert.equal(view.schemaVersion, 1);
        assert.deepEqual(view.stored, DEFAULT_CONFIG);
        assert.deepEqual(view.effective, DEFAULT_CONFIG);
        assert.deepEqual(view.environmentOverrides, {});
        assert.equal(view.runtime.hotApply, true);
        assert.equal(view.runtime.algorithmEnabled, true);
        assert.equal(existsSync(box.directory), false);
        assert.deepEqual([...h.routes.keys()].sort(), ["GET config", "POST config", "POST reset"]);
        for (const route of h.routes.values()) assert.equal(route.access, "owner");
        assert.deepEqual(h.clients, [{ entry: "iot-thoughts", access: "owner" }]);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("save persists atomically with restrictive modes, hot apply, reset confirmation and reload", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const original = await h.call("GET", "config");
        const disabled = await h.call("POST", "config", {
            settings: fullSettings({ enabled: false, maxNodes: 4 }),
            revision: original.revision,
        });
        assert.equal(lstatSync(box.directory).mode & 0o777, 0o700);
        assert.equal(lstatSync(box.file).mode & 0o777, 0o600);
        assert.deepEqual(JSON.parse(readFileSync(box.file, "utf8")), disabled.stored);
        assert.equal(disabled.effective.enabled, false);
        assert.equal((await h.invoke(noteFixture)).payload.reason, "disabled");
        await assert.rejects(
            () => h.call("POST", "reset", { confirm: false, revision: disabled.revision }),
            statusIs(400),
        );
        assert.deepEqual((await h.call("GET", "config")).stored, disabled.stored);
        await h.dispose();
        const reloaded = await moduleHarness(box.dataDir);
        assert.deepEqual((await reloaded.call("GET", "config")).stored, disabled.stored);
        const reset = await reloaded.call("POST", "reset", { confirm: true, revision: disabled.revision });
        assert.deepEqual(reset.stored, DEFAULT_CONFIG);
        assert.deepEqual(reset.effective, DEFAULT_CONFIG);
        assert.equal((await reloaded.invoke(noteFixture)).payload.status, "compacted");
        assert.deepEqual(readdirSync(box.directory), ["config.json"]);
        await reloaded.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("in-flight tool uses call-start snapshot; later call uses saved profile and node cap", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const view = await h.call("GET", "config");
        const pending = h.invoke(noteFixture);
        const saved = await h.call("POST", "config", {
            settings: fullSettings({ enabled: false }),
            revision: view.revision,
        });
        assert.equal((await pending).payload.status, "compacted");
        assert.equal((await h.invoke(noteFixture)).payload.reason, "disabled");
        await h.call("POST", "config", {
            settings: fullSettings({ profile: "compact", maxNodes: 3 }),
            revision: saved.revision,
        });
        const capped = (await h.invoke(noteFixture)).payload;
        assert.equal(capped.profile, "compact");
        assert.ok(capped.nodes.length <= 3);
        assert.equal(capped.status, "compacted");
        const current = await h.call("GET", "config");
        await h.call("POST", "config", { settings: originalSettings(), revision: current.revision });
        assert.deepEqual((await h.call("GET", "config")).effective, DEFAULT_CONFIG);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});
function originalSettings() {
    return fullSettings();
}

for (const [label, settings] of [
    ["unknown", { ...fullSettings(), root: "/synthetic" }],
    ["missing", { enabled: true }],
    ["fraction", fullSettings({ maxNodes: 1.5 })],
    ["negative", fullSettings({ minChars: -1 })],
    ["profile", { ...fullSettings(), profile: "invented" }],
    ["cross minimum", fullSettings({ minChars: 25000 })],
    ["cross output", fullSettings({ maxOutputChars: 25000 })],
    ["array", []],
    ["null", null],
    ["inherited", Object.create(fullSettings())],
    [
        "accessor",
        Object.defineProperty(fullSettings(), "maxNodes", {
            enumerable: true,
            get() {
                throw new Error("SYNTHETIC_GETTER_MUST_NOT_RUN");
            },
        }),
    ],
] as const) {
    test("strict full-settings rejection preserves state and disk: " + label, async () => {
        const box = sandbox();
        const restore = withEnv(undefined);
        try {
            const h = await moduleHarness(box.dataDir);
            const before = await h.call("GET", "config");
            await assert.rejects(
                () => h.call("POST", "config", { settings, revision: before.revision }),
                (error) => statusIs(400)(error),
            );
            assert.deepEqual(await h.call("GET", "config"), before);
            assert.equal(existsSync(box.file), false);
            await h.dispose();
        } finally {
            restore();
            box.cleanup();
        }
    });
}

test("top-level getters/prototypes, unknown body fields and oversized body reject without executing accessors", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const before = await h.call("GET", "config");
        let accesses = 0;
        const accessor = Object.defineProperty({ revision: before.revision }, "settings", {
            enumerable: true,
            get() {
                accesses++;
                return fullSettings();
            },
        });
        for (const body of [
            accessor,
            Object.create({ settings: fullSettings(), revision: before.revision }),
            { settings: fullSettings(), revision: before.revision, extra: true },
        ])
            await assert.rejects(() => h.call("POST", "config", body), statusIs(400));
        assert.equal(accesses, 0);
        await assert.rejects(
            () =>
                h.call("POST", "config", {
                    settings: fullSettings(),
                    revision: before.revision,
                    padding: "x".repeat(8200),
                }),
            statusIs(413),
        );
        assert.deepEqual(await h.call("GET", "config"), before);
        assert.equal(existsSync(box.file), false);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("owner check rejects direct guest/viewer requests and reset cannot bypass it", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const view = await h.call("GET", "config");
        for (const role of ["guest", "viewer"])
            for (const [method, path, body] of [
                ["GET", "config", {}],
                ["POST", "config", { settings: fullSettings(), revision: view.revision }],
                ["POST", "reset", { confirm: true, revision: view.revision }],
            ] as const)
                await assert.rejects(() => h.call(method, path, body, role), statusIs(403));
        assert.equal(existsSync(box.file), false);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("stale and concurrent revisions yield a single winner and preserve committed bytes", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const view = await h.call("GET", "config");
        const results = await Promise.allSettled([
            h.call("POST", "config", { settings: fullSettings({ maxNodes: 4 }), revision: view.revision }),
            h.call("POST", "config", { settings: fullSettings({ maxNodes: 5 }), revision: view.revision }),
        ]);
        assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
        const rejected = results.find((r) => r.status === "rejected");
        assert.ok(rejected?.status === "rejected" && statusIs(409)(rejected.reason));
        const bytes = readFileSync(box.file);
        await assert.rejects(
            () => h.call("POST", "reset", { confirm: true, revision: view.revision }),
            statusIs(409),
        );
        assert.deepEqual(readFileSync(box.file), bytes);
        assert.deepEqual(readdirSync(box.directory), ["config.json"]);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("stale external write rejects and fresh read sees the preserved external file", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const view = await h.call("GET", "config");
        mkdirSync(box.directory, { mode: 0o700 });
        const external = JSON.stringify(fullSettings({ maxNodes: 5 }));
        writeFileSync(box.file, external, { mode: 0o600 });
        await assert.rejects(
            () =>
                h.call("POST", "config", {
                    settings: fullSettings({ maxNodes: 4 }),
                    revision: view.revision,
                }),
            statusIs(409),
        );
        assert.equal(readFileSync(box.file, "utf8"), external);
        const refreshed = await h.call("GET", "config");
        assert.deepEqual(refreshed.effective, fullSettings({ maxNodes: 5 }));
        assert.deepEqual(refreshed.stored, fullSettings({ maxNodes: 5 }));
        assert.equal(refreshed.revision, createHash("sha256").update(external).digest("hex"));
        assert.equal(readFileSync(box.file, "utf8"), external);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("explicit env keys override saved keys only; reset keeps env and merged bounds validate before write", async () => {
    const box = sandbox();
    const restore = withEnv('{"maxNodes":3}');
    try {
        mkdirSync(box.directory);
        writeFileSync(
            box.file,
            JSON.stringify(fullSettings({ profile: "balanced", minChars: 12, maxNodes: 7 })),
            { mode: 0o600 },
        );
        const h = await moduleHarness(box.dataDir);
        const before = await h.call("GET", "config");
        assert.deepEqual(before.environmentOverrides, { maxNodes: 3 });
        assert.equal(before.effective.profile, "balanced");
        assert.equal(before.effective.minChars, 12);
        assert.equal(before.effective.maxNodes, 3);
        assert.equal(before.sources.maxNodes, "env");
        const reset = await h.call("POST", "reset", { confirm: true, revision: before.revision });
        assert.deepEqual(reset.stored, DEFAULT_CONFIG);
        assert.equal(reset.effective.maxNodes, 3);
        await h.dispose();
        process.env[envKey] = '{"minChars":500}';
        const bound = await moduleHarness(box.dataDir);
        const view = await bound.call("GET", "config");
        const bytes = readFileSync(box.file);
        await assert.rejects(
            () =>
                bound.call("POST", "config", {
                    settings: fullSettings({ minChars: 100, maxInputChars: 400, maxOutputChars: 300 }),
                    revision: view.revision,
                }),
            statusIs(400),
        );
        assert.deepEqual(readFileSync(box.file), bytes);
        await bound.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

for (const raw of ["", " ", "not-json-SYNTHETIC", "[]", "null", '{"unknown":"SYNTHETIC"}'])
    test("invalid env fails closed without raw echo: " + JSON.stringify(raw), async () => {
        const box = sandbox();
        const restore = withEnv(raw);
        try {
            await assert.rejects(
                () => moduleHarness(box.dataDir),
                (error) => error instanceof Error && !error.message.includes("SYNTHETIC"),
            );
            assert.equal(existsSync(box.file), false);
        } finally {
            restore();
            box.cleanup();
        }
    });

for (const shape of ["directory-link", "file-link", "hardlink", "fifo", "large", "malformed"] as const)
    test("unsafe existing own config fails closed: " + shape, async () => {
        const box = sandbox();
        const restore = withEnv(undefined);
        try {
            const outside = join(box.dataDir, "outside");
            mkdirSync(outside);
            const sentinel = join(outside, "sentinel");
            writeFileSync(sentinel, "SYNTHETIC_UNCHANGED");
            if (shape === "directory-link") symlinkSync(outside, box.directory, "dir");
            else {
                mkdirSync(box.directory);
                if (shape === "file-link") symlinkSync(sentinel, box.file);
                else if (shape === "hardlink") linkSync(sentinel, box.file);
                else if (shape === "fifo") execFileSync("mkfifo", [box.file], { timeout: 3000 });
                else writeFileSync(box.file, shape === "large" ? "x".repeat(8193) : "SYNTHETIC_INVALID_JSON");
            }
            await assert.rejects(() => moduleHarness(box.dataDir));
            assert.equal(readFileSync(sentinel, "utf8"), "SYNTHETIC_UNCHANGED");
        } finally {
            restore();
            box.cleanup();
        }
    });

test("aborted and unloaded saves preserve valid file and memory with no temporary residue", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const first = await h.call("GET", "config");
        const saved = await h.call("POST", "config", {
            settings: fullSettings({ maxNodes: 4 }),
            revision: first.revision,
        });
        const bytes = readFileSync(box.file);
        const stop = new AbortController();
        stop.abort();
        await assert.rejects(
            () =>
                h.call(
                    "POST",
                    "config",
                    { settings: fullSettings({ maxNodes: 6 }), revision: saved.revision },
                    "owner",
                    stop.signal,
                ),
            statusIs(408),
        );
        await h.dispose();
        await assert.rejects(
            () =>
                h.call("POST", "config", {
                    settings: fullSettings({ maxNodes: 6 }),
                    revision: saved.revision,
                }),
            statusIs(408),
        );
        assert.deepEqual(readFileSync(box.file), bytes);
        await assert.rejects(() => h.call("GET", "config"), statusIs(408));
        const live = await moduleHarness(box.dataDir);
        assert.equal((await live.call("GET", "config")).effective.maxNodes, 4);
        assert.deepEqual(readFileSync(box.file), bytes);
        await live.dispose();
        assert.deepEqual(readdirSync(box.directory), ["config.json"]);
        chmodSync(box.directory, 0o700);
        rmSync(box.file);
    } finally {
        restore();
        box.cleanup();
    }
});

test("two factory versions sharing one directory cannot both commit the same revision", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const a = await moduleHarness(box.dataDir);
        const b = await moduleHarness(box.dataDir);
        const before = await a.call("GET", "config");
        assert.equal((await b.call("GET", "config")).revision, before.revision);
        const results = await Promise.allSettled([
            a.call("POST", "config", { settings: fullSettings({ maxNodes: 4 }), revision: before.revision }),
            b.call("POST", "config", { settings: fullSettings({ maxNodes: 5 }), revision: before.revision }),
        ]);
        const summary = {
            results: results.map((result) =>
                result.status === "fulfilled"
                    ? { status: result.status, view: result.value }
                    : { status: result.status, error: String(result.reason), http: result.reason?.status },
            ),
            disk: JSON.parse(readFileSync(box.file, "utf8")),
            a: await a.call("GET", "config"),
            b: await b.call("GET", "config"),
        };
        const evidence = process.env.IOT_TEST_EVIDENCE_DIR;
        if (evidence) {
            mkdirSync(evidence, { recursive: true });
            writeFileSync(join(evidence, "cross-factory-revision.json"), JSON.stringify(summary, null, 2));
        }
        assert.equal(
            results.filter((result) => result.status === "fulfilled").length,
            1,
            "only one version can commit the original disk revision",
        );
        const failed = results.find((result) => result.status === "rejected");
        assert.ok(failed?.status === "rejected" && statusIs(409)(failed.reason));
        assert.deepEqual(readdirSync(box.directory), ["config.json"]);
        await a.dispose();
        await b.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

test("failed config-path precommit preserves valid hot snapshot and unrelated bytes", async () => {
    const box = sandbox();
    const restore = withEnv(undefined);
    try {
        const h = await moduleHarness(box.dataDir);
        const original = await h.call("GET", "config");
        const saved = await h.call("POST", "config", {
            settings: fullSettings({ maxNodes: 4 }),
            revision: original.revision,
        });
        const bytes = readFileSync(box.file);
        rmSync(box.file);
        mkdirSync(box.file);
        writeFileSync(join(box.file, "sentinel"), bytes);
        await assert.rejects(
            () =>
                h.call("POST", "config", {
                    settings: fullSettings({ maxNodes: 6 }),
                    revision: saved.revision,
                }),
            statusIs(500),
        );
        await assert.rejects(() => h.call("GET", "config"), statusIs(500));
        assert.deepEqual(readFileSync(join(box.file, "sentinel")), bytes);
        assert.deepEqual(readdirSync(box.directory), ["config.json"]);
        rmSync(box.file, { recursive: true });
        writeFileSync(box.file, bytes, { mode: 0o600 });
        const restored = await h.call("GET", "config");
        assert.equal(restored.effective.maxNodes, 4);
        assert.deepEqual(restored.effective, saved.effective);
        assert.deepEqual(restored.stored, saved.stored);
        assert.equal(restored.revision, saved.revision);
        assert.deepEqual(readFileSync(box.file), bytes);
        assert.equal(lstatSync(box.file).mode & 0o777, 0o600);
        assert.deepEqual(readdirSync(box.directory), ["config.json"]);
        await h.dispose();
    } finally {
        restore();
        box.cleanup();
    }
});

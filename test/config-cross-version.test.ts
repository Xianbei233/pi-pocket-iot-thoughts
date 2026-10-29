import assert from "node:assert/strict";
import { chmodSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { test } from "node:test";
import { fullSettings, moduleHarness, noteFixture, sandbox, statusIs } from "./config-support.ts";

// These supplement, and do not replace, the original cross-factory single-winner and getter assertions.
test("a previously loaded factory refreshes committed settings on GET and next tool call", async () => {
    const box = sandbox();
    try {
        const old = await moduleHarness(box.dataDir);
        const fresh = await moduleHarness(box.dataDir);
        const initial = await old.call("GET", "config");
        const saved = await fresh.call("POST", "config", {
            settings: fullSettings({ enabled: false }),
            revision: initial.revision,
        });
        const actual = await old.invoke(noteFixture);
        assert.equal(
            actual.payload.reason,
            "disabled",
            "next tool call must not use an indefinitely stale factory snapshot",
        );
        const refreshed = await old.call("GET", "config");
        assert.deepEqual(refreshed.stored, saved.stored);
        assert.deepEqual(refreshed.effective, saved.effective);
        assert.equal(refreshed.revision, saved.revision);
        await old.dispose();
        await fresh.dispose();
    } finally {
        box.cleanup();
    }
});

test("external valid settings refresh safely without accepting the old revision for a save", async () => {
    const box = sandbox();
    try {
        const h = await moduleHarness(box.dataDir);
        const initial = await h.call("GET", "config");
        mkdirSync(box.directory, { mode: 0o700 });
        writeFileSync(box.file, JSON.stringify(fullSettings({ enabled: false })), { mode: 0o600 });
        await assert.rejects(
            () => h.call("POST", "config", { settings: fullSettings(), revision: initial.revision }),
            statusIs(409),
        );
        assert.equal((await h.invoke(noteFixture)).payload.reason, "disabled");
        assert.equal((await h.call("GET", "config")).effective.enabled, false);
        await h.dispose();
    } finally {
        box.cleanup();
    }
});

test("an existing own directory must actually become 0700 before a successful save", async () => {
    const box = sandbox();
    try {
        mkdirSync(box.directory, { mode: 0o755 });
        chmodSync(box.directory, 0o755);
        const h = await moduleHarness(box.dataDir);
        const initial = await h.call("GET", "config");
        await h.call("POST", "config", {
            settings: fullSettings({ maxNodes: 4 }),
            revision: initial.revision,
        });
        assert.equal(lstatSync(box.directory).mode & 0o777, 0o700);
        assert.equal(lstatSync(box.file).mode & 0o777, 0o600);
        assert.deepEqual(
            readdirSync(box.directory),
            ["config.json"],
            "owned locks and temporary files must be cleaned after success",
        );
        await h.dispose();
    } finally {
        box.cleanup();
    }
});

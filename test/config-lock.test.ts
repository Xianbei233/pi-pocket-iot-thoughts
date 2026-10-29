import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import { fullSettings, moduleHarness, sandbox, statusIs } from "./config-support.ts";

test("foreign own-path lock yields bounded 409 without removing it or changing config", async () => {
    const box = sandbox();
    try {
        const h = await moduleHarness(box.dataDir);
        const initial = await h.call("GET", "config");
        mkdirSync(box.directory, { mode: 0o700 });
        const lock = join(box.directory, "config.lock");
        writeFileSync(lock, "SYNTHETIC_FOREIGN_LOCK", { mode: 0o600 });
        const started = Date.now();
        await assert.rejects(
            () =>
                h.call("POST", "config", {
                    settings: fullSettings({ maxNodes: 4 }),
                    revision: initial.revision,
                }),
            statusIs(409),
        );
        assert.ok(Date.now() - started < 5000);
        assert.equal(readFileSync(lock, "utf8"), "SYNTHETIC_FOREIGN_LOCK");
        assert.equal(existsSync(box.file), false);
        assert.deepEqual(readdirSync(box.directory), ["config.lock"]);
        await h.dispose();
    } finally {
        box.cleanup();
    }
});

test("disposal while waiting for another version lock aborts before commit and leaves foreign lock", async () => {
    const box = sandbox();
    try {
        const h = await moduleHarness(box.dataDir);
        const initial = await h.call("GET", "config");
        mkdirSync(box.directory, { mode: 0o700 });
        const lock = join(box.directory, "config.lock");
        writeFileSync(lock, "SYNTHETIC_FOREIGN_LOCK", { mode: 0o600 });
        const pending = h.call("POST", "config", {
            settings: fullSettings({ maxNodes: 4 }),
            revision: initial.revision,
        });
        const caught = assert.rejects(() => pending);
        await delay(30);
        await h.dispose();
        await caught;
        assert.equal(existsSync(box.file), false);
        assert.equal(readFileSync(lock, "utf8"), "SYNTHETIC_FOREIGN_LOCK");
        assert.deepEqual(readdirSync(box.directory), ["config.lock"]);
    } finally {
        box.cleanup();
    }
});

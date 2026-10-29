import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
    copyFileSync,
    cpSync,
    existsSync,
    lstatSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    readdirSync,
    rmSync,
    symlinkSync,
    unlinkSync,
    writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";

const project = resolve(import.meta.dirname, "..");
const evidence = process.env.IOT_TEST_EVIDENCE_DIR ?? join(project, "evidence");
const roots = [
    "package.json",
    "iot-thoughts.ts",
    "manifest.json",
    "config.example.json",
    "README.md",
    "LICENSE",
    "PROVENANCE.md",
];
function sandbox() {
    const dir = mkdtempSync(join(tmpdir(), "iot-package-test-"));
    const clone = join(dir, "project");
    mkdirSync(clone);
    for (const file of roots) copyFileSync(join(project, file), join(clone, file));
    for (const sub of ["scripts", "docs", "iot-thoughts"])
        cpSync(join(project, sub), join(clone, sub), { recursive: true, dereference: false });
    return { dir, clone, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}
function runScript(clone: string, name: string, label: string, extra: Record<string, string> = {}) {
    const result = spawnSync(process.execPath, [join(clone, "scripts", name)], {
        cwd: clone,
        encoding: "utf8",
        timeout: 30000,
        env: {
            ...process.env,
            npm_config_offline: "true",
            npm_config_cache: join(clone, "local-cache"),
            ...extra,
        },
    });
    writeFileSync(
        join(evidence, `${label}.log`),
        `${result.stdout ?? ""}${result.stderr ?? ""}${result.error ? String(result.error) : ""}`,
    );
    writeFileSync(join(evidence, `${label}.exit`), `${result.status ?? result.signal ?? "spawn-error"}\n`);
    return result;
}

for (const shape of ["directory-symlink", "dangling-symlink", "regular-file"] as const) {
    test(`link script refuses ${shape} node_modules without modifying external target`, () => {
        const box = sandbox();
        try {
            const fakePocket = join(box.dir, "fake-pocket");
            mkdirSync(join(fakePocket, "node_modules", "typescript"), { recursive: true });
            mkdirSync(join(fakePocket, "types"));
            writeFileSync(join(fakePocket, "types", "pocket.d.ts"), "// synthetic types\n");
            const external = join(box.dir, "outside");
            mkdirSync(external);
            writeFileSync(join(external, "sentinel.txt"), "SYNTHETIC_UNCHANGED");
            const before = readdirSync(external);
            const target = join(box.clone, "node_modules");
            if (shape === "regular-file") writeFileSync(target, "SYNTHETIC_FILE");
            else
                symlinkSync(
                    shape === "directory-symlink" ? external : join(box.dir, "does-not-exist"),
                    target,
                    "dir",
                );
            const result = runScript(box.clone, "link-pocket.mjs", `link-${shape}`, {
                POCKET_ROOT: fakePocket,
            });
            assert.notEqual(result.status, 0);
            assert.deepEqual(readdirSync(external), before);
            assert.equal(readFileSync(join(external, "sentinel.txt"), "utf8"), "SYNTHETIC_UNCHANGED");
            assert.ok(!existsSync(join(box.clone, "_pocket.d.ts")));
            if (shape !== "regular-file") assert.ok(lstatSync(target).isSymbolicLink());
        } finally {
            box.cleanup();
        }
    });
}

for (const unexpected of ["docs/private.txt", "scripts/extra.mjs", "iot-thoughts/private.txt"]) {
    test(`offline pack refuses unexpected ${unexpected} instead of including prefix contents`, () => {
        const box = sandbox();
        try {
            writeFileSync(join(box.clone, unexpected), "SYNTHETIC_UNEXPECTED_PAYLOAD\n");
            const result = runScript(box.clone, "pack.mjs", `pack-reject-${unexpected.replaceAll("/", "-")}`);
            assert.notEqual(result.status, 0);
            assert.ok(!existsSync(join(box.clone, "dist", "pi-pocket-iot-thoughts-0.2.0.tgz")));
        } finally {
            box.cleanup();
        }
    });
}

for (const payload of [
    "iot-thoughts.ts",
    "manifest.json",
    "iot-thoughts/index.js",
    "iot-thoughts/style.css",
]) {
    test(`offline pack refuses symlink payload ${payload}`, () => {
        const box = sandbox();
        try {
            const outside = join(box.dir, "outside-synthetic-payload");
            const original = readFileSync(join(box.clone, payload));
            writeFileSync(outside, original);
            unlinkSync(join(box.clone, payload));
            symlinkSync(outside, join(box.clone, payload));
            const result = runScript(
                box.clone,
                "pack.mjs",
                `pack-reject-symlink-${payload.replaceAll("/", "-").replaceAll(".", "-")}`,
            );
            assert.notEqual(result.status, 0);
            assert.deepEqual(readFileSync(outside), original);
        } finally {
            box.cleanup();
        }
    });
}

test("offline pack rejects a tampered source digest", () => {
    const box = sandbox();
    try {
        writeFileSync(
            join(box.clone, "iot-thoughts.ts"),
            readFileSync(join(box.clone, "iot-thoughts.ts"), "utf8") + "\n// synthetic digest tamper\n",
        );
        const result = runScript(box.clone, "pack.mjs", "pack-reject-tampered-hash");
        assert.notEqual(result.status, 0);
    } finally {
        box.cleanup();
    }
});

test("actual offline pack succeeds only with complete hashed manifest and allowlisted regular payload", () => {
    const box = sandbox();
    try {
        const manifest = JSON.parse(readFileSync(join(box.clone, "manifest.json"), "utf8"));
        assert.ok(
            manifest.hashes && typeof manifest.hashes === "object",
            "manifest must contain final source/payload hashes",
        );
        assert.equal(manifest.module, "iot-thoughts.ts");
        assert.equal(manifest.capabilities.network, false);
        assert.equal(manifest.capabilities.modelCalls, false);
        assert.equal(
            manifest.capabilities.filesystem,
            "own config only: <dataDir>/x.iot-thoughts/config.json",
        );
        assert.equal(
            manifest.hashes["iot-thoughts.ts"],
            createHash("sha256")
                .update(readFileSync(join(box.clone, "iot-thoughts.ts")))
                .digest("hex"),
        );
        for (const [path, digest] of Object.entries(manifest.hashes)) {
            assert.ok(
                roots.includes(path) ||
                    /^docs\/[\w.-]+\.md$/.test(path) ||
                    /^scripts\/[\w.-]+\.mjs$/.test(path) ||
                    ["iot-thoughts/index.js", "iot-thoughts/style.css"].includes(path),
            );
            const entry = join(box.clone, path);
            assert.ok(lstatSync(entry).isFile() && !lstatSync(entry).isSymbolicLink());
            assert.equal(createHash("sha256").update(readFileSync(entry)).digest("hex"), digest, path);
        }
        const result = runScript(box.clone, "pack.mjs", "pack-valid");
        assert.equal(result.status, 0, result.stdout + result.stderr);
        const tarball = join(box.clone, "dist", "pi-pocket-iot-thoughts-0.2.0.tgz");
        const entries = execFileSync("tar", ["-tzf", tarball], { encoding: "utf8", timeout: 10000 })
            .trim()
            .split("\n");
        assert.ok(entries.includes("package/iot-thoughts.ts"));
        assert.deepEqual(
            entries.slice().sort(),
            [
                ...roots.map((path) => `package/${path}`),
                "package/docs/design.md",
                "package/docs/install.md",
                "package/iot-thoughts/index.js",
                "package/iot-thoughts/style.css",
            ].sort(),
        );
        for (const path of ["iot-thoughts/index.js", "iot-thoughts/style.css"]) {
            assert.ok(Object.hasOwn(manifest.hashes, path));
            const client = execFileSync("tar", ["-xOzf", tarball, `package/${path}`], { timeout: 10000 });
            assert.equal(createHash("sha256").update(client).digest("hex"), manifest.hashes[path]);
        }
        assert.ok(entries.every((entry) => !/node_modules|test\/|evidence\/|\.probe|\.git/.test(entry)));
        const bytes = execFileSync("tar", ["-xOzf", tarball, "package/iot-thoughts.ts"], { timeout: 10000 });
        assert.equal(createHash("sha256").update(bytes).digest("hex"), manifest.hashes["iot-thoughts.ts"]);
        mkdirSync(join(evidence, "artifacts"), { recursive: true });
        copyFileSync(tarball, join(evidence, "artifacts", "verified-script-output.tgz"));
    } finally {
        box.cleanup();
    }
});

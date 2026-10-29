#!/usr/bin/env node
/**
 * Pack the installable tarball without installing anything or contacting a registry.
 *
 * A fixed file list and the manifest's SHA-256 digests must both agree with the files on disk. npm's `files` allowlist
 * is checked again after the dry run, so a test, evidence, node_modules, or upstream file cannot slip in. The local
 * development link script stays out of the package.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const TARBALL = `pi-pocket-iot-thoughts-${String(packageJson.version)}.tgz`;
const expectedFiles = [
    "package.json",
    "iot-thoughts.ts",
    "iot-thoughts/index.js",
    "iot-thoughts/style.css",
    "manifest.json",
    "config.example.json",
    "README.md",
    "LICENSE",
    "PROVENANCE.md",
    "docs/design.md",
    "docs/install.md",
];
const expected = new Set(expectedFiles);
// Local development files that may exist beside the module but are never shipped.
const knownUnshipped = new Set(["scripts/link-pocket.mjs", "scripts/pack.mjs", "scripts/hash-manifest.mjs"]);

function filesUnder(directory) {
    const absolute = join(root, directory);
    if (!existsSync(absolute)) {
        return [];
    }
    return readdirSync(absolute, { withFileTypes: true })
        .filter((entry) => entry.isFile() || entry.isSymbolicLink())
        .map((entry) => `${directory}/${entry.name}`)
        .sort();
}

function refuse(message) {
    console.error(`pack: refusing, ${message}`);
    process.exit(1);
}

function sha256(bytes) {
    return createHash("sha256").update(bytes).digest("hex");
}

for (const directory of ["docs", "scripts", "iot-thoughts"]) {
    for (const path of filesUnder(directory)) {
        if (!expected.has(path) && !knownUnshipped.has(path)) {
            refuse(`unexpected file on disk: ${path}`);
        }
    }
}

const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
const hashes = manifest.hashes;
if (hashes === null || typeof hashes !== "object" || Array.isArray(hashes)) {
    refuse("manifest hashes are not final (run this after independent test and acceptance).");
}
for (const path of expectedFiles) {
    if (path === "manifest.json") {
        continue;
    }
    const absolute = join(root, path);
    const entry = lstatSync(absolute, { throwIfNoEntry: false });
    if (entry === undefined || !entry.isFile() || entry.isSymbolicLink()) {
        refuse(`${path} is missing or is not a regular file.`);
    }
    const digest = sha256(readFileSync(absolute));
    if (hashes[path] !== digest) {
        refuse(`manifest digest for ${path} does not match the file.`);
    }
}

function npm(args) {
    return execFileSync("npm", args, {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, npm_config_offline: "true" },
    });
}

const dryRun = JSON.parse(npm(["pack", "--dry-run", "--json", "--ignore-scripts"]));
const files = dryRun[0]?.files?.map((entry) => entry.path) ?? [];
if (files.length === 0) {
    refuse("npm reported no files.");
}
const unexpected = files.filter((path) => !expected.has(path));
const missing = expectedFiles.filter((path) => !files.includes(path));
if (unexpected.length > 0) {
    refuse(`files outside the fixed list: ${unexpected.join(", ")}`);
}
if (missing.length > 0) {
    refuse(`files missing from the package: ${missing.join(", ")}`);
}

const destination = join(root, "dist");
mkdirSync(destination, { recursive: true });
const tarball = join(destination, TARBALL);
if (existsSync(tarball)) {
    refuse(`refusing to overwrite ${tarball}`);
}

npm(["pack", "--pack-destination", destination, "--ignore-scripts", "--json"]);
const bytes = readFileSync(tarball);
console.log(`pack: ${tarball}`);
console.log(`pack: ${bytes.length} bytes, ${files.length} files`);
console.log(`pack: sha256 ${sha256(bytes)}`);
console.log("pack: not installed, not published, not enabled.");

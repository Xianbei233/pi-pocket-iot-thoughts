#!/usr/bin/env node
/**
 * Write the SHA-256 of each shipped file into manifest.json.
 *
 * Run this after the last edit to a shipped file. It changes only manifest.json; it does not pack, install, or publish.
 * The manifest cannot contain its own digest.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const shipped = [
    "package.json",
    "iot-thoughts.ts",
    "iot-thoughts/index.js",
    "iot-thoughts/style.css",
    "config.example.json",
    "README.md",
    "LICENSE",
    "PROVENANCE.md",
    "docs/design.md",
    "docs/install.md",
];

const manifestPath = join(root, "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
manifest.hashes = {};
for (const path of shipped) {
    manifest.hashes[path] = createHash("sha256")
        .update(readFileSync(join(root, path)))
        .digest("hex");
}
manifest.hashesStatus = "candidate snapshot; regenerate after any edit to a shipped file";
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 4)}\n`);
console.log(`hash-manifest: wrote ${shipped.length} digests to manifest.json`);

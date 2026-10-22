#!/usr/bin/env node
/**
 * Link this checkout to an existing Pi Pocket installation for development and tests.
 *
 * It creates symlinks only inside this project (node_modules/… and ./_pocket.d.ts). It never copies Pi Pocket's files,
 * never runs a package manager, and never overwrites a real file or directory. Point it somewhere else with
 * POCKET_ROOT=/path/to/pi-pocket-production.
 */
import { existsSync, lstatSync, mkdirSync, readlinkSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pocketRoot = resolve(process.env.POCKET_ROOT ?? join(root, "..", "pi-pocket-production"));
const pocketModules = join(pocketRoot, "node_modules");

if (!existsSync(pocketModules)) {
    console.error(`link-pocket: no node_modules at ${pocketModules}`);
    console.error("link-pocket: set POCKET_ROOT to the Pi Pocket checkout and try again.");
    process.exit(1);
}

// Refuse a project node_modules that is itself a symlink (it could point outside this project) or a non-directory.
// Nothing is unlinked or redirected; the script stops before writing.
const modulesPath = join(root, "node_modules");
const modulesEntry = lstatSync(modulesPath, { throwIfNoEntry: false });
if (modulesEntry !== undefined && (!modulesEntry.isDirectory() || modulesEntry.isSymbolicLink())) {
    console.error(`link-pocket: refusing ${modulesPath} (it must be a real directory, not a symlink)`);
    process.exit(1);
}

const packageLinks = [
    "@earendil-works",
    "@types",
    "@eslint",
    "@stylistic",
    "typescript",
    "typescript-eslint",
    "eslint",
    "eslint-config-prettier",
    "prettier",
    ".bin",
];

let failures = 0;

function link(target, destination) {
    const existing = lstatSync(destination, { throwIfNoEntry: false });
    if (existing !== undefined) {
        if (
            existing.isSymbolicLink() &&
            resolve(dirname(destination), readlinkSync(destination)) === target
        ) {
            console.log(`link-pocket: ok       ${destination}`);
            return;
        }
        console.error(`link-pocket: refusing ${destination} (it already exists and is not this link)`);
        failures += 1;
        return;
    }
    symlinkSync(target, destination, "dir");
    console.log(`link-pocket: linked   ${destination}`);
}

mkdirSync(modulesPath, { recursive: true });
for (const name of packageLinks) {
    const target = join(pocketModules, name);
    if (!existsSync(target)) {
        console.warn(`link-pocket: missing  ${target} (skipped)`);
        continue;
    }
    link(target, join(modulesPath, name));
}

const typesSource = join(pocketRoot, "types", "pocket.d.ts");
if (!existsSync(typesSource)) {
    console.error(`link-pocket: no types file at ${typesSource}`);
    failures += 1;
} else {
    const destination = join(root, "_pocket.d.ts");
    const existing = lstatSync(destination, { throwIfNoEntry: false });
    if (existing === undefined) {
        symlinkSync(typesSource, destination, "file");
        console.log(`link-pocket: linked   ${destination}`);
    } else if (
        existing.isSymbolicLink() &&
        resolve(dirname(destination), readlinkSync(destination)) === typesSource
    ) {
        console.log(`link-pocket: ok       ${destination}`);
    } else {
        console.error(`link-pocket: refusing ${destination} (it already exists and is not this link)`);
        failures += 1;
    }
}

if (failures > 0) {
    console.error(`link-pocket: ${failures} path(s) refused; nothing outside this project was changed.`);
    process.exit(1);
}
console.log("link-pocket: done. Development links only; do not commit node_modules or _pocket.d.ts.");

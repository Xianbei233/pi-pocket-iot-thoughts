// Actual Pocket helpers first: isolate agent/home/work/data before the application imports.
import {
    cleanUp,
    context,
    newSession,
    openApp,
    owner,
    root,
    say,
    scriptedModel,
    type App,
} from "/home/xianbei233/Work/pi-pocket-production/test/helpers.ts";
import assert from "node:assert/strict";
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { join, resolve } from "node:path";
import { after, test } from "node:test";
import { execFileSync } from "node:child_process";
import { fauxAssistantMessage, fauxText, fauxToolCall } from "@earendil-works/pi-ai/providers/faux";
import { createHandler } from "/home/xianbei233/Work/pi-pocket-production/src/server/http.ts";
import { DEFAULT_CONFIG } from "../iot-thoughts.ts";
import type { ConfigView } from "./config-support.ts";
const project = resolve(import.meta.dirname, "..");
const evidence = process.env.IOT_TEST_EVIDENCE_DIR ?? join(project, "evidence/config-ui/http");
const data = join(root, "config-http-data");
const notes =
    "Support: A local prototype helps.\nPlan: Run local checks tomorrow.\nTradeoff: Less detail means shorter display.\n" +
    "Neutral: A synthetic observation.\n".repeat(24);
let providerCalls = 0;
const model = scriptedModel((input) => {
    providerCalls++;
    const last = input.messages.findLast((message) => message.role !== "system");
    return last?.role === "toolResult"
        ? fauxAssistantMessage([fauxText("synthetic result received")])
        : fauxAssistantMessage([fauxToolCall("iot_thoughts_compact", { text: notes })], {
              stopReason: "toolUse",
          });
});
let app: App | undefined;
let server: Server | undefined;
after(async () => {
    server?.closeAllConnections();
    server?.close();
    await app?.close();
    cleanUp();
});
function install() {
    const extensions = join(data, "extensions");
    mkdirSync(extensions, { recursive: true });
    const candidate = process.env.IOT_TEST_DIST_PACKAGE;
    if (candidate)
        execFileSync(
            "tar",
            [
                "-xzf",
                candidate,
                "-C",
                extensions,
                "--strip-components=1",
                "package/iot-thoughts.ts",
                "package/iot-thoughts/index.js",
                "package/iot-thoughts/style.css",
            ],
            { timeout: 10000 },
        );
    else {
        copyFileSync(join(project, "iot-thoughts.ts"), join(extensions, "iot-thoughts.ts"));
        cpSync(join(project, "iot-thoughts"), join(extensions, "iot-thoughts"), { recursive: true });
    }
}

test(
    "real Pocket owner-only config routes, persisted hot apply and restart use actual native faux",
    { timeout: 115000 },
    async () => {
        mkdirSync(evidence, { recursive: true });
        install();
        app = await openApp(model, data);
        const added = [
            app.config.addUser("Guest", "guest"),
            app.config.addUser("Viewer", "viewer"),
            app.config.addUser("Single", "guest", ["1"]),
        ];
        await app.setExtensionEnabled(owner(app), "iot-thoughts.ts", true);
        const loaded = (await app.extensions(owner(app))).modules.find(
            (module) => module.file === "iot-thoughts.ts",
        );
        assert.equal(loaded?.error, undefined);
        server = createServer(
            createHandler({ app, listen: { host: "127.0.0.2", port: 0 }, restart: () => {} }),
        );
        await new Promise<void>((resolve) => server!.listen(0, "127.0.0.2", resolve));
        const address = server.address();
        assert.ok(address && typeof address === "object");
        const base = "http://127.0.0.2:" + address.port;
        const call = async (token: string | null, path: string, body?: unknown, header = true) => {
            const response = await fetch(base + path, {
                method: body === undefined ? "GET" : "POST",
                headers: {
                    ...(token ? { authorization: "Bearer " + token } : {}),
                    ...(header ? { "x-pocket": "1" } : {}),
                    ...(body === undefined ? {} : { "content-type": "application/json" }),
                },
                ...(body === undefined ? {} : { body: JSON.stringify(body) }),
            });
            return { status: response.status, text: await response.text() };
        };
        const ownerToken = app.config.ownerToken;
        const configPath = "/api/x/iot-thoughts/config";
        const initial = await call(ownerToken, configPath);
        assert.equal(initial.status, 200);
        const view: ConfigView = JSON.parse(initial.text);
        assert.deepEqual(view.effective, DEFAULT_CONFIG);
        assert.equal(existsSync(join(data, "x.iot-thoughts", "config.json")), false);
        assert.equal((await call(null, configPath)).status, 401);
        assert.equal((await call(ownerToken, configPath, undefined, false)).status, 403);
        for (const person of added) {
            for (const [path, body] of [
                [configPath, undefined],
                [configPath, { settings: { ...DEFAULT_CONFIG, enabled: false }, revision: view.revision }],
                ["/api/x/iot-thoughts/reset", { confirm: true, revision: view.revision }],
            ] as const)
                assert.equal((await call(person.token, path, body)).status, 404);
            const me = JSON.parse((await call(person.token, "/api/me")).text);
            assert.ok(!me.server.ui.some((module: { module: string }) => module.module === "iot-thoughts"));
            assert.equal((await call(person.token, "/x/iot-thoughts/index.js")).status, 404);
        }
        assert.equal(existsSync(join(data, "x.iot-thoughts", "config.json")), false);
        const disabledResponse = await call(ownerToken, configPath, {
            settings: { ...DEFAULT_CONFIG, enabled: false },
            revision: view.revision,
        });
        assert.equal(disabledResponse.status, 200);
        const disabled: ConfigView = JSON.parse(disabledResponse.text);
        const toolResult = async (label: string) => {
            const id = await newSession(app!);
            const before = providerCalls;
            await say(app!, id, label);
            const transcript = await (await app!.harness.conversation(id, context))!.context(context);
            const raw = transcript.messages.findLast((message) => message.role === "toolResult");
            writeFileSync(join(evidence, label + "-raw.json"), JSON.stringify(raw, null, 2));
            assert.ok(raw?.role === "toolResult");
            assert.equal(raw.isError, false);
            const text = raw.content
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");
            const match = /<iot_thoughts_result>\n([\s\S]*)\n‹\/iot_thoughts_result>/.exec(text);
            assert.ok(match);
            const parsed: { reason: string; profile: string; nodes: unknown[] } = JSON.parse(match[1]!);
            assert.equal(providerCalls - before, 2);
            return parsed;
        };
        assert.equal((await toolResult("disabled")).reason, "disabled");
        const cappedResponse = await call(ownerToken, configPath, {
            settings: { ...DEFAULT_CONFIG, profile: "compact", maxNodes: 3 },
            revision: disabled.revision,
        });
        assert.equal(cappedResponse.status, 200);
        const capped: ConfigView = JSON.parse(cappedResponse.text);
        const actual = await toolResult("compact");
        assert.equal(actual.profile, "compact");
        assert.ok(actual.nodes.length <= 3);
        await app.reloadExtension("iot-thoughts.ts");
        assert.deepEqual(JSON.parse((await call(ownerToken, configPath)).text).stored, capped.stored);
        const invalid = await call(ownerToken, configPath, {
            settings: { ...DEFAULT_CONFIG, maxNodes: 99 },
            revision: capped.revision,
        });
        assert.equal(invalid.status, 400);
        const reset = await call(ownerToken, "/api/x/iot-thoughts/reset", {
            confirm: true,
            revision: capped.revision,
        });
        assert.equal(reset.status, 200);
        assert.deepEqual(JSON.parse(reset.text).effective, DEFAULT_CONFIG);
        server.closeAllConnections();
        await new Promise<void>((resolve) => server!.close(() => resolve()));
        server = undefined;
        await app.close();
        app = await openApp(model, data);
        assert.deepEqual(
            (await app.extensions(owner(app))).modules.find((module) => module.file === "iot-thoughts.ts")
                ?.enabled,
            true,
        );
        assert.deepEqual(
            JSON.parse(readFileSync(join(data, "x.iot-thoughts", "config.json"), "utf8")),
            DEFAULT_CONFIG,
        );
        assert.equal((await toolResult("restarted-defaults")).reason, "compacted");
        writeFileSync(
            join(evidence, "config-http-summary.json"),
            JSON.stringify(
                {
                    realLoader: true,
                    nativeFaux: true,
                    unauthorizedNoWrites: true,
                    hotDisabled: true,
                    hotProfileCap: true,
                    reload: true,
                    restart: true,
                    restoredDefaults: true,
                    paidProviderRequests: 0,
                },
                null,
                2,
            ),
        );
    },
);

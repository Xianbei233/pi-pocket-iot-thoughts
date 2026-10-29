// Actual Pocket helpers first. Only synthetic temporary app/data/users are used.
import { cleanUp, context, newSession, openApp, owner, root, say, scriptedModel } from "/home/xianbei233/Work/pi-pocket-production/test/helpers.ts";
import { createServer } from "node:http";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHandler } from "/home/xianbei233/Work/pi-pocket-production/src/server/http.ts";
import { fauxAssistantMessage, fauxText, fauxToolCall } from "@earendil-works/pi-ai/providers/faux";
const evidence = import.meta.dirname;
const candidate = process.env.IOT_TEST_DIST_PACKAGE;
if (!candidate) throw new Error("Exact candidate required");
const data = join(root, "ui-data"); const extensions = join(data, "extensions"); mkdirSync(extensions, { recursive: true });
execFileSync("tar", ["-xzf", candidate, "-C", extensions, "--strip-components=1", "package/iot-thoughts.ts", "package/iot-thoughts/index.js", "package/iot-thoughts/style.css"], { timeout: 10000 });
let calls = 0;
const notes = "Support: A useful local prototype.\nPlan: Run local tests tomorrow.\nTradeoff: Shorter display has less context.\n" + "Neutral: Synthetic background observation.\n".repeat(24);
const model = scriptedModel(input => { calls++; return input.messages.findLast(message => message.role !== "system")?.role === "toolResult" ? fauxAssistantMessage([fauxText("Synthetic tool result received")]) : fauxAssistantMessage([fauxToolCall("iot_thoughts_compact", { text: notes })], { stopReason: "toolUse" }); });
const app = await openApp(model, data); await app.setExtensionEnabled(owner(app), "iot-thoughts.ts", true);
const server = createServer(createHandler({ app, listen: { host: "127.0.0.2", port: 0 }, restart: () => {} }));
await new Promise<void>(resolve => server.listen(0, "127.0.0.2", resolve));
const address = server.address(); if (!address || typeof address === "string") throw new Error("No isolated server port");
const base = "http://127.0.0.2:" + address.port;
const guest = app.config.addUser("Synthetic Guest", "guest");
const receipt = { pid: process.pid, root, data, base, ownerLogin: base + "/login?token=" + encodeURIComponent(app.config.ownerToken), guestLogin: base + "/login?token=" + encodeURIComponent(guest.token), candidate, expiresAfterSeconds: 1800 };
writeFileSync(join(evidence, "server.json"), JSON.stringify(receipt, null, 2));
writeFileSync(join(evidence, "ready.txt"), base);
console.log("Isolated synthetic app ready: " + base);
const stop = async () => { server.closeAllConnections(); server.close(); await app.close(); cleanUp(); writeFileSync(join(evidence, "cleanup.json"), JSON.stringify({ closed: true, at: new Date().toISOString(), calls })); process.exit(0); };
process.on("SIGTERM", () => void stop()); process.on("SIGINT", () => void stop());
setTimeout(() => void stop(), 1800000).unref();
// Synthetic-only IPC through a polled own evidence request file. It exercises normal app APIs, never a production app.
let busy = false;
const timer = setInterval(() => { if (busy) return; busy = true; void (async () => {
    let request: { id: string; operation: string; env?: string };
    try { request = JSON.parse(readFileSync(join(evidence, "command.json"), "utf8")); } catch { return; }
    let previous: { id?: string } = {}; try { previous = JSON.parse(readFileSync(join(evidence, "command-result.json"), "utf8")); } catch {}
    if (previous.id === request.id) return;
    try {
        if (request.operation === "reload") { if (request.env === undefined) delete process.env.PI_POCKET_IOT_THOUGHTS_CONFIG; else process.env.PI_POCKET_IOT_THOUGHTS_CONFIG = request.env; await app.reloadExtension("iot-thoughts.ts"); writeFileSync(join(evidence, "command-result.json"), JSON.stringify({ id: request.id, reloaded: true, modules: (await app.extensions(owner(app))).modules.filter(m => m.file === "iot-thoughts.ts") })); }
        else if (request.operation === "tool") { const id = await newSession(app); const before = calls; await say(app, id, "Organize synthetic notes using current configuration"); const transcript = await (await app.harness.conversation(id, context))!.context(context); const raw = transcript.messages.findLast(message => message.role === "toolResult"); writeFileSync(join(evidence, "tool-" + request.id + ".json"), JSON.stringify(raw, null, 2)); writeFileSync(join(evidence, "command-result.json"), JSON.stringify({ id: request.id, raw, providerCalls: calls - before })); }
    } catch (error) { writeFileSync(join(evidence, "command-result.json"), JSON.stringify({ id: request.id, error: String(error) })); }
})().finally(() => { busy = false; }); }, 150); timer.unref();

import { BACKGROUND_CONTEXT, withAbortSignal } from "@earendil-works/chord/context";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import createIotThoughts, { DEFAULT_CONFIG, type Config } from "../iot-thoughts.ts";
import type { Host, Web, WebHandler, WebRequest } from "../_pocket.d.ts";

export interface ConfigView {
    schemaVersion: number;
    stored: Readonly<Config>;
    effective: Readonly<Config>;
    defaults: Readonly<Config>;
    environmentOverrides: Partial<Config>;
    revision: string;
    sources: Record<keyof Config, string>;
    runtime: { moduleLoaded: boolean; algorithmEnabled: boolean; hotApply: boolean };
}
export function sandbox() {
    const dataDir = mkdtempSync(join(tmpdir(), "iot-config-test-"));
    return {
        dataDir,
        directory: join(dataDir, "x.iot-thoughts"),
        file: join(dataDir, "x.iot-thoughts", "config.json"),
        cleanup: () => rmSync(dataDir, { recursive: true, force: true }),
    };
}
export async function moduleHarness(dataDir: string) {
    const routes = new Map<string, { handler: WebHandler; access: unknown }>();
    const clients: { entry: string; access: unknown }[] = [];
    const cleanups: (() => unknown)[] = [];
    const host = {
        dataDir,
        text: { defang: (text: string) => text.replace(/<(?=[^<>]{0,80}\/)/g, "‹") },
    } as unknown as Host;
    const web = {
        route: (method: string, path: string, handler: WebHandler, options?: { access?: string }) =>
            routes.set(method + " " + path, { handler, access: options?.access }),
        client: (entry: string, options?: { access?: string }) =>
            clients.push({ entry, access: options?.access }),
        error: (status: number, message: string) => Object.assign(new Error(message), { status }),
        onDispose: (run: () => unknown) => cleanups.push(run),
    } as unknown as Web;
    const extension = await createIotThoughts(host, web);
    async function call(
        method: string,
        path: string,
        body: unknown = {},
        role = "owner",
        signal = new AbortController().signal,
    ): Promise<ConfigView> {
        const route = routes.get(method + " " + path);
        if (!route) throw new Error("Missing expected route " + method + " " + path);
        return (await route.handler({
            method,
            body,
            user: { id: "synthetic", name: "Synthetic", role },
            signal,
        } as unknown as WebRequest)) as ConfigView;
    }
    async function invoke(text: string, profile?: Config["profile"], signal?: AbortSignal) {
        const result = await extension.tools![0]!.execute(
            { text, ...(profile === undefined ? {} : { profile }) },
            {} as never,
            signal ? withAbortSignal(signal, BACKGROUND_CONTEXT) : BACKGROUND_CONTEXT,
        );
        const raw =
            result?.output
                ?.filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("") ?? "";
        const match = /<iot_thoughts_result>\n([\s\S]*)\n‹\/iot_thoughts_result>/.exec(raw);
        if (!match) throw new Error("No complete result fence");
        const payload: {
            status: string;
            reason: string;
            profile: string;
            nodes: { text: string; tag: string; start: number; end: number }[];
            text: string;
        } = JSON.parse(match[1]!);
        return { raw, payload };
    }
    return {
        routes,
        clients,
        extension,
        call,
        invoke,
        dispose: async () => {
            for (const run of cleanups) await run();
        },
    };
}
export const fullSettings = (extra: Partial<Config> = {}) => ({ ...DEFAULT_CONFIG, ...extra });
export const statusIs = (status: number) => (error: unknown) =>
    error !== null && typeof error === "object" && "status" in error && error.status === status;
export const noteFixture =
    "Support: Keep the local prototype.\nPlan: Test locally tomorrow.\nTradeoff: Shorter output costs context.\n" +
    "Neutral: Synthetic background observation.\n".repeat(24);

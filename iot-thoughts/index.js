/**
 * Owner settings page for the IoT notes module.
 *
 * It calls only this module's own routes through `pocket.api`. It never touches the app's private API, and it keeps no
 * settings of its own: the server owns persistence and tells this page the stored and effective values.
 */

export const pocketApi = 2;

/** @typedef {"compact"|"balanced"|"full"} Profile */
/** @typedef {"default"|"saved"|"env"} Source */
/**
 * @typedef {object} Settings
 * @property {boolean} enabled
 * @property {Profile} profile
 * @property {number} minChars
 * @property {number} maxInputChars
 * @property {number} maxNodes
 * @property {number} maxOutputChars
 * @property {number} timeoutMs
 */
/**
 * @typedef {object} View
 * @property {number} schemaVersion
 * @property {Settings} stored
 * @property {Settings} effective
 * @property {Settings} defaults
 * @property {Partial<Settings>} environmentOverrides
 * @property {Record<string, Source>} sources
 * @property {string} revision
 * @property {{moduleLoaded:boolean,algorithmEnabled:boolean,hotApply:boolean}} runtime
 * @property {Record<string, unknown>} limits
 */

const FIELDS = [
    {
        key: "minChars",
        label: "最小字符数 / Minimum characters",
        hint: "短于此值的输入保留原文。单位：UTF-16 单元。范围 0–64000。 Inputs shorter than this stay unchanged; UTF-16 units, 0–64000.",
        min: 0,
        max: 64000,
    },
    {
        key: "maxInputChars",
        label: "最大输入字符数 / Maximum input characters",
        hint: "超过即拒绝，不截断。单位：UTF-16 单元。范围 100–64000。 Larger input is rejected, not truncated; UTF-16 units, 100–64000.",
        min: 100,
        max: 64000,
    },
    {
        key: "maxNodes",
        label: "最大节点数 / Maximum nodes",
        hint: "一次整理最多返回的节点数。范围 1–16。 Maximum nodes returned by one extraction; 1–16.",
        min: 1,
        max: 16,
    },
    {
        key: "maxOutputChars",
        label: "最大输出字符数 / Maximum output characters",
        hint: "压缩结果的字符上限，且不得大于最大输入字符数。单位：UTF-16 单元。 Output limit, at most the input limit; UTF-16 units.",
        min: 100,
        max: 64000,
    },
    {
        key: "timeoutMs",
        label: "超时 / Timeout",
        hint: "一次整理的时间上限。单位：毫秒。范围 10–5000。 Time limit for one extraction; milliseconds, 10–5000.",
        min: 10,
        max: 5000,
    },
];

/** @type {Record<Source, string>} */
const SOURCE_LABEL = {
    default: "默认 / default",
    saved: "已保存 / saved",
    env: "环境锁定 / env",
};

/** @param {import("../_pocket.d.ts").Pocket} pocket */
export default function setup(pocket) {
    const { html, useEffect, useRef, useState, Loader, Switch } = pocket;
    pocket.style("style.css");

    /** @param {unknown} value */
    function messageOf(value) {
        return value instanceof Error && value.message ? value.message : "请求失败 / Request failed";
    }

    /** @param {Settings} form */
    function problems(form) {
        for (const field of FIELDS) {
            const value = /** @type {Record<string, unknown>} */ (form)[field.key];
            if (
                typeof value !== "number" ||
                !Number.isInteger(value) ||
                value < field.min ||
                value > field.max
            ) {
                return `${field.label}：请填写 ${field.min}–${field.max} 的整数。 / Enter a whole number from ${field.min} to ${field.max}.`;
            }
        }
        if (Number(form.minChars) > Number(form.maxInputChars)) {
            return "最小字符数不得大于最大输入字符数。 / Minimum characters must not exceed maximum input characters.";
        }
        if (Number(form.maxOutputChars) > Number(form.maxInputChars)) {
            return "最大输出字符数不得大于最大输入字符数。 / Maximum output characters must not exceed maximum input characters.";
        }
        if (form.profile !== "compact" && form.profile !== "balanced" && form.profile !== "full") {
            return "profile 必须是 compact、balanced 或 full。 / Profile must be compact, balanced, or full.";
        }
        if (typeof form.enabled !== "boolean") {
            return "enabled 必须是布尔值。 / Enabled must be a boolean.";
        }
        return "";
    }

    function SettingsPage() {
        const [view, setView] = useState(/** @type {View | null} */ (null));
        const [form, setForm] = useState(/** @type {Settings | null} */ (null));
        const [error, setError] = useState("");
        const [status, setStatus] = useState("");
        const [busy, setBusy] = useState(false);
        const [confirmReset, setConfirmReset] = useState(false);
        const active = useRef(/** @type {AbortController | null} */ (null));

        function stopActive() {
            if (active.current) {
                active.current.abort();
                active.current = null;
            }
        }

        /** @param {View} next */
        function apply(next) {
            setView(next);
            setForm({ ...next.stored });
        }

        /** @param {boolean} clearStatus */
        function load(clearStatus) {
            stopActive();
            const request = new AbortController();
            active.current = request;
            setBusy(true);
            if (clearStatus) {
                setError("");
                setStatus("");
            }
            pocket.api("config", undefined, { signal: request.signal }).then(
                (next) => {
                    if (!request.signal.aborted) {
                        apply(/** @type {View} */ (next));
                        setBusy(false);
                    }
                },
                (failure) => {
                    if (!request.signal.aborted) {
                        setError(`${messageOf(failure)}（已刷新，未确认保存 / not saved）`);
                        setBusy(false);
                    }
                },
            );
        }

        useEffect(() => {
            load(false);
            return stopActive;
        }, []);

        if (!view || !form) {
            return html`<div class="iot-page">
                ${error ? html`<div class="error-box" role="alert">${error}</div>` : html`<${Loader} label="正在读取 IoT 配置 / Loading IoT settings" />`}
            </div>`;
        }

        /** @param {string} key */
        const locked = (key) => view.sources[key] === "env";
        const stored = view.stored;
        const effective = view.effective;

        /**
         * @param {string} key
         * @param {unknown} value
         */
        function setField(key, value) {
            setForm((/** @type {Settings | null} */ current) =>
                current ? { ...current, [key]: value } : current,
            );
            setStatus("");
        }

        /** @param {Event} event */
        function onProfile(event) {
            const target = /** @type {HTMLSelectElement} */ (event.currentTarget);
            setField("profile", target.value);
        }

        /**
         * @param {string} key
         * @returns {(event: Event) => void}
         */
        function onNumber(key) {
            return (event) => {
                const target = /** @type {HTMLInputElement} */ (event.currentTarget);
                setField(key, target.value === "" ? "" : Number(target.value));
            };
        }

        function save() {
            const problem = problems(form);
            if (problem) {
                setError(problem);
                return;
            }
            setError("");
            setStatus("");
            setConfirmReset(false);
            stopActive();
            const request = new AbortController();
            active.current = request;
            setBusy(true);
            pocket
                .api("config", { settings: { ...form }, revision: view.revision }, { signal: request.signal })
                .then(
                    (next) => {
                        if (!request.signal.aborted) {
                            apply(/** @type {View} */ (next));
                            setStatus(
                                "已保存并即时生效，下一次工具调用使用新值 / Saved and applied to the next tool call",
                            );
                            setBusy(false);
                        }
                    },
                    (failure) => {
                        if (!request.signal.aborted) {
                            const conflict = failure && failure.status === 409;
                            setError(
                                conflict
                                    ? "配置已在其他标签页更新，页面已刷新，请重新保存 / Changed in another tab; reloaded, save again"
                                    : `${messageOf(failure)}（未保存 / not saved）`,
                            );
                            setBusy(false);
                            if (conflict) load(false);
                        }
                    },
                );
        }

        function reset() {
            setError("");
            setStatus("");
            stopActive();
            const request = new AbortController();
            active.current = request;
            setBusy(true);
            pocket.api("reset", { confirm: true, revision: view.revision }, { signal: request.signal }).then(
                (next) => {
                    if (!request.signal.aborted) {
                        apply(/** @type {View} */ (next));
                        setConfirmReset(false);
                        setStatus(
                            "已恢复保存的默认值；环境变量仍会覆盖 / Saved defaults restored; environment overrides still win",
                        );
                        setBusy(false);
                    }
                },
                (failure) => {
                    if (!request.signal.aborted) {
                        const conflict = failure && failure.status === 409;
                        setError(
                            conflict
                                ? "配置已在其他标签页更新，页面已刷新，请重新确认 / Changed in another tab; reloaded"
                                : `${messageOf(failure)}（未重置 / not reset）`,
                        );
                        setBusy(false);
                        if (conflict) load(false);
                    }
                },
            );
        }

        return html`
            <div class="iot-page">
                <div class="iot-head">
                    <div>
                        <h2>IoT 配置 / IoT settings</h2>
                        <p class="small">
                            抽取算法保持确定性、离线。这里只调整该工具的运行上限；插件开关仍在 Menu →
                            Extensions。 / Extraction is deterministic and offline. This page changes limits
                            only; the plugin switch stays in Menu → Extensions.
                        </p>
                    </div>
                    <div class="iot-badges" aria-live="polite">
                        <span class="iot-badge">模块已加载 / module loaded</span>
                        <span class=${effective.enabled ? "iot-badge ok" : "iot-badge warn"}>
                            算法执行 / algorithm ${effective.enabled ? "on" : "off"}
                        </span>
                        <span class="iot-badge">热应用 / hot apply</span>
                    </div>
                </div>

                ${error ? html`<div class="error-box" role="alert">${error}</div>` : null}
                <p class="small" aria-live="polite">${status}</p>

                <section class="iot-card">
                    <div class="setting">
                        <div>
                            <span class="iot-label">启用整理算法 / Enable extraction</span>
                            <p class="small">
                                关闭后工具返回 kept，不改写原文。运行中的其他功能不变。 / When off, the tool
                                keeps the original text unchanged; other running features stay as they are.
                            </p>
                        </div>
                        <${Switch}
                            on=${form.enabled}
                            label="启用整理算法 / Enable extraction"
                            disabled=${busy || locked("enabled")}
                            onChange=${() => setField("enabled", !form.enabled)}
                        />
                    </div>
                    ${
                        locked("enabled")
                            ? html`<p class="small iot-lock">
                                  环境变量已锁定此项 / env locked：保存值 / stored
                                  ${String(stored.enabled)}，生效值 / effective
                                  ${String(effective.enabled)}。GUI 不能改进程环境 / cannot edit the process
                                  environment.
                              </p>`
                            : null
                    }

                    <div class="setting">
                        <div>
                            <label for="iot-profile">Profile</label>
                            <p class="small">
                                compact 节点更少，balanced 中等，full 上限最高。 / compact keeps fewer nodes,
                                balanced is middle, full has the highest ceiling.
                            </p>
                        </div>
                        <select
                            id="iot-profile"
                            value=${form.profile}
                            disabled=${busy || locked("profile")}
                            onChange=${onProfile}
                        >
                            <option value="compact">compact</option>
                            <option value="balanced">balanced</option>
                            <option value="full">full</option>
                        </select>
                    </div>
                    ${
                        locked("profile")
                            ? html`<p class="small iot-lock">
                                  环境变量已锁定 / env locked：保存值 / stored ${stored.profile}，生效值 /
                                  effective ${effective.profile}。
                              </p>`
                            : null
                    }
                </section>

                <section class="iot-card">
                    ${FIELDS.map((field) => {
                        const isLocked = locked(field.key);
                        return html`
                            <div class="setting iot-field" key=${field.key}>
                                <div>
                                    <label for=${`iot-${field.key}`}>${field.label}</label>
                                    <p class="small">
                                        ${field.hint}
                                        来源：${SOURCE_LABEL[/** @type {Source} */ (view.sources[field.key] ?? "default")]}
                                    </p>
                                </div>
                                <div class="iot-input-wrap">
                                    <input
                                        id=${`iot-${field.key}`}
                                        type="number"
                                        inputmode="numeric"
                                        min=${field.min}
                                        max=${field.max}
                                        step="1"
                                        value=${form[field.key]}
                                        disabled=${busy || isLocked}
                                        aria-describedby=${`iot-${field.key}-note`}
                                        onInput=${onNumber(field.key)}
                                    />
                                </div>
                                <p class="small iot-note" id=${`iot-${field.key}-note`}>
                                    ${
                                        isLocked
                                            ? `环境锁定 / env locked：保存值 / stored ${String(stored[field.key])}，生效值 / effective ${String(effective[field.key])}。`
                                            : `保存值 / stored ${String(stored[field.key])}，生效值 / effective ${String(effective[field.key])}。`
                                    }
                                </p>
                            </div>
                        `;
                    })}
                </section>

                <div class="iot-actions">
                    <button class="button primary" disabled=${busy} onClick=${save}>
                        ${busy ? "保存中 / Saving…" : "保存 / Save"}
                    </button>
                    <button class="button" disabled=${busy} onClick=${() => load(true)}>
                        刷新 / Refresh
                    </button>
                </div>

                <section class="iot-card iot-reset">
                    <h3>恢复保存的默认值 / Reset saved defaults</h3>
                    <p class="small">
                        只会写回默认保存值；环境变量仍然优先。 / Writes the saved defaults only; environment
                        overrides still win. It does not unload the module or change Pocket settings.
                    </p>
                    ${
                        confirmReset
                            ? html`<div class="iot-actions">
                                  <button class="button" disabled=${busy} onClick=${reset}>
                                      确认恢复 / Confirm reset
                                  </button>
                                  <button
                                      class="button"
                                      disabled=${busy}
                                      onClick=${() => setConfirmReset(false)}
                                  >
                                      取消 / Cancel
                                  </button>
                              </div>`
                            : html`<button
                                  class="button"
                                  disabled=${busy}
                                  onClick=${() => {
                                      setConfirmReset(true);
                                      setStatus("");
                                  }}
                              >
                                  恢复默认值 / Reset…
                              </button>`
                    }
                </section>

                <p class="small">
                    生效顺序 / precedence：默认值 / defaults ${"<"} 保存值 / saved ${"<"} 环境变量 /
                    env。保存写入 Pocket
                    数据目录下的模块私有配置文件；保存后无需重启，下一次工具调用使用新值。 / Saves to the
                    module's own config file and applies to the next tool call without a restart. 字符数是
                    UTF-16 单元，不是 token / UTF-16 units, not tokens. 插件开关和卸载在 Menu → Extensions /
                    plugin switch and removal stay there. revision ${view.revision.slice(0, 12)}…
                </p>
            </div>
        `;
    }

    pocket.page({ id: "settings", title: "IoT 配置 / IoT settings", component: SettingsPage });
    pocket.rail({
        id: "iot-settings",
        title: "IoT 配置 / IoT settings",
        icon: "grid",
        page: "settings",
    });
    pocket.menu({
        id: "iot-settings",
        label: "IoT 配置 / IoT settings",
        hint: "notes",
        page: "settings",
    });
    pocket.launcher({
        id: "iot-settings",
        label: "IoT 配置 / IoT settings",
        detail: "Notes extraction limits",
        icon: "grid",
        keywords: ["iot", "thoughts", "notes", "config", "设置", "配置"],
        page: "settings",
    });
}

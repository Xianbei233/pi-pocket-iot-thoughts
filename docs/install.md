# 安装、启用与回滚

本仓库的安装是**手工的**：`iot-thoughts.ts` 加同目录的 `iot-thoughts/` 浏览器目录。没有任何脚本会把模块写进默认数据目录、生产目录或 `~/.pi-pocket`；脚本只做本地开发链接与打包。

## 前提

- 已在运行的 Pi Pocket **0.20.0**（本次核对版本；`pocketApi = 2`，工具返回 `output`，浏览器 API 2）。
- Node.js **>= 22.19**（宿主 Pocket 的运行时；本机实际验证 26.10.0）。
- 一个由 Owner 指定、与生产数据隔离的 extensions 目录。不要把本模块直接复制进生产基线或归档目录。

## 审阅

1. 通读 [`iot-thoughts.ts`](../iot-thoughts.ts)、`iot-thoughts/index.js` 与 `iot-thoughts/style.css`。模块包含工具、owner-only 配置路由和浏览器设置页；提取工具本身是本地、确定性的。
2. 确认它只使用公开 API：`defineTool`、`defineExtension`、`section`、`host.text.defang`、`host.dataDir`、`web.route`、`web.client`、`web.onDispose`，以及 Chord 的 `context.abortSignal`。
3. 确认边界与代码一致：提取工具不调用模型、不联网、不做工具内文件 IO；模块只读自己的设置文件，配置页通过本模块路由写同一个固定文件。

## 手工安装

```bash
# 目标目录必须由人显式指定；下面只是示意
TARGET=/path/to/isolated/pocket/extensions
test -d "$TARGET" || { echo "目录不存在"; exit 1; }
test ! -L "$TARGET" || { echo "目标目录是符号链接，拒绝"; exit 1; }
test ! -e "$TARGET/iot-thoughts.ts" && test ! -L "$TARGET/iot-thoughts.ts" \
  || { echo "已存在（含悬空符号链接），先备份"; exit 1; }
cp --no-clobber iot-thoughts.ts "$TARGET/iot-thoughts.ts" || exit 1
test ! -e "$TARGET/iot-thoughts" || { echo "浏览器目录已存在，先备份"; exit 1; }
cp -R --no-clobber iot-thoughts "$TARGET/iot-thoughts" || exit 1
sha256sum "$TARGET/iot-thoughts.ts" "$TARGET/iot-thoughts/index.js" "$TARGET/iot-thoughts/style.css"
```

- Pocket 会在启动时于 extensions 目录创建 `_pocket.d.ts` 和 `node_modules` 链接；本仓库不复制这两个链接。
- 不要覆盖已有同名文件；不要用符号链接覆盖现有文件。
- 复制后在 **Menu → Extensions** 打开 `iot-thoughts`。drop-in 默认是关闭的。

## 配置与设置页

模块加载后可打开 **Menu → App → IoT 配置 / IoT settings**（也可从 rail 或启动器进入）。页面只调用本模块的 owner-only 路由，显示默认值、保存值、生效值和 env 来源。保存后无需重启，下一次工具调用使用新值。插件开关和卸载仍在 Menu → Extensions。

保存路径固定为 `<dataDir>/x.iot-thoughts/config.json`（目录 `0700`、文件 `0600`）。缺失时使用默认值且不自动创建；坏文件 fail closed 并保留。重置只恢复保存的默认值，env 覆盖仍优先。

部署级环境变量由 **Pocket 服务进程在启动时继承**。在另一个终端里 `export` 不会改变已在运行的 Pocket 进程；保存模块文件触发的 reload 只会重新读取该进程现有的 `process.env`。要让新值生效，必须用更新后的环境启动或重启隔离的 Pocket 实例（本次不启动/重启生产）。

```bash
# 在启动 Pocket 的那一层设置，而不是事后在别的 shell export
PI_POCKET_IOT_THOUGHTS_CONFIG='{"profile":"balanced","maxNodes":6}' <启动 Pocket 的命令>
```

- 只接受 JSON **对象**字符串；未知字段、非整数、越界值、访问器、数组、`null` 或 proto 污染键都会让模块加载失败（fail closed）。
- 只有**未设置**时用默认值；空字符串、纯空白或解析失败也 fail closed。
- 模块只读写自己的固定文件 `<dataDir>/x.iot-thoughts/config.json`，不接受路径参数；factory 在加载时解析一次 env 与存储。

可用 `config.example.json` 作为起点。

## 离线 tgz（可选）

```bash
npm run link:pocket      # 仅为类型检查/打包准备本地链接
npm run pack:offline     # 产出 dist/pi-pocket-iot-thoughts-<version>.tgz
sha256sum dist/*.tgz
```

tgz 是给人工审阅/转存的离线包，**不会**自动安装。包内固定只有：

```text
package.json
iot-thoughts.ts
iot-thoughts/index.js
iot-thoughts/style.css
manifest.json
config.example.json
README.md
LICENSE
PROVENANCE.md
docs/design.md
docs/install.md
```

打包脚本使用精确文件列表（不是目录前缀），逐个检查是普通文件而非符号链接，并要求 `manifest.json` 的 SHA-256 与磁盘文件一致；`manifest.json` 尚未定稿 hash 时拒绝打包。测试、evidence、node_modules 与本地 link 脚本都不会进入发布包。

## 停用、卸载与回滚

1. **停用**：Menu → Extensions 关闭 `iot-thoughts`；Pocket 会移除其工具、页面与路由。
2. **卸载**：停用后删除 `extensions/iot-thoughts.ts` 和 `extensions/iot-thoughts/`；重启 Pocket 确认不再列出。数据目录 `x.iot-thoughts/config.json` 不会被自动删除；需要时由 Owner 明确处理。
3. **回滚**：保留上一版模块文件、浏览器目录（或上一版 tgz）与对应 `sha256`；停用 → 替换 → 启用。
4. 本模块唯一的持久化文件是 `<dataDir>/x.iot-thoughts/config.json`；没有数据库、cache、handle 或外部服务。会话中的工具调用记录按 Pocket 的常规保留策略处理。

## 本次未执行

生产安装、启用、发布、推送、真实模型 API、MCP 与硬件操作均未在本次实现中执行。最终提交与 tgz 指纹在独立测试/主规划验收后统一确定。

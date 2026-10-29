# 设计说明

本文记录实现选择、不变量和已知边界，便于审阅与独立测试对照。实现只有 `iot-thoughts.ts` 一个文件。

## 数据流

```text
可见笔记 text
  → 状态检查（enabled / 空 / 超长 / 过短 / fenced code）
  → 分句（保留源偏移）
  → 显式标签解析（偏移跳过标签）
  → 保守词法标签推断
  → 去重 + 去固定填充句
  → 关键节点与预算检查
  → 贪心选择（标签秩 + 多样性上限 + 字符预算）
  → 按源顺序渲染 "- [tag] text"
  → 严格短于原文才 compacted，否则 kept
  → 工具层 defang + 固定标签封装 JSON
```

除固定的有界协作让出（最多 4 次 `setTimeout(0)`，每次让出后重新检查取消与超时）外，整个流程是确定性的、纯内存的。没有随机数、时间戳、网络、文件、进程或模型调用。

## 分句与偏移

- 在换行、`。！？!?；;` 处切分；英文 `.` 仅在后跟空白或文本末尾时切分。
- 每个单元先 `trim`，`start/end` 指向 trim 后的原文位置。
- 显式标签支持 `[risk]`、`【风险】`、`(note)`、`（待定）`、`risk:`、`风险：`，仅匹配单元开头。
- 标签匹配成功且正文非空时，节点 `start` 跳过标签及标签后的空白；`sourceTag` 保存原文标签词。
- 不变量：`text.slice(node.start, node.end) === node.text`。工具层返回前逐节点复核，失败则 `kept` / `source-mismatch`。

偏移是 JavaScript UTF-16 code unit 下标，和 `String.prototype.slice` 一致。

## 8 个标签

`decision`、`risk`、`open`、`oppose`、`support`、`tradeoff`、`plan`、`neutral`（中性默认）。没有“已验证/事实”标签。

支持的中英文显式词包括：决策/决定、风险/隐患、待定/未决/未定、反对/异议、支持/同意、权衡/取舍、计划/下一步、中性/备注/笔记，以及对应英文词。`事实`、`已验证` 不作为标签接受，避免把措辞当成世界验证。

推断只做保守词法匹配，优先级固定为：`oppose` → `open` → `plan` → `risk` → `tradeoff` → `decision` → `support` → `neutral`。

- `oppose` 在 `support` 之前判断，`不支持采用 A` 不会被判成支持。
- `尚未决定/还没决定/未定` 先判为 `open`；`计划/打算/准备/拟/将要` 先判为 `plan`；两者都不会落到 `decision`。
- `decision` 只匹配 `决定：`、`已决定`、`决定采用`、`最终决定/选择`、`结论是/为`、`选定`、`定为` 等明确措辞，不把裸“采用”当成决定。
- 推断失败一律 `neutral`，不生成新事实，也不把计划措辞渲染成已完成。

标签是**关于措辞的启发式**，不是事实核验；输出始终 `verified: false`。

## 关键节点

以下必须保留，不能被预算静默丢弃：

- 标签为 `decision`、`risk`、`open`、`oppose` 的节点；
- 含否定词（不/没/无/未/勿/别/禁/避免/不能/不应/不可/拒绝/反对，及常见英文否定）的节点。唯一词法例外：`无害` 中的“无”不算否定；同句其他否定（如 `未经`、`不得`、`无法`、`没有`）仍算。

若关键节点数超过有效节点上限，或关键节点渲染后超过 `maxOutputChars`，结果为 `kept` / `node-budget-insufficient`，原文完整返回。**不会**为了凑预算删掉风险、待定或否定。

数字不会被截断：节点要么整句保留，要么整句不选；不会出现半句或截短的数值。

## 去重与填充

- 仅删除规范化空白后**标签和正文都相同**的重复句；`[支持] X` 与 `[反对] X` 是不同语义，都会保留。
- 只删除固定的短填充句（如“谢谢”“收到”“ok”），且要求无显式标签、非关键节点、长度 ≤ 12。
- 不做语义循环检测；正常代码骨架或重复 fence 不会被判成“循环”，含 fence 的文本直接保守 `kept`。

## 选择

- 有效节点上限 = `min(config.maxNodes, profile 上限)`；profile 只收紧，不扩大。
- 非关键节点按标签秩（tradeoff/plan 优先于 support/neutral）和源顺序尝试加入。
- 同标签数量受 profile 上限约束，避免单一标签刷满节点。
- 每次加入都按最终源顺序重新计算渲染长度，保证不超过 `maxOutputChars`。
- 最终输出按源顺序，便于人工核对。

## 成功条件

只有同时满足下列条件才是 `compacted`：

1. 至少有一个节点；
2. 所有节点偏移与原文逐字一致；
3. 渲染结果严格短于 `text.trim()`。

否则一律 `kept`，`text` 是原文，`charsOut === charsIn`，`omitted === 0`。

## 输入、参数与选项

- 输入先过硬上限 64000 与配置 `maxInputChars`，再判断 `enabled`：超限抛 `iot-thoughts: input too large`，不回显。禁用状态也不回显超限原文。
- `options` 若是对象，只允许普通的 `profile` 数据属性；数组、`null`、访问器、symbol、未知字段（如 `root`/`path`/`role`）都抛 `iot-thoughts: invalid options`。
- 有效 profile = `options.profile ?? config.profile`；工具结果的 `profile` 报告实际生效值。

## 设置存储与热应用

- 固定路径 `<host.dataDir>/x.iot-thoughts/config.json`；不接受 path/root/user/role 参数。目录 `0700`、文件 `0600`。
- 读取使用 `O_NOFOLLOW`，拒绝符号链接、非普通文件、`nlink != 1`、设备文件和超过 8192 bytes 的文件；读取比对 lstat 与打开后 fstat 的 inode/device。缺失时使用默认值，不自动创建文件。
- 写入串行化：先在固定 `config.lock` 上取得跨版本/跨 factory 准入，再在锁内重读磁盘 revision → 写唯一临时文件（`O_CREAT|O_EXCL|O_NOFOLLOW`）→ `fsync` → `rename`。**提交点是 `rename` 成功**；之后不再报“保存失败”。提交前取消只删除本次临时文件，内存生效值不变。
- 锁文件超过 1.5 秒仍被占用时返回 `409 busy`；不删除无法确认归属的锁。释放前核对 inode/device。
- GET 和每次工具调用在读之前刷新自己的文件；外部版本提交后不会继续提供陈旧值，工具仍只在自己的调用开始时取一次快照。
- 加载时同时校验保存值和与 env 合并后的生效值；POST 也校验两者。坏存储文件或无效 env 使模块 fail closed 且保留原文件。
- 请求体先按数据描述符复制，拒绝 accessor/symbol/非普通原型/数组/toJSON，再计算 8 KB 上限；请求 handler 只读安全副本。
- 优先级：默认值 < 保存值 < env 显式键。`sources` 逐字段给出 `default` / `saved` / `env`；env 锁定的字段只展示存储值与生效值，GUI 不修改环境。
- 工具在每次 `execute` 开始时取一次 `state.effective` 快照；保存提交后替换快照，因此下一次调用生效，运行中的调用不变。
- 模块 factory 为 `async`：在返回 extension 前读取并校验自己的文件；`web.onDispose` abort 生命周期信号，队列中的写入在提交前取消。

## 取消与超时

- `compactVisibleNotes` 接受 `AbortSignal`，在分句与选择循环中周期性检查（每 4096 字符 / 每个候选）。
- `timeoutMs` 是函数级硬超时；超时抛 `DOMException`（`TimeoutError`），取消抛 `DOMException`（`AbortError`）。
- 工具层通过 Chord 的公开 `Context.abortSignal`（`execute` 第三参）接入 Pocket 的调用取消，并用 `web.onDispose` 在模块卸载/重载时 abort 本版本的生命周期信号。
- 取消与超时都不会返回 `kept` 或 `compacted`。
- 函数在开始、分句后和选择循环中做有界协作让出（最多 4 次 `setTimeout(0)`），让 abort/dispose 能在运行中进入；每次让出后都重新检查取消与超时。
- 无共享状态：模块每次加载都新建配置、信号和工具实例；隔离来自无状态 + Pocket 的正常权限，而不是本模块提供的用户私密隔离。多人会话仍共享同一服务端进程与常规会话存储。

## 已知边界

- 不做语义理解：同义改写、跨句指代、反讽、表格结构可能识别不到。
- 含 fenced code 的文本一律不压缩（保守拒绝，而不是删除代码）。
- 入口只保守保护**明确标识**的工具事实输出：行首的 `Tool output:` / `tool result:` / `command output:` / `stdout:` / `stderr:` / `工具输出：` / `工具结果：` / `命令输出：` / `执行结果：`。这类文本整体 `kept`。
- 没有标识来源的粘贴数据仍按普通笔记处理，可能被抽取或省略；本模块不读文件、不拦截工具、不判断未标识数据是否事实。
- `minChars` 只按原始长度判断；不做语言检测。
- `chars` 是 UTF-16 字符数，不是 token，也不预测账单。
- 不做敏感信息清洗；工具参数/结果按 Pocket 常规进入会话与 provider。
- 工具结果有固定输出上界（1MiB / 4000 行），按最坏 JSON 转义估算；`kept` 返回完整原文也在此上界内。仍超限时固定报错，不静默截断。
- 展示层对整个 fenced 结果（含 JSON 与收尾标记）做 `host.text.defang`；偏移针对调用者原始 UTF-16 文本，defang 后的展示不是 byte-exact 原档。
- profile 的合并是有损展示；原文标签保留在 `sourceTag`，但节点顺序和相邻关系会变化。

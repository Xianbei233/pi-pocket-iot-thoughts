# 来源与许可边界

## 上游（仅作行为来源）

- 项目：**IoT — Items of Thoughts**
- 仓库：<https://github.com/Roninton/IoT-items-of-thoughts>
- 参考提交：`2bdf1ef78e9decdea7bbc3d5a2664160a2a83e8e`（2026-10-21T12:19:26Z，main）
- 查询日期：2026-10-22；当时无 release、无 tag。
- 上游 root 与子 manifest 写 `version 0.1.0`、`license MIT`；但递归树中没有 `LICENSE` / `COPYING` / `NOTICE` 正文，GitHub API 的 `license` 字段为 `null`。

## 本仓库做了什么

本仓库是**独立重实现**。主规划为核实公开行为与固定 commit，阅读了上游官方源码/README；本实现的开发与测试 agent **没有**读取、复制或改写上游源码、提示词、fixtures 或样例会话，只接收主规划给出的行为规格与边界。因此这里不宣称“完全未阅源”的 clean-room，而是：阅源核查由主规划完成，实现由开发按规格独立完成，二者不共享上游代码。

本实现刻意不采用上游的一些有损做法：

- 不把“待定/未决”归并成“已定/决定”。
- 不把风险、反对或否定改写成支持。
- 不拦截 stream、不在 block end 额外调用模型、不改写正文、tool_calls、usage 或 finish。
- 只提供 Pocket 只读工具与简短 prompt section，不做 hooks、routes、browser module 或后台服务。

## 许可

- 本仓库的代码与文档采用 **MIT** 许可（见 `LICENSE`），版权人为 `pi-pocket-iot-thoughts contributors`；尚未公开发布。
- 本仓库**不包含**上游代码或文档的副本，因此不附带上游的版权声明，也不声称与上游作者存在隶属或授权关系。
- 上游 manifest 声明 MIT、但仓库中没有许可正文，这一事实本身不构成本仓库对上游代码的再许可。若将来需要引用上游内容，必须另行核对上游许可与版权归属。
- Pi Pocket、Pi Durable、Pi AI 是其各自权利人的软件；本仓库只通过公开的 `defineTool` / `defineExtension` / `section` API 使用它们，不复制其源码。

## 行为差异（有意）

| 上游形态（公开描述）                                            | 本实现                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------- |
| DSH 0.2.x 外部 bundle，在 LLM 流中暴露 reasoning delta 并提节点 | Pocket 内单文件 drop-in，仅由模型显式调用工具，不接触流 |
| block end 额外模型调用，失败保留原文                            | 纯本地确定性抽取；无模型调用                            |
| 自动在流中替换文本                                              | 只在工具结果里返回节点；不改历史、不改原工具            |
| 上游标签映射（有损）                                            | 独立 8 标签 + `sourceTag` 证据；不改变极性              |

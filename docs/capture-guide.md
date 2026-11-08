# 抓包定位开屏广告接口

规则是否有效只能真机确认。下面是给一个 App 找到/验证开屏广告接口的流程。

## 准备

- 一台装有 Surge / Loon / Stash / Shadowrocket 任一的 iPhone，MITM 证书已信任。
- 已按 README 屏蔽 UDP 443（否则很多请求走 QUIC，抓不到明文）。

## 步骤

1. **找主机名**：打开代理工具的"最近请求"，冷启动目标 App（先从后台划掉），记录开屏期间出现的主机名。
2. **加 MITM**：把可疑主机名加入 MITM 列表，再冷启动一次。
   - 若 App 报网络错误 → 该主机有证书固定，移出 MITM，只能退回到域名/素材拦截。
3. **找接口**：在解密后的请求里搜关键词：`splash`、`launch`、`startup`、`boot`、`ad`、`adx`、`screen`、`open_screen`、`functionId=start`。
   - 也可按响应体找：搜 `.mp4`、`.jpg` 地址，以及 `start_time` / `end_time` / `show_time` / `countdown` / `skip` 这类字段。
4. **判断手段**：
   - 接口只给广告用 → `reject-dict`（或 `reject-array`，看原响应顶层类型）。
   - 接口还混有其他配置（如京东 `start`）→ 写脚本只清广告字段。
   - 响应加密/protobuf → 只能 reject 整个接口，或拦截素材域名。
5. **验证**：
   - 启用规则 → 清 App 缓存 → 冷启动 5 次以上，覆盖首次启动和热启动（后台返回前台也可能触发开屏）。
   - 检查 App 其余功能正常（首页、搜索、登录态）。
6. **登记**：在 `src/apps/<id>.js` 更新 `pattern` / `example`，把 `status` 改为 `verified`，`verifiedOn` 填 `App 版本 / 日期`，例如 `'7.80.0 / 2026-11-08'`。把去敏后的真实响应加入 `tests/cases.js`。

## 常见坑

| 现象 | 原因 | 处理 |
|---|---|---|
| 规则命中但仍有开屏 | 本地缓存素材 | 清缓存；或用脚本把投放时间推到未来覆盖缓存 |
| 规则从不命中 | 走 QUIC / 自研长连接 | 屏蔽 UDP 443；检查是否走了非 443 端口 |
| 开屏变成几秒白屏 | 只拦了素材、配置仍在 | 找到配置接口改为脚本处理 |
| App 启动卡住 | 拒绝的接口是阻塞式请求 | 改用 `reject-dict` 返回合法空 JSON，而不是 `reject` |

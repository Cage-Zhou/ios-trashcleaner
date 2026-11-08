# ios-trashcleaner

去除国行 iOS App 开屏广告的**代理工具模块**。一份规则源，生成 Surge / Shadowrocket / Loon / Quantumult X / Stash 五个平台的模块文件。无需越狱。

> ⚠️ 当前所有规则状态均为 `unverified`：接口路径整理自对各 App 的常见实现，**尚未在真机上逐一验证**。App 更新后接口经常变化，请按 [docs/capture-guide.md](docs/capture-guide.md) 抓包确认后把状态改为 `verified`。

## 覆盖范围

| App | 手段 |
|---|---|
| 哔哩哔哩 | 脚本：清空开屏列表，拉取间隔改为一年 |
| 知乎 | 重写：开屏接口返回 `{}` |
| 微博 | 规则 + 重写 + 脚本（保留 `sdkad.php` 的 `OK` 后缀） |
| 小红书 | 脚本：素材投放时间改到 2090 年，让本地缓存失效 |
| 高德地图 | 脚本：清空阿里妈妈开屏素材 |
| 京东 | 脚本：`functionId=start` 清空开屏图片 |
| 美团 | 重写：拦截开屏图片/视频素材 |
| 淘宝 | 重写：开屏配置 mtop 接口（受 QUIC / 长连接限制，见下） |
| 网易云音乐 | 重写：`eapi/ad/` 广告接口（响应加密，只能整体拒绝） |
| 百度网盘 | 重写：`pcs/adx` 广告接口、活动弹窗 |

实时状态见构建生成的 `dist/STATUS.md`。

## 原理

开屏广告的典型链路：**App 启动 → 请求广告配置接口 → 下载素材并缓存 → 下次启动展示缓存素材**。所以拦截有三个层次：

1. **拒绝配置接口**（reject-dict）：最简单，但部分 App 拿到空响应会回退到旧缓存或重试。
2. **改写配置响应**（脚本）：清空素材列表、把展示次数置 0、把投放时间推到遥远未来——让 App 自己"认为"没有可展示的广告，同时覆盖掉本地缓存的排期。
3. **拒绝素材下载**（reject-img）：配置接口无法 MITM 或加密时的兜底，可能出现短暂空白。

## 使用

### 1. 托管脚本

脚本需要一个可公网访问的地址。推到 GitHub 后修改 [config.json](config.json) 的 `scriptBaseUrl`，或构建时传入：

```bash
node tools/build.js --base-url https://cdn.jsdelivr.net/gh/Cage-Zhou/ios-trashcleaner@main/dist/scripts
```

### 2. 安装模块

| 平台 | 文件 | 安装方式 |
|---|---|---|
| Surge | `dist/surge/TrashCleaner.sgmodule` | 模块 → 安装新模块 → 粘贴 URL |
| Shadowrocket | `dist/shadowrocket/TrashCleaner.module` | 配置 → 模块 → 添加 |
| Loon | `dist/loon/TrashCleaner.plugin` | 插件 → 添加 |
| Quantumult X | `dist/quantumultx/TrashCleaner.snippet`（重写）+ `TrashCleaner.list`（分流） | 重写 → 规则资源；分流 → 规则资源 |
| Stash | `dist/stash/TrashCleaner.stoverride` | 覆写 → 安装 |

### 3. 必做配置

- **安装并信任 MITM 证书**：设置 → 通用 → 关于本机 → 证书信任设置 → 打开完全信任。
- **屏蔽 QUIC**：大量国行 App 走 HTTP/3 (UDP 443)，会绕过 MITM。Surge 在 `[Rule]` 最前加 `AND,((PROTOCOL,UDP),(DEST-PORT,443)),REJECT-NO-DROP`；Loon 在 `[General]` 设 `disable-udp-ports = 443`；QX 在 `[filter_local]` 加 `ip-cidr, 0.0.0.0/0, reject, udp-port=443`（按你所用版本的语法调整）。
- **清缓存**：启用后对各 App 清一次缓存或重装，否则已下载的开屏素材还会再出现 1～2 次。

## 开发

```bash
npm test          # 校验规则 + 在模拟运行环境中跑脚本
npm run build     # 生成 dist/
```

- 新增 App：在 `src/apps/` 加一个文件，格式见 [src/apps/_schema.md](src/apps/_schema.md)。每条规则必须带 `example` URL，构建会校验正则能匹配它、且主机名已加入 `mitm`。
- 新增脚本：`src/scripts/<name>.js`，首行 `// @include _lib.js` 引入公共函数（`tcRun` / `tcEmpty` / `tcPushTimes`）。脚本出错时原样放行，不会让 App 白屏。
- 在 `tests/cases.js` 中加样例响应；验证后尽量换成真实抓包（去除个人信息）。

## 已知限制

- **证书固定**：支付宝、微信、抖音、拼多多等对核心域名做了 SSL Pinning，MITM 会导致断网，本项目不覆盖。
- **自研协议**：淘宝/天猫的 ACCS、美团的 Shark 等长连接通道不走标准 HTTPS，HTTP 层规则拦不到。
- **SDK 开屏**：中小 App 多用穿山甲 / 优量汇 / 快手联盟 / 百度百青藤 SDK，可作为下一阶段的通用规则方向。

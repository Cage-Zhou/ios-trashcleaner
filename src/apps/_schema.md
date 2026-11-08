# App 规则文件格式

每个 App 一个 `src/apps/<id>.js`，导出一个对象：

```js
module.exports = {
  id: 'bilibili',               // 唯一 id，也用作脚本 tag 前缀
  name: '哔哩哔哩',
  bundleId: 'tv.danmaku.bilianime',
  status: 'unverified',          // unverified | verified | broken
  verifiedOn: null,              // 'App 版本 / 日期'，真机验证后填写
  mitm: ['app.bilibili.com'],    // 需要解密的主机名，支持 *.example.com
  rules: [                       // 网络层规则（不需要 MITM）
    { type: 'DOMAIN', value: 'ad.example.com', note: '...' },  // DOMAIN | DOMAIN-SUFFIX | DOMAIN-KEYWORD，策略固定为 REJECT
  ],
  rewrites: [                    // URL 重写：直接返回空响应
    { pattern: String.raw`^https:\/\/...`, action: 'reject-dict', example: 'https://...', note: '...' },
    // action: reject | reject-200 | reject-dict | reject-array | reject-img
  ],
  scripts: [                     // 响应体改写（脚本位于 src/scripts/<script>.js）
    { pattern: String.raw`^https:\/\/...`, script: 'bilibili-splash', example: 'https://...', note: '...' },
  ],
  notes: ['缓存需清除', '...'],
};
```

`example` 必填：构建时会校验正则能匹配它，且其主机名被 `mitm` 覆盖。

// 南通州（南通市通州区融媒体，江苏广电「荔枝云」平台）。
module.exports = {
  id: 'nantongzhou',
  name: '南通州',
  bundleId: '未知（App Store id1494938780）',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['publish.cm.jstv.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/publish\.cm\.jstv\.com\/ad\?`,
      action: 'reject-dict',
      example: 'https://publish.cm.jstv.com/ad?AppID=9b06860d803743ddac9bb8b7cbce5f62&TT=1&Sign=x',
      note: '荔枝云平台广告接口（开屏），每次启动请求多次',
    },
  ],
  scripts: [],
  notes: [
    '2026-11-09 抓包（1.98）：启动时 publish.cm.jstv.com 依次请求 nav/channel、appSetting、whiteDomain、ad；只有 /ad 是广告',
    '同平台（江苏广电荔枝云）的其他县区 App 用同一个 /ad 接口，AppID 不同，此规则同样生效',
    '如仍出开屏：可能是已缓存的广告图，清除 App 缓存或删除重装',
  ],
};

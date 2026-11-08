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
      note: '荔枝云平台广告位接口（站内广告位）',
    },
  ],
  scripts: [
    {
      pattern: String.raw`^https:\/\/publish\.cm\.jstv\.com\/appSetting\?`,
      script: 'nantongzhou-splash',
      example: 'https://publish.cm.jstv.com/appSetting?appType=1&AppID=9b06860d803743ddac9bb8b7cbce5f62&TT=1&Sign=x',
      note: '开屏图在 data.startPhotoList（每次随机选一张，显示 data.loadingTime 秒）：清空列表、倒计时归零',
    },
  ],
  notes: [
    '2026-11-09 抓包（1.98）：拦掉 /ad 后开屏仍在；抓 appSetting 返回体确认开屏来自 data.startPhotoList（3 张，含美团小象超市等商业广告）',
    '同平台（江苏广电荔枝云）的其他县区 App 用同一套接口，AppID 不同，此规则同样生效',
  ],
};

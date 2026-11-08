module.exports = {
  id: 'jin10',
  name: '金十数据',
  bundleId: 'com.jin10.app',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['jad-api.jin10.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/jad-api\.jin10\.com\/ad`,
      action: 'reject-dict',
      example: 'https://jad-api.jin10.com/ad2/opening?display=opening',
      note: '金十自有广告接口（来源：blackmatrix7/ios_rule_script）；返回空 JSON 而非断连，避免 App 回退到本地缓存的开屏',
    },
  ],
  scripts: [],
  notes: [
    '2026-11-08 抓包（6.53.6）确认命中：ad2/opening（开屏）、ad2/opening/show、ad2/single(_unread) 均被拒绝',
    '专业版(金十数据专业版)是否同一接口未确认',
  ],
};

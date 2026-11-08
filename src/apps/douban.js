module.exports = {
  id: 'douban',
  name: '豆瓣',
  bundleId: 'com.douban.frodo',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['frodo.douban.com', 'api.douban.com'],
  rules: [
    { type: 'DOMAIN', value: 'erebor.douban.com', note: '豆瓣自有广告投放服务' },
  ],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/frodo\.douban\.com\/api\/v2\/splash`,
      action: 'reject-dict',
      example: 'https://frodo.douban.com/api/v2/splash?apikey=x',
      note: 'App 开屏配置',
    },
    {
      pattern: String.raw`^https:\/\/api\.douban\.com\/v2\/app_ads\/`,
      action: 'reject-dict',
      example: 'https://api.douban.com/v2/app_ads/splash_preload',
      note: '旧版开屏广告接口',
    },
  ],
  scripts: [],
  notes: [
    '2026-11-08 抓包（7.137.0）确认：app_ads/splash_preload|splash_show|splash_bid|splash_statistics 与 erebor 均已命中拒绝',
    '剩余开屏来自第三方 SDK（广点通、穿山甲、京东 DSP），由「通用广告 SDK」规则处理',
  ],
};

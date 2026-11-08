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
  notes: ['豆瓣部分开屏走第三方广告 SDK（优量汇/穿山甲），此时上述规则拦不到，需要抓包后补 SDK 域名'],
};

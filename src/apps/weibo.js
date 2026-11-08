module.exports = {
  id: 'weibo',
  name: '微博',
  bundleId: 'com.sina.weibo',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['bootrealtime.uve.weibo.com', 'sdkapp.uve.weibo.com', 'wbapp.uve.weibo.com'],
  rules: [
    { type: 'DOMAIN', value: 'adimg.uve.weibo.com', note: '广告素材 CDN' },
  ],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/bootrealtime\.uve\.weibo\.com\/v[23]\/ad\/realtime`,
      action: 'reject-dict',
      example: 'https://bootrealtime.uve.weibo.com/v3/ad/realtime?wbversion=1400',
      note: '启动时实时开屏广告',
    },
  ],
  scripts: [
    {
      pattern: String.raw`^https:\/\/sdkapp\.uve\.weibo\.com\/interface\/sdk\/sdkad\.php`,
      script: 'weibo-splash',
      example: 'https://sdkapp.uve.weibo.com/interface/sdk/sdkad.php?wbver=1400',
      note: '预加载开屏广告；响应为 JSON 后接 "OK"，脚本会保留后缀',
    },
    {
      pattern: String.raw`^https:\/\/wbapp\.uve\.weibo\.com\/wbapplua\/wbpullad\.lua`,
      script: 'weibo-splash',
      example: 'https://wbapp.uve.weibo.com/wbapplua/wbpullad.lua?wbver=1400',
      note: '拉取缓存开屏广告',
    },
  ],
  notes: ['国际版微博(WeiboIntl)接口不同，未覆盖'],
};

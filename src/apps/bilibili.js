module.exports = {
  id: 'bilibili',
  name: '哔哩哔哩',
  bundleId: 'tv.danmaku.bilianime',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['app.bilibili.com'],
  rules: [],
  rewrites: [],
  scripts: [
    {
      pattern: String.raw`^https:\/\/app\.bilibili\.com\/x\/v2\/splash\/(brand\/list|event\/list2|list|show)`,
      script: 'bilibili-splash',
      example: 'https://app.bilibili.com/x/v2/splash/list?build=8000&mobi_app=iphone',
      note: '清空开屏素材列表，并把拉取间隔拉到一年',
    },
  ],
  notes: [
    '开屏素材会预下载缓存，启用后需在 App 内清除缓存或重装一次才能完全生效',
  ],
};

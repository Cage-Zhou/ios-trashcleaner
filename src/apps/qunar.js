module.exports = {
  id: 'qunar',
  name: '去哪儿旅行',
  bundleId: 'com.qunar.iphoneclient8',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['client.qunar.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/client\.qunar\.com\/pitcher-proxy\?qrt=p_splashAd`,
      action: 'reject-dict',
      example: 'https://client.qunar.com/pitcher-proxy?qrt=p_splashAd',
      note: '开屏广告（pitcher 网关按 qrt 参数区分业务）',
    },
  ],
  scripts: [],
  notes: [],
};

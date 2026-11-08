module.exports = {
  id: 'qidian',
  name: '起点读书',
  bundleId: 'com.qidian.QDReader',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['magev6.if.qidian.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/magev6\.if\.qidian\.com\/argus\/api\/v\d\/client\/(getsplashscreen|iosad)`,
      action: 'reject-dict',
      example: 'https://magev6.if.qidian.com/argus/api/v4/client/getsplashscreen',
      note: '开屏配置 / iOS 广告位',
    },
  ],
  scripts: [],
  notes: [],
};

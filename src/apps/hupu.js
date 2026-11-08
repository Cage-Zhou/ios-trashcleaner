module.exports = {
  id: 'hupu',
  name: '虎扑',
  bundleId: 'com.hupu.games',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['games.mobileapi.hupu.com', 'goblin.hupu.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/(games\.mobileapi|goblin)\.hupu\.com\/.+\/interfaceAd`,
      action: 'reject-dict',
      example: 'https://goblin.hupu.com/3/7.5.60/interfaceAd/getOther',
      note: '广告接口（含开屏）；把握较低，需抓包确认',
    },
  ],
  scripts: [],
  notes: [],
};

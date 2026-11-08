module.exports = {
  id: 'netease-music',
  name: '网易云音乐',
  bundleId: 'com.netease.cloudmusic',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['interface*.music.163.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https?:\/\/interface\d?\.music\.163\.com\/eapi\/ad\/`,
      action: 'reject-dict',
      example: 'https://interface3.music.163.com/eapi/ad/get',
      note: 'eapi 响应体加密，无法改写，只能整体拒绝广告接口',
    },
  ],
  scripts: [],
  notes: [],
};

module.exports = {
  id: 'zhihu',
  name: '知乎',
  bundleId: 'com.zhihu.ios',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['api.zhihu.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/api\.zhihu\.com\/commercial_api\/(real_time_)?launch_v2`,
      action: 'reject-dict',
      example: 'https://api.zhihu.com/commercial_api/real_time_launch_v2?app=zhihu',
      note: '开屏广告下发接口（含实时竞价版本）',
    },
  ],
  scripts: [],
  notes: [],
};

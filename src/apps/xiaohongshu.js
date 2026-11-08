module.exports = {
  id: 'xiaohongshu',
  name: '小红书',
  bundleId: 'com.xingin.discover',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['edith.xiaohongshu.com'],
  rules: [],
  rewrites: [],
  scripts: [
    {
      pattern: String.raw`^https:\/\/edith\.xiaohongshu\.com\/api\/sns\/v\d\/system_service\/splash_config`,
      script: 'xiaohongshu-splash',
      example: 'https://edith.xiaohongshu.com/api/sns/v2/system_service/splash_config',
      note: '把所有开屏素材的投放时间改到 2090 年，已缓存的素材也不会展示',
    },
  ],
  notes: [],
};

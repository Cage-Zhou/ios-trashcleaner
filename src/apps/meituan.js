module.exports = {
  id: 'meituan',
  name: '美团',
  bundleId: 'com.meituan.imeituan',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['img.meituan.net', 's3plus.meituan.net', 'flowplus.meituan.net'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https?:\/\/img\.meituan\.net\/(adunion|display|midas)\/`,
      action: 'reject-img',
      example: 'https://img.meituan.net/midas/abc123.jpg',
      note: '广告联盟 / 展位 / 麦达斯广告素材',
    },
    {
      pattern: String.raw`^https?:\/\/(s3plus|flowplus)\.meituan\.net\/v\d\/\w+\/linglong\/\w+\.(gif|jpg|png|mp4)`,
      action: 'reject-img',
      example: 'https://s3plus.meituan.net/v1/mss_abc/linglong/abc123.mp4',
      note: '玲珑开屏素材（图片/视频）',
    },
  ],
  scripts: [],
  notes: ['基于素材拦截：开屏位可能短暂显示空白后跳过'],
};

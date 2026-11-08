module.exports = {
  id: 'baidu-netdisk',
  name: '百度网盘',
  bundleId: 'com.baidu.netdisk',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['pan.baidu.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/pan\.baidu\.com\/rest\/2\.0\/pcs\/adx`,
      action: 'reject-dict',
      example: 'https://pan.baidu.com/rest/2.0/pcs/adx?method=getad',
      note: '广告交易接口（含开屏）',
    },
    {
      pattern: String.raw`^https:\/\/pan\.baidu\.com\/act\/api\/activityentry`,
      action: 'reject-dict',
      example: 'https://pan.baidu.com/act/api/activityentry?channel=ios',
      note: '活动弹窗入口',
    },
  ],
  scripts: [],
  notes: [],
};

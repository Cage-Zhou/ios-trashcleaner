module.exports = {
  id: 'jd',
  name: '京东',
  bundleId: 'com.360buy.jdmobile',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['api.m.jd.com'],
  rules: [],
  rewrites: [],
  scripts: [
    {
      pattern: String.raw`^https:\/\/api\.m\.jd\.com\/client\.action\?functionId=start\b`,
      script: 'jd-splash',
      example: 'https://api.m.jd.com/client.action?functionId=start&clientVersion=13.0.0',
      note: '启动配置接口：清空开屏图片，日展示次数置 0',
    },
  ],
  notes: ['api.m.jd.com 承载几乎全部业务，MITM 会增加一定耗时；脚本仅匹配 functionId=start'],
};

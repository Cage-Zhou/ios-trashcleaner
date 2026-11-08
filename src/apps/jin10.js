module.exports = {
  id: 'jin10',
  name: '金十数据',
  bundleId: 'com.jin10.app',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['jad-api.jin10.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/jad-api\.jin10\.com\/ad`,
      action: 'reject',
      example: 'https://jad-api.jin10.com/ad/splash',
      note: '金十自有广告接口（来源：blackmatrix7/ios_rule_script 去广告规则集）',
    },
  ],
  scripts: [],
  notes: ['专业版(金十数据专业版)是否同一接口未确认'],
};

module.exports = {
  id: 'quark',
  name: '夸克',
  bundleId: 'com.quark.browser',
  status: 'unverified',
  verifiedOn: null,
  mitm: [],
  rules: [
    { type: 'DOMAIN-SUFFIX', value: 'huichuan.sm.cn', note: 'UC/夸克「汇川」广告平台' },
  ],
  rewrites: [],
  scripts: [],
  notes: [
    '只做了域名拦截，不需要 MITM；若仍有开屏需抓包补接口',
  ],
};

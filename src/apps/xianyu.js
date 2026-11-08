module.exports = {
  id: 'xianyu',
  name: '闲鱼',
  bundleId: 'com.taobao.fleamarket',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['acs.m.taobao.com', 'acs.m.goofish.com', 'g-acs.m.goofish.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/(acs\.m\.taobao|(g-)?acs\.m\.goofish)\.com\/gw\/mtop\.(taobao\.)?idle\.[\w.]*splash`,
      action: 'reject-dict',
      example: 'https://acs.m.goofish.com/gw/mtop.taobao.idle.home.splash.get/1.0/',
      note: '名字里带 splash 的闲鱼 mtop 接口',
    },
  ],
  scripts: [],
  notes: [
    '与淘宝相同，大量请求走 ACCS 长连接 / QUIC，HTTP 层只能拦到一部分',
  ],
};

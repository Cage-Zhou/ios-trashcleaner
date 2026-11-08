module.exports = {
  id: 'taobao',
  name: '淘宝',
  bundleId: 'com.taobao.taobao4iphone',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['guide-acs.m.taobao.com', 'acs.m.taobao.com'],
  rules: [],
  rewrites: [
    {
      pattern: String.raw`^https:\/\/guide-acs\.m\.taobao\.com\/gw\/mtop\.taobao\.(wireless\.home\.splash\.awesome\.get|cloudvideo\.video\.query)`,
      action: 'reject-dict',
      example: 'https://guide-acs.m.taobao.com/gw/mtop.taobao.wireless.home.splash.awesome.get/1.0/',
      note: '首页开屏配置 / 开屏视频',
    },
    {
      pattern: String.raw`^https:\/\/acs\.m\.taobao\.com\/gw\/mtop\.alibaba\.advertisementservice\.getadv`,
      action: 'reject-dict',
      example: 'https://acs.m.taobao.com/gw/mtop.alibaba.advertisementservice.getadv/1.0/',
      note: '通用广告位',
    },
  ],
  scripts: [],
  notes: [
    '淘宝大量请求走自研长连接(ACCS/SPDY)与 QUIC，HTTP 层规则覆盖有限；需配合屏蔽 UDP 443 才能让请求回落到可 MITM 的 HTTPS',
    '若 MITM 后出现网络错误，说明该域名启用了证书固定，需移除对应 hostname',
  ],
};

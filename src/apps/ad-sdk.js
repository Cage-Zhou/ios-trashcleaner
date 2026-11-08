// Third-party ad SDKs embedded in many apps. Blocking them by domain removes
// SDK-served splash ads everywhere, without MITM. Seen in a Douban 7.137.0
// cold-start log (2026-11-08) after Douban's own splash APIs were rejected.
module.exports = {
  id: 'ad-sdk',
  name: '通用广告 SDK',
  bundleId: '-',
  status: 'unverified',
  verifiedOn: null,
  mitm: [],
  rules: [
    { type: 'DOMAIN-SUFFIX', value: 'gdt.qq.com', note: '腾讯广点通/优量汇（mi/v/v2mi/c3/v3 等，含 QUIC）' },
    { type: 'DOMAIN', value: 'sdk.e.qq.com', note: '腾讯优量汇 新版 SDK 广告请求' },
    { type: 'DOMAIN', value: 'sdkquic.e.qq.com', note: '腾讯优量汇 新版 SDK（QUIC/UDP）' },
    { type: 'DOMAIN-SUFFIX', value: 'ugdtimg.com', note: '腾讯广告素材 CDN（adsmind.ugdtimg.com 即开屏图片）' },
    { type: 'DOMAIN-SUFFIX', value: 'gdtimg.com', note: '腾讯广告素材 CDN（旧域名）' },
    { type: 'DOMAIN-SUFFIX', value: 'pangolin-sdk-toutiao.com', note: '字节穿山甲 广告请求' },
    { type: 'DOMAIN-SUFFIX', value: 'pangolin-sdk-toutiao1.com', note: '字节穿山甲 广告请求（备用域）' },
    { type: 'DOMAIN-SUFFIX', value: 'pangolin-sdk-toutiao-b.com', note: '字节穿山甲 日志上报' },
    { type: 'DOMAIN-SUFFIX', value: 'pglstatp-toutiao.com', note: '字节穿山甲 素材 CDN' },
    { type: 'DOMAIN', value: 'dsp-x.jd.com', note: '京东 DSP 广告' },
  ],
  rewrites: [],
  scripts: [],
  notes: [
    '会影响所有内置这些 SDK 的 App：开屏/信息流广告消失；少数 App 的「看广告领奖励」功能会失效',
  ],
};

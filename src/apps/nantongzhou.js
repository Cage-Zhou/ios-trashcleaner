// 南通州（南通市通州区融媒体，江苏广电「荔枝云」平台）。
// 2026-11-09 抓包：启动时只连 *.cm.jstv.com（publish / tongzhou / image / user / statistic / dataview-api），
// 都未解密，看不到路径。这一版先只开 MITM，用于下一次抓包找到开屏接口，暂不拦截任何东西。
module.exports = {
  id: 'nantongzhou',
  name: '南通州',
  bundleId: '未知（App Store id1494938780）',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['*.cm.jstv.com'],
  rules: [],
  rewrites: [],
  scripts: [],
  notes: [
    '采集阶段：仅解密 *.cm.jstv.com，尚未拦截；待抓到开屏接口路径后再加 rewrite',
    '同平台（江苏广电荔枝云）的其他县区 App 可能共用同一套接口',
  ],
};

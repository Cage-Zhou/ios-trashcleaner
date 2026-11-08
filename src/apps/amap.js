module.exports = {
  id: 'amap',
  name: '高德地图',
  bundleId: 'com.autonavi.amap',
  status: 'unverified',
  verifiedOn: null,
  mitm: ['m5.amap.com', 'm5-zb.amap.com'],
  rules: [],
  rewrites: [],
  scripts: [
    {
      pattern: String.raw`^https:\/\/m5(-zb)?\.amap\.com\/ws\/valueadded\/alimama\/splash_screen`,
      script: 'amap-splash',
      example: 'https://m5.amap.com/ws/valueadded/alimama/splash_screen?div=IOSH1400',
      note: '阿里妈妈开屏：清空素材并把投放时间改到 2090 年',
    },
  ],
  notes: [],
};

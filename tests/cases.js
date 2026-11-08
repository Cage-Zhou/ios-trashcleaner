// Sample responses are hand-written approximations of each API's shape.
// Replace them with real captured (and de-identified) responses as you verify apps.
const assert = require('assert');
const FAR = 3818332800;
const json = (r) => JSON.parse(r.body);

module.exports = [
  {
    script: 'bilibili-splash',
    title: 'clears splash list and stretches intervals',
    url: 'https://app.bilibili.com/x/v2/splash/list?build=8000',
    body: JSON.stringify({ code: 0, data: { max_time: 5, min_interval: 3600, pull_interval: 1800, list: [{ id: 1, thumb: 'x.jpg' }], show: [{ id: 1, stime: 1, etime: 2 }] } }),
    check: (r) => {
      const d = json(r).data;
      assert.deepStrictEqual(d.list, []);
      assert.deepStrictEqual(d.show, []);
      assert.strictEqual(d.max_time, 0);
      assert.strictEqual(d.pull_interval, 31536000);
    },
  },
  {
    script: 'bilibili-splash',
    title: 'leaves non-data responses alone',
    url: 'https://app.bilibili.com/x/v2/splash/show',
    body: JSON.stringify({ code: -404, message: 'not found' }),
    check: (r) => assert.deepStrictEqual(json(r), { code: -404, message: 'not found' }),
  },
  {
    script: 'weibo-splash',
    title: 'sdkad.php: empties ads and keeps "OK" suffix',
    url: 'https://sdkapp.uve.weibo.com/interface/sdk/sdkad.php',
    body: JSON.stringify({ ads: [{ adid: '1' }], background_delay_display_time: 60, show_push_splash_ad: true }) + 'OK',
    check: (r) => {
      assert.ok(r.body.endsWith('}OK'), 'suffix preserved');
      const o = JSON.parse(r.body.slice(0, -2));
      assert.deepStrictEqual(o.ads, []);
      assert.strictEqual(o.background_delay_display_time, 31536000);
      assert.strictEqual(o.show_push_splash_ad, false);
    },
  },
  {
    script: 'weibo-splash',
    title: 'wbpullad.lua: empties cached_ad.ads',
    url: 'https://wbapp.uve.weibo.com/wbapplua/wbpullad.lua',
    body: JSON.stringify({ cached_ad: { ads: [{ id: 1 }], delay_display_time: 10 } }),
    check: (r) => {
      const o = json(r);
      assert.deepStrictEqual(o.cached_ad.ads, []);
      assert.strictEqual(o.cached_ad.delay_display_time, 31536000);
    },
  },
  {
    script: 'xiaohongshu-splash',
    title: 'pushes every creative schedule to 2090 (s and ms)',
    url: 'https://edith.xiaohongshu.com/api/sns/v2/system_service/splash_config',
    body: JSON.stringify({ data: { ads_groups: [{ start_time: 1700000000, end_time: 1700086400, ads: [{ id: 'a', start_time: 1700000000000, end_time: '1700086400' }] }] } }),
    check: (r) => {
      const g = json(r).data.ads_groups[0];
      assert.strictEqual(g.start_time, FAR);
      assert.strictEqual(g.end_time, FAR + 86399);
      assert.strictEqual(g.ads[0].start_time, FAR * 1000);
      assert.strictEqual(g.ads[0].end_time, String(FAR + 86399));
    },
  },
  {
    script: 'amap-splash',
    title: 'empties ad list',
    url: 'https://m5.amap.com/ws/valueadded/alimama/splash_screen',
    body: JSON.stringify({ code: '1', data: { ad: [{ id: 1, start_time: 1700000000, end_time: 1700086400 }], settings: { x: 1 } } }),
    check: (r) => {
      const d = json(r).data;
      assert.deepStrictEqual(d.ad, []);
      assert.deepStrictEqual(d.settings, { x: 1 });
    },
  },
  {
    script: 'nantongzhou-splash',
    title: 'empties startPhotoList, zeroes countdown, keeps config',
    url: 'https://publish.cm.jstv.com/appSetting?appType=1&AppID=x&TT=1&Sign=x',
    body: JSON.stringify({ code: 200, data: {
      version: 1.97, loadingTime: 3, isHalfStartPhoto: 0, popupAd: null, cornerAd: null,
      startPhotoList: [{ url: 'https://image.cm.jstv.com/a.jpg', globalId: 32379196, startTime: 0, endTime: 0 }],
      domainList: [{ name: 'apiauth', url: 'https://api-auth.cm.jstv.com/' }],
    } }),
    check: (r) => {
      const d = json(r).data;
      assert.strictEqual(JSON.stringify(d.startPhotoList), '[]');
      assert.strictEqual(d.loadingTime, 0);
      assert.strictEqual(d.version, 1.97);
      assert.strictEqual(d.domainList[0].name, 'apiauth');
    },
  },
  {
    script: 'jd-splash',
    title: 'clears images and daily show count',
    url: 'https://api.m.jd.com/client.action?functionId=start',
    body: JSON.stringify({ code: '0', images: [[{ url: 'a.jpg' }]], showTimesDaily: 3, countdown: 5000, other: 'keep' }),
    check: (r) => {
      const o = json(r);
      assert.deepStrictEqual(o.images, []);
      assert.strictEqual(o.showTimesDaily, 0);
      assert.strictEqual(o.countdown, 0);
      assert.strictEqual(o.other, 'keep');
    },
  },
];

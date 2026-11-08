// @include _lib.js
// 荔枝云 appSetting: the splash ads are data.startPhotoList (one picked at random per launch),
// shown for data.loadingTime seconds. Empty the list and zero the countdown; keep the rest of the config.
tcRun('nantongzhou-splash', function (obj) {
  var d = obj && obj.data;
  if (!d) return obj;
  tcEmpty(d, ['startPhotoList']);
  if (typeof d.loadingTime === 'number') d.loadingTime = 0;
  d.popupAd = null;
  d.cornerAd = null;
  return obj;
});

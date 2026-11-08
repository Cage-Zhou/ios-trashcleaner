// @include _lib.js
tcRun('amap-splash', function (obj) {
  var d = obj && obj.data;
  if (!d) return obj;
  tcPushTimes(d, ['start_time', 'end_time', 'starttime', 'endtime']);
  tcEmpty(d, ['ad', 'ads', 'splash']);
  return obj;
});

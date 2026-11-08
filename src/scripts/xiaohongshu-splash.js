// @include _lib.js
// Emptying the list alone is not enough: creatives are cached on device and
// shown on later launches. We keep the creatives but push their schedule to
// 2090, so the app overwrites its cached schedule and never qualifies them.
tcRun('xiaohongshu-splash', function (obj) {
  var d = obj && obj.data;
  if (!d) return obj;
  tcPushTimes(d, ['start_time', 'end_time']);
  return obj;
});

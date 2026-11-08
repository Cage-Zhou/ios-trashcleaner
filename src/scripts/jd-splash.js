// @include _lib.js
tcRun('jd-splash', function (obj) {
  if (!obj || typeof obj !== 'object') return obj;
  tcEmpty(obj, ['images', 'videos']);
  if ('showTimesDaily' in obj) obj.showTimesDaily = 0;
  if ('countdown' in obj) obj.countdown = 0;
  return obj;
});

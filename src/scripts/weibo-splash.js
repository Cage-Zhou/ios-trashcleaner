// @include _lib.js
// Handles sdkad.php (JSON + "OK" suffix) and wbpullad.lua.
tcRun('weibo-splash', function (obj) {
  tcEmpty(obj, ['ads']);
  if (obj.cached_ad) tcEmpty(obj.cached_ad, ['ads']);
  var delays = ['background_delay_display_time', 'lastAdShow_delay_display_time', 'delay_display_time'];
  for (var i = 0; i < delays.length; i++) {
    if (delays[i] in obj) obj[delays[i]] = TC_ONE_YEAR;
    if (obj.cached_ad && delays[i] in obj.cached_ad) obj.cached_ad[delays[i]] = TC_ONE_YEAR;
  }
  if ('realtime_ad_video_stall_time' in obj) obj.realtime_ad_video_stall_time = 0;
  if ('realtime_ad_timeout_duration' in obj) obj.realtime_ad_timeout_duration = 0;
  if ('show_push_splash_ad' in obj) obj.show_push_splash_ad = false;
  return obj;
});

// @include _lib.js
tcRun('bilibili-splash', function (obj) {
  var d = obj && obj.data;
  if (!d || typeof d !== 'object') return obj;
  tcEmpty(d, ['list', 'show', 'event_list', 'preload', 'keep_ids']);
  if ('max_time' in d) d.max_time = 0;
  if ('min_interval' in d) d.min_interval = TC_ONE_YEAR;
  if ('pull_interval' in d) d.pull_interval = TC_ONE_YEAR;
  return obj;
});

// TrashCleaner shared helpers — inlined into every script by tools/build.js.
// Uses only $request / $response / $done, which Surge, Loon, Quantumult X,
// Shadowrocket and Stash all provide for http-response scripts.

var TC_FAR_FUTURE = 3818332800; // 2090-12-31 00:00:00 UTC (seconds)
var TC_ONE_YEAR = 31536000;

function tcLog(msg) {
  console.log('[TrashCleaner] ' + msg);
}

// Splits a body into prefix / JSON / suffix, so responses like `{...}OK` survive.
function tcSplitJson(raw) {
  var start = raw.search(/[\[{]/);
  var end = Math.max(raw.lastIndexOf('}'), raw.lastIndexOf(']'));
  if (start < 0 || end < start) return null;
  return { prefix: raw.slice(0, start), json: raw.slice(start, end + 1), suffix: raw.slice(end + 1) };
}

// Runs transform(obj, url) on the JSON body. On any failure the original
// response passes through untouched — never break the app.
function tcRun(name, transform) {
  var raw = (typeof $response !== 'undefined' && $response && $response.body) || '';
  var url = (typeof $request !== 'undefined' && $request && $request.url) || '';
  try {
    var parts = tcSplitJson(raw);
    if (!parts) return $done({});
    var obj = JSON.parse(parts.json);
    var out = transform(obj, url);
    if (out === undefined) out = obj;
    $done({ body: parts.prefix + JSON.stringify(out) + parts.suffix });
  } catch (e) {
    tcLog(name + ' failed, passthrough: ' + e);
    $done({});
  }
}

// Empties the listed keys wherever they appear at this level:
// arrays -> [], objects -> {}, other values are left alone.
function tcEmpty(obj, keys) {
  if (!obj || typeof obj !== 'object') return obj;
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (Array.isArray(obj[k])) obj[k] = [];
    else if (obj[k] && typeof obj[k] === 'object') obj[k] = {};
  }
  return obj;
}

// Recursively visits every object node.
function tcWalk(node, fn) {
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) tcWalk(node[i], fn);
  } else if (node && typeof node === 'object') {
    fn(node);
    for (var k in node) if (Object.prototype.hasOwnProperty.call(node, k)) tcWalk(node[k], fn);
  }
}

// Pushes any start/end time fields into the far future so cached creatives never qualify.
// Keeps the original unit (seconds vs milliseconds).
function tcPushTimes(node, fields) {
  tcWalk(node, function (o) {
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (typeof o[f] === 'number') {
        var ms = o[f] > 1e12;
        var isEnd = /end|expire/i.test(f);
        var t = TC_FAR_FUTURE + (isEnd ? 86399 : 0);
        o[f] = ms ? t * 1000 : t;
      } else if (typeof o[f] === 'string' && /^\d{10,13}$/.test(o[f])) {
        var msS = o[f].length === 13;
        var tS = TC_FAR_FUTURE + (/end|expire/i.test(f) ? 86399 : 0);
        o[f] = String(msS ? tS * 1000 : tS);
      }
    }
  });
  return node;
}

tcRun('jd-splash', function (obj) {
  if (!obj || typeof obj !== 'object') return obj;
  tcEmpty(obj, ['images', 'videos']);
  if ('showTimesDaily' in obj) obj.showTimesDaily = 0;
  if ('countdown' in obj) obj.countdown = 0;
  return obj;
});

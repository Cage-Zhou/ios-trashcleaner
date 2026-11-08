#!/usr/bin/env node
// Runs bundled scripts against sample responses inside a sandbox that mimics
// the proxy-app runtime ($request / $response / $done).
'use strict';
const assert = require('assert');
const vm = require('vm');
const { bundleScript, loadApps, validate } = require('../tools/build');
const cases = require('./cases');

function runScript(name, url, body) {
  const code = bundleScript(name);
  let result;
  const logs = [];
  const sandbox = {
    $request: { url, headers: {} },
    $response: { body, headers: {}, status: 200 },
    $done: (r) => { result = r; },
    console: { log: (m) => logs.push(m) },
  };
  vm.runInNewContext(code, sandbox, { timeout: 1000 });
  if (result === undefined) throw new Error('$done was never called');
  return { result, logs };
}

let pass = 0, fail = 0;
function test(title, fn) {
  try { fn(); pass++; console.log('  ✓ ' + title); }
  catch (e) { fail++; console.log('  ✗ ' + title + '\n    ' + e.message); }
}

console.log('rule validation');
test('all app rules validate', () => assert.deepStrictEqual(validate(loadApps()), []));

console.log('script cases');
for (const c of cases) {
  test(`${c.script}: ${c.title}`, () => {
    const { result } = runScript(c.script, c.url, c.body);
    c.check(result);
  });
}

console.log('robustness');
const scripts = [...new Set(cases.map((c) => c.script))];
for (const s of scripts) {
  for (const [label, body] of [['empty body', ''], ['non-JSON body', '<html>502</html>'], ['broken JSON', '{"data":']]) {
    test(`${s}: ${label} passes through`, () => {
      const { result } = runScript(s, 'https://example.com/', body);
      // vm objects come from another realm, so compare serialized form.
      assert.strictEqual(JSON.stringify(result), '{}');
    });
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

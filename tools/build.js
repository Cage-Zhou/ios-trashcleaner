#!/usr/bin/env node
// Builds proxy-app modules from src/apps/*.js and bundles src/scripts/*.js.
// Usage: node tools/build.js [--base-url URL] [--only id1,id2]
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC_APPS = path.join(ROOT, 'src', 'apps');
const SRC_SCRIPTS = path.join(ROOT, 'src', 'scripts');
const DIST = path.join(ROOT, 'dist');

const ACTIONS = ['reject', 'reject-200', 'reject-dict', 'reject-array', 'reject-img'];
const RULE_TYPES = ['DOMAIN', 'DOMAIN-SUFFIX', 'DOMAIN-KEYWORD'];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--base-url') out.baseUrl = argv[++i];
    else if (argv[i] === '--only') out.only = argv[++i].split(',');
  }
  return out;
}

function loadApps(only) {
  return fs.readdirSync(SRC_APPS)
    .filter((f) => f.endsWith('.js') && !f.startsWith('_'))
    .sort()
    .map((f) => require(path.join(SRC_APPS, f)))
    .filter((a) => !only || only.includes(a.id));
}

// ---------- validation ----------
function hostMatches(host, mitmEntry) {
  const re = new RegExp('^' + mitmEntry.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');
  return re.test(host);
}

function validate(apps) {
  const errors = [];
  const ids = new Set();
  for (const a of apps) {
    const where = `[${a.id}]`;
    if (!a.id || !a.name) errors.push(`${where} missing id/name`);
    if (ids.has(a.id)) errors.push(`${where} duplicate id`);
    ids.add(a.id);
    for (const r of a.rules || []) {
      if (!RULE_TYPES.includes(r.type)) errors.push(`${where} bad rule type ${r.type}`);
    }
    const entries = [
      ...(a.rewrites || []).map((r) => ({ ...r, kind: 'rewrite' })),
      ...(a.scripts || []).map((s) => ({ ...s, kind: 'script' })),
    ];
    for (const e of entries) {
      if (/\s/.test(e.pattern)) errors.push(`${where} pattern contains whitespace: ${e.pattern}`);
      let re;
      try { re = new RegExp(e.pattern); } catch (err) { errors.push(`${where} invalid regex ${e.pattern}: ${err.message}`); continue; }
      if (e.kind === 'rewrite' && !ACTIONS.includes(e.action)) errors.push(`${where} bad action ${e.action}`);
      if (e.kind === 'script' && !fs.existsSync(path.join(SRC_SCRIPTS, e.script + '.js'))) errors.push(`${where} missing script ${e.script}.js`);
      if (!e.example) { errors.push(`${where} missing example for ${e.pattern}`); continue; }
      if (!re.test(e.example)) errors.push(`${where} pattern does not match its example: ${e.example}`);
      const host = new URL(e.example).hostname;
      if (!(a.mitm || []).some((m) => hostMatches(host, m))) errors.push(`${where} host ${host} not covered by mitm`);
    }
  }
  return errors;
}

// ---------- script bundling ----------
function bundleScript(name) {
  const src = fs.readFileSync(path.join(SRC_SCRIPTS, name + '.js'), 'utf8');
  return src.replace(/^\/\/ @include (\S+)\s*$/m, (_, file) =>
    fs.readFileSync(path.join(SRC_SCRIPTS, file), 'utf8').trim() + '\n');
}

// ---------- collectors ----------
function collect(apps) {
  const rules = [], rewrites = [], scripts = [], mitm = [];
  for (const a of apps) {
    for (const r of a.rules || []) rules.push({ app: a, ...r });
    for (const r of a.rewrites || []) rewrites.push({ app: a, ...r });
    (a.scripts || []).forEach((s, i) => scripts.push({ app: a, tag: `tc-${a.id}-${i + 1}`, ...s }));
    for (const h of a.mitm || []) if (!mitm.includes(h)) mitm.push(h);
  }
  return { rules, rewrites, scripts, mitm };
}

function header(cfg, style) {
  const lines = [`name=${cfg.name}`, `desc=${cfg.desc}`, `author=${cfg.author}`, `version=${cfg.version}`];
  if (style === 'surge') lines.push('category=TrashCleaner');
  return lines.map((l) => '#!' + l).join('\n');
}

const comment = (x) => `# ${x.app.name}${x.note ? ' · ' + x.note : ''}`;
const scriptUrl = (cfg, s) => `${cfg.scriptBaseUrl}/${s.script}.js`;

// ---------- Surge ----------
function surgeMapLocal(action) {
  switch (action) {
    case 'reject-dict': return 'data-type=text data="{}" status-code=200 header="Content-Type:application/json"';
    case 'reject-array': return 'data-type=text data="[]" status-code=200 header="Content-Type:application/json"';
    case 'reject-img': return 'data-type=tiny-gif status-code=200';
    case 'reject-200': return 'data-type=text data=" " status-code=200';
    default: return null;
  }
}

function buildSurge(cfg, c) {
  const out = [header(cfg, 'surge'), ''];
  if (c.rules.length) {
    out.push('[Rule]');
    for (const r of c.rules) out.push(comment(r), `${r.type},${r.value},REJECT`);
    out.push('');
  }
  const rejects = c.rewrites.filter((r) => r.action === 'reject');
  const maps = c.rewrites.filter((r) => r.action !== 'reject');
  if (rejects.length) {
    out.push('[URL Rewrite]');
    for (const r of rejects) out.push(comment(r), `${r.pattern} - reject`);
    out.push('');
  }
  if (maps.length) {
    out.push('[Map Local]');
    for (const r of maps) out.push(comment(r), `${r.pattern} ${surgeMapLocal(r.action)}`);
    out.push('');
  }
  if (c.scripts.length) {
    out.push('[Script]');
    for (const s of c.scripts) {
      out.push(comment(s), `${s.tag} = type=http-response,pattern="${s.pattern}",requires-body=1,max-size=0,timeout=${cfg.scriptTimeout},script-path=${scriptUrl(cfg, s)}`);
    }
    out.push('');
  }
  out.push('[MITM]', `hostname = %APPEND% ${c.mitm.join(', ')}`, '');
  return out.join('\n');
}

// ---------- Shadowrocket (Surge syntax, but reject-* in URL Rewrite) ----------
function buildShadowrocket(cfg, c) {
  const out = [header(cfg), ''];
  if (c.rules.length) {
    out.push('[Rule]');
    for (const r of c.rules) out.push(comment(r), `${r.type},${r.value},REJECT`);
    out.push('');
  }
  if (c.rewrites.length) {
    out.push('[URL Rewrite]');
    for (const r of c.rewrites) out.push(comment(r), `${r.pattern} - ${r.action}`);
    out.push('');
  }
  if (c.scripts.length) {
    out.push('[Script]');
    for (const s of c.scripts) {
      out.push(comment(s), `${s.tag} = type=http-response,pattern="${s.pattern}",requires-body=1,max-size=0,timeout=${cfg.scriptTimeout},script-path=${scriptUrl(cfg, s)}`);
    }
    out.push('');
  }
  out.push('[MITM]', `hostname = %APPEND% ${c.mitm.join(', ')}`, '');
  return out.join('\n');
}

// ---------- Loon ----------
function buildLoon(cfg, c) {
  const out = [header(cfg), ''];
  if (c.rules.length) {
    out.push('[Rule]');
    for (const r of c.rules) out.push(comment(r), `${r.type},${r.value},REJECT`);
    out.push('');
  }
  if (c.rewrites.length) {
    out.push('[Rewrite]');
    for (const r of c.rewrites) out.push(comment(r), `${r.pattern} ${r.action}`);
    out.push('');
  }
  if (c.scripts.length) {
    out.push('[Script]');
    for (const s of c.scripts) {
      out.push(comment(s), `http-response ${s.pattern} script-path=${scriptUrl(cfg, s)}, requires-body=true, timeout=${cfg.scriptTimeout}, tag=${s.tag}`);
    }
    out.push('');
  }
  out.push('[MITM]', `hostname = ${c.mitm.join(', ')}`, '');
  return out.join('\n');
}

// ---------- Quantumult X ----------
function buildQxRewrite(cfg, c) {
  const out = [header(cfg), '', `hostname = ${c.mitm.join(', ')}`, ''];
  for (const r of c.rewrites) out.push(comment(r), `${r.pattern} url ${r.action}`);
  for (const s of c.scripts) out.push(comment(s), `${s.pattern} url script-response-body ${scriptUrl(cfg, s)}`);
  out.push('');
  return out.join('\n');
}

function buildQxFilter(cfg, c) {
  const map = { DOMAIN: 'HOST', 'DOMAIN-SUFFIX': 'HOST-SUFFIX', 'DOMAIN-KEYWORD': 'HOST-KEYWORD' };
  const out = [header(cfg), ''];
  for (const r of c.rules) out.push(comment(r), `${map[r.type]},${r.value},REJECT`);
  out.push('');
  return out.join('\n');
}

// ---------- Stash ----------
const yq = (s) => "'" + String(s).replace(/'/g, "''") + "'";

function buildStash(cfg, c) {
  const out = [`name: ${yq(cfg.name)}`, `desc: ${yq(cfg.desc)}`, ''];
  if (c.rules.length) {
    out.push('rules:');
    for (const r of c.rules) out.push(`  ${comment(r)}`, `  - ${yq(`${r.type},${r.value},REJECT`)}`);
    out.push('');
  }
  out.push('http:', '  mitm:');
  for (const h of c.mitm) out.push(`    - ${yq(h)}`);
  if (c.rewrites.length) {
    out.push('  url-rewrite:');
    for (const r of c.rewrites) out.push(`    ${comment(r)}`, `    - ${yq(`${r.pattern} - ${r.action}`)}`);
  }
  if (c.scripts.length) {
    out.push('  script:');
    for (const s of c.scripts) {
      out.push(`    ${comment(s)}`, `    - match: ${yq(s.pattern)}`, `      name: ${yq(s.script)}`,
        '      type: response', '      require-body: true', `      timeout: ${cfg.scriptTimeout}`);
    }
    out.push('', 'script-providers:');
    for (const name of [...new Set(c.scripts.map((s) => s.script))]) {
      out.push(`  ${yq(name)}:`, `    url: ${yq(`${cfg.scriptBaseUrl}/${name}.js`)}`, '    interval: 86400');
    }
  }
  out.push('');
  return out.join('\n');
}

// ---------- app status table ----------
function buildStatus(apps) {
  const lines = ['| App | Bundle ID | 状态 | 验证版本 | 方式 | MITM |', '|---|---|---|---|---|---|'];
  for (const a of apps) {
    const ways = [];
    if ((a.rules || []).length) ways.push(`规则×${a.rules.length}`);
    if ((a.rewrites || []).length) ways.push(`重写×${a.rewrites.length}`);
    if ((a.scripts || []).length) ways.push(`脚本×${a.scripts.length}`);
    lines.push(`| ${a.name} | \`${a.bundleId}\` | ${a.status} | ${a.verifiedOn || '-'} | ${ways.join(' ')} | ${(a.mitm || []).join(', ')} |`);
  }
  return lines.join('\n') + '\n';
}

function write(rel, content) {
  const p = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content.replace(/\r?\n/g, '\n'), 'utf8');
  console.log('  ' + path.relative(ROOT, p).replace(/\\/g, '/'));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
  if (args.baseUrl) cfg.scriptBaseUrl = args.baseUrl.replace(/\/$/, '');
  const apps = loadApps(args.only);

  const errors = validate(apps);
  if (errors.length) {
    console.error('Validation failed:\n' + errors.map((e) => '  ✗ ' + e).join('\n'));
    process.exit(1);
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  const c = collect(apps);
  console.log(`Building ${apps.length} apps (${c.rules.length} rules, ${c.rewrites.length} rewrites, ${c.scripts.length} scripts, ${c.mitm.length} MITM hosts)`);
  write('surge/TrashCleaner.sgmodule', buildSurge(cfg, c));
  write('shadowrocket/TrashCleaner.module', buildShadowrocket(cfg, c));
  write('loon/TrashCleaner.plugin', buildLoon(cfg, c));
  write('quantumultx/TrashCleaner.snippet', buildQxRewrite(cfg, c));
  write('quantumultx/TrashCleaner.list', buildQxFilter(cfg, c));
  write('stash/TrashCleaner.stoverride', buildStash(cfg, c));
  for (const name of [...new Set(c.scripts.map((s) => s.script))]) write(`scripts/${name}.js`, bundleScript(name));
  write('STATUS.md', buildStatus(apps));
}

if (require.main === module) main();
module.exports = { loadApps, validate, bundleScript, collect };

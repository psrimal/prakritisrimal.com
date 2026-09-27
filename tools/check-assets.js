/* node tools/check-assets.js
   Scans the four standalone project pages for every asset they reference and
   reports which files are missing from src/assets. Run it before every push. */

import fs from 'node:fs';
import path from 'node:path';

const WORK = 'src/work';
const ROOT = 'src';
const ATTR = /(?:src|href|data-src|data-logo|data-poster|content)="(\/assets\/[^"]+)"/g;

const wanted = new Map(); // asset path -> set of pages that ask for it

for (const slug of fs.readdirSync(WORK)) {
  const file = path.join(WORK, slug, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(ATTR)) {
    if (!wanted.has(m[1])) wanted.set(m[1], new Set());
    wanted.get(m[1]).add(slug);
  }
}

const missing = [];
for (const asset of [...wanted.keys()].sort()) {
  if (!fs.existsSync(path.join(ROOT, asset))) missing.push(asset);
}

console.log(`\n${wanted.size} assets referenced, ${wanted.size - missing.length} present, ${missing.length} missing.`);

if (missing.length) {
  const byFolder = {};
  for (const a of missing) {
    const folder = a.slice(0, a.lastIndexOf('/'));
    (byFolder[folder] ||= []).push(a.slice(a.lastIndexOf('/') + 1));
  }
  console.log('\nMissing, grouped by the folder they go in:');
  for (const folder of Object.keys(byFolder).sort()) {
    console.log(`\n  src${folder}/`);
    for (const f of byFolder[folder]) console.log(`     ${f}`);
  }
  console.log('\nFilenames are case sensitive once deployed. Match them exactly.\n');
  process.exitCode = 1;
} else {
  console.log('Nothing missing.\n');
}

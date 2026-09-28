/* Converts shapefiles you drop into ./data into the compact ring format the
   canvas draws. Handles reprojection to WGS84 if the .prj is present.
   Run: node tools/build-geo.mjs

   Expected input, any of these (all optional):
     data/bengaluru-district/*.shp   -> district boundary
     data/bengaluru-roads/*.shp      -> street network
     data/bengaluru-water/*.shp      -> lakes
*/
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import mapshaper from 'mapshaper';

const LAYERS = [
  { dir: 'data/bengaluru-district', key: 'district', simplify: '8%',  maxPts: 1200 },
  { dir: 'data/bengaluru-roads',    key: 'roads',    simplify: '3%',  maxPts: 24000 },
  { dir: 'data/bengaluru-water',    key: 'water',    simplify: '12%', maxPts: 3000 }
];

function shpIn(dir) {
  if (!existsSync(dir)) return null;
  const f = readdirSync(dir).find((n) => n.toLowerCase().endsWith('.shp'));
  return f ? `${dir}/${f}` : null;
}

function ringsFrom(geojson, round = 4) {
  const out = [];
  const push = (coords) => {
    const r = coords.map(([x, y]) => [+x.toFixed(round), +y.toFixed(round)]);
    if (r.length > 1) out.push(r);
  };
  for (const f of geojson.features || []) {
    const g = f.geometry; if (!g) continue;
    if (g.type === 'LineString') push(g.coordinates);
    else if (g.type === 'MultiLineString') g.coordinates.forEach(push);
    else if (g.type === 'Polygon') g.coordinates.forEach(push);
    else if (g.type === 'MultiPolygon') g.coordinates.forEach((p) => p.forEach(push));
  }
  return out;
}

const result = {};
for (const layer of LAYERS) {
  const shp = shpIn(layer.dir);
  if (!shp) { console.log(`skip   ${layer.key.padEnd(9)} no .shp in ${layer.dir}`); continue; }
  const cmd = `-i "${shp}" -proj wgs84 -simplify ${layer.simplify} keep-shapes -o out.json format=geojson`;
  const res = await mapshaper.applyCommands(cmd);
  const gj = JSON.parse(Buffer.from(res['out.json']).toString('utf8'));
  let rings = ringsFrom(gj);
  const pts = rings.reduce((n, r) => n + r.length, 0);
  if (pts > layer.maxPts) {
    rings.sort((a, b) => b.length - a.length);
    let kept = 0; const trimmed = [];
    for (const r of rings) { if (kept + r.length > layer.maxPts) continue; trimmed.push(r); kept += r.length; }
    console.log(`trim   ${layer.key.padEnd(9)} ${pts} -> ${kept} points`);
    rings = trimmed;
  }
  result[layer.key] = rings;
  const all = rings.flat();
  const lon = all.map((p) => p[0]), lat = all.map((p) => p[1]);
  console.log(`ok     ${layer.key.padEnd(9)} ${rings.length} rings, ` +
    `bounds ${Math.min(...lon).toFixed(2)},${Math.min(...lat).toFixed(2)} ` +
    `to ${Math.max(...lon).toFixed(2)},${Math.max(...lat).toFixed(2)}`);
}

if (!Object.keys(result).length) {
  console.log('\nNothing written. Put your shapefiles in the folders listed above.');
} else {
  mkdirSync('src/assets/data', { recursive: true });
  writeFileSync('src/assets/data/bengaluru.json', JSON.stringify(result));
  console.log(`\nwrote src/assets/data/bengaluru.json`);
}

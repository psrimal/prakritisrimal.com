/* Turns the bundled Natural Earth land topology into a compact list of
   lat/lon rings the canvas can draw straight onto the sphere.
   Run: node tools/build-world.mjs   (only needed if you change the source) */
import { readFileSync, writeFileSync } from 'node:fs';
import * as topojson from 'topojson-client';

/* Two resolutions: the coarse one for the spinning globe where nobody can see
   detail, the finer one for the descent where India fills the frame. */
const LEVELS = [
  { src: 'land-110m.json', eps: 0.35, min: 8,  out: 'src/assets/data/world.json' },
  { src: 'land-50m.json',  eps: 0.10, min: 10, out: 'src/assets/data/world-50m.json' }
];

// Ramer-Douglas-Peucker in degrees. 0.35 keeps continents readable at globe
// scale while cutting the payload by roughly an order of magnitude.
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  let idx = 0, max = 0;
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i];
    const dx = bx - ax, dy = by - ay;
    const d = Math.abs(dy * px - dx * py + bx * ay - by * ax) / (Math.hypot(dx, dy) || 1);
    if (d > max) { max = d; idx = i; }
  }
  if (max <= eps) return [pts[0], pts[pts.length - 1]];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
}

function build({ src, eps, min, out }) {
const topo = JSON.parse(readFileSync(`node_modules/world-atlas/${src}`, 'utf8'));
const land = topojson.feature(topo, topo.objects.land);
const rings = [];
for (const f of land.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      // a closed ring has first === last, which collapses RDP to two points.
      // split it at the midpoint and simplify each half.
      const closed = ring.length > 3 &&
        ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1];
      let s;
      if (closed) {
        const mid = Math.floor(ring.length / 2);
        s = [...rdp(ring.slice(0, mid + 1), eps).slice(0, -1), ...rdp(ring.slice(mid), eps)];
      } else {
        s = rdp(ring, 0.35);
      }
      // drop slivers: anything under 8 points after simplification is noise at this scale
      if (s.length < min) continue;
      rings.push(s.map(([lon, lat]) => [+lon.toFixed(2), +lat.toFixed(2)]));
    }
  }
}
rings.sort((a, b) => b.length - a.length);
const doc = { note: `Natural Earth ${src}, simplified. [lon, lat] degrees.`, rings };
writeFileSync(out, JSON.stringify(doc));
console.log(`${out.split('/').pop().padEnd(16)} ${String(rings.length).padStart(4)} rings, ` +
  `${String(rings.reduce((n, r) => n + r.length, 0)).padStart(6)} points, ` +
  `${(JSON.stringify(doc).length / 1024).toFixed(0)} KB`);
}
LEVELS.forEach(build);

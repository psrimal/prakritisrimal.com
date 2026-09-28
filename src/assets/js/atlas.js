/* Prakriti / Spatial Intelligence
   All content comes from src/_data/projects.js via window.PROJECTS.
   Canvas work here is schematic and says so on screen. */

const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Real geography. world.json always exists; bengaluru.json appears once you run
   tools/build-geo.mjs over your shapefiles. Everything degrades to the schematic
   if a file is missing, so the site never breaks waiting on data. */
const GEO = { world: null, world50: null, blr: null };
const grab = (u) => fetch(u).then((r) => r.ok ? r.json() : null).catch(() => null);
/* coarse first so the globe paints immediately, then the finer set for the descent */
grab('/assets/data/world.json').then((w) => { GEO.world = w && w.rings; redrawAll(); });
Promise.all([grab('/assets/data/world-50m.json'), grab('/assets/data/bengaluru.json')])
  .then(([w50, b]) => { GEO.world50 = w50 && w50.rings; GEO.blr = b; redrawAll(); });

const REDRAWS = [];
function redrawAll() { REDRAWS.forEach((f) => { try { f(); } catch (e) {} }); }
const PROJECTS = window.PROJECTS || [];
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim();
const C = {
  active: cssVar('active'), water: cssVar('water'), form: cssVar('form'),
  sensing: cssVar('sensing'), network: cssVar('network'), dim: cssVar('text-3')
};

function rng(seed) { let s = seed >>> 0; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
function fitCanvas(cv) {
  const dpr = Math.min(devicePixelRatio || 1, 2), r = cv.getBoundingClientRect();
  cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

/* ---------------- cities ---------------- */
/* grain = intersections per km2 at the 10 km ball, from the morphology study.
   Only the five study cities carry a value. */
const CITIES = [
  { n: 'BENGALURU', lat: 12.97, lon: 77.59, tier: 'study', c: C.active, grain: 135.6 },
  { n: 'LONDON', lat: 51.51, lon: -0.13, tier: 'research', c: C.network },
  { n: 'DELHI', lat: 28.61, lon: 77.21, tier: 'comparison', c: C.form, grain: 74.2 },
  { n: 'MUMBAI', lat: 19.08, lon: 72.88, tier: 'comparison', c: C.form, grain: 57.9 },
  { n: 'KOLKATA', lat: 22.57, lon: 88.36, tier: 'comparison', c: C.form, grain: 81.8 },
  { n: 'CHENNAI', lat: 13.08, lon: 80.27, tier: 'comparison', c: C.form, grain: 90.4 },
  { n: 'DUBAI', lat: 25.20, lon: 55.27, tier: 'writing', c: C.water }
];
const TIER_PRIO = { study: 0, research: 1, comparison: 2, writing: 3 };

/* Draws lat/lon rings onto a sphere, hiding anything on the far side. */
function strokeRings(ctx, rings, cx, cy, R, rotRad, style, width) {
  if (!rings) return;
  ctx.strokeStyle = style; ctx.lineWidth = width;
  for (const ring of rings) {
    let pen = false;
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const la = ring[i][1] * Math.PI / 180, lo = ring[i][0] * Math.PI / 180 + rotRad;
      const z = Math.cos(la) * Math.cos(lo);
      if (z <= 0) { pen = false; continue; }
      const x = cx + Math.cos(la) * Math.sin(lo) * R, y = cy - Math.sin(la) * R;
      if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

/* Flat equirectangular draw, for the close range where curvature is irrelevant. */
function strokeFlat(ctx, rings, cx, cy, ppd, lat0, lon0, style, width, close) {
  if (!rings) return;
  const k = Math.cos(lat0 * Math.PI / 180);
  ctx.strokeStyle = style; ctx.lineWidth = width;
  for (const ring of rings) {
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const x = cx + (ring[i][0] - lon0) * ppd * k, y = cy - (ring[i][1] - lat0) * ppd;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    if (close) ctx.closePath();
    ctx.stroke();
  }
}

function drawMarker(ctx, city, px, py, t) {
  if (city.tier === 'study') {
    ctx.beginPath(); ctx.arc(px, py, 3.4, 0, 7); ctx.fillStyle = city.c; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 9 + Math.sin(t * 0.03) * 2.2, 0, 7);
    ctx.strokeStyle = 'rgba(166,248,196,.45)'; ctx.lineWidth = 1; ctx.stroke();
  } else if (city.tier === 'research' || city.tier === 'writing') {
    ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.fillStyle = city.c; ctx.fill();
  } else {
    ctx.strokeStyle = city.c; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.arc(px, py, 3, 0, 7); ctx.stroke();
  }
}

function placeLabels(ctx, labels) {
  labels.sort((a, b) => TIER_PRIO[a.city.tier] - TIER_PRIO[b.city.tier]);
  const placed = [];
  for (const L of labels) {
    const tw = ctx.measureText(L.text).width;
    const spots = [[15, 3.4], [15, -9], [-tw - 15, 3.4], [15, 15], [-tw - 15, -9]];
    let box = null;
    for (const [dx, dy] of spots) {
      const b = { x: L.px + dx, y: L.py + dy - 9, w: tw + 6, h: 13 };
      if (!placed.some((q) => !(b.x > q.x + q.w || b.x + b.w < q.x || b.y > q.y + q.h || b.y + b.h < q.y))) { box = b; break; }
    }
    if (!box) continue;
    placed.push(box);
    ctx.globalAlpha = L.fade;
    ctx.fillStyle = L.city.tier === 'study' ? 'rgba(238,241,234,.95)' : 'rgba(165,180,177,.75)';
    ctx.fillText(L.text, box.x, box.y + 9.6);
    ctx.globalAlpha = 1;
  }
}

/* ---------------- hero and closing globe ---------------- */
function globeField(canvas, opts) {
  const o = Object.assign({ count: 1200, spin: 0.00003, seed: 7, right: true, labels: true, phase: -1.354 }, opts || {});
  let ctx, w, h, pts = [], raf = null, t = 0, vis = true;
  const r0 = rng(o.seed);
  for (let i = 0; i < o.count; i++) pts.push({ th: 2 * Math.PI * r0(), ph: Math.acos(2 * r0() - 1), s: 0.5 + r0() * 0.9 });
  const size = () => { const f = fitCanvas(canvas); ctx = f.ctx; w = f.w; h = f.h; };
  const rot = () => o.phase + t * o.spin * 60;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const R = Math.min(w, h) * (o.radius || 0.42);
    const cx = o.right ? w * (w > 900 ? 0.68 : 0.5) : w * 0.5;
    const cy = h * 0.5;
    const desk = w > 900;                      // point 2: desktop was too faint
    const gA = desk ? 0.30 : 0.22;             // graticule
    const dotBoost = desk ? 1.55 : 1.0;        // land dots
    ctx.strokeStyle = `rgba(56,78,78,${gA})`; ctx.lineWidth = 1;
    for (let k = -60; k <= 60; k += 30) {
      ctx.beginPath();
      for (let a = 0; a <= 180; a += 3) {
        const lon = (a / 180) * Math.PI * 2 + rot(), lat = k * Math.PI / 180;
        const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
        if (z < 0) { ctx.moveTo(cx + x * R, cy - y * R); continue; }
        a === 0 ? ctx.moveTo(cx + x * R, cy - y * R) : ctx.lineTo(cx + x * R, cy - y * R);
      }
      ctx.stroke();
    }
    for (let m = 0; m < 12; m++) {
      ctx.beginPath();
      const lon = (m / 12) * Math.PI * 2 + rot();
      for (let b = -90; b <= 90; b += 4) {
        const lat = b * Math.PI / 180;
        const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
        if (z < 0) { ctx.moveTo(cx + x * R, cy - y * R); continue; }
        b === -90 ? ctx.moveTo(cx + x * R, cy - y * R) : ctx.lineTo(cx + x * R, cy - y * R);
      }
      ctx.stroke();
    }
    for (const p of pts) {
      const lon = p.th + rot(), lat = Math.PI / 2 - p.ph;
      const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
      if (z < 0) continue;
      const a = Math.min(1, (0.16 + z * 0.72) * dotBoost);
      ctx.fillStyle = `rgba(166,248,196,${a})`;
      ctx.fillRect(cx + x * R, cy - y * R, p.s * 1.25 * (desk ? 1.15 : 1), p.s * 1.25 * (desk ? 1.15 : 1));
    }
    strokeRings(ctx, GEO.world, cx, cy, R, rot(),
      desk ? 'rgba(150,196,186,.60)' : 'rgba(150,196,186,.42)', 1);
    ctx.font = '9.5px "JetBrains Mono", monospace';
    const labels = [];
    for (const city of CITIES) {
      const lat = city.lat * Math.PI / 180, lon = city.lon * Math.PI / 180 + rot();
      const x = Math.cos(lat) * Math.sin(lon), z = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat);
      if (z <= 0.02) continue;
      const px = cx + x * R, py = cy - y * R, fade = Math.min(1, (z - 0.02) / 0.28);
      ctx.globalAlpha = fade; drawMarker(ctx, city, px, py, t); ctx.globalAlpha = 1;
      if (o.labels && z > 0.30 && w > 640) labels.push({ city, px, py, fade, text: city.n });
    }
    placeLabels(ctx, labels);
  }
  const loop = () => { if (!vis) { raf = null; return; } t += 1; draw(); raf = requestAnimationFrame(loop); };
  size(); draw();
  REDRAWS.push(() => { size(); draw(); });
  if (!RM) {
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }, { threshold: 0.02 }).observe(canvas);
  }
  addEventListener('resize', () => { size(); draw(); });
}

if ($('#heroCanvas')) globeField($('#heroCanvas'), { count: 5200, seed: 11, radius: 0.43, spin: 0.00003 });
if ($('#closeCanvas')) globeField($('#closeCanvas'), { count: 4000, seed: 29, radius: 0.40, spin: 0.000022, phase: -1.15 });

(function boot() {
  const el = $('#bootLine'); if (!el) return;
  if (RM) return;
  const seq = ['SYSTEM / READY', 'ACQUIRING / 001', 'OBSERVE / 001'];
  let i = 0; const id = setInterval(() => { el.textContent = seq[i++]; if (i >= seq.length) clearInterval(id); }, 260);
})();

/* ---------------- descent: earth, subcontinent, street ---------------- */
(function descent() {
  const sec = $('.descent'), cv = $('#scaleCanvas'); if (!sec || !cv) return;
  let ctx, w, h;
  const STEPS = [
    { p: 0.00, name: 'EARTH', scale: '1:40,000,000', state: 'NATURAL EARTH COASTLINE',
      t: 'From the planet<br>to the street.',
      b: 'Seven cities carry work on this site. One is the subject, one is where the research was done, four are the comparison set, and one turns up in an essay about pace.' },
    { p: 0.34, name: 'SUBCONTINENT', scale: '1:4,000,000', state: 'MEASURED / 10 KM NETWORK BALL',
      t: 'Five cities,<br>cut the same way.',
      b: 'Delhi, Mumbai, Kolkata, Chennai and Bengaluru, each measured inside a ten kilometre network distance ball from its historic core. Not a municipal boundary, not a circle. The number beside each city is intersections per square kilometre.' },
    { p: 0.68, name: 'BENGALURU', scale: '1:40,000', state: 'DISTRICT BOUNDARY / OSM',
      t: 'And into<br>Bengaluru.',
      b: 'The finest grained of the five. 136 intersections per square kilometre, streets averaging 59 metres, and the most direct routes in the set.' }
  ];
  const rc = rng(4242);
  const cloud = Array.from({ length: 1600 }, () => ({ th: 2 * Math.PI * rc(), ph: Math.acos(2 * rc() - 1), s: 0.4 + rc() * 0.8 }));
  const fallback = (() => {
    const g = rng(99), lines = [];
    for (let i = 0; i < 64; i++) { const y = g(); lines.push([[0, y], [1, y + (g() - 0.5) * 0.10]]); }
    for (let i = 0; i < 64; i++) { const x = g(); lines.push([[x, 0], [x + (g() - 0.5) * 0.10, 1]]); }
    return lines;
  })();
  const size = () => { const f = fitCanvas(cv); ctx = f.ctx; w = f.w; h = f.h; };
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const PHASE = -1.354;   // locked so India faces the viewer throughout
  const BLR = [77.5946, 12.9716];

  function draw(p) {
    ctx.clearRect(0, 0, w, h);
    const desk = w > 900;
    const cx0 = w * (desk ? 0.30 : 0.5), cy0 = h * 0.5;
    const proj = (latDeg, lonDeg) => {
      const la = latDeg * Math.PI / 180, lo = lonDeg * Math.PI / 180 + PHASE;
      return { x: Math.cos(la) * Math.sin(lo), z: Math.cos(la) * Math.cos(lo), y: Math.sin(la) };
    };
    const R = Math.min(w, h) * (0.34 + Math.pow(p, 1.35) * 2.0);
    const follow = sstep(0.06, 0.38, p);
    const ctr = proj(20.5, 79.0);
    const cx = cx0 - ctr.x * R * follow, cy = cy0 + ctr.y * R * follow;

    const globeA = Math.max(0, 1 - Math.max(0, p - 0.55) / 0.30);
    const cityA  = sstep(0.12, 0.32, p) * (1 - sstep(0.66, 0.88, p));
    const localA = sstep(0.66, 0.86, p);

    if (globeA > 0.01) {
      for (const q of cloud) {
        const lon = q.th + PHASE, la = Math.PI / 2 - q.ph;
        const x = Math.cos(la) * Math.sin(lon), z = Math.cos(la) * Math.cos(lon), y = Math.sin(la);
        if (z < 0) continue;
        ctx.fillStyle = `rgba(166,248,196,${(0.10 + z * 0.45) * globeA * (desk ? 1.5 : 1)})`;
        ctx.fillRect(cx + x * R, cy - y * R, q.s, q.s);
      }
      ctx.strokeStyle = `rgba(56,78,78,${0.45 * globeA})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      // swap to the finer coastline once the sphere is big enough to show it
      const coast = (p > 0.10 && GEO.world50) ? GEO.world50 : GEO.world;
      strokeRings(ctx, coast, cx, cy, R, PHASE, `rgba(150,196,186,${0.62 * globeA})`, 1);
    }

    /* close range: the real district, or the schematic if the file is not built yet */
    if (localA > 0.01) {
      const bp = proj(BLR[1], BLR[0]);
      const bx = cx + bp.x * R, by = cy - bp.y * R;
      const ppd = R * Math.PI / 180;   // pixels per degree at this sphere radius
      if (GEO.blr) {
        strokeFlat(ctx, GEO.blr.roads, bx, by, ppd, BLR[1], BLR[0], `rgba(120,160,155,${0.42 * localA})`, 0.7);
        strokeFlat(ctx, GEO.blr.water, bx, by, ppd, BLR[1], BLR[0], `rgba(115,207,229,${0.55 * localA})`, 1, true);
        strokeFlat(ctx, GEO.blr.district, bx, by, ppd, BLR[1], BLR[0], `rgba(166,248,196,${0.75 * localA})`, 1.4, true);
      } else {
        const S = Math.max(w, h) * 2.4, ox = bx - S / 2, oy = by - S / 2;
        ctx.strokeStyle = `rgba(110,150,145,${0.40 * localA})`; ctx.lineWidth = 0.8;
        for (const l of fallback) {
          ctx.beginPath();
          ctx.moveTo(ox + l[0][0] * S, oy + l[0][1] * S);
          ctx.lineTo(ox + l[1][0] * S, oy + l[1][1] * S);
          ctx.stroke();
        }
      }
    }

    if (cityA > 0.01) {
      const pos = {};
      for (const city of CITIES) {
        const q = proj(city.lat, city.lon);
        if (q.z <= 0.02) continue;
        pos[city.n] = { px: cx + q.x * R, py: cy - q.y * R, city };
      }
      const blr = pos['BENGALURU'];
      if (blr) {
        ctx.strokeStyle = `rgba(249,172,117,${0.35 * cityA})`; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
        for (const n of ['DELHI', 'MUMBAI', 'KOLKATA', 'CHENNAI']) {
          if (!pos[n]) continue;
          ctx.beginPath(); ctx.moveTo(blr.px, blr.py); ctx.lineTo(pos[n].px, pos[n].py); ctx.stroke();
        }
        ctx.setLineDash([]);
      }
      ctx.font = '10px "JetBrains Mono", monospace';
      const labels = [];
      for (const k in pos) {
        const { px, py, city } = pos[k];
        ctx.globalAlpha = cityA; drawMarker(ctx, city, px, py, 0); ctx.globalAlpha = 1;
        labels.push({ city, px, py, fade: cityA, text: city.grain ? `${city.n}  ${city.grain}` : city.n });
      }
      placeLabels(ctx, labels);
    }
  }

  let cur = null, lastP = 0;
  function onScroll() {
    const rect = sec.getBoundingClientRect();
    const total = sec.offsetHeight - innerHeight;
    lastP = Math.min(1, Math.max(0, (-rect.top) / Math.max(1, total)));
    draw(lastP);
    let st = STEPS[0];
    for (const x of STEPS) if (lastP >= x.p) st = x;
    if (cur !== st.name) {
      cur = st.name;
      $('#scaleName').textContent = st.name;
      $('#scaleValue').textContent = st.scale;
      $('#scaleState').textContent = (st.name === 'BENGALURU' && !GEO.blr) ? 'SCHEMATIC / AWAITING SHAPEFILE' : st.state;
      $('#descentTitle').innerHTML = st.t;
      $('#descentBody').textContent = st.b;
    }
  }
  size(); onScroll();
  REDRAWS.push(() => { size(); cur = null; onScroll(); });
  addEventListener('resize', () => { size(); onScroll(); });
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
})();

/* ---------------- atlas map ---------------- */
let activeFilter = 'ALL';
let activeId = PROJECTS.length ? PROJECTS[0].id : null;
const MARKER_POS = { isochronic: [0.30, 0.66], geometry: [0.71, 0.58], sensing: [0.22, 0.32], speed: [0.58, 0.28], scenario: [0.80, 0.30], water: [0.47, 0.80] };

function drawAtlas() {
  const cv = $('#atlasCanvas'); if (!cv) return;
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const g = rng(1337);
  ctx.strokeStyle = 'rgba(38,53,53,.42)'; ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 64) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 64) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  const dom = activeFilter === 'ALL' ? null : activeFilter;
  const streetAlpha = dom && dom !== 'FORM' ? 0.28 : 0.55;
  const cx = w * 0.44, cy = h * 0.52;

  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.3;
    ctx.strokeStyle = `rgba(120,160,155,${streetAlpha * 0.9})`; ctx.lineWidth = 1.3;
    const gap = (Math.min(w, h) / 13) * (0.10 + g() * 0.30);
    let px = cx + Math.cos(a) * gap, py = cy + Math.sin(a) * gap;
    ctx.beginPath(); ctx.moveTo(px, py);
    for (let s = 1; s <= 10; s++) {
      const j = (g() - 0.5) * 0.22;
      px += Math.cos(a + j) * (Math.max(w, h) / 13); py += Math.sin(a + j) * (Math.max(w, h) / 13);
      ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  for (let r = 1; r <= 6; r++) {
    ctx.strokeStyle = `rgba(120,160,155,${streetAlpha * 0.5})`; ctx.lineWidth = 0.9;
    ctx.beginPath();
    const rad = (Math.min(w, h) / 13) * r * 1.35;
    for (let a = 0; a <= 6.4; a += 0.16) {
      const wob = 1 + Math.sin(a * 3 + r) * 0.05;
      const x = cx + Math.cos(a) * rad * wob, y = cy + Math.sin(a) * rad * wob * 0.82;
      a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  for (let i = 0; i < 240; i++) {
    const bias = g();
    const x = cx + (g() - 0.5) * w * (0.55 + bias * 0.8), y = cy + (g() - 0.5) * h * (0.55 + bias * 0.8), l = 14 + g() * 70;
    ctx.strokeStyle = `rgba(110,150,145,${streetAlpha * 0.5})`; ctx.lineWidth = 0.7;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (g() > 0.5 ? l : 0), y + (g() > 0.5 ? 0 : l)); ctx.stroke();
  }
  if (!dom || dom === 'WATER') {
    const a = dom === 'WATER' ? 0.85 : 0.3;
    for (let i = 0; i < 7; i++) {
      const x = g() * w, y = g() * h, rr = 16 + g() * 44;
      ctx.beginPath();
      for (let k = 0; k <= 18; k++) {
        const ang = (k / 18) * Math.PI * 2, rad = rr * (0.7 + Math.sin(ang * 3 + i) * 0.22);
        const px = x + Math.cos(ang) * rad, py = y + Math.sin(ang) * rad * 0.72;
        k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(115,207,229,${a * 0.16})`; ctx.fill();
      ctx.strokeStyle = `rgba(115,207,229,${a})`; ctx.lineWidth = 1; ctx.stroke();
    }
  }
  if (dom === 'SENSING') {
    for (let i = 0; i < 26; i++) {
      const x = g() * w, y = g() * h;
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 7); ctx.fillStyle = C.sensing; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, 10, 0, 7); ctx.strokeStyle = 'rgba(230,155,201,.35)'; ctx.stroke();
    }
  }
  if (dom === 'FORM') {
    for (let i = 0; i < 150; i++) {
      const x = g() * w, y = g() * h, s = 4 + g() * 16;
      ctx.fillStyle = `rgba(249,172,117,${0.08 + g() * 0.22})`; ctx.fillRect(x, y, s, s * 0.72);
    }
  }
  if (dom === 'PACE') {
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.strokeStyle = 'rgba(166,248,196,.5)'; ctx.lineWidth = 2.4;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * Math.min(w, h) * (0.18 + g() * 0.34), cy + Math.sin(a) * Math.min(w, h) * (0.18 + g() * 0.34));
      ctx.stroke();
    }
  }
  if (dom === 'ACCESS' || dom === 'SCENARIO') {
    const col = dom === 'ACCESS' ? '191,154,255' : '115,207,229';
    for (let r = 1; r <= 3; r++) {
      ctx.strokeStyle = `rgba(${col},${0.75 - r * 0.16})`; ctx.setLineDash([5, 5]); ctx.lineWidth = 1.3;
      ctx.beginPath();
      const rad = Math.min(w, h) * 0.12 * r;
      for (let a = 0; a <= 6.4; a += 0.1) {
        const wob = 1 + Math.sin(a * 4 + r * 2) * 0.16;
        const x = cx + Math.cos(a) * rad * wob, y = cy + Math.sin(a) * rad * wob * 0.85;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    }
  }
}

function renderMarkers() {
  const wrap = $('#mapWrap'); if (!wrap) return;
  wrap.querySelectorAll('.marker').forEach((n) => n.remove());
  PROJECTS.forEach((p) => {
    if (activeFilter !== 'ALL' && p.domain !== activeFilter) return;
    const pos = MARKER_POS[p.id] || [0.5, 0.5];
    const b = document.createElement('button');
    b.className = 'marker';
    b.style.left = pos[0] * 100 + '%'; b.style.top = pos[1] * 100 + '%';
    b.style.color = `var(--${p.color})`;
    b.setAttribute('aria-pressed', String(p.id === activeId));
    b.innerHTML = `<i></i><span style="color:var(--text-2)">${esc(p.domain)}</span>`;
    b.addEventListener('click', () => select(p.id));
    wrap.appendChild(b);
  });
}

function renderFilters() {
  const doms = ['ALL', ...new Set(PROJECTS.map((p) => p.domain))];
  $('#filters').innerHTML = doms.map((d) => `<button class="chip" data-f="${d}" aria-pressed="${d === activeFilter}">${d}</button>`).join('');
  $$('#filters .chip').forEach((b) => b.addEventListener('click', () => {
    activeFilter = b.dataset.f; renderFilters(); renderRows(); renderMarkers(); drawAtlas();
  }));
}

function renderRows() {
  const list = PROJECTS.filter((p) => activeFilter === 'ALL' || p.domain === activeFilter);
  const live = list.filter((p) => p.stage === 'live');
  const rest = list.filter((p) => p.stage !== 'live');
  $('#signalCount').textContent = `${String(live.length).padStart(2, '0')} LIVE / ${String(rest.length).padStart(2, '0')} NOT YET`;
  const full = (p) => `
    <button class="row" data-id="${p.id}" aria-pressed="${p.id === activeId}" style="color:var(--${p.color})">
      <span class="row-meta"><span>${p.num} / ${esc(p.domain)} / ${esc(p.place)}</span><span class="status">${esc(p.maturity)}</span></span>
      <h3>${esc(p.question)}</h3>
      <p>${esc(p.blurb)}</p>
      ${p.href ? '<span class="open">FULL PROJECT PAGE</span>' : ''}
    </button>`;
  const thin = (p) => `
    <button class="row thin" data-id="${p.id}" aria-pressed="${p.id === activeId}" style="color:var(--${p.color})">
      <span class="row-meta"><span>${p.num} / ${esc(p.domain)}</span><span class="status">${esc(p.maturity)}</span></span>
      <h3>${esc(p.question)}</h3>
    </button>`;
  $('#rows').innerHTML = live.map(full).join('')
    + (rest.length ? '<div class="rows-divider">NOT YET</div>' + rest.map(thin).join('') : '');
  $$('#rows .row').forEach((b) => b.addEventListener('click', () => select(b.dataset.id)));
}

function select(id) {
  activeId = id;
  renderRows(); renderMarkers(); drawAtlas();
  renderInvestigation(PROJECTS.find((p) => p.id === id));
  $('#investigation').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
}

/* ---------------- block renderer ---------------- */
function block(b) {
  switch (b.type) {
    case 'prose':
      return `${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}
        ${b.h ? `<h3>${esc(b.h)}</h3>` : ''}
        ${(b.p || []).map((t) => `<p>${esc(t)}</p>`).join('')}`;
    case 'note':
      return `<div class="note">${b.label ? `<b>${esc(b.label)}</b>` : ''}<span>${esc(b.text)}</span></div>`;
    case 'steps':
      return `<ol class="steps">${b.items.map((m, i) =>
        `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span><b>${esc(m[0])}</b><span>${esc(m[1])}</span></span></li>`).join('')}</ol>`;
    case 'list':
      return `${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}${b.h ? `<h3>${esc(b.h)}</h3>` : ''}
        <ul class="deflist">${b.items.map((m) => `<li><b>${esc(m[0])}</b><span>${esc(m[1])}</span></li>`).join('')}</ul>`;
    case 'pending':
      return `<p class="kicker">NOT DEFINED YET</p><h3>What this needs before it can say anything.</h3>
        <ul class="deflist">${b.items.map((m) => `<li><b>${esc(m[0])}</b><span><span class="pending">PENDING</span> ${esc(m[1])}</span></li>`).join('')}</ul>`;
    case 'table':
      return `${b.kicker ? `<p class="kicker">${esc(b.kicker)}</p>` : ''}${b.h ? `<h3>${esc(b.h)}</h3>` : ''}
        <div class="table-scroll"><table class="dtable">
          <thead><tr>${b.head.map((x) => `<th>${esc(x)}</th>`).join('')}</tr></thead>
          <tbody>${b.rows.map((r) => `<tr>${r.map((x) => `<td>${esc(x)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>${b.foot ? `<p class="tfoot">${esc(b.foot)}</p>` : ''}`;
    case 'findings':
      return `<div class="findings">${b.items.map((m) => `<div><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join('')}</div>`;
    case 'graph':
      return graphPanel();
    default:
      return '';
  }
}

function graphPanel() {
  return `<div class="two">
    <div>
      <div class="graph-wrap">
        <canvas class="graph-canvas"></canvas>
        <div class="graph-hud">SCHEMATIC WALKING GRAPH / ILLUSTRATIVE COSTS</div>
        <div class="graph-legend">
          <span><i class="swatch" style="background:var(--rule-strong)"></i>network</span>
          <span><i class="swatch" style="background:var(--network)"></i>reachable</span>
          <span><i class="swatch" style="background:var(--active)"></i>new reach</span>
        </div>
      </div>
      <div class="controls">
        <div class="timepick" role="group" aria-label="Travel time budget">
          <button class="chip" data-t="5">5 MIN</button>
          <button class="chip" data-t="10">10 MIN</button>
          <button class="chip" data-t="15">15 MIN</button>
        </div>
        <button class="chip scen-toggle">ADD CROSSING</button>
        <span class="range-out js-reach"></span>
      </div>
    </div>
    <div>
      <p class="kicker">THE PRINCIPLE, AT ITS SMALLEST</p>
      <h3>Reach follows the graph.</h3>
      <p>One origin, a walking network and a barrier cutting a corridor in two. Raise the time budget and reach grows along routes, not outward as a circle. Add the crossing and the same budget reaches the far side.</p>
      <div class="deltabox js-delta"></div>
      <p class="fill">Generated geometry, fixed illustrative walking speed. This demonstrates the logic behind the thesis and the scenario simulator. It is not a result for London or anywhere else, and no real segment, population or amenity count is claimed.</p>
    </div>
  </div>`;
}

function renderInvestigation(p) {
  if (!p) return;
  $('#invLabel').textContent = `${p.num} / ${p.domain}`;
  $('#invQuestion').textContent = p.question;
  $('#invNote').textContent = p.note;

  $('#tabs').innerHTML = p.views.map((v, i) =>
    `<button class="tab" role="tab" id="t-${v.id}" aria-controls="p-${v.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${esc(v.label)}</button>`).join('');

  $('#panels').innerHTML = p.views.map((v, i) => `
    <div class="tabpanel" role="tabpanel" id="p-${v.id}" aria-labelledby="t-${v.id}" ${i === 0 ? '' : 'hidden'}>
      ${v.blocks.map(block).join('')}
      ${p.href ? `<a class="open-link" href="${p.href}">Open the full project page</a>` : ''}
    </div>`).join('');

  const keys = p.views.map((v) => v.id);
  keys.forEach((k, i) => {
    const t = $('#t-' + k);
    t.addEventListener('click', () => activateTab(keys, k));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
      activateTab(keys, keys[n]); $('#t-' + keys[n]).focus();
    });
  });
  if ($('.graph-canvas')) wireGraph();
}

function activateTab(keys, key) {
  keys.forEach((k) => {
    const t = $('#t-' + k), pn = $('#p-' + k), on = k === key;
    t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; pn.hidden = !on;
  });
  if ($('.graph-canvas')) requestAnimationFrame(wireGraph);
}

/* ---------------- accessibility demo ---------------- */
let TIME = 10, SCENARIO = false;
const G = (() => {
  const nodes = [], edges = [], r = rng(2024), cols = 7, rows = 6, BARRIER_COL = 3;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    nodes.push({ x: 0.08 + (i / (cols - 1)) * 0.84 + (r() - 0.5) * 0.035, y: 0.08 + (j / (rows - 1)) * 0.84 + (r() - 0.5) * 0.035 });
  }
  const idx = (i, j) => j * cols + i;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols - 1; i++) {
    if (i === BARRIER_COL - 1 && j !== 0 && j !== rows - 1) continue;
    edges.push([idx(i, j), idx(i + 1, j)]);
  }
  for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols; i++) if (r() > 0.14) edges.push([idx(i, j), idx(i, j + 1)]);
  return { nodes, edges, CROSSING: [idx(BARRIER_COL - 1, 3), idx(BARRIER_COL, 3)], origin: idx(BARRIER_COL - 1, 3) };
})();
const SPEED = 4.6, SPAN = 1.5;
const edgeCost = (a, b) => (Math.hypot(G.nodes[a].x - G.nodes[b].x, G.nodes[a].y - G.nodes[b].y) * SPAN / SPEED) * 60;

function solve(withCrossing) {
  const list = withCrossing ? G.edges.concat([G.CROSSING]) : G.edges;
  const adj = G.nodes.map(() => []);
  list.forEach(([a, b]) => { const c = edgeCost(a, b); adj[a].push([b, c]); adj[b].push([a, c]); });
  const dist = G.nodes.map(() => Infinity); dist[G.origin] = 0;
  const seen = new Set();
  while (seen.size < G.nodes.length) {
    let u = -1, best = Infinity;
    for (let i = 0; i < dist.length; i++) if (!seen.has(i) && dist[i] < best) { best = dist[i]; u = i; }
    if (u < 0) break;
    seen.add(u);
    for (const [v, c] of adj[u]) if (dist[u] + c < dist[v]) dist[v] = dist[u] + c;
  }
  return { dist, list };
}
const reachCount = (dist, list, T) => list.filter(([a, b]) => dist[a] <= T && dist[b] <= T).length;

function paintGraph(cv, base, prop) {
  const { ctx, w, h } = fitCanvas(cv);
  ctx.clearRect(0, 0, w, h);
  const P = (n) => [16 + G.nodes[n].x * (w - 32), 16 + G.nodes[n].y * (h - 32)];
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(69,96,99,.85)';
  prop.list.forEach(([a, b]) => { const A = P(a), B = P(b); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); });
  ctx.lineWidth = 2.1; ctx.strokeStyle = C.network;
  base.list.forEach(([a, b]) => { if (base.dist[a] <= TIME && base.dist[b] <= TIME) { const A = P(a), B = P(b); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); } });
  if (SCENARIO) {
    ctx.lineWidth = 2.6; ctx.strokeStyle = C.active;
    prop.list.forEach(([a, b]) => {
      const now = prop.dist[a] <= TIME && prop.dist[b] <= TIME;
      const was = base.dist[a] <= TIME && base.dist[b] <= TIME;
      if (now && !was) { const A = P(a), B = P(b); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
    });
    const A = P(G.CROSSING[0]), B = P(G.CROSSING[1]);
    ctx.setLineDash([4, 4]); ctx.lineWidth = 2; ctx.strokeStyle = C.form;
    ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); ctx.setLineDash([]);
  }
  const O = P(G.origin);
  ctx.beginPath(); ctx.arc(O[0], O[1], 5, 0, 7); ctx.fillStyle = C.active; ctx.fill();
  ctx.beginPath(); ctx.arc(O[0], O[1], 11, 0, 7); ctx.strokeStyle = 'rgba(166,248,196,.5)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.font = '9.5px "JetBrains Mono", monospace'; ctx.fillStyle = 'rgba(165,180,177,.9)';
  ctx.fillText('ORIGIN', O[0] + 15, O[1] + 3.5);
}

function drawGraph() {
  const targets = $$('.graph-canvas').filter((c) => c.offsetParent !== null);
  const base = solve(false), prop = solve(SCENARIO);
  targets.forEach((cv) => paintGraph(cv, base, prop));
  const nb = reachCount(base.dist, base.list, TIME), np = reachCount(prop.dist, prop.list, TIME);
  $$('.js-reach').forEach((o) => { o.textContent = `${np} / ${prop.list.length} SCHEMATIC SEGMENTS REACHED`; });
  const html = SCENARIO
    ? `With the crossing, <b>${np}</b> schematic segments are reachable within <b>${TIME} minutes</b>, against <b>${nb}</b> on the baseline. Delta <b>${np - nb}</b> segments. These are counts of drawn segments in a generated graph, not streets, people or places.`
    : `Baseline: <b>${nb}</b> of <b>${base.list.length}</b> schematic segments reachable within <b>${TIME} minutes</b>. Toggle the crossing to compare.`;
  $$('.js-delta').forEach((b) => { b.innerHTML = html; });
}

function syncControls() {
  $$('.timepick .chip').forEach((o) => o.setAttribute('aria-pressed', String(+o.dataset.t === TIME)));
  $$('.scen-toggle').forEach((o) => { o.setAttribute('aria-pressed', String(SCENARIO)); o.textContent = SCENARIO ? 'REMOVE CROSSING' : 'ADD CROSSING'; });
}
function wireGraph() {
  $$('.timepick .chip').forEach((b) => { b.onclick = () => { TIME = +b.dataset.t; syncControls(); drawGraph(); }; });
  $$('.scen-toggle').forEach((b) => { b.onclick = () => { SCENARIO = !SCENARIO; syncControls(); drawGraph(); }; });
  $$('.graph-canvas').forEach((cv) => {
    if (cv.dataset.ro) return;
    cv.dataset.ro = '1';
    new ResizeObserver(() => requestAnimationFrame(drawGraph)).observe(cv);
  });
  syncControls(); drawGraph();
}

/* ---------------- search ---------------- */
(function search() {
  const dlg = $('#cmd'), input = $('#cmdInput'), list = $('#cmdList');
  if (!dlg) return;
  function render(q = '') {
    const s = q.trim().toLowerCase();
    const hits = PROJECTS.filter((p) => !s || (p.question + p.title + p.domain + p.place + p.blurb).toLowerCase().includes(s));
    list.innerHTML = hits.length ? hits.map((p) => `
      <li><button data-id="${p.id}">
        <span><strong style="font-family:var(--mono);font-weight:600">${esc(p.question)}</strong><br>
        <span class="lbl">${p.num} / ${esc(p.domain)} / ${esc(p.place)} / ${esc(p.maturity)}</span></span>
        <span class="lbl" style="color:var(--${p.color})">OPEN</span>
      </button></li>`).join('')
      : '<li><div style="padding:18px 22px;color:var(--text-2);font-size:14px">Nothing matches that. Search covers the listed investigations.</div></li>';
    list.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { dlg.close(); select(b.dataset.id); }));
  }
  $('#openSearch').addEventListener('click', () => { render(''); dlg.showModal(); input.value = ''; input.focus(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); const b = list.querySelector('button'); if (b) b.click(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); const b = list.querySelector('button'); if (b) b.focus(); }
  });
  addEventListener('keydown', (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); $('#openSearch').click(); } });
})();

/* ---------------- boot ---------------- */
if ($('#rows')) {
  renderFilters(); renderRows(); renderMarkers(); drawAtlas();
  renderInvestigation(PROJECTS[0]);
  new ResizeObserver(() => requestAnimationFrame(drawAtlas)).observe($('#atlasCanvas'));
  $$('.r-go').forEach((b) => b.addEventListener('click', () => select(b.dataset.id)));
  $('#resetAtlas').addEventListener('click', () => { activeFilter = 'ALL'; renderFilters(); renderRows(); renderMarkers(); drawAtlas(); });
  addEventListener('resize', () => { drawAtlas(); drawGraph(); });
}

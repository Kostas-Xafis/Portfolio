/**
 * Generates procedural cover images for projects and blog posts.
 *
 * Every entry gets a deterministic, category-themed SVG scene rendered to
 * src/assets/covers/<slug>.webp (1200x675), matching the site's design
 * language: near-black background (#0b0b0c), slate surfaces (#131315) and a
 * single warm golden accent (#d2a24f). No text is drawn — the UI adds labels.
 *
 * The script also injects `cover: <slug>.webp` into the frontmatter of the
 * BOTH language files (the "en-" and "el-" files) so a translation pair
 * always uses the same image. It is idempotent: existing `cover:` lines are
 * left alone.
 *
 * Run with:  npm run covers:generate
 *
 * These covers are committed to the repo; you can replace any of them with
 * AI-generated art (see image-gen-prompt.txt) at any time.
 */
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src/content');
const OUT = path.join(ROOT, 'src/assets/covers');

const W = 1200;
const H = 675;
// Raster output size (the SVG scales its 1200x675 coordinate space to this).
// Detail pages render the cover ~960 CSS px wide. To stay sharp we need:
//   960px × DPR 2 × typical browser zoom 1.25 ≈ 2400 physical px,
// so 2560×1440 gives comfortable headroom for retina + zoomed displays.
const OUT_W = 2560;
const OUT_H = 1440;

const BG = '#0b0b0c';
const SURFACE = '#131315';
const SURFACE_2 = '#1a1a1d';
const LINE = '#26262a';
const INK_DIM = '#9b9aa2';
const ACCENT = '#d2a24f';

/** Deterministic PRNG (mulberry32) seeded by a string. */
function rng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z]+):\s*(?:"([^"]*)"|(.*))$/);
    if (kv) out[kv[1]] = kv[2] ?? kv[3];
  }
  return out;
}

/** Common background: dark fill, faint dot grid, soft vignette. */
function background(rand) {
  const dots = [];
  for (let y = 30; y < H; y += 56) {
    for (let x = 30; x < W; x += 56) {
      dots.push(`<circle cx="${x}" cy="${y}" r="1.3" fill="rgba(232,230,225,0.055)"/>`);
    }
  }
  return `
    <rect width="${W}" height="${H}" fill="${BG}"/>
    <rect width="${W}" height="${H}" fill="url(#surfGrad)"/>
    ${dots.join('')}
    <rect width="${W}" height="${H}" fill="url(#vignette)"/>`;
}

const DEFS = `
  <defs>
    <linearGradient id="surfGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${SURFACE_2}" stop-opacity="0.85"/>
      <stop offset="0.55" stop-color="${SURFACE}" stop-opacity="0.6"/>
      <stop offset="1" stop-color="${BG}" stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0.25"/>
    </linearGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.78">
      <stop offset="0.62" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.5"/>
    </radialGradient>
    <pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(232,230,225,0.07)"/>
    </pattern>
  </defs>`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/* ---------------------------------------------------------------- scenes */

function sceneFullstack(rand) {
  const w = 560;
  const h = 88;
  const x = (W - w) / 2;
  const tops = [190, 320, 450];
  let s = '';
  for (let i = 0; i < tops.length; i++) {
    const top = tops[i];
    s += `
      <rect x="${x}" y="${top}" width="${w}" height="${h}" rx="14" fill="#131315" stroke="${LINE}" stroke-width="1.5"/>
      <rect x="${x}" y="${top}" width="${w}" height="4" fill="url(#gold)" opacity="${0.95 - i * 0.2}"/>`;
    for (let b = 0; b < 3; b++) {
      const bx = x + 28 + b * 132 + rand() * 22;
      const bw = 92 + rand() * 26;
      const lit = b === ((i + 1) % 3);
      s += `<rect x="${bx}" y="${top + 22}" width="${bw}" height="${h - 44}" rx="8" fill="${lit ? 'url(#gold)' : '#1a1a1d'}" opacity="${lit ? 0.8 : 0.9}" ${lit ? '' : `stroke="${LINE}" stroke-width="1.2"`}/>`;
    }
    s += `<circle cx="${x + w - 34}" cy="${top + h / 2}" r="10" fill="none" stroke="${ACCENT}" stroke-width="2" opacity="0.9"/>`;
  }
  for (let i = 0; i < tops.length - 1; i++) {
    const y1 = tops[i] + h;
    const y2 = tops[i + 1];
    const cx1 = x + w / 2 + (rand() - 0.5) * 220;
    const cx2 = x + w / 2 + (rand() - 0.5) * 220;
    s += `<line x1="${cx1}" y1="${y1}" x2="${cx2}" y2="${y2}" stroke="${ACCENT}" stroke-width="1.8" opacity="0.45" stroke-dasharray="3 7"/>`;
  }
  return s;
}

function sceneMl(rand) {
  const nodes = [];
  const edges = [];
  const all = [];
  const lobes = [
    { cx: 280, cy: 320, n: 26, r: 130 },
    { cx: 610, cy: 240, n: 20, r: 105 },
    { cx: 900, cy: 370, n: 24, r: 140 },
  ];
  for (const lobe of lobes) {
    const points = [];
    for (let i = 0; i < lobe.n; i++) {
      const a = (i / lobe.n) * Math.PI * 2;
      const rr = lobe.r * (0.35 + rand() * 0.6);
      points.push({
        x: lobe.cx + Math.cos(a) * rr,
        y: lobe.cy + Math.sin(a) * rr * 0.8,
      });
    }
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      if (rand() < 0.62) {
        const q = points[Math.floor(rand() * points.length)];
        edges.push(`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" stroke="${ACCENT}" stroke-width="1" opacity="0.26"/>`);
      }
      nodes.push(
        `<circle cx="${p.x}" cy="${p.y}" r="${3.5 + rand() * 4}" fill="${i % 6 === 0 ? ACCENT : LINE}" fill-opacity="${i % 5 === 0 ? 0.9 : 0.6}" ${i % 6 === 0 ? `stroke="${ACCENT}" stroke-width="1.5"` : ''}/>`,
      );
      all.push(p);
    }
  }
  // highlight a random walk between two far nodes
  const a = all[Math.floor(rand() * all.length)];
  const b = all[Math.floor(rand() * all.length)];
  const walk = `<path d="M${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y - 90}, ${(a.x + b.x) / 2} ${b.y + 90}, ${b.x} ${b.y}" fill="none" stroke="url(#gold)" stroke-width="2.4" opacity="0.8"/>`;
  return edges.join('') + nodes.join('') + walk;
}

function sceneCompilers(rand) {
  const chambers = [];
  const y = 250;
  const w = 180;
  const h = 150;
  const xs = [250, 510, 770];
  const motifs = [
    // gear: dashed ring + teeth
    `<circle cx="${xs[0] + w / 2}" cy="${y + h / 2}" r="52" fill="none" stroke="url(#gold)" stroke-width="3" stroke-dasharray="9 7"/>
     <circle cx="${xs[0] + w / 2}" cy="${y + h / 2}" r="26" fill="none" stroke="${ACCENT}" stroke-width="1.6" opacity="0.8"/>`,
    // AST: root + branches
    () => {
      const cx = xs[1] + w / 2;
      const cy = y + h / 2;
      return `<line x1="${cx}" y1="${cy}" x2="${cx - 52}" y2="${cy - 44}" stroke="${ACCENT}" stroke-width="1.8" opacity="0.7"/>
       <line x1="${cx}" y1="${cy}" x2="${cx + 52}" y2="${cy - 44}" stroke="${ACCENT}" stroke-width="1.8" opacity="0.7"/>
       <line x1="${cx}" y1="${cy}" x2="${cx + 20}" y2="${cy + 46}" stroke="${ACCENT}" stroke-width="1.8" opacity="0.7"/>
       <circle cx="${cx}" cy="${cy}" r="10" fill="url(#gold)"/>
       <circle cx="${cx - 52}" cy="${cy - 44}" r="7" fill="${ACCENT}" opacity="0.8"/>
       <circle cx="${cx + 52}" cy="${cy - 44}" r="7" fill="${ACCENT}" opacity="0.8"/>
       <circle cx="${cx + 20}" cy="${cy + 46}" r="7" fill="${ACCENT}" opacity="0.8"/>`;
    },
    // circuit: board + traces
    () => {
      const cx = xs[2] + w / 2;
      const cy = y + h / 2;
      let s = `<rect x="${cx - 60}" y="${cy - 46}" width="120" height="92" rx="8" fill="#131315" stroke="${LINE}" stroke-width="1.5"/>`;
      for (let i = 0; i < 4; i++) {
        s += `<path d="M${cx - 48} ${cy - 28 + i * 20} h ${28 + rand() * 40}" stroke="${ACCENT}" stroke-width="1.4" opacity="0.6" fill="none"/>`;
        s += `<circle cx="${cx + 30 + rand() * 20}" cy="${cy - 28 + i * 20}" r="4" fill="none" stroke="${ACCENT}" stroke-width="1.4" opacity="0.7"/>`;
      }
      s += `<rect x="${cx - 14}" y="${cy - 14}" width="28" height="28" rx="6" fill="url(#gold)" opacity="0.9"/>`;
      return s;
    },
  ];
  for (let i = 0; i < 3; i++) {
    chambers.push(`
      <rect x="${xs[i]}" y="${y}" width="${w}" height="${h}" rx="14" fill="#131315" stroke="${LINE}" stroke-width="1.5"/>
      ${typeof motifs[i] === 'function' ? motifs[i]() : motifs[i]}`);
    if (i < 2) {
      chambers.push(`<path d="M${xs[i] + w} ${y + h / 2} h 80" stroke="${ACCENT}" stroke-width="2" opacity="0.5" marker-end="url(#arrow)"/>`);
    }
  }
  const cube = `
    <rect x="1020" y="${y + 12}" width="120" height="120" rx="10" fill="#131315" stroke="url(#gold)" stroke-width="2.5"/>
    <rect x="1044" y="${y + 36}" width="72" height="72" rx="8" fill="url(#gold)" opacity="0.8"/>`;
  return chambers.join('') + cube;
}

function sceneSystems(rand) {
  const cx = 430;
  const cy = 337;
  let s = '';
  for (let i = 5; i >= 1; i--) {
    s += `<circle cx="${cx}" cy="${cy}" r="${i * 62}" fill="none" stroke="${i === 2 ? 'url(#gold)' : LINE}" stroke-width="1.6" opacity="${i === 2 ? 0.9 : 0.7}"/>`;
  }
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    const r1 = 280;
    const r2 = 298;
    s += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" stroke="${i % 3 === 0 ? ACCENT : LINE}" stroke-width="2" opacity="${i % 3 === 0 ? 0.8 : 0.5}"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="26" fill="url(#gold)"/>`;
  // bars
  for (let i = 0; i < 7; i++) {
    const bw = 40 + rand() * 36;
    const bh = 30 + rand() * 150;
    const x = 760 + i * 64;
    const y2 = 520;
    s += `<rect x="${x}" y="${y2 - bh}" width="42" height="${bh}" rx="5" fill="#131315" stroke="${LINE}" stroke-width="1.4"/>
    <rect x="${x}" y="${y2 - bh}" width="42" height="${bh * (0.35 + rand() * 0.3)}" rx="5" fill="url(#gold)" opacity="0.75"/>`;
  }
  return s;
}

function sceneExtensions(rand) {
  let cols = '';
  const keys = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 12; c++) {
      keys.push({ x: 150 + c * 82, y: 170 + r * 120, w: 64, h: 88 });
    }
  }
  const chosen = keys.filter(() => rand() < 0.62);
  cols = chosen
    .map((k, i) => {
      const lit = i % 4 === 0;
      return `
        <rect x="${k.x}" y="${k.y}" width="${k.w}" height="${k.h}" rx="10" fill="#131315" stroke="${lit ? 'url(#gold)' : LINE}" stroke-width="1.6"/>
        <rect x="${k.x + 12}" y="${k.y + 14}" width="${k.w - 24}" height="14" rx="3" fill="${ACCENT}" opacity="${lit ? 0.85 : 0.4}"/>
        <rect x="${k.x + 12}" y="${k.y + 36}" width="${(k.w - 24) * (0.4 + rand() * 0.6)}" height="14" rx="3" fill="${INK_DIM}" opacity="0.35"/>`;
    })
    .join('');
  return cols;
}

function sceneDevops(rand) {
  const w = 560;
  const h = 96;
  const x = (W - w) / 2;
  const tops = [150, 300, 450];
  let s = '';
  for (let i = 0; i < tops.length; i++) {
    const top = tops[i];
    s += `
      <rect x="${x}" y="${top}" width="${w}" height="${h}" rx="14" fill="#131315" stroke="${LINE}" stroke-width="1.5"/>
      <rect x="${x}" y="${top}" width="${w / 3}" height="${h}" rx="14" fill="url(#gold)" opacity="${0.6 - i * 0.18}"/>`;
    for (let b = 0; b < 3; b++) {
      const bx = x + 44 + b * 130 + rand() * 20;
      s += `<rect x="${bx}" y="${top + 30}" width="96" height="36" rx="6" fill="#1a1a1d" stroke="${LINE}" stroke-width="1.2"/>
        <circle cx="${bx + 14}" cy="${top + 48}" r="5" fill="${ACCENT}" opacity="0.7"/>`;
    }
    s += `<circle cx="${x + 20}" cy="${top + 48}" r="8" fill="none" stroke="${ACCENT}" stroke-width="2"/>`;
  }
  for (let i = 0; i < tops.length - 1; i++) {
    s += `<line x1="${W / 2}" y1="${tops[i] + h}" x2="${W / 2}" y2="${tops[i + 1]}" stroke="${ACCENT}" stroke-width="2" opacity="0.5" stroke-dasharray="4 8"/>`;
  }
  // vault + key on the right
  s += `
    <rect x="985" y="255" width="105" height="165" rx="14" fill="#131315" stroke="url(#gold)" stroke-width="2"/>
    <circle cx="1037" cy="337" r="30" fill="none" stroke="${ACCENT}" stroke-width="2.4" opacity="0.9"/>
    <rect x="1030" y="320" width="14" height="34" rx="4" fill="url(#gold)"/>`;
  return s;
}

function sceneWave(rand) {
  const cx = 320;
  const cy = 340;
  const chain = [
    { kind: 'osc', x: 240 },
    { kind: 'filter', x: 480 },
    { kind: 'eq', x: 720 },
    { kind: 'gain', x: 960 },
  ];
  let s = '';
  for (let i = 0; i < chain.length; i++) {
    const n = chain[i];
    s += `<rect x="${n.x - 70}" y="${cy - 60}" width="140" height="120" rx="16" fill="#131315" stroke="${LINE}" stroke-width="1.5"/>`;
    s += `<circle cx="${n.x}" cy="${cy}" r="22" fill="url(#gold)" opacity="0.9"/>`;
    if (i < chain.length - 1) {
      const nx = chain[i + 1].x;
      s += `<line x1="${n.x + 70}" y1="${cy}" x2="${nx - 70}" y2="${cy}" stroke="${ACCENT}" stroke-width="2" opacity="0.5"/>`;
    }
  }
  let d = `M 80 ${cy + 70}`;
  for (let i = 0; i <= 60; i++) {
    const x = 80 + i * 17;
    const y = cy + 70 - Math.sin(i * 0.42) * 34 - Math.sin(i * 0.11) * 12;
    d += ` L ${x} ${y}`;
  }
  s += `<path d="${d}" fill="none" stroke="url(#gold)" stroke-width="2.6" opacity="0.85"/>`;
  // 72 tick arc (moria motif)
  s += `<path d="M ${cx} ${cy} m -220 0 a 220 220 0 0 1 440 0" fill="none" stroke="${LINE}" stroke-width="1.4" opacity="0.7"/>`;
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (i / 24) * Math.PI;
    const r1 = 220;
    const r2 = i % 4 === 0 ? 240 : 229;
    s += `<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" stroke="${i % 4 === 0 ? ACCENT : LINE}" stroke-width="1.6" opacity="0.75"/>`;
  }
  return s;
}

function sceneDefault(rand) {
  return sceneSystems(rand);
}

function sceneFor(entry) {
  const category = entry.category ?? '';
  const kind = entry.kind ?? entry.tags?.[0] ?? '';
  const rand = rng(entry.slug);
  if (category === 'fullstack') return sceneFullstack(rand);
  if (category === 'ml') return sceneMl(rand);
  if (category === 'compilers') return sceneCompilers(rand);
  if (category === 'systems') return sceneSystems(rand);
  if (category === 'extensions') return sceneExtensions(rand);
  if (category === 'devops') return sceneDevops(rand);
  if (kind === 'web-audio') return sceneWave(rand);
  if (kind === 'compiler' || kind === 'java') return sceneCompilers(rand);
  if (entry.kind === 'post') return sceneWave(rand);
  return sceneDefault(rand);
}

function svg(entry) {
  const rand = rng(entry.slug + '#scene');
  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${OUT_W}" height="${OUT_H}" viewBox="0 0 ${W} ${H}">
    ${DEFS}
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${ACCENT}"/>
    </marker>
    ${background(rand)}
    <rect x="0" y="0" width="${W}" height="${H}" fill="url(#grid)" opacity="0.25"/>
    ${sceneFor(entry)}
    <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" fill="none" stroke="${LINE}" stroke-width="1.5" rx="0"/>
    <rect x="0" y="0" width="${W}" height="5" fill="url(#gold)" opacity="0.9"/>
  </svg>`;
}

/* --------------------------------------------------- frontmatter wiring */

function ensureCoverLine(raw, filename) {
  if (/^cover:/m.test(raw)) return raw;
  const lines = raw.split('\n');
  const idx = lines.findIndex((l) => /^lang:\s*/.test(l));
  const at = idx >= 0 ? idx + 1 : 2;
  lines.splice(at, 0, `cover: ${filename}`);
  return lines.join('\n');
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const entries = [];
  for (const kind of ['projects', 'blog']) {
    const dir = path.join(CONTENT, kind);
    for (const file of await readdir(dir)) {
      if (!file.startsWith('en-')) continue;
      const raw = await readFile(path.join(dir, file), 'utf8');
      const fm = parseFrontmatter(raw);
      if (!fm.slug) continue;
      entries.push({
        kind: kind === 'blog' ? 'post' : 'project',
        category: fm.category,
        tags: fm.tags ? fm.tags.replace(/[\[\]]/g, '').split(',').map((s) => s.trim()) : [],
        slug: fm.slug,
        title: fm.title ?? fm.slug,
      });
    }
  }

  let generated = 0;
  for (const entry of entries) {
    const filename = `${entry.slug}.webp`;
    const output = path.join(OUT, filename);
    const buffer = Buffer.from(svg(entry));
    await sharp(buffer).webp({ quality: 85 }).toFile(output);
    generated++;

    for (const lang of ['en', 'el']) {
      const file = path.join(CONTENT, entry.kind === 'post' ? 'blog' : 'projects', `${lang}-${entry.slug}.md`);
      try {
        const raw = await readFile(file, 'utf8');
        const next = ensureCoverLine(raw, filename);
        if (next !== raw) {
          await writeFile(file, next);
          console.log(`  injected cover: ${filename} -> ${path.relative(ROOT, file)}`);
        }
      } catch {
        console.warn(`  missing translation file: ${path.relative(ROOT, file)}`);
      }
    }
  }

  console.log(`\nGenerated ${generated} cover images in ${path.relative(ROOT, OUT)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

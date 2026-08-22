#!/usr/bin/env node
/**
 * Generates src/lib/techIcons.ts
 *
 * Scans `stack:` lists in src/content/projects/*.md, resolves every tag to an
 * icon and writes a `PATHS` record keyed by normalized tag. Run after adding
 * new technologies to any project:
 *
 *   npm run icons:generate
 *
 * Icon sources:
 *  - simple-icons (CC0, brand logos):  https://cdn.jsdelivr.net/npm/simple-icons@v16.28.0/icons/<slug>.svg
 *  - Font Awesome Free solid (CC BY 4.0): https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/<icon>.svg
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS_DIR = join(ROOT, 'src/content/projects');
const OUT_FILE = join(ROOT, 'src/lib/techIcons.ts');

const SI_VERSION = '16.28.0';
/**
 * Icons removed from recent simple-icons releases, fetched from an older
 * release (note: `nodejs` used to ship under the slug `nodedotjs`).
 */
const SI_FALLBACKS = {
  java: { version: '6.23.0', file: 'java' },
  nodejs: { version: '6.23.0', file: 'nodedotjs' },
  pytorchlightning: { version: '8.15.0', file: 'pytorchlightning' },
};
const FA_VERSION = '6.7.2';

function normalizeTag(tag) {
  return tag.toLowerCase().replace(/[^a-z]/g, '');
}

/** Icon catalog: id -> how to fetch it. */
const SI = (slug, title) => ({ source: 'si', slug, title });
const FA = (icon, title) => ({ source: 'fa', icon, title });

const ICONS = {
  // ---- brand logos (simple-icons) ----
  ansible: SI('ansible', 'Ansible'),
  apachemaven: SI('apachemaven', 'Apache Maven'),
  astro: SI('astro', 'Astro'),
  bun: SI('bun', 'Bun'),
  c: SI('c', 'C'),
  clerk: SI('clerk', 'Clerk'),
  cloudflare: SI('cloudflare', 'Cloudflare'),
  docker: SI('docker', 'Docker'),
  github: SI('github', 'GitHub'),
  go: SI('go', 'Go'),
  google: SI('google', 'Google'),
  huggingface: SI('huggingface', 'Hugging Face'),
  java: SI('java', 'Java'),
  javascript: SI('javascript', 'JavaScript'),
  jenkins: SI('jenkins', 'Jenkins'),
  keras: SI('keras', 'Keras'),
  nodejs: SI('nodejs', 'Node.js'),
  openjdk: SI('openjdk', 'OpenJDK'),
  pandas: SI('pandas', 'pandas'),
  postgresql: SI('postgresql', 'PostgreSQL'),
  puppeteer: SI('puppeteer', 'Puppeteer'),
  pyTorch: SI('pytorch', 'PyTorch'),
  pytorchlightning: SI('pytorchlightning', 'PyTorch Lightning'),
  python: SI('python', 'Python'),
  react: SI('react', 'React'),
  rust: SI('rust', 'Rust'),
  scikitlearn: SI('scikitlearn', 'scikit-learn'),
  solid: SI('solid', 'SolidJS'),
  spring: SI('spring', 'Spring'),
  sqlite: SI('sqlite', 'SQLite'),
  tailwindcss: SI('tailwindcss', 'Tailwind CSS'),
  tensorflow: SI('tensorflow', 'TensorFlow'),
  typescript: SI('typescript', 'TypeScript'),
  turso: SI('turso', 'Turso'),
  vite: SI('vite', 'Vite'),
  webpack: SI('webpack', 'webpack'),

  // ---- generic / conceptual icons (Font Awesome Free solid) ----
  asterisk: FA('asterisk', 'Glob pattern'),
  arrowsSpin: FA('arrows-spin', 'Concurrency'),
  bolt: FA('bolt', 'Lightning'),
  brain: FA('brain', 'Neural network'),
  bucket: FA('bucket', 'Object storage'),
  calculator: FA('calculator', 'Arbitrary precision'),
  circleCheck: FA('circle-check', 'Validation'),
  cloud: FA('cloud', 'Cloud storage'),
  code: FA('code', 'Code'),
  codeBranch: FA('code-branch', 'Parser / grammar'),
  compress: FA('compress', 'Image compression'),
  cube: FA('cube', 'Model file format'),
  database: FA('database', 'Database'),
  diagramProject: FA('diagram-project', 'Parallel scheduling'),
  dna: FA('dna', 'Bioinformatics'),
  envelope: FA('envelope', 'Email service'),
  file: FA('file', 'Document'),
  fileLines: FA('file-lines', 'Structured document'),
  filePdf: FA('file-pdf', 'PDF'),
  filePen: FA('file-pen', 'PDF library'),
  fire: FA('fire', 'Wildfire dataset'),
  font: FA('font', 'Font tooling'),
  gear: FA('gear', 'Service worker'),
  hammer: FA('hammer', 'Build tool'),
  image: FA('image', 'Image processing'),
  key: FA('key', 'OAuth2'),
  layerGroup: FA('layer-group', 'State management'),
  lock: FA('lock', 'Authentication'),
  microchip: FA('microchip', 'Local LLM inference'),
  networkWired: FA('network-wired', 'Graph library'),
  plug: FA('plug', 'Office add-in'),
  puzzlePiece: FA('puzzle-piece', 'Browser extension'),
  scaleBalanced: FA('scale-balanced', 'Class imbalance'),
  shapes: FA('shapes', 'Mesh / geometry'),
  shieldHalved: FA('shield-halved', 'Validation'),
  sitemap: FA('sitemap', 'Graph analysis'),
  table: FA('table', 'N-dimensional arrays'),
  terminal: FA('terminal', 'CLI tool'),
  wandMagicSparkles: FA('wand-magic-sparkles', 'Code generator'),
  waveSquare: FA('wave-square', 'Web Audio API'),
};

/**
 * Normalized tag (as found in `stack:` lists) -> icon id.
 * Add a row here every time a new technology shows up in a project stack.
 */
const TAGS = {
  ansible: 'ansible',
  arctic: 'lock',
  asm: 'code',
  astro: 'astro', // "Astro 5" -> Astro logo
  biopython: 'dna',
  bun: 'bun',
  c: 'c',
  chromeextensionmv: 'puzzlePiece', // "Chrome Extension MV3"
  clerk: 'clerk',
  cloudflarepages: 'cloudflare', // Cloudflare Pages -> Cloudflare logo
  cloudflareworkers: 'cloudflare', // Cloudflare Workers -> Cloudflare logo
  cup: 'codeBranch',
  d: 'database', // "D1" (digits are stripped by normalizeTag)
  dgl: 'networkWired',
  docker: 'docker',
  fontkit: 'font',
  gguf: 'cube',
  github: 'github',
  gmp: 'calculator',
  go: 'go',
  googleapis: 'google',
  huggingface: 'huggingface',
  imbalancedlearn: 'scaleBalanced',
  indexeddb: 'database',
  java: 'java',
  javascript: 'javascript',
  jenkins: 'jenkins',
  jflex: 'wandMagicSparkles',
  keras: 'keras',
  kv: 'database',
  libsql: 'database',
  llamacpppython: 'microchip',
  mailersend: 'envelope',
  makefile: 'hammer',
  maven: 'apachemaven',
  micromatch: 'asterisk',
  networkx: 'sitemap',
  nodejs: 'nodejs',
  oauth: 'key', // "OAuth2"
  officeaddin: 'plug',
  ooxml: 'fileLines',
  openjdk: 'openjdk',
  opentypejs: 'font',
  pandas: 'pandas',
  pdf: 'filePdf',
  pdflib: 'filePen',
  postgresql: 'postgresql',
  pthreads: 'diagramProject',
  puppeteer: 'puppeteer',
  pymesh: 'shapes',
  python: 'python',
  pytorch: 'pyTorch',
  pytorchlightning: 'pytorchlightning',
  r: 'bucket', // "R2" (digits are stripped by normalizeTag) — object storage bucket
  react: 'react', // also covers "React 19"
  resnet: 'brain', // "ResNet50"
  rust: 'rust',
  scikitlearn: 'scikitlearn',
  seasfire: 'fire',
  serviceworker: 'gear',
  sharp: 'compress',
  solidjs: 'solid',
  springboot: 'spring',
  sqlite: 'sqlite',
  tailwindcss: 'tailwindcss', // also covers "Tailwind CSS 4"
  tensorflow: 'tensorflow',
  torchvision: 'pyTorch', // torchvision is part of the PyTorch ecosystem
  turso: 'turso',
  typescript: 'typescript',
  valibot: 'shieldHalved',
  vite: 'vite',
  webaudioapi: 'waveSquare',
  webpack: 'webpack',
  wrangler: 'terminal',
  xarray: 'table',
  zustand: 'layerGroup',
};

/** Niceties kept in the icon table even when no project uses them yet. */
const EXTRAS = ['go', 'rust', 'javascript', 'nodejs', 'openjdk', 'github'];

async function fetchIcon(id) {
  const def = ICONS[id];
  if (!def) throw new Error(`Unknown icon id: ${id}`);
  let url;
  if (def.source === 'si') {
    const fallback = SI_FALLBACKS[def.slug];
    const version = fallback ? fallback.version : SI_VERSION;
    const file = fallback ? fallback.file : def.slug;
    url = `https://cdn.jsdelivr.net/npm/simple-icons@${version}/icons/${file}.svg`;
  } else {
    url = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${FA_VERSION}/svgs/solid/${def.icon}.svg`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch ${url} -> ${res.status}`);
  const svg = await res.text();
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 24 24';
  const paths = [...svg.matchAll(/<path d="([^"]+)"/g)].map(([, d]) => ({ d }));
  if (paths.length === 0) throw new Error(`No <path> found in ${url}`);
  const title =
    def.title ?? (svg.match(/<title>([^<]+)<\/title>/)?.[1] || def.slug || id);
  return { title, viewBox, paths };
}

// ---- collect the tags actually used by projects ----
const usedTags = new Set();
for (const file of readdirSync(PROJECTS_DIR).filter((f) => f.endsWith('.md'))) {
  const text = readFileSync(join(PROJECTS_DIR, file), 'utf8');
  const match = text.match(/^stack:\s*\[([^\]]*)\]/m);
  if (!match) continue;
  for (const raw of match[1].split(',')) {
    const tag = raw.trim();
    if (tag) usedTags.add(normalizeTag(tag));
  }
}

const keys = [...new Set([...usedTags, ...EXTRAS])].sort();
const missing = [];
for (const key of keys) {
  if (!TAGS[key]) missing.push(key);
}
if (missing.length > 0) {
  console.error(
    `\nNo icon mapping for tag(s): ${missing.join(', ')}\n` +
      'Add them to the TAGS map in scripts/generate-tech-icons.mjs.\n',
  );
  process.exit(1);
}

// ---- fetch every distinct icon once ----
const iconCache = new Map();
const entries = [];
for (const key of keys) {
  const iconId = TAGS[key];
  if (!iconCache.has(iconId)) {
    iconCache.set(iconId, await fetchIcon(iconId));
  }
  const { title, viewBox, paths } = iconCache.get(iconId);
  entries.push(`  ${key}: ${JSON.stringify({ title, viewBox, paths })},`);
}
entries.push('');

const runtime = `
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z]/g, '');
}

export function hasTechIcon(tag: string): boolean {
  return normalizeTag(tag) in PATHS;
}
`;

writeFileSync(
  OUT_FILE,
  `/**
 * AUTO-GENERATED FILE — do not edit by hand.
 * Run \`npm run icons:generate\` after changing technologies in project stacks.
 *
 * Sources:
 *  - simple-icons (CC0) for brand logos
 *  - Font Awesome Free solid (CC BY 4.0) for generic/conceptual icons
 */

export interface TechIconDef {
  title: string;
  viewBox?: string;
  paths: { d: string; fill?: string }[];
}

export const PATHS: Record<string, TechIconDef> = {
${entries.join('\n')}};

${runtime.trim()}
`,
);

console.log(`Wrote ${OUT_FILE} with ${entries.length} icons (${usedTags.size} used tags).`);

// Generates OpenGraph preview images (1200x630) for every page, into public/og/.
// Card design mirrors the site: dark background, gold accent, monogram.
import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import React from 'react';
import { createElement as h } from 'react';
import sharp from 'sharp';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'src/content');
const OUT = path.join(ROOT, 'public/og');

const BG = '#0b0b0c';
const SURFACE = '#131315';
const LINE = '#26262a';
const INK = '#e8e6e1';
const INK_DIM = '#9b9aa2';
const INK_FAINT = '#6d6c74';
const ACCENT = '#d2a24f';

const SITE = 'konstantinos.xafis';
const DOMAIN = 'kostas-portfolio.pages.dev';

async function loadFonts() {
  const regular = await readFile(path.join(ROOT, 'scripts/fonts/NotoSans-Regular.ttf'));
  const bold = await readFile(path.join(ROOT, 'scripts/fonts/NotoSans-Bold.ttf'));
  return [
    { name: 'Sans', data: regular, weight: 400, style: 'normal' },
    { name: 'Sans', data: bold, weight: 700, style: 'normal' },
  ];
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

const CLAMP = {
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

function titleFontSize(title) {
  const len = title.length;
  if (len <= 30) return 62;
  if (len <= 45) return 54;
  if (len <= 60) return 46;
  return 40;
}

function card({ title, description, tag, featured }) {
  const monogram = h('div', {
    style: {
      width: 56, height: 56, borderRadius: 12,
      background: ACCENT, color: BG,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Sans', fontWeight: 700, fontSize: 26,
    },
  }, 'KX');

  return h('div', {
    style: {
      width: 1200, height: 630,
      background: BG, color: INK,
      display: 'flex', flexDirection: 'column',
      padding: 72, position: 'relative', overflow: 'hidden',
      fontFamily: 'Sans',
    },
  }, [
    h('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: ACCENT } }),
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, [
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 20 } }, [
        monogram,
        h('div', { style: { display: 'flex', flexDirection: 'column' } }, [
          h('div', { style: { fontSize: 30, fontWeight: 700, color: INK, letterSpacing: 0.5 } }, SITE),
          h('div', { style: { fontSize: 20, color: INK_FAINT, marginTop: 4 } }, 'software engineer'),
        ]),
      ]),
      tag
        ? h('div', {
            style: {
              fontSize: 20, color: ACCENT, letterSpacing: 3, textTransform: 'uppercase',
              border: `1px solid ${ACCENT}55`, borderRadius: 999, padding: '10px 22px',
            },
          }, tag)
        : null,
    ]),
    h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 } }, [
      h('div', {
        style: {
          fontSize: titleFontSize(title), fontWeight: 700, lineHeight: 1.15, color: INK,
          maxWidth: 1000, textWrap: 'balance',
          WebkitLineClamp: 2,
          ...CLAMP,
        },
      }, title),
      description
        ? h('div', {
            style: {
              fontSize: 25, color: INK_DIM, lineHeight: 1.4, marginTop: 20, maxWidth: 980,
              WebkitLineClamp: 2,
              ...CLAMP,
            },
          }, description)
        : null,
    ]),
    h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${LINE}`, paddingTop: 28 } }, [
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, color: INK_FAINT } }, [
        h('div', { style: { width: 10, height: 10, borderRadius: 999, background: ACCENT } }),
        DOMAIN,
      ]),
      featured
        ? h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 22, color: ACCENT, fontWeight: 700 } }, [
            '★ FEATURED',
          ])
        : null,
    ]),
  ]);
}

async function loadMarkdown(dir) {
  const files = await readdir(path.join(CONTENT, dir));
  const entries = [];
  for (const f of files) {
    if (!f.endsWith('.md')) continue;
    const raw = await readFile(path.join(CONTENT, dir, f), 'utf8');
    const fm = parseFrontmatter(raw);
    if (fm.lang !== 'en' && fm.lang !== 'el') continue;
    entries.push({
      lang: fm.lang,
      slug: fm.slug,
      title: fm.title,
      description: fm.summary ?? fm.description,
      category: fm.category,
      tags: fm.tags ? fm.tags.replace(/[\[\]\s]/g, '').split(',').filter(Boolean) : [],
      featured: fm.featured === 'true',
    });
  }
  return entries;
}

const LANG_NAMES = { en: 'EN', el: 'ΕΛ' };

async function main() {
  await mkdir(OUT, { recursive: true });
  const fonts = await loadFonts();

  const pages = [
    { path: 'en/index.png', title: 'Konstantinos Xafis', description: 'Software engineer — full-stack TypeScript on the Cloudflare edge, machine learning, compilers and systems software.', tag: 'EN' },
    { path: 'el/index.png', title: 'Κωνσταντίνος Χαφής', description: 'Μηχανικός λογισμικού — full-stack TypeScript στο Cloudflare edge, μηχανική μάθηση, compilers και λογισμικό συστημάτων.', tag: 'ΕΛ' },
    { path: 'en/projects.png', title: 'Projects', description: 'Selected work across full-stack web, machine learning, compilers, systems and tooling.', tag: 'EN' },
    { path: 'el/projects.png', title: 'Έργα', description: 'Επιλεγμένη δουλειά σε full-stack web, μηχανική μάθηση, compilers, συστήματα και εργαλεία.', tag: 'ΕΛ' },
    { path: 'en/blog.png', title: 'Blog', description: 'Technical write-ups on the projects I build.', tag: 'EN' },
    { path: 'el/blog.png', title: 'Blog', description: 'Τεχνικά άρθρα για τα έργα που υλοποιώ.', tag: 'ΕΛ' },
    { path: 'en/about.png', title: 'About', description: 'Software engineer based in Attica, Greece.', tag: 'EN' },
    { path: 'el/about.png', title: 'Σχετικά', description: 'Μηχανικός λογισμικού από την Αττική, Ελλάδα.', tag: 'ΕΛ' },
    { path: 'en/contact.png', title: 'Contact', description: 'Reach me at koxafis@gmail.com', tag: 'EN' },
    { path: 'el/contact.png', title: 'Επικοινωνία', description: 'Επικοινωνήστε μαζί μου στο koxafis@gmail.com', tag: 'ΕΛ' },
  ];

  const projects = await loadMarkdown('projects');
  for (const p of projects) {
    pages.push({
      path: `${p.lang}/projects/${p.slug}.png`,
      title: p.title,
      description: p.description,
      tag: LANG_NAMES[p.lang],
      featured: p.featured,
    });
  }

  const posts = await loadMarkdown('blog');
  for (const p of posts) {
    pages.push({
      path: `${p.lang}/blog/${p.slug}.png`,
      title: p.title,
      description: p.description,
      tag: LANG_NAMES[p.lang],
    });
  }

  // Blog tag archive pages (mirrors getStaticPaths in src/pages/[locale]/blog/tag/[tag].astro).
  const slugify = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
  const tagsByLang = { en: new Set(), el: new Set() };
  for (const p of posts) {
    for (const tag of p.tags) tagsByLang[p.lang].add(tag);
  }
  for (const lang of ['en', 'el']) {
    const label = lang === 'en' ? 'Blog posts tagged' : 'Αναρτήσεις με ετικέτα';
    for (const tag of tagsByLang[lang]) {
      pages.push({
        path: `${lang}/blog/tag/${slugify(tag)}.png`,
        title: `#${tag}`,
        description: `${label} #${tag}`,
        tag: LANG_NAMES[lang],
      });
    }
  }

  let count = 0;
  for (const page of pages) {
    const svg = await satori(card(page), { width: 1200, height: 630, fonts });
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const file = path.join(OUT, page.path);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, png);
    count++;
  }
  console.log(`Generated ${count} OG images into public/og/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

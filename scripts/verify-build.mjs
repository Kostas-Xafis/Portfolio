/**
 * Post-build verification smoke test. Run after `npm run build`:
 *
 *   npm run verify
 *
 * Checks (all source of truth = the built output in dist/):
 *   - every internal href / asset referenced by the built HTML resolves
 *   - no self-referential hreflang alternate links (canonical === alternate)
 *   - every og:image referenced by built pages exists
 *   - every sitemap URL resolves to a built page
 *   - no trailing-slash internal links (Cloudflare Pages 308s those)
 *   - en/el content pairs are complete and share the same cover image
 *
 * Exits non-zero on any error so it can gate CI deployments.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'src/content');

const errors = [];
const warnings = [];
let pagesChecked = 0;
let linksChecked = 0;

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

/** Candidates on disk for a public, extension-less URL: x.html or x/index.html. */
function candidatesFor(url) {
  const clean = url.split('#')[0].split('?')[0];
  const trimmed = clean.replace(/\/+$/, '') || '/';
  if (trimmed === '/') return [path.join(DIST, 'index.html')];
  return [path.join(DIST, `${trimmed.slice(1)}.html`), path.join(DIST, trimmed.slice(1), 'index.html')];
}

function frontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z]+):\s*(?:"([^"]*)"|(.*))$/);
    if (kv) out[kv[1]] = kv[2] ?? kv[3];
  }
  return out;
}

async function checkContentPairs() {
  for (const kind of ['projects', 'blog']) {
    const dir = path.join(CONTENT, kind);
    const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
    const byLang = { en: new Map(), el: new Map() };
    for (const file of files) {
      const raw = await readFile(path.join(dir, file), 'utf8');
      const fm = frontmatter(raw);
      const lang = file.startsWith('el-') ? 'el' : file.startsWith('en-') ? 'en' : null;
      if (!lang || !fm.slug) continue;
      byLang[lang].set(fm.slug, { file, cover: fm.cover });
    }
    for (const [slug, info] of byLang.en) {
      const other = byLang.el.get(slug);
      if (!other) {
        errors.push(`content: ${info.file} has no el-${slug} pair`);
        continue;
      }
      if (info.cover !== other.cover) {
        errors.push(`content: ${slug} covers differ between locales (${info.cover} vs ${other.cover})`);
      }
    }
    for (const slug of byLang.el.keys()) {
      if (!byLang.en.has(slug)) errors.push(`content: el-${slug} has no en pair`);
    }
  }
  // referenced covers must exist
  for (const kind of ['projects', 'blog']) {
    const dir = path.join(CONTENT, kind);
    for (const file of await readdir(dir)) {
      if (!file.endsWith('.md')) continue;
      const fm = frontmatter(await readFile(path.join(dir, file), 'utf8'));
      if (fm.cover && !(await exists(path.join(ROOT, 'src/assets/covers', fm.cover)))) {
        errors.push(`content: ${file} references missing cover ${fm.cover}`);
      }
    }
  }
}

async function checkHtml() {
  if (!(await exists(DIST))) {
    errors.push('dist/ not found — run `npm run build` first');
    return;
  }
  const htmlFiles = [];
  for await (const file of walk(DIST)) {
    if (file.endsWith('.html')) htmlFiles.push(file);
  }

  for (const file of htmlFiles) {
    pagesChecked++;
    const raw = await readFile(file, 'utf8');
    const rel = path.relative(ROOT, file);

    const canonical = raw.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    const alternates = [...raw.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => ({
      lang: m[1],
      href: m[2],
    }));
    for (const alt of alternates) {
      if (alt.lang !== 'x-default' && alt.href === canonical) {
        errors.push(`${rel}: hreflang ${alt.lang} alternate is self-referential`);
      }
    }

    const ogImages = [...raw.matchAll(/property="og:image" content="([^"]+)"/g)].map((m) => m[1]);
    for (const og of ogImages) {
      let u;
      try {
        u = new URL(og);
      } catch {
        errors.push(`${rel}: invalid og:image ${og}`);
        continue;
      }
      if (!(await exists(path.join(DIST, u.pathname.replace(/^\//, ''))))) {
        errors.push(`${rel}: og:image missing on disk: ${og}`);
      }
    }

    // Match href/src attributes but not data-nav-href / data-* lookalikes.
    const hrefs = [...raw.matchAll(/(?<![\w-])(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
    for (const href of hrefs) {
      if (
        !href ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        href.startsWith('data:') ||
        href.startsWith('javascript:')
      ) {
        continue;
      }
      linksChecked++;
      if (href.endsWith('/') && href !== '/') {
        warnings.push(`${rel}: trailing-slash link ${href} (Pages would 308 it)`);
      }
      let ok = false;
      for (const candidate of candidatesFor(href)) {
        if (await exists(candidate)) {
          ok = true;
          break;
        }
      }
      if (!ok && (await exists(path.join(DIST, href.replace(/^\//, ''))))) ok = true;
      if (!ok) errors.push(`${rel}: broken internal link ${href}`);
    }
  }
}

async function checkSitemap() {
  const index = path.join(DIST, 'sitemap-index.xml');
  const sitemap0 = path.join(DIST, 'sitemap-0.xml');
  if (!(await exists(index))) {
    warnings.push('no sitemap-index.xml in dist');
    return;
  }
  if (!(await exists(sitemap0))) {
    warnings.push('no sitemap-0.xml in dist');
    return;
  }
  const raw = await readFile(sitemap0, 'utf8');
  for (const m of raw.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    linksChecked++;
    let u;
    try {
      u = new URL(m[1]);
    } catch {
      errors.push(`sitemap: invalid URL ${m[1]}`);
      continue;
    }
    let ok = false;
    for (const candidate of candidatesFor(u.pathname)) {
      if (await exists(candidate)) {
        ok = true;
        break;
      }
    }
    if (!ok) errors.push(`sitemap URL does not resolve: ${m[1]}`);
  }
}

await checkContentPairs();
await checkHtml();
await checkSitemap();

if (errors.length) {
  console.error(`\n✗ verify-build failed (${errors.length} error(s)):\n`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log(`\n✓ verify-build OK — ${pagesChecked} pages, ${linksChecked} links/assets checked, ${warnings.length} warning(s).`);
for (const warning of warnings) console.warn(`  ! ${warning}`);

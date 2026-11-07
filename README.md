# Konstantinos Chafis — Portfolio

Personal portfolio and blog. Static Astro site, deployed on Cloudflare Pages.

- Live: https://kostas-portfolio.pages.dev
- Pages project: `kostas-portfolio`
- Locales: `en` (default, prefixed) and `el` — bilingual content and UI
- Stack: Astro 7 · Tailwind CSS 4 · TypeScript · Cloudflare Pages (+ Functions)

## Commands

| Command                 | Action                                                        |
| :---------------------- | :------------------------------------------------------------ |
| `npm run dev`           | Dev server (`astro dev --background` for background mode)     |
| `npm run check`         | `astro check` — typecheck (required before build)             |
| `npm run build`         | Static build to `dist/` (generates OG images, then Pagefind)  |
| `npm run verify`        | Post-build smoke test: links, hreflang, OG images, sitemap    |
| `npm run preview`       | Preview the production build locally                          |
| `npm run deploy`        | `wrangler pages deploy dist --project-name=kostas-portfolio`  |
| `npm run icons:generate`| Regenerate the tech-icon path data (after stack changes)      |
| `npm run covers:generate`| Regenerate procedural cover images for all content            |

## Project structure

```
src/
  content/
    projects/en-<slug>.md   Projects — one file per language, shared `slug`
    projects/el-<slug>.md
    blog/en-<slug>.md       Blog posts — same pairing convention
    blog/el-<slug>.md
  components/               .astro components (Header, PostCard, Search, …)
  layouts/BaseLayout.astro  Head meta, hreflang, OG tags, transitions, search
  lib/
    i18n.ts                 Locale helpers + `ui` dictionary (keep both in sync)
    site.ts                 Site URL constant
    techIcons.ts            AUTO-GENERATED icon paths (do not edit)
  pages/
    index.astro             Meta-refresh fallback (Pages middleware handles /)
    404.astro               Terminal-themed 404
    [locale]/…              Routes: index, projects, blog, about, contact, rss
functions/
  _middleware.js            Root "/" locale redirect (cookie → Accept-Language)
scripts/
  generate-og.mjs           OpenGraph preview cards → public/og/
  generate-tech-icons.mjs   Tech icon svg paths → src/lib/techIcons.ts
  generate-covers.mjs       Procedural cover art → src/assets/covers/
  verify-build.mjs          Post-build smoke test (npm run verify)
```

`astro.config.mjs` uses `build.format: 'file'` with `trailingSlash: 'never'`:
Cloudflare Pages serves extension-less URLs from `.html` files with a direct
200, which keeps canonical/sitemap URLs redirect-free. Do not switch to
`directory` format on Pages (it 308s to trailing slashes).

## Authoring content

Every entry exists twice — `en-<slug>.md` and `el-<slug>.md` — with the same
`slug` and the same `cover`. Keep translations paired:
`pairTranslation()` in `src/lib/i18n.ts` links them, and the detail pages show
a "Read in English / Διαβάστε στα ελληνικά" link when both exist.

Project frontmatter:

```yaml
slug, lang, title, summary, category (fullstack|ml|compilers|systems|extensions|devops),
stack [..], status (production|maintained|archived|academic|thesis|prototype),
year, featured, cover, relatedPosts [blog slugs], links { repo, live, paper }
```

Blog frontmatter:

```yaml
slug, lang, title, description, date, updated (optional), tags [..],
draft, cover, relatedProjects [project slugs]
```

`relatedPosts` / `relatedProjects` render cross-link sections on the
corresponding detail pages. Tags on cards and posts link to `/blog/tag/<tag>`;
the tag index is generated at build time.

## Cover images

`npm run covers:generate` renders a deterministic, category-themed cover
(`2560×1440` webp) for every project and blog post from `scripts/generate-covers.mjs`,
writes it to `src/assets/covers/<slug>.webp`, and injects the `cover:` line into
both language files. The covers are committed, so a build does not regenerate
them. To replace one with AI-generated art, use the matching prompt in
[`image-gen-prompt.txt`](image-gen-prompt.txt) and keep the same filename.

## Search

[Pagefind](https://pagefind.app/) indexes the site in `postbuild` into
`dist/pagefind/`. The overlay (Ctrl/⌘+K or `/`) loads it lazily and filters by
locale. Re-indexing is part of every build.

## Deployment

```sh
npm run check   # typecheck
npm run build   # astro build + OG images + pagefind index
npm run verify  # link/hreflang/OG/sitemap smoke test
npm run deploy  # wrangler pages deploy
```

`wrangler pages deploy` uploads `functions/` together with the static assets,
and `public/_headers` applies security headers plus immutable caching.

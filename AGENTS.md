## Project

Personal portfolio + blog (Konstantinos Xafis). Astro 7, static output, Cloudflare Pages.

- Live: https://kostas-portfolio.pages.dev (Pages project: `kostas-portfolio`)
- Locales: `en` (default, prefixed) and `el`, configured via `i18n` in `astro.config.mjs`
- Content: `src/content/projects/*.md` and `src/content/blog/*.md`; each entry is written in
  both languages as separate files (`en-<slug>.md`, `el-<slug>.md`) with a shared `slug` field.
  Translations are paired via `pairTranslation` in `src/lib/i18n.ts`.
- UI strings live in the `ui` dictionary in `src/lib/i18n.ts` (keep both locales in sync)
- Styling: Tailwind CSS 4 via `@tailwindcss/vite`; dark theme tokens in `src/styles/global.css`

## Commands

- `npm run dev` — dev server (use `astro dev --background` for background mode)
- `npm run check` — astro check (typecheck, required before build)
- `npm run build` — static build to `dist/`
- `npm run deploy` — build-agnostic deploy: `wrangler pages deploy dist --project-name=kostas-portfolio`

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

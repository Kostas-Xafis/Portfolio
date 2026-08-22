// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kostas-portfolio.pages.dev',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit page.html files instead of page/index.html. Cloudflare Pages serves
    // extension-less URLs from .html files with a direct 200; directory
    // folders would get a 308 to the trailing-slash URL, which conflicts with
    // the (trailing-slash-free) canonical and sitemap URLs.
    format: 'file',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'el'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [
    sitemap({
      // "/" is a meta-refresh fallback that redirects on Pages; keep it out
      // of the sitemap so no redirecting URL is submitted.
      filter: (page) => new URL(page).pathname !== '/',
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

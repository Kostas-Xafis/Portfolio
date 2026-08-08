import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { LOCALES, type Locale } from '../../lib/i18n';

export function getStaticPaths() {
  return LOCALES.map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = async (context) => {
  const { locale } = context.params as { locale: Locale };
  const posts = (await getCollection('blog'))
    .filter((p) => p.data.lang === locale && !p.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: locale === 'en' ? 'Konstantinos Xafis — Blog' : 'Κωνσταντίνος Χαφής — Blog',
    description:
      locale === 'en'
        ? 'Technical write-ups on software engineering, Cloudflare, machine learning, compilers and systems.'
        : 'Τεχνικά άρθρα για μηχανική λογισμικού, Cloudflare, μηχανική μάθηση, compilers και συστήματα.',
    site: context.site ?? 'https://portfolio.pages.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/${locale}/blog/${post.data.slug}`,
    })),
    customData: `<language>${locale === 'el' ? 'el-GR' : 'en-GB'}</language>`,
  });
};

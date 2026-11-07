import type { CollectionEntry } from 'astro:content';

export const LOCALES = ['en', 'el'] as const;
export type Locale = (typeof LOCALES)[number];

export const ui = {
  en: {
    name: 'Konstantinos Chafis',
    'name.logo': 'konstantinos.chafis',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'switch-locale': 'Ελληνικά',
    'hero.greeting': 'Software Engineer',
    'hero.location': 'Attica, Greece',
    'home.featured': 'Featured projects',
    'home.featured.more': 'View all projects',
    'home.blog': 'Latest from the blog',
    'home.blog.more': 'View all posts',
    'home.about.cta': 'About me',
    'projects.title': 'Projects',
    'projects.subtitle': 'Selected work across full-stack web, machine learning, compilers, systems and tooling.',
    'projects.featured': 'Featured',
    'blog.title': 'Blog',
    'blog.subtitle': 'Technical write-ups on the projects I build.',
    'blog.reading': 'min read',
    'blog.toc': 'On this page',
    'blog.posts.one': 'post',
    'blog.posts.other': 'posts',
    'blog.tags': 'Tags',
    'about.title': 'About',
    'contact.title': 'Contact',
    'contact.email.cta': 'Email me',
    'contact.copy': 'Copy',
    'contact.copied': 'Copied!',
    'footer.rights': 'All rights reserved.',
    'footer.source': 'Source',
    'skip.content': 'Skip to content',
    'post.copy-link': 'Copy link',
    'scroll.top': 'Back to top',
    'category.fullstack': 'Full-Stack & Cloudflare',
    'category.ml': 'Machine Learning & AI',
    'category.compilers': 'Compilers',
    'category.systems': 'Systems & Performance',
    'category.extensions': 'Extensions & Tooling',
    'category.devops': 'DevOps & Platforms',
    'status.production': 'In production',
    'status.maintained': 'Maintained',
    'status.archived': 'Archived',
    'status.academic': 'Academic',
    'status.thesis': 'Thesis work',
    'status.prototype': 'Prototype',
    'label.stack': 'Stack',
    'label.links': 'Links',
    'label.repo': 'Repository',
    'label.live': 'Live site',
    'label.paper': 'Paper',
    'label.tags': 'Tags',
    'label.published': 'Published',
    'label.updated': 'Updated',
    'rss.title': 'Blog RSS',
    'blog.feed': 'RSS feed',
    'search.title': 'Search',
    'search.placeholder': 'Search projects, posts and tags…',
    'search.no-results': 'No results for',
    'search.close': 'Close search',
    'post.prev': 'Previous post',
    'post.next': 'Next post',
    'related.projects': 'Related projects',
    'related.posts': 'Related posts',
    'notfound.title': 'Page not found',
    'notfound.body': 'The page you are looking for does not exist.',
    'notfound.home': 'Back to home',
  },
  el: {
    name: 'Κωνσταντίνος Χάφης',
    'name.logo': 'κωνσταντίνος.χάφης',
    'nav.home': 'Αρχική',
    'nav.projects': 'Έργα',
    'nav.blog': 'Blog',
    'nav.about': 'Σχετικά',
    'nav.contact': 'Επικοινωνία',
    'nav.menu': 'Μενού',
    'switch-locale': 'English',
    'hero.greeting': 'Μηχανικός Λογισμικού',
    'hero.location': 'Αττική, Ελλάδα',
    'home.featured': 'Επιλεγμένα έργα',
    'home.featured.more': 'Όλα τα έργα',
    'home.blog': 'Τελευταία από το blog',
    'home.blog.more': 'Όλες οι αναρτήσεις',
    'home.about.cta': 'Σχετικά με εμένα',
    'projects.title': 'Έργα',
    'projects.subtitle': 'Επιλεγμένη δουλειά σε full-stack web, μηχανική μάθηση, compilers, συστήματα και εργαλεία.',
    'projects.featured': 'Επιλεγμένα',
    'blog.title': 'Blog',
    'blog.subtitle': 'Τεχνικά άρθρα για τα έργα που υλοποιώ.',
    'blog.reading': 'λεπτά ανάγνωσης',
    'blog.toc': 'Σε αυτή τη σελίδα',
    'blog.posts.one': 'ανάρτηση',
    'blog.posts.other': 'αναρτήσεις',
    'blog.tags': 'Ετικέτες',
    'about.title': 'Σχετικά',
    'contact.title': 'Επικοινωνία',
    'contact.email.cta': 'Στείλτε μου email',
    'contact.copy': 'Αντιγραφή',
    'contact.copied': 'Αντιγράφηκε!',
    'footer.rights': 'Με επιφύλαξη παντός δικαιώματος.',
    'footer.source': 'Κώδικας',
    'skip.content': 'Μετάβαση στο περιεχόμενο',
    'post.copy-link': 'Αντιγραφή συνδέσμου',
    'scroll.top': 'Επιστροφή στην κορυφή',
    'category.fullstack': 'Full-Stack & Cloudflare',
    'category.ml': 'Μηχανική Μάθηση & AI',
    'category.compilers': 'Compilers',
    'category.systems': 'Συστήματα & Επιδόσεις',
    'category.extensions': 'Επεκτάσεις & Εργαλεία',
    'category.devops': 'DevOps & Πλατφόρμες',
    'status.production': 'Σε παραγωγή',
    'status.maintained': 'Συντηρείται',
    'status.archived': 'Αρχειοθετημένο',
    'status.academic': 'Ακαδημαϊκό',
    'status.thesis': 'Διπλωματική εργασία',
    'status.prototype': 'Πρωτότυπο',
    'label.stack': 'Τεχνολογίες',
    'label.links': 'Σύνδεσμοι',
    'label.repo': 'Αποθετήριο',
    'label.live': 'Live',
    'label.paper': 'Εργασία',
    'label.tags': 'Ετικέτες',
    'label.published': 'Δημοσιεύτηκε',
    'label.updated': 'Ενημερώθηκε',
    'rss.title': 'RSS Blog',
    'blog.feed': 'Ροή RSS',
    'search.title': 'Αναζήτηση',
    'search.placeholder': 'Αναζήτηση σε έργα, αναρτήσεις και ετικέτες…',
    'search.no-results': 'Κανένα αποτέλεσμα για',
    'search.close': 'Κλείσιμο αναζήτησης',
    'post.prev': 'Προηγούμενη ανάρτηση',
    'post.next': 'Επόμενη ανάρτηση',
    'related.projects': 'Σχετικά έργα',
    'related.posts': 'Σχετικές αναρτήσεις',
    'notfound.title': 'Η σελίδα δεν βρέθηκε',
    'notfound.body': 'Η σελίδα που αναζητάτε δεν υπάρχει.',
    'notfound.home': 'Επιστροφή στην αρχική',
  },
} as const;

export type TranslationKey = keyof (typeof ui)['en'];

export function t(lang: Locale, key: TranslationKey): string {
  return ui[lang][key];
}

export function pathWithoutLocale(pathname: string): string {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}`) return '/';
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
  }
  return pathname;
}

export function switchLocalePath(current: string, to: Locale): string {
  return `/${to}${pathWithoutLocale(current)}`.replace(/\/$/, '');
}

export type ProjectEntry = CollectionEntry<'projects'>;
export type BlogEntry = CollectionEntry<'blog'>;

export function pairTranslation<T extends { data: { slug: string; lang: Locale } }>(
  entries: T[],
  entry: T,
): T | undefined {
  return entries.find(
    (e) => e.data.slug === entry.data.slug && e.data.lang !== entry.data.lang,
  );
}

export function categoryLabel(lang: Locale, category: ProjectEntry['data']['category']): string {
  return t(lang, `category.${category}` as TranslationKey);
}

export function statusLabel(lang: Locale, status: ProjectEntry['data']['status']): string {
  return t(lang, `status.${status}` as TranslationKey);
}

export function formatDate(lang: Locale, date: Date): string {
  return new Intl.DateTimeFormat(lang === 'el' ? 'el-GR' : 'en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/** Slugify a tag for URL use: lower-case, keep letters/numbers (incl. Greek). */
export function slugifyTag(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

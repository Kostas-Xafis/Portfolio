/**
 * Root locale redirect.
 *
 * Requests to "/" are redirected to "/en" or "/el" based on:
 *   1. the "pref-locale" cookie (set by the language switcher), then
 *   2. the Accept-Language header, then
 *   3. English as the default.
 *
 * Deployed automatically with the static assets: wrangler pages deploy
 * uploads the functions/ directory that exists where the command runs.
 */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname !== '/') return context.next();

  const cookie = (context.request.headers.get('Cookie') ?? '')
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('pref-locale='));

  let lang = cookie?.split('=')[1];
  if (lang !== 'en' && lang !== 'el') {
    const accept = context.request.headers.get('Accept-Language') ?? '';
    lang = /^\s*el([-_]|;|,|$)/i.test(accept.split(',')[0] ?? '') ? 'el' : 'en';
  }

  return Response.redirect(new URL('/' + lang, url), 302);
}

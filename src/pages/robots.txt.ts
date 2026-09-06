import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

/**
 * robots.txt is generated rather than static, because the correct contents
 * differ by host.
 *
 * A preview deployment (GitHub Pages, any Vercel URL) must disallow
 * everything: the pages already carry `noindex`, but a crawler has to fetch a
 * page to see a meta tag, whereas robots.txt stops it at the door. A static
 * file in public/ would ship production's "Allow: /" to every preview.
 */
export const GET: APIRoute = ({ site }) => {
  const origin = site?.href ?? SITE.url;
  const isPreview = new URL(origin).origin !== new URL(SITE.url).origin;

  const body = isPreview
    ? ['# Preview deployment — not for indexing.', 'User-agent: *', 'Disallow: /', ''].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${new URL('sitemap-index.xml', origin).href}`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

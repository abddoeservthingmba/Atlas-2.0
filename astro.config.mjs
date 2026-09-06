// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** The real domain. Anything else is treated as a preview host. */
const PRODUCTION_URL = 'https://www.atlasfitnesselite.com';

/**
 * Resolve the origin this build will be served from.
 *
 * Precedence:
 *   1. SITE_URL          explicit override. Set this in Vercel's project
 *                        settings once atlasfitnesselite.com points at it,
 *                        so production stops being treated as a preview.
 *   2. Vercel env        VERCEL_URL is unique per deployment, so a preview
 *                        self-references; a production deploy prefers the
 *                        stable project domain instead.
 *   3. PRODUCTION_URL    local builds and `astro dev`.
 *
 * Pages sets SITE_URL explicitly (see .github/workflows/deploy.yml).
 */
function resolveSite() {
  if (process.env.SITE_URL) return process.env.SITE_URL;

  if (process.env.VERCEL) {
    const host =
      process.env.VERCEL_ENV === 'production'
        ? (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)
        : process.env.VERCEL_URL;
    if (host) return `https://${host}`;
  }

  return PRODUCTION_URL;
}

/**
 * Vercel serves from the domain root, so the base stays '/'. Only a GitHub
 * Pages project site needs a subpath, and its workflow sets BASE_PATH.
 */
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: resolveSite(),
  base,
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'ignore',
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Sharp is the default service in Astro; named here so the dependency is explicit.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
});

// @ts-check
import { defineConfig } from 'astro/config';

/**
 * `site` and `base` are environment-driven so one codebase serves two hosts:
 *
 *   local / production   defaults below -> https://www.atlasfitnesselite.com/
 *   GitHub Pages preview SITE_URL + BASE_PATH set by .github/workflows/deploy.yml
 *
 * A GitHub Pages project site is served from a subpath (/<repo>/), so every
 * absolute asset URL has to carry that prefix. Astro handles its own emitted
 * assets; anything hand-written in a template must go through withBase() from
 * src/config/site.ts.
 */
const site = process.env.SITE_URL ?? 'https://www.atlasfitnesselite.com';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
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

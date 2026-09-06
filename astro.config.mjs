// @ts-check
import { defineConfig } from 'astro/config';

// TODO: replace with the production origin once the domain is pointed at this build.
export const SITE_URL = 'https://www.atlasfitnesselite.com';

export default defineConfig({
  site: SITE_URL,
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

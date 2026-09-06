# Atlas Fitness Elite — 2.0

Mobile-first marketing site rebuild for [atlasfitnesselite.com](https://www.atlasfitnesselite.com).

## Stack

- **Astro 7** — `output: 'static'`, TypeScript strict
- **pnpm** — package manager
- **Plain CSS** with custom properties. No Tailwind, no component library.
- **Sharp** — image optimization

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server on `0.0.0.0:4321` |
| `pnpm build` | Static build to `dist/` |
| `pnpm preview` | Serve `dist/` on `0.0.0.0:4321` |
| `pnpm check` | `astro check` — TS + template diagnostics |

## Layout rule

The design **is** a 480px column (`--layout-max`). On viewports wider than
that, the column is centred on a darker surround (`--color-surround`) with a
drop shadow, so desktop reads as an intentional frame rather than a phone
layout stretched across a monitor.

## Where things live

```
src/
  config/site.ts       NAP, branding strings, JSON-LD builder. One source of truth.
  styles/tokens.css    EVERY design decision: colour, type, space, radii, motion.
  styles/global.css    Reset, base type, app shell, CTA bar, reduced motion.
  layouts/Base.astro   html shell: meta, OG/Twitter, JSON-LD, CTA bar, Eruda.
  pages/index.astro    Placeholder section.
public/                favicon, touch icon, OG image, manifest, robots.
```

## Conventions

- **No raw values in components.** Reference a token from `tokens.css`. If a
  value is missing, add it there first.
- Prefer semantic tokens (`--color-text-muted`) over primitives (`--grey-600`)
  so a brand swap propagates.
- Minimum tap target is `--tap-min` (44px).
- Every page reserves `--cta-clearance` at the bottom so the sticky CTA never
  covers content. `.shell__main` does this already.

## Outstanding placeholders

Search the repo for `TODO` — the two that matter:

- `src/styles/tokens.css` — brand and accent colour ramps are neutral greys.
- `src/config/site.ts` — NAP (address, phone, email), hours, social URLs, geo.

## Reviewing on a phone

`import.meta.env.DEV` gates [Eruda](https://github.com/liriliri/eruda), an
on-device console. It appears in `pnpm dev` only and is statically stripped
from production builds — verify with `grep -c eruda dist/index.html` (expect `0`).

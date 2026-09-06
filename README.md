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

## Brand direction

Black, red, white — luxury. Derived from the current site, deliberately
corrected (the reasoning is recorded at the top of `tokens.css`):

| current site | here | why |
| --- | --- | --- |
| `#ff0033` neon red | `#c8102e` crimson | the neon red is the main "supplement store" tell |
| `#ffd700` gold | removed | a fourth colour dilutes black/red/white |
| `glow-red` / `glow-yellow` | removed | glows read as gaming hardware |
| radii to 24px | 2-3px | luxury is sharp |
| Outfit + Inter | Bodoni Moda + Archivo | a high-contrast didone is the luxury signal |

Two contrast rules that are easy to break:

- `--red-500` is a **fill only** — 3.18:1 as text on the column. White *on*
  it is 5.88:1, which is why it works as a button.
- `--red-400` is the **text** red — 5.30:1 on the column.

All text pairings are verified against WCAG AA. Re-check after any palette
change rather than trusting the numbers in the comments.

## Outstanding placeholders

Search the repo for `TODO` — the ones that matter:

- `src/config/site.ts` — NAP (address, phone, email), hours, social URLs, geo.
- Fonts are loaded from Google Fonts; self-host as woff2 before launch.
- `public/og-default.png` and the favicon are generated placeholders, not
  real brand assets.

## Reviewing on a phone

`import.meta.env.DEV` gates [Eruda](https://github.com/liriliri/eruda), an
on-device console. It appears in `pnpm dev` only and is statically stripped
from production builds — verify with `grep -c eruda dist/index.html` (expect `0`).

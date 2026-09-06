# Atlas Fitness Elite — 2.0

Mobile-first marketing site rebuild for [atlasfitnesselite.com](https://www.atlasfitnesselite.com).

## Stack

- **Astro 7** — `output: 'static'`, TypeScript strict
- **pnpm** — package manager
- **Plain CSS** with custom properties. No Tailwind, no component library.
- **Sharp** — image optimization

## Hosting

**Live preview: https://atlas-2-0-lac.vercel.app/**

Deployed on Vercel, auto-deploying on every push to `main` (`vercel.json`
pins the framework, install and build commands). The GitHub Pages workflow is
kept as a fallback.

The build resolves its own origin, so canonical/OG tags and JSON-LD are
correct on every host without per-host code:

| host | canonical | indexable |
| --- | --- | --- |
| Vercel preview | that deployment's URL | no |
| Vercel project URL | `*.vercel.app` | no |
| GitHub Pages | `…github.io/<repo>/` | no |
| production domain | `atlasfitnesselite.com` | **yes** |

Anything that is not the production domain is treated as a preview and emits
`noindex`, so a public mirror never competes with the real site in search.

**When the domain goes live:** set `SITE_URL=https://www.atlasfitnesselite.com`
in the Vercel project's environment variables. That is what flips the build
from preview to production — without it, a live site would stay `noindex`.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Dev server on `0.0.0.0:4321` |
| `pnpm build` | Static build to `dist/` |
| `pnpm preview` | Serve `dist/` on `0.0.0.0:4321` |
| `pnpm check` | `astro check` — TS + template diagnostics |

## Layout

Responsive, mobile-first. Three breakpoints, used in this order everywhere —
a breakpoint per component is how a layout system rots:

| | width | layout |
| --- | --- | --- |
| base | — | single column, hamburger, sticky bottom CTA |
| md | `48em` / 768px | two-up grids, wider gutters |
| lg | `64em` / 1024px | three-up grids, inline nav + header CTA, no sticky bar |
| wide | `90em` / 1440px | gutters grow, content stops at `--layout-max` (1200px) |

Only **tokens** are redefined per breakpoint, never component rules. A
component reads `--text-3xl` and gets the right size for the viewport without
knowing a breakpoint exists.

Grids use one `.grid` utility driven by `--cols` / `--cols-md` / `--cols-lg`,
so a component declares intent once rather than carrying a stack of
`.col-md-3`-style classes.

The sticky bottom CTA is retired at `lg`: a bar pinned to the bottom of a
1440px window is a phone pattern, and the header carries the same action
where a desktop user looks for it.

## Where things live

```
src/
  config/site.ts        NAP, branding, JSON-LD builder. One source of truth.
  data/content.ts       Programmes, plans, facilities, FAQ. Real copy, typed.
  styles/tokens.css     EVERY design decision: colour, type, space, radii, motion.
  styles/global.css     Reset, base type, app shell, CTA bar, shared components.
  layouts/Base.astro    html shell: meta, OG/Twitter, JSON-LD, CTA bar, Eruda.
  components/           Header (menu), Footer, PageHeader.
  pages/                index, about, programs, facilities, membership, contact
  pages/robots.txt.ts   Generated — disallows everything on preview hosts.
  assets/photos/        Client photography, optimised at build by Sharp.
```

## Pages

| route | notes |
| --- | --- |
| `/` | Hero, positioning, programme preview, floor, three plans, visit |
| `/about` | Mission, values, promise |
| `/programs` | All nine programmes |
| `/facilities` | Equipment and amenities |
| `/membership` | Three plans up front, all twelve behind a disclosure |
| `/contact` | NAP, hours, parking, nine FAQs |

The header menu is the only JavaScript on the site. Without it the panel stays
closed and the footer carries the same links, so navigation still works.

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
| `#ffd700` gold | `#d4af67` antique | pure yellow beside a strong red reads fairground; antique gold reads as struck metal |
| `glow-red` / `glow-yellow` | removed | glows read as gaming hardware |
| radii to 24px | 2-3px | luxury is sharp |
| Outfit + Inter | Fraunces + Archivo | a serif carries the luxury, but low stroke contrast keeps it legible on black — a didone does not |

**Red and gold have different jobs.** Red is *action* — buttons, links, the
live page. Gold is *distinction* — the medallion, the chosen plan, the best
rate. Two loud colours competing for the same job is what made the original
look cheap.

## Hero scene (WebGL)

`src/scripts/hero-scene.ts` turns the Atlas mark as a struck gold medallion in
drifting chalk dust. Technique adapted from ThreeUI's `SylvaHero` (MIT):
transparent canvas over the page, shader-driven geometry, deterministic noise,
capped DPR, offscreen/idle pause, reduced-motion path.

It is strictly an enhancement, layered under the hero scrim:

- three.js is a **lazy chunk** (~517KB) imported only when the hero nears the
  viewport, on an idle callback. It is not referenced by the initial HTML and
  no other page loads it.
- No WebGL, a script error, or JS off → the hero is the photograph and
  headline, unchanged.
- `prefers-reduced-motion` renders one considered frame and never animates.
- The coin oscillates ±34° rather than rotating fully: a 360° spin spends much
  of each cycle edge-on, where it collapses into a bright bar behind the
  headline.
- Gold is read from `tokens.css` at runtime, so the 3D follows a rebrand.

Two contrast rules that are easy to break:

- `--red-500` is a **fill only** — 3.18:1 as text on the column. White *on*
  it is 5.88:1, which is why it works as a button.
- `--red-400` is the **text** red — 5.30:1 on the column.

All text pairings are verified against WCAG AA. Re-check after any palette
change rather than trusting the numbers in the comments.

## Content

`docs/content-inventory.md` records the current site's real copy, pricing and
structure, plus the defects the rebuild should not inherit. Build pages from
that, not placeholder text.

NAP in `src/config/site.ts` is the real business data, taken from the live
site's own bundle.

## Google reviews

The section on the home page renders **only when real reviews exist**. It is
empty by default and there is no placeholder copy anywhere: an invented
testimonial on a real gym is fake social proof.

**This project populates them by hand.** Paste real reviews from the Google
listing into `MANUAL_REVIEWS` in `src/data/reviews.ts`, verbatim — the file has
a worked example. Three to five is the right number.

The API route below is wired up but not in use; it is here for whenever
automatic refresh is worth setting up.

Google does not serve reviews in the HTML of a Maps link — the page is a
JavaScript shell — and scraping them breaches Google's terms. The supported
automatic route is the Places API:

```sh
GOOGLE_PLACES_API_KEY=xxx pnpm reviews:fetch     # finds the place, prints its id
GOOGLE_PLACES_API_KEY=xxx GOOGLE_PLACE_ID=yyy pnpm reviews:fetch   # pin it
```

Set both in Vercel's environment variables and add `pnpm reviews:fetch` before
`pnpm build` to refresh on every deploy. Pin the place id so a rename or a
similarly named gym can never silently swap which business the site quotes.

Notes worth knowing before wiring this up:

- **The API returns at most five reviews.** Google's limit, not a choice here.
- **Attribution is required**, and the component renders it: "Reviews from
  Google" plus a link through to the listing.
- **No `Review` / `AggregateRating` structured data is emitted.** Google's own
  guidelines say a business should not mark up reviews aggregated from another
  site as its own; doing it risks a manual action. They are shown to readers,
  not claimed as first-party data.
- Reviews refresh only when the site rebuilds. A scheduled Vercel deploy keeps
  them current if that matters.

Without an API key, `MANUAL_REVIEWS` in `src/data/reviews.ts` takes real text
pasted verbatim from the listing.

## Outstanding placeholders

Search the repo for `TODO`. The ones that matter:

- **Geo coordinates** — omitted from JSON-LD entirely rather than shipping
  `0,0`. Needs the real lat/long.
- **Which WhatsApp number** — the live site carries both an Indian and a UK
  number; the Indian one is used here. Confirm before launch.
- `public/og-default.png` and the favicon are generated placeholders, not real
  brand assets.
- Fonts load from Google Fonts; self-host as woff2 before launch.

## Reviewing on a phone

`import.meta.env.DEV` gates [Eruda](https://github.com/liriliri/eruda), an
on-device console. It appears in `pnpm dev` only and is statically stripped
from production builds — verify with `grep -c eruda dist/index.html` (expect `0`).

/**
 * Site-wide constants: NAP (name / address / phone), branding strings and
 * social handles. Meta tags and JSON-LD both read from here, so the business
 * details exist in exactly one place.
 *
 * The NAP below was lifted from the strings in the current site's own JS
 * bundle rather than retyped from screenshots, so it matches what the live
 * site publishes today. It still wants a human check before launch -- see the
 * TODOs, and the "O Mallapur" note on addressLocality.
 */

export interface PostalAddress {
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface OpeningHours {
  /** schema.org day names, e.g. ['Monday', 'Tuesday'] */
  days: readonly string[];
  /** 24h 'HH:MM' */
  opens: string;
  closes: string;
}

export const SITE = {
  /** Canonical production origin, no trailing slash. */
  url: 'https://www.atlasfitnesselite.com',

  name: 'Atlas Fitness Elite',
  legalName: 'Atlas Fitness Elite', // TODO: confirm registered legal entity name
  shortName: 'Atlas',

  /** Used as the default <title> and og:site_name. */
  title: 'Atlas Fitness Elite',
  titleTemplate: '%s | Atlas Fitness Elite',

  tagline: 'Transform Your Body, Transform Your Life',

  description:
    'Atlas Fitness Elite is a strength and conditioning gym in Mallapur, ' +
    'Hyderabad, offering coached training, premium equipment and flexible ' +
    'membership plans.',

  locale: 'en_IN',
  lang: 'en',

  /** Default social share image, 1200x630, served from /public. */
  ogImage: '/og-default.png', // TODO: replace with a real brand share image (photography)
  ogImageAlt: 'Atlas Fitness Elite',

  themeColor: '#000000', // matches --color-surround (--ink-1000)

  /* ---- NAP ----------------------------------------------------------
     Verified against the live site's bundle. Both numbers are published;
     the first is the one used for calls, WhatsApp and the sticky CTA.
     -------------------------------------------------------------------- */
  telephone: '+91-99882-29441',
  telephoneAlt: '+91-83175-29757',
  /** Digits only, for tel: and wa.me links. */
  telephoneDigits: '919988229441',
  email: 'atlasfitnesselite@gmail.com',

  address: {
    streetAddress: '3-4-98/4/204, New Narsina Nagar',
    // The live site renders this as "O Mallapur" in one place and "Mallapur"
    // in its own Google Maps query. "Mallapur" is what actually resolves, so
    // it wins here. TODO: confirm the intended spelling with the client.
    addressLocality: 'Mallapur, Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500076',
    addressCountry: 'IN',
  } satisfies PostalAddress,

  /**
   * TODO: replace with the real coordinates. The current site links to a Maps
   * query rather than a pinned location, so it carries no lat/long to copy.
   * Zeroes are deliberately obvious rather than a plausible-looking guess.
   */
  geo: {
    latitude: 0,
    longitude: 0,
  },

  /** Mon-Sat 5am-11pm, Sun 5am-6pm, per the live site. */
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '05:00',
      closes: '23:00',
    },
    { days: ['Sunday'], opens: '05:00', closes: '18:00' },
  ] satisfies readonly OpeningHours[],

  currency: 'INR',
  /** Memberships run 2,999-55,999 INR; the plans page carries the detail. */
  priceRange: '₹₹',

  social: {
    instagram: 'https://instagram.com/atlasfitnesselite',
    facebook: 'https://facebook.com/atlasfitnesselite',
    tiktok: '',
    youtube: '',
  },

  twitterHandle: '', // no X/Twitter presence found; omitted from meta when blank

  /* ---- Primary conversion -------------------------------------------
     The current site's main action is a WhatsApp enquiry, which suits an
     Indian mobile audience better than a form. Kept as the primary CTA.
     -------------------------------------------------------------------- */
  cta: {
    label: 'Book free trial', // TODO: confirm wording with client
    href: 'https://wa.me/919988229441?text=Hi%21%20I%27m%20interested%20in%20joining%20Atlas%20Fitness%20Elite',
    secondaryLabel: 'Call',
    secondaryHref: 'tel:+919988229441',
  },
} as const;

/**
 * Prefix a root-relative path with the configured base path.
 *
 * On the production domain the base is '/' and this is a no-op. On a GitHub
 * Pages project site the base is '/<repo>/', and any hand-written absolute
 * path ('/favicon.svg') would 404 without this. Astro rewrites the assets it
 * emits itself; this is for the ones written by hand in templates.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const left = base.endsWith('/') ? base.slice(0, -1) : base;
  const right = path.startsWith('/') ? path : `/${path}`;
  return `${left}${right}`;
}

/** Absolute URL helper for canonical/OG tags. */
export function absoluteUrl(path: string, base: string = SITE.url): string {
  return new URL(path, base).href;
}

/**
 * schema.org HealthClub node.
 *
 * `origin` lets a preview deployment describe itself rather than claiming the
 * production URLs, so a Pages or Vercel mirror never emits structured data
 * pointing at the live domain.
 */
export function healthClubSchema(
  canonical: string,
  origin: string = SITE.url,
): Record<string, unknown> {
  const sameAs = Object.values(SITE.social).filter((url) => url.length > 0);
  // `origin` is the bare host (Astro.site excludes the base path), so the site
  // root has to be rebuilt through withBase — otherwise a project-site deploy
  // claims the owner's github.io root instead of its own subpath.
  const rooted = absoluteUrl(withBase('/'), origin);
  const root = rooted.endsWith('/') ? rooted.slice(0, -1) : rooted;

  return {
    '@context': 'https://schema.org',
    '@type': 'HealthClub',
    '@id': `${root}/#healthclub`,
    name: SITE.name,
    legalName: SITE.legalName,
    description: SITE.description,
    slogan: SITE.tagline,
    url: root,
    telephone: SITE.telephone,
    email: SITE.email,
    priceRange: SITE.priceRange,
    currenciesAccepted: SITE.currency,
    image: absoluteUrl(withBase(SITE.ogImage), origin),
    logo: absoluteUrl(withBase(SITE.ogImage), origin), // TODO: dedicated logo asset
    address: {
      '@type': 'PostalAddress',
      ...SITE.address,
    },
    // Omitted entirely until real coordinates exist: publishing 0,0 would
    // place the gym in the Atlantic, which is worse than saying nothing.
    ...(SITE.geo.latitude !== 0 || SITE.geo.longitude !== 0
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: SITE.geo.latitude,
            longitude: SITE.geo.longitude,
          },
        }
      : {}),
    openingHoursSpecification: SITE.openingHours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    mainEntityOfPage: canonical,
  };
}
